import { NextRequest } from "next/server";
import { db } from "@/lib/store/json-db";
import { successResponse, errorResponse } from "@/lib/utils/api";
import { batchSchema } from "@/lib/validations/schema";

// Sample data - Replace with your database calls
let batches = [
  {
    id: 1,
    name: "Morning Physics",
    class: "11",
    subjects: ["physics"],
    totalStudents: 15,
    maxStudents: 30,
    status: "active",
    teacher: "Dr. Smith",
    icon: "⚡",
    iconBg: "bg-blue-500",
  },
  {
    id: 2,
    name: "Evening Chemistry",
    class: "12",
    subjects: ["chemistry"],
    totalStudents: 20,
    maxStudents: 25,
    status: "active",
    teacher: "Dr. Johnson",
    icon: "🧪",
    iconBg: "bg-green-500",
  },
];

// Schema for creating a new batch
const createBatchSchema = batchSchema.omit({ id: true });

const querySchema = batchSchema.omit({ id: true });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      class: searchParams.get("class") || undefined,
      status: searchParams.get("status") || undefined,
      subject: searchParams.get("subject") || undefined,
    };

    const batches = db.getBatches(filters);
    return successResponse(batches);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to fetch batches");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = batchSchema.omit({ id: true }).parse(body);
    const newBatch = db.addBatch(validatedData);
    return successResponse(newBatch);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to add batch");
  }
}
