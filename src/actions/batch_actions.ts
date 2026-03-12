"use server";
import { getCookie } from "./cookie_actions";

interface BatchCreateData {
  name: string;
  standard: string;
  mentors?: string[];
  institute?: string;
  description?: string;
  about?: string;
  payment?: {
    subscriptionType: "Free" | "Paid";
    amount: number;
    currency: "INR";
  };
}

export const createBatch = async (data: BatchCreateData) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/batch/create`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      },
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in saving daily quiz answers: ${error.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while saving daily quiz answers!",
      );
    }
  }
};

export const getInstituteBatch = async (instituteId: string) => {
  if (!instituteId) {
    throw new Error("Institute ID is required to fetch batches");
  }
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/${instituteId}/batches`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        credentials: "include",
      },
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in saving daily quiz answers: ${error.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while saving daily quiz answers!",
      );
    }
  }
};
