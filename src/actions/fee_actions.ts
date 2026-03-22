"use server";

import { revalidatePath } from "next/cache";
import { getCookie } from "./cookie_actions";

export interface AdditionalFeeItem {
  label: string;
  amount: number;
  type: "addition" | "deduction";
}

export interface FeeRecordData {
  uniqueIdentificationNo: string;
  studentName: string;
  fatherName?: string;
  motherName?: string;
  streamName?: string;
  courseName?: string;
  courseCode?: string;
  center?: string;
  school?: string;
  /** Class / grade 6–12 */
  standard?: string;
  dateOfBirth?: string;
  address?: string;
  paymentMode?: string;
  tuitionFees: number;
  amountReceived?: number;
  igstPercent?: number;
  discount?: number;
  additionalFees?: AdditionalFeeItem[];
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
  installmentNo: number;
  igstAmount: number;
  totalAmount: number;
  balanceAmount?: number;
  status: "Active" | "Deleted";
  createdAt: string;
  updatedAt: string;
}

export interface FeeUidGroup {
  _id: string;
  studentName: string;
  fatherName?: string;
  streamName?: string;
  academicSession?: string;
  recordCount: number;
  totalPaid: number;
  totalAmountReceived: number;
  totalBalance: number;
  lastPaymentDate: string;
  studentId?: string;
  // Session-level fee info (from first installment)
  sessionTuitionFees?: number;
  sessionIgstPercent?: number;
  sessionDiscount?: number;
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
  studentId?: string,
  uid?: string
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
      ...(uid ? { uid } : {}),
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

export async function getFeeUidGroups(
  instituteId: string,
  search = ""
): Promise<{
  success: boolean;
  data?: FeeUidGroup[];
  total?: number;
  message?: string;
}> {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({
      ...(search ? { search } : {}),
    });
    const res = await fetch(
      `${getBase()}/api/institute/${instituteId}/fees/uid-groups?${params}`,
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
    if (!res.ok) throw new Error(json.message ?? "Failed to fetch UID groups");
    return { success: true, data: json.data, total: json.total };
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

/**
 * Fetch all active fee records for a given UID within an institute.
 * Omit academicSession to load every session (used to merge one-time student fields).
 * With academicSession, the API filters to that year. Sorted by installmentNo asc.
 */
export async function getFeeRecordsByUid(
  instituteId: string,
  uid: string,
  academicSession?: string
): Promise<{ success: boolean; data?: IFeeRecord[]; message?: string }> {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({ uid, limit: "50" });
    if (academicSession) params.set("session", academicSession);
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
    const records: IFeeRecord[] = (json.data ?? []).sort(
      (a: IFeeRecord, b: IFeeRecord) => (a.installmentNo ?? 1) - (b.installmentNo ?? 1)
    );
    return { success: true, data: records };
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
