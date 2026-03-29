"use server";

import { revalidatePath } from "next/cache";

import { getCookie } from "./cookie_actions";
import { logger } from "@/lib/logger";

const BASE = () => process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export type UINRecord = {
  _id: string;
  uin: string;
  instituteId: string;
  isAssigned: boolean;
  assignedTo?: string | null;
  assignedToStudent?: {
    firstname: string;
    lastname?: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

/** Add one or many UINs (comma/newline separated, parsed on client) */
export async function addInstituteUINs(instituteId: string, uins: string[]) {
  try {
    const token = await getCookie();
    const res = await fetch(`${BASE()}/api/institute/uin/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ instituteId, uins }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to add UIDs" };
    }

    revalidatePath(`/institute/${instituteId}/uins`);
    return {
      success: true,
      message: data.message,
      insertedCount: data.insertedCount as number,
      duplicateCount: data.duplicateCount as number,
    };
  } catch (error) {
    logger.error("addInstituteUINs error", { error });
    return { success: false, message: "Failed to add UIDs. Please try again." };
  }
}

/** Get paginated UINs for an institute */
export async function getInstituteUINs(
  instituteId: string,
  {
    page = 1,
    limit = 50,
    assigned,
  }: { page?: number; limit?: number; assigned?: "true" | "false" } = {}
) {
  try {
    const token = await getCookie();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(assigned !== undefined ? { assigned } : {}),
    });

    const res = await fetch(
      `${BASE()}/api/institute/${instituteId}/uin?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, uins: [] as UINRecord[], total: 0 };
    }

    return {
      success: true,
      uins: (data.uins ?? []) as UINRecord[],
      total: data.total as number,
      page: data.page as number,
      limit: data.limit as number,
    };
  } catch (error) {
    logger.error("getInstituteUINs error", { error });
    return { success: false, uins: [] as UINRecord[], total: 0 };
  }
}

/** Delete a single unassigned UIN by its document ID */
export async function deleteInstituteUIN(uinId: string, instituteId: string) {
  try {
    const token = await getCookie();
    const res = await fetch(`${BASE()}/api/institute/uin/${uinId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete UID" };
    }

    revalidatePath(`/institute/${instituteId}/uins`);
    return { success: true, message: data.message };
  } catch (error) {
    logger.error("deleteInstituteUIN error", { error });
    return { success: false, message: "Failed to delete UID. Please try again." };
  }
}
