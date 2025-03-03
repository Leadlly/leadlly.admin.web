import type { Batch, Student } from "@/lib/validations/schema";
import type { ApiResponse } from "@/lib/utils/api";

type BatchQueryParams = {
  class?: "11" | "12" | "all";
  status?: "active" | "inactive" | "all";
  subject?: string;
};

type StudentQueryParams = {
  performanceLevel?: "excellent" | "optimal" | "inefficient" | "all";
  search?: string;
};

type DashboardStats = {
  // Student Overview
  totalStudents: number;
  activeCourses: number;
  averageAttendance: number;
  performanceIndex: number;

  // Teacher Overview
  totalTeachers: number;
  departments: number;
  activeClasses: number;
  satisfactionRate: number;

  // Additional Stats
  totalBatches: number;
  activeStudents: number;
  inactiveStudents: number;
  performanceDistribution: {
    excellent: number;
    optimal: number;
    inefficient: number;
  };
  batchDistribution: {
    class11: number;
    class12: number;
  };
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/dashboard/stats");
  const data: ApiResponse<DashboardStats> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch dashboard stats");
  }

  return data.data!;
}

export async function fetchBatches(params?: BatchQueryParams) {
  const searchParams = new URLSearchParams();

  // Only add parameters that are defined and not "all"
  if (params?.class && params.class !== "all") {
    searchParams.set("class", params.class);
  }
  if (params?.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params?.subject) {
    searchParams.set("subject", params.subject);
  }

  const queryString = searchParams.toString();
  const url = `/api/batches${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  const data: ApiResponse<Batch[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch batches");
  }

  return data.data!;
}

export async function fetchStudentsByBatch(
  batchId: string,
  params?: StudentQueryParams
) {
  const searchParams = new URLSearchParams();

  if (params?.performanceLevel && params.performanceLevel !== "all") {
    searchParams.set("performanceLevel", params.performanceLevel);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const queryString = searchParams.toString();
  const url = `/api/batches/${batchId}/students${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url);
  const data: ApiResponse<Student[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch students");
  }

  return data.data!;
}

export async function addBatch(batchData: Omit<Batch, "id">) {
  const response = await fetch("/api/batches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batchData),
  });

  const data: ApiResponse<Batch> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to add batch");
  }

  return data.data!;
}

export async function updateBatch(id: number, batchData: Partial<Batch>) {
  const response = await fetch(`/api/batches/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batchData),
  });

  const data: ApiResponse<Batch> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to update batch");
  }

  return data.data!;
}

export async function deleteBatch(id: number) {
  const response = await fetch(`/api/batches/${id}`, {
    method: "DELETE",
  });

  const data: ApiResponse<void> = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to delete batch");
  }
}
