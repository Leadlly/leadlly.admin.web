"use server";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export const createAnnouncement = async (formData: {
  content: string;
  batchId?: string;
  classId?: string;
  attachment?: { title: string; fileUrl: string; fileType: string };
}) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/announcement/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    return await res.json();
  } catch (error: unknown) {
    console.error("Error creating announcement:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getAnnouncements = async (query: {
  batchId?: string;
  classId?: string;
  date?: string;
}) => {
  const token = await getCookie();
  const searchParams = new URLSearchParams();
  if (query.batchId) searchParams.append("batchId", query.batchId);
  if (query.classId) searchParams.append("classId", query.classId);
  if (query.date) searchParams.append("date", query.date);

  try {
    const res = await fetch(
      `${API}/api/announcement/all?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching announcements:", error);
    return { success: false, announcements: [] };
  }
};

export const deleteAnnouncement = async (id: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/announcement/${id}`, {
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
    console.error("Error deleting announcement:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
