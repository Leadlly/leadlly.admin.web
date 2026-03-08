"use server";

import { updateTag } from "next/cache";

import { z } from "zod";

import { CreateInstituteFormSchema } from "@/helpers/schema/createInstituteSchema";
import { IInstitute } from "@/helpers/types";

import { getCookie } from "./cookie_actions";

type InstituteCreateData = z.infer<typeof CreateInstituteFormSchema>;

export const createInstitute = async (data: InstituteCreateData) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
          isAdmin: "true",
        },
        credentials: "include",
      }
    );

    const responseData: { success: boolean; data: IInstitute; error?: string } =
      await res.json();

    updateTag("userData");

    return responseData;
  } catch (error) {
    console.log(error);

    return { success: false, data: null, error: (error as Error).message };
  }
};

export const getMyInstitute = async () => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching institute!");
    }
  }
};

export const getAllUserInstitutes = async () => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching institutes!");
    }
  }
};

// export const setCurrentInstitute = async (instituteId: string) => {
//   const token = await getCookie();

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/set-current`,
//       {
//         method: "POST",
//         body: JSON.stringify({ instituteId }),
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `token=${token}`,
//         },
//         credentials: "include",
//       }
//     );

//     const responseData = await res.json();
//     return responseData;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Error: ${error.message}`);
//     } else {
//       throw new Error(
//         "An unknown error occurred while setting current institute!"
//       );
//     }
//   }
// };
