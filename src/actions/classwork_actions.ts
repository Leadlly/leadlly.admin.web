"use server";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export const createNote = async (params: {
  title: string;
  description?: string;
  batchId: string;
  classId: string;
  subject: string;
  fileUrl: string;
  fileType: string;
}) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/class-work/notes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(params),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create note" };
    }
    return { success: true, message: data.message, note: data.note };
  } catch (error: unknown) {
    console.error("Error creating note:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getNotes = async (query: {
  classId?: string;
  batchId?: string;
  date?: string;
}) => {
  const token = await getCookie();
  const searchParams = new URLSearchParams();
  if (query.classId) searchParams.append("classId", query.classId);
  if (query.batchId) searchParams.append("batchId", query.batchId);
  if (query.date) searchParams.append("date", query.date);

  try {
    const res = await fetch(
      `${API}/api/class-work/notes?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    return { success: false, notes: [] };
  }
};

export const deleteNote = async (id: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/class-work/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    return await res.json();
  } catch (error: unknown) {
    console.error("Error deleting note:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const createDPP = async (params: {
  title: string;
  description?: string;
  batchId: string;
  classId: string;
  subject: string;
  attachments: { fileName: string; fileUrl: string; fileType: string }[];
  dueDate?: string;
}) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/class-work/dpp/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(params),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create DPP" };
    }
    return { success: true, message: data.message, dpp: data.dpp };
  } catch (error: unknown) {
    console.error("Error creating DPP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getDPPs = async (query: {
  classId?: string;
  batchId?: string;
  date?: string;
}) => {
  const token = await getCookie();
  const searchParams = new URLSearchParams();
  if (query.classId) searchParams.append("classId", query.classId);
  if (query.batchId) searchParams.append("batchId", query.batchId);
  if (query.date) searchParams.append("date", query.date);

  try {
    const res = await fetch(
      `${API}/api/class-work/dpp?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching DPPs:", error);
    return { success: false, dpps: [] };
  }
};

export const deleteDPP = async (id: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/class-work/dpp/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    return await res.json();
  } catch (error: unknown) {
    console.error("Error deleting DPP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
