"use server";
import { getCookie } from "./cookie_actions";
import { logger } from "@/lib/logger";

interface BatchCreateData {
  name: string;
  standard: string;
  subjects?: string[];
  mentors?: string[];
  institute?: string;
  description?: string;
  about?: string;
  coverImage?: { name: string; type: string };
  payment?: {
    subscriptionType: "Free" | "Paid";
    amount: number;
    currency: "INR";
  };
}

export const createBatch = async (data: BatchCreateData) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/create`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      },
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in saving daily quiz answers: ${error.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while saving daily quiz answers!",
      );
    }
  }
};

export const getInstituteBatch = async (instituteId: string) => {
  if (!instituteId) {
    throw new Error("Institute ID is required to fetch batches");
  }
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/${instituteId}/batches`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
      },
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching institute batches: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching institute batches!");
    }
  }
};

export const getBatchDetails = async (batchId: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/${batchId}`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? data;
  } catch (error) {
    logger.error("Error fetching batch details", { error });
    return null;
  }
};

export const getBatchClasses = async (batchId: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/class/batch/${batchId}`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    logger.error("Error fetching batch classes", { error });
    return [];
  }
};

export const getBatchStudents = async (batchId: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/${batchId}/students`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) return { students: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    logger.error("Error fetching batch students", { error });
    return { students: [] };
  }
};

export const updateBatch = async (
  batchId: string,
  data: Partial<Omit<BatchCreateData, "institute">>
) => {
  const token = await getCookie();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/${batchId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );
    return await res.json();
  } catch (error) {
    logger.error("Error updating batch", { error });
    return { success: false, message: "Failed to update batch" };
  }
};

export const deleteBatch = async (batchId: string) => {
  const token = await getCookie();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/${batchId}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      }
    );
    return await res.json();
  } catch (error) {
    logger.error("Error deleting batch", { error });
    return { success: false, message: "Failed to delete batch" };
  }
};

export const getTeacherAssignedBatches = async (
  teacherId: string
): Promise<{ success: boolean; batchIds: string[]; message?: string }> => {
  if (!teacherId) return { success: false, batchIds: [], message: "Teacher ID is required" };
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/admin/teacher/${teacherId}/dashboard`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) return { success: false, batchIds: [], message: "Failed to fetch teacher batches" };
    const data = await res.json();
    // Dashboard returns batchPerformance array, each item has batchId
    const batchPerformance: Array<{ batchId: string }> = data?.data?.batchPerformance ?? [];
    return { success: true, batchIds: batchPerformance.map((b) => String(b.batchId)) };
  } catch (error) {
    logger.error("Error fetching teacher assigned batches", { error });
    return { success: false, batchIds: [], message: error instanceof Error ? error.message : "Failed to fetch" };
  }
};
