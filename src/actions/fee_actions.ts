"use server";

import { revalidatePath } from "next/cache";
import { getCookie } from "./cookie_actions";

export interface FeeRecordData {
  studentName: string;
  fatherName?: string;
  motherName?: string;
  streamName?: string;
  courseName?: string;
  courseCode?: string;
  center?: string;
  paymentMode?: string;
  tuitionFees: number;
  igstPercent?: number;
  amountInWords?: string;
  paymentDate?: string;
  academicSession?: string;
  studentId?: string;
}

export interface IFeeRecord extends FeeRecordData {
  _id: string;
  institute: string;
  formNo: string;
  acknowledgementNo: string;
  igstAmount: number;
  totalAmount: number;
  status: "Active" | "Deleted";
  createdAt: string;
  updatedAt: string;
}

const getBase = () => process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export async function createFeeRecord(
  instituteId: string,
  data: FeeRecordData
): Promise<{ success: boolean; data?: IFeeRecord; message?: string }> {
  const token = await getCookie();
  try {
    const res = await fetch(`${getBase()}/api/institute/${instituteId}/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Failed to create record");
    revalidatePath(`/institute/${instituteId}/fees`);
    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getFeeRecords(
  instituteId: string,
  page = 1,
  search = "",
  studentId?: string
): Promise<{
  success: boolean;
  data?: IFeeRecord[];
  total?: number;
  totalPages?: number;
  message?: string;
}> {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      ...(search ? { search } : {}),
      ...(studentId ? { studentId } : {}),
    });
    const res = await fetch(
      `${getBase()}/api/institute/${instituteId}/fees?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Failed to fetch records");
    return {
      success: true,
      data: json.data,
      total: json.total,
      totalPages: json.totalPages,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

export async function updateFeeRecord(
  instituteId: string,
  recordId: string,
  data: Partial<FeeRecordData>
): Promise<{ success: boolean; data?: IFeeRecord; message?: string }> {
  const token = await getCookie();
  try {
    const res = await fetch(
      `${getBase()}/api/institute/${instituteId}/fees/${recordId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Failed to update record");
    revalidatePath(`/institute/${instituteId}/fees`);
    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteFeeRecord(
  instituteId: string,
  recordId: string
): Promise<{ success: boolean; message?: string }> {
  const token = await getCookie();
  try {
    const res = await fetch(
      `${getBase()}/api/institute/${instituteId}/fees/${recordId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
      }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Failed to delete record");
    revalidatePath(`/institute/${instituteId}/fees`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
