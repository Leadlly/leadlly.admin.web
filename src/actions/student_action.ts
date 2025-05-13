"use server";

import { revalidatePath } from "next/cache";
import { getCookie } from "./cookie_actions";

/**
 * Add students to an institute by email
 * @param instituteId - The ID of the institute to add students to
 * @param emails - Array of student email addresses
 * @returns Response with success status and message
 */
export async function addStudentsToInstitute(instituteId: string, emails: string[]) {
  try {

    const token = await getCookie("token");

    // Validate inputs
    if (!instituteId) {
      throw new Error("Institute ID is required");
    }
    
    if (!emails || emails.length === 0) {
      throw new Error("At least one email address is required");
    }
    
    // Filter out invalid emails
    const validEmails = emails.filter(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    
    if (validEmails.length === 0) {
      throw new Error("No valid email addresses provided");
    }
    
    // Make API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/student/add/${instituteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ emails: validEmails }),
    });
    
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
      data: data
    };
  } catch (error: any) {
    console.error("Error adding students:", error);
    return {
      success: false,
      message: error.message || "Failed to add students",
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
    // Validate input
    if (!instituteId) {
      throw new Error("Institute ID is required");
    }
    
    // Make API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/institutes/${instituteId}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch students");
    }
    
    const data = await response.json();
    
    return {
      success: true,
      students: data.students || [],
    };
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch students",
      students: [],
    };
  }
}