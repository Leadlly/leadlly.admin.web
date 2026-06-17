"use server";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export const getClassLectures = async (
  classId: string,
  page = 1,
  limit = 10
) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${API}/api/lecture/class/${classId}?page=${page}&limit=${limit}`,
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

    if (!res.ok) return { lectures: [], pagination: null };

    const data = await res.json();
    return {
      lectures: data.lectures || [],
      pagination: data.pagination || null,
    };
  } catch {
    return { lectures: [], pagination: null };
  }
};

export const createTodaysWork = async (payload: {
  classId: string;
  batchId: string;
  chapter: Array<{ _id: string; name: string }>;
  topics: Array<{
    _id: string;
    name: string;
    subItems?: Array<{ _id: string; name: string }>;
  }>;
  subtopics?: Array<{ _id: string; name: string }>;
  duration: number;
}) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/lecture/todays-work`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save today's work");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An unknown error occurred while saving today's work");
  }
};

export const getTodaysLecture = async (classId: string, date?: string) => {
  const token = await getCookie();
  const dateParam = date ? `?date=${date}` : "";

  try {
    const res = await fetch(
      `${API}/api/lecture/todays-work/${classId}${dateParam}`,
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

    const data = await res.json();

    if (!res.ok) return null;

    return data.lecture || null;
  } catch {
    return null;
  }
};

export const updateTodaysWork = async (
  lectureId: string,
  payload: {
    chapter: Array<{ _id: string; name: string }>;
    topics: Array<{
      _id: string;
      name: string;
      subItems?: Array<{ _id: string; name: string }>;
    }>;
    subtopics?: Array<{ _id: string; name: string }>;
    duration: number;
  }
) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/lecture/todays-work/${lectureId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update today's work");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An unknown error occurred while updating today's work");
  }
};
