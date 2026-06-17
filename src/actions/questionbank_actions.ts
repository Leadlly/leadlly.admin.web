"use server";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export const getChapters = async (
  subjectName: string,
  standard: number | string
) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${API}/api/questionbank/chapter?subjectName=${encodeURIComponent(subjectName)}&standard=${standard}`,
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

    if (!res.ok) {
      if (res.status === 404) return { chapters: [] };
      throw new Error("Failed to fetch chapters");
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching chapters:", error);
    return { chapters: [] };
  }
};

export const getTopicsWithSubtopics = async (
  subjectName: string,
  standard: number | string,
  chapterId: string
) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${API}/api/questionbank/topicwithsubtopic?subjectName=${encodeURIComponent(subjectName)}&standard=${standard}&chapterId=${chapterId}`,
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

    if (!res.ok) {
      if (res.status === 404) return { topics: [] };
      throw new Error("Failed to fetch topics");
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching topics:", error);
    return { topics: [] };
  }
};
