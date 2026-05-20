"use server";

import { getCookie } from "./cookie_actions";

const MENTOR_API = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

export interface QBChapter {
  _id: string;
  name: string;
}

export interface QBTopic {
  _id: string;
  name: string;
  chapterId: string;
  subtopics?: QBSubtopic[];
}

export interface QBSubtopic {
  _id: string;
  name: string;
}

export interface QBOption {
  _id: string;
  name: string;
  tag: string;
  images?: string | null;
}

export interface QBQuestion {
  _id: string;
  question: string;
  options: QBOption[];
  answer: string;
  subject: string;
  chapter: string[];
  topics: string[];
  subtopics: string[];
  level: string;
  standard: number;
  images?: Array<{ key: string; url: string; _id: string }>;
}

export interface QBPagination {
  page: number;
  limit: number;
  total: number;
  totalAvailable: number;
  totalPages: number;
}

export async function getQBSubjects(standard: string) {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({ standard });
    const res = await fetch(
      `${MENTOR_API}/api/questionbank/subject?${params}`,
      {
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data as { success: boolean; subjectList?: string[]; message?: string };
  } catch (error) {
    return { success: false, message: (error as Error).message, subjectList: undefined };
  }
}

export async function getQBChapters(subjectName: string, standard: string) {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({ subjectName, standard });
    const res = await fetch(
      `${MENTOR_API}/api/questionbank/chapter?${params}`,
      {
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data as { success: boolean; chapters?: QBChapter[]; message?: string };
  } catch (error) {
    return { success: false, message: (error as Error).message, chapters: undefined };
  }
}

export async function getQBTopicsWithSubtopics(
  subjectName: string,
  standard: string,
  chapterId: string
) {
  const token = await getCookie();
  try {
    const params = new URLSearchParams({ subjectName, standard, chapterId });
    const res = await fetch(
      `${MENTOR_API}/api/questionbank/topicwithsubtopic?${params}`,
      {
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data as { success: boolean; topics?: QBTopic[]; message?: string };
  } catch (error) {
    return { success: false, message: (error as Error).message, topics: undefined };
  }
}

export async function getQBQuestions(params: {
  subjectName: string;
  standard: string;
  chapterIds?: string[];
  topicIds?: string[];
  subtopicIds?: string[];
  noOfQuestions: number;
  page?: number;
  limit?: number;
}) {
  const token = await getCookie();
  try {
    const query = new URLSearchParams({
      subjectName: params.subjectName,
      standard: params.standard,
      noOfQuestions: String(params.noOfQuestions),
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
    });
    if (params.chapterIds?.length) query.set("chapterIds", params.chapterIds.join(","));
    if (params.topicIds?.length) query.set("topicIds", params.topicIds.join(","));
    if (params.subtopicIds?.length) query.set("subtopicIds", params.subtopicIds.join(","));

    const res = await fetch(
      `${MENTOR_API}/api/questionbank/questions?${query}`,
      {
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data as {
      success: boolean;
      questions?: QBQuestion[];
      pagination?: QBPagination;
      message?: string;
    };
  } catch (error) {
    return { success: false, message: (error as Error).message, questions: undefined };
  }
}
