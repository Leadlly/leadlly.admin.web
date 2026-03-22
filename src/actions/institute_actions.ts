"use server";

import { revalidateTag } from "next/cache";

import { z } from "zod";

import { CreateInstituteFormSchema } from "@/helpers/schema/createInstituteSchema";
import { IInstitute } from "@/helpers/types";
import { logger } from "@/lib/logger";

import { getCookie } from "./cookie_actions";

type InstituteCreateData = z.infer<typeof CreateInstituteFormSchema> & {
  logo?: { name: string; type: string };
};

type InstituteUpdateData = Partial<z.infer<typeof CreateInstituteFormSchema>> & {
  logo?: { name: string; type: string };
  docLogo?: { name: string; type: string };
};

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
        },
        credentials: "include",
      }
    );

    const responseData: {
      success: boolean;
      data: IInstitute;
      logoUploadUrl?: string;
      error?: string;
    } = await res.json();

    revalidateTag("userData", "max");

    return responseData;
  } catch (error) {
    logger.error("Error creating institute", { error });

    return { success: false, data: null, logoUploadUrl: undefined, error: (error as Error).message };
  }
};

export const updateInstitute = async (instituteId: string, data: InstituteUpdateData) => {
  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/${instituteId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    const responseData: {
      success: boolean;
      data: IInstitute;
      logoUploadUrl?: string;
      docLogoUploadUrl?: string;
      error?: string;
    } = await res.json();

    revalidateTag("userData", "max");

    return responseData;
  } catch (error) {
    logger.error("Error updating institute", { error });
    return {
      success: false,
      data: null,
      logoUploadUrl: undefined,
      docLogoUploadUrl: undefined,
      error: (error as Error).message,
    };
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

export const getActiveInstitute = async ({
  instituteId,
}: {
  instituteId: string;
}) => {
  if (!instituteId || instituteId === "undefined") {
    return { success: false, institute: null };
  }

  const token = await getCookie();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/${instituteId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    const responseData: { success: boolean; institute: IInstitute } =
      await res.json();
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

    const responseData: {
      success: boolean;
      institutes: IInstitute[];
      count: number;
    } = await res.json();
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
