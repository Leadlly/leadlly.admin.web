"use server";

import {
  ChapterPlanComparison,
  ChapterPlanListRow,
  ChapterPlanRecord,
  ChapterPlanSheet,
  PlannedChapterInput,
} from "@/helpers/types/chapter-plan";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

async function headers() {
  const token = await getCookie();
  return {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  };
}

export const listChapterPlans = async (params: {
  instituteId: string;
  batchId?: string;
  subject?: string;
}): Promise<{ success: boolean; rows: ChapterPlanListRow[]; message?: string }> => {
  const search = new URLSearchParams({ instituteId: params.instituteId });
  if (params.batchId) search.set("batchId", params.batchId);
  if (params.subject) search.set("subject", params.subject);
  try {
    const res = await fetch(`${API}/api/chapter-plan/admin/list?${search}`, {
      headers: await headers(),
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return { success: Boolean(data.success), rows: data.rows || [], message: data.message };
  } catch {
    return { success: false, rows: [], message: "Failed to load chapter plans" };
  }
};

export const getChapterPlan = async (
  planId: string
): Promise<{
  success: boolean;
  plan: ChapterPlanRecord | null;
  comparison: ChapterPlanComparison | null;
  canEdit?: boolean;
  message?: string;
}> => {
  try {
    const res = await fetch(`${API}/api/chapter-plan/${planId}`, {
      headers: await headers(),
      credentials: "include",
      cache: "no-store",
    });
    return await res.json();
  } catch {
    return { success: false, plan: null, comparison: null, message: "Failed to load plan" };
  }
};

export const getChapterPlanByClass = async (classId: string) => {
  try {
    const res = await fetch(`${API}/api/chapter-plan/class/${classId}`, {
      headers: await headers(),
      credentials: "include",
      cache: "no-store",
    });
    return await res.json();
  } catch {
    return { success: false, plan: null, comparison: null };
  }
};

export const getPlanChapters = async (batchId: string, subject: string) => {
  try {
    const res = await fetch(
      `${API}/api/chapter-plan/admin/chapters?batchId=${batchId}&subject=${encodeURIComponent(subject)}`,
      {
        headers: await headers(),
        credentials: "include",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch {
    return { success: false, chapters: [] };
  }
};

export const getChapterPlanSheet = async (
  batchId: string,
  subject: string
): Promise<ChapterPlanSheet> => {
  try {
    const res = await fetch(
      `${API}/api/chapter-plan/admin/sheet?batchId=${batchId}&subject=${encodeURIComponent(subject)}`,
      {
        headers: await headers(),
        credentials: "include",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch {
    return {
      success: false,
      batch: { _id: "", name: "", standard: "", subjects: [] },
      subject,
      plan: null,
      rows: [],
      weeklyLectureLoad: 5,
      academicSession: "",
      courseCompletionDate: null,
      totalLecturesRequired: 0,
      message: "Failed to load course planner",
    };
  }
};

export const saveChapterPlanSheet = async (payload: {
  batchId: string;
  subject: string;
  weeklyLectureLoad: number;
  academicSession?: string;
  courseCompletionDate?: string | null;
  chapters: PlannedChapterInput[];
}) => {
  try {
    const res = await fetch(`${API}/api/chapter-plan/admin/sheet`, {
      method: "POST",
      headers: await headers(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Failed to save course planner" };
  }
};

export const createChapterPlan = async (payload: {
  batchId: string;
  subject: string;
  chapters: PlannedChapterInput[];
}) => {
  try {
    const res = await fetch(`${API}/api/chapter-plan`, {
      method: "POST",
      headers: await headers(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Failed to create chapter plan" };
  }
};

export const updateChapterPlan = async (
  planId: string,
  chapters: PlannedChapterInput[]
) => {
  try {
    const res = await fetch(`${API}/api/chapter-plan/${planId}`, {
      method: "PUT",
      headers: await headers(),
      credentials: "include",
      body: JSON.stringify({ chapters }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Failed to update chapter plan" };
  }
};
