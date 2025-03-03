import { NextRequest } from "next/server";
import { db } from "@/lib/store/json-db";
import { successResponse, errorResponse } from "@/lib/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      performanceLevel: searchParams.get("performanceLevel") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const students = db.getStudents(params.batchId, filters);
    return successResponse(students);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to fetch students");
  }
}
