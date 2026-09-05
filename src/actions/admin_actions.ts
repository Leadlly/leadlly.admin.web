"use server";

import { revalidatePath } from "next/cache";

import { getCookie } from "./cookie_actions";
import { logger } from "@/lib/logger";

const BASE = () => process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export type InstituteMemberRole = "admin" | "manager";

export type InstituteMember = {
  _id: string;
  firstname: string;
  lastname?: string;
  email: string;
  avatar?: { url: string; public_id: string };
  status: string;
  lastLogin?: string | null;
  createdAt: string;
  role: InstituteMemberRole;
  isCurrentUser: boolean;
};

export async function getInstituteAdmins(instituteId: string) {
  try {
    const token = await getCookie();
    const res = await fetch(`${BASE()}/api/institute/${instituteId}/admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        members: [] as InstituteMember[],
        canRemoveMembers: false,
        currentUserRole: null as InstituteMemberRole | null,
        message: data.message || "Failed to fetch admins",
      };
    }

    return {
      success: true,
      members: (data.members ?? []) as InstituteMember[],
      canRemoveMembers: Boolean(data.canRemoveMembers),
      currentUserRole: (data.currentUserRole ?? null) as InstituteMemberRole | null,
    };
  } catch (error) {
    logger.error("getInstituteAdmins error", { error });
    return {
      success: false,
      members: [] as InstituteMember[],
      canRemoveMembers: false,
      currentUserRole: null as InstituteMemberRole | null,
      message: "Failed to fetch admins",
    };
  }
}

export async function addInstituteAdmin(
  instituteId: string,
  email: string,
  role: InstituteMemberRole,
) {
  try {
    const token = await getCookie();
    const res = await fetch(`${BASE()}/api/institute/${instituteId}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to add admin" };
    }

    revalidatePath(`/institute/${instituteId}/admins`);
    return {
      success: true,
      message: data.message as string,
      member: data.member as InstituteMember,
    };
  } catch (error) {
    logger.error("addInstituteAdmin error", { error });
    return { success: false, message: "Failed to add admin. Please try again." };
  }
}

export async function removeInstituteAdmin(
  instituteId: string,
  adminId: string,
) {
  try {
    const token = await getCookie();
    const res = await fetch(
      `${BASE()}/api/institute/${instituteId}/admins/${adminId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove member",
      };
    }

    revalidatePath(`/institute/${instituteId}/admins`);
    return { success: true, message: data.message as string };
  } catch (error) {
    logger.error("removeInstituteAdmin error", { error });
    return {
      success: false,
      message: "Failed to remove member. Please try again.",
    };
  }
}
