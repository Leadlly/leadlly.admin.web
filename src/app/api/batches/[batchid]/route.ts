import { Student } from "@/types/student";
import { NextResponse } from "next/server";

const students: Student[] = [
  { name: "Abhinav Mishra", class: 11, level: 80, status: "excellent" },
  { name: "Abhinav Mishra", class: 11, level: 50, status: "optimal" },
  { name: "Abhinav Mishra", class: 11, level: 20, status: "inefficient" },
  { name: "Abhinav Mishra", class: 11, level: 90, status: "excellent" },
  { name: "Abhinav Mishra", class: 11, level: 40, status: "optimal" },
  { name: "Abhinav Mishra", class: 11, level: 30, status: "inefficient" },
];

export async function GET() {
  return NextResponse.json(students, { status: 200 });
}
