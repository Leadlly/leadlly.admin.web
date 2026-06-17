"use server";

import { getCookie } from "./cookie_actions";

const API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

interface CreateQuizParams {
  classId: string;
  batchId: string;
  instituteId?: string;
  subject: string;
  chapterId: string;
  chapterName: string;
  topicIds: string[];
  questionsNumber: number;
  endDate?: string;
}

export const createQuizForClass = async (params: CreateQuizParams) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/quiz/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      body: JSON.stringify(params),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create quiz",
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getClassQuizzes = async (query: {
  classId: string;
  date?: string;
}) => {
  const token = await getCookie();
  const searchParams = new URLSearchParams();
  searchParams.append("classId", query.classId);
  if (query.date) searchParams.append("date", query.date);

  try {
    const res = await fetch(
      `${API}/api/quiz/list?${searchParams.toString()}`,
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
    console.error("Error fetching quizzes:", error);
    return { success: false, quizzes: [] };
  }
};

export const deleteQuiz = async (id: string) => {
  const token = await getCookie();

  try {
    const res = await fetch(`${API}/api/quiz/${id}`, {
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
    console.error("Error deleting quiz:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
