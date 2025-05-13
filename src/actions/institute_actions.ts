"use server";
import { revalidateTag } from "next/cache";
import { getCookie } from "./cookie_actions";

interface InstituteCreateData {
  name: string;
  logo?: any;
  subjects?: string[];
  standards?: string[];
}

export const createInstitute = async (data: InstituteCreateData) => {
  const token = await getCookie("token");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/institute/create`,
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

    revalidateTag("userData");

    const responseData = await res.json();
    return responseData;
  } catch (error) {
      return new Error(`Error: ${(error as Error).message}`);
  }
};

export const getMyInstitute = async () => {
  const token = await getCookie("token");

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
      throw new Error(
        "An unknown error occurred while fetching institute!"
      );
    }
  }
};

export const getAllUserInstitutes = async () => {
  const token = await getCookie("token");

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
      throw new Error(
        "An unknown error occurred while fetching institutes!"
      );
    }
  }
};

// export const setCurrentInstitute = async (instituteId: string) => {
//   const token = await getCookie("token");

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