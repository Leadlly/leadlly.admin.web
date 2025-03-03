import { NextResponse } from "next/server";
import { BatchGroup } from "@/types/batch";

const batches: BatchGroup[] = [
  {
    standard: "11st Standard",
    batch: [
      {
        standard: "11st Standard",
        className: "Omega",
        status: "active",
        subjects: ["Chemistry", "Physics", "Biology"],
        totalStudents: 120,
        maxCapacity: 180,
        instructor: "Dr. Sarah Wilson",
      },
      {
        standard: "11st Standard",
        className: "Omega",
        status: "active",
        subjects: ["Chemistry", "Physics", "Biology"],
        totalStudents: 120,
        maxCapacity: 180,
        instructor: "Dr. Sarah Wilson",
      },
      {
        standard: "11st Standard",
        className: "Omega",
        status: "active",
        subjects: ["Chemistry", "Physics", "Biology"],
        totalStudents: 120,
        maxCapacity: 180,
        instructor: "Dr. Sarah Wilson",
      },
    ],
  },
  {
    standard: "12nd Standard",
    batch: [
      {
        standard: "12st Standard",
        className: "Omega",
        status: "active",
        subjects: ["Chemistry", "Physics", "Biology"],
        totalStudents: 120,
        maxCapacity: 180,
        instructor: "Dr. Sarah Wilson",
      },
      {
        standard: "11st Standard",
        className: "Omega",
        status: "active",
        subjects: ["Chemistry", "Physics", "Biology"],
        totalStudents: 120,
        maxCapacity: 180,
        instructor: "Dr. Sarah Wilson",
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(batches, { status: 200 });
}
