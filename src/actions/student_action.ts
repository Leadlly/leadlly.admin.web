"use server";

import { revalidatePath } from "next/cache";

import { getCookie } from "./cookie_actions";

/**
 * Add students to an institute by email
 * @param instituteId - The ID of the institute to add students to
 * @param emails - Array of student email addresses
 * @returns Response with success status and message
 */
export async function addStudentsToInstitute(
  instituteId: string,
  emails: string[]
) {
  try {
    const token = await getCookie();

    // Validate inputs
    if (!instituteId) {
      throw new Error("Institute ID is required");
    }

    if (!emails || emails.length === 0) {
      throw new Error("At least one email address is required");
    }

    // Filter out invalid emails
    const validEmails = emails.filter((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });

    if (validEmails.length === 0) {
      throw new Error("No valid email addresses provided");
    }

    // Make API call to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/student/add/${instituteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ emails: validEmails }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add students");
    }

    const data = await response.json();

    // Revalidate the institute page to show updated student count
    revalidatePath(`/institute/${instituteId}`);

    return {
      success: true,
      message: `Successfully added ${validEmails.length} students`,
      data: data,
    };
  } catch (error) {
    console.error("Error adding students:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add students",
    };
  }
}

/**
 * Get all students for an institute
 * @param instituteId - The ID of the institute
 * @returns Response with students data
 */
export async function getInstituteStudents(instituteId: string) {
  try {
    if (!instituteId) {
      throw new Error("Institute ID is required");
    }

    const token = await getCookie();
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "API base URL not configured. Set NEXT_PUBLIC_ADMIN_API_BASE_URL in .env.local"
      );
    }

    const response = await fetch(
      `${baseUrl}/api/institute/${instituteId}/students`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Failed to fetch students (${response.status})`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch students");
    }

    return {
      success: true,
      students: data.students ?? [],
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch students",
      students: [],
    };
  }
}
