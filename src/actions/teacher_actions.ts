"use server";

import { getCookie } from "./cookie_actions";

type ApiTeacher = {
  _id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: { personal?: number | null; other?: number | null } | null;
  avatar?: { url?: string | null } | null;
  role?: string | null;
  status?: string | null;
  about?: { dateOfBirth?: string | null; gender?: string | null } | null;
  academic?: {
    schoolOrCollegeName?: string | null;
    schoolOrCollegeAddress?: string | null;
    degree?: string | null;
  } | null;
};

export async function getInstituteTeachers(
  instituteId: string
): Promise<{
  success: boolean;
  teachers: ApiTeacher[];
  message?: string;
}> {
  try {
    if (!instituteId) {
      return { success: false, teachers: [], message: "Institute ID is required" };
    }

    const token = await getCookie();
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

    if (!baseUrl) {
      return {
        success: false,
        teachers: [],
        message:
          "API base URL not configured. Set NEXT_PUBLIC_ADMIN_API_BASE_URL in .env.local",
      };
    }

    const res = await fetch(
      `${baseUrl}/api/admin/institute/${instituteId}/teachers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        cache: "no-store",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        teachers: [],
        message: data?.message ?? "Failed to fetch teachers",
      };
    }

    return {
      success: true,
      teachers: (data?.teachers ?? []) as ApiTeacher[],
    };
  } catch (error) {
    return {
      success: false,
      teachers: [],
      message: error instanceof Error ? error.message : "Failed to fetch teachers",
    };
  }
}

export async function assignBatchToTeacher(
  instituteId: string,
  teacherId: string,
  batchId: string
): Promise<{ success: boolean; message?: string; data?: unknown }> {
  try {
    if (!instituteId || !teacherId || !batchId) {
      return {
        success: false,
        message: "instituteId, teacherId and batchId are required",
      };
    }

    const token = await getCookie();
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

    if (!baseUrl) {
      return {
        success: false,
        message:
          "API base URL not configured. Set NEXT_PUBLIC_ADMIN_API_BASE_URL in .env.local",
      };
    }

    const res = await fetch(`${baseUrl}/api/admin/assign-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ teacherId, batchId, instituteId }),
      cache: "no-store",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message ?? "Failed to assign teacher to batch",
      };
    }

    return {
      success: Boolean(data?.success ?? true),
      message: data?.message,
      data: data?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to assign",
    };
  }
}

export async function assignBatchesToTeacher(
  instituteId: string,
  teacherId: string,
  batchIds: string[]
): Promise<{ success: boolean; message?: string; results: Array<{ batchId: string; success: boolean; message?: string }> }> {
  if (!batchIds || batchIds.length === 0) {
    return {
      success: false,
      message: "Select at least one batch",
      results: [],
    };
  }

  const results: Array<{
    batchId: string;
    success: boolean;
    message?: string;
  }> = [];

  // Assign one-by-one using the existing backend endpoint.
  // Backend has no bulk endpoint yet.
  for (const batchId of batchIds) {
    const r = await assignBatchToTeacher(instituteId, teacherId, batchId);
    results.push({ batchId, success: r.success, message: r.message });
  }

  const failed = results.filter((r) => !r.success).length;
  return {
    success: failed === 0,
    message:
      failed === 0
        ? "Teacher assigned to selected batches"
        : `${failed} batch assignment(s) failed`,
    results,
  };
}

export async function getBatchTeachers(
  batchId: string
): Promise<{ success: boolean; teachers: ApiTeacher[]; message?: string }> {
  try {
    if (!batchId) return { success: false, teachers: [], message: "Batch ID is required" };

    const token = await getCookie();
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
    if (!baseUrl) return { success: false, teachers: [], message: "API base URL not configured" };

    const res = await fetch(`${baseUrl}/api/admin/batch/${batchId}/teachers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      cache: "no-store",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, teachers: [], message: data?.message ?? "Failed to fetch batch teachers" };
    return { success: true, teachers: (data?.teachers ?? data?.data ?? []) as ApiTeacher[] };
  } catch (error) {
    return { success: false, teachers: [], message: error instanceof Error ? error.message : "Failed to fetch batch teachers" };
  }
}

export async function assignTeachersToBatch(
  instituteId: string,
  batchId: string,
  teacherIds: string[]
): Promise<{ success: boolean; message?: string; results: Array<{ teacherId: string; success: boolean; message?: string }> }> {
  if (!teacherIds || teacherIds.length === 0) {
    return { success: false, message: "Select at least one teacher", results: [] };
  }

  const results: Array<{ teacherId: string; success: boolean; message?: string }> = [];

  for (const teacherId of teacherIds) {
    const r = await assignBatchToTeacher(instituteId, teacherId, batchId);
    results.push({ teacherId, success: r.success, message: r.message });
  }

  const failed = results.filter((r) => !r.success).length;
  return {
    success: failed === 0,
    message: failed === 0 ? "Teachers assigned successfully" : `${failed} assignment(s) failed`,
    results,
  };
}

export async function getTeacherDashboardById(
  teacherId: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    if (!teacherId) {
      return { success: false, message: "Teacher ID is required" };
    }

    const token = await getCookie();
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

    if (!baseUrl) {
      return { success: false, message: "API base URL not configured" };
    }

    const res = await fetch(`${baseUrl}/api/admin/teacher/${teacherId}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      cache: "no-store",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data?.message ?? "Failed to fetch teacher dashboard" };
    }

    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch teacher dashboard",
    };
  }
}

