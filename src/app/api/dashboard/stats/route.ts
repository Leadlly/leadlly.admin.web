import { NextRequest } from "next/server";
import { db } from "@/lib/store/json-db";
import { successResponse, errorResponse } from "@/lib/utils/api";

// Sample data - Replace with your database calls
const students = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/student-avatar.png",
    class: "11",
    performanceLevel: "excellent",
    emoji: "😊",
    status: "active",
    attendance: 95,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/student-avatar.png",
    class: "11",
    performanceLevel: "optimal",
    emoji: "🙂",
    status: "active",
    attendance: 98,
  },
  {
    id: 3,
    name: "Bob Johnson",
    avatar: "/student-avatar.png",
    class: "12",
    performanceLevel: "inefficient",
    emoji: "😕",
    status: "inactive",
    attendance: 75,
  },
  {
    id: 4,
    name: "Alice Brown",
    avatar: "/student-avatar.png",
    class: "12",
    performanceLevel: "excellent",
    emoji: "😊",
    status: "active",
    attendance: 92,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    avatar: "/student-avatar.png",
    class: "11",
    performanceLevel: "optimal",
    emoji: "🙂",
    status: "inactive",
    attendance: 85,
  },
];

const batches = [
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
    department: "Science",
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
    department: "Science",
  },
  {
    id: 3,
    name: "Mathematics Advanced",
    class: "11",
    subjects: ["mathematics"],
    totalStudents: 18,
    maxStudents: 25,
    status: "active",
    teacher: "Dr. Williams",
    icon: "📐",
    iconBg: "bg-purple-500",
    department: "Mathematics",
  },
];

const teachers = [
  {
    id: 1,
    name: "Dr. Smith",
    department: "Science",
    rating: 9.5,
    activeClasses: 3,
  },
  {
    id: 2,
    name: "Dr. Johnson",
    department: "Science",
    rating: 9.2,
    activeClasses: 2,
  },
  {
    id: 3,
    name: "Dr. Williams",
    department: "Mathematics",
    rating: 8.8,
    activeClasses: 4,
  },
];

export async function GET(_request: NextRequest) {
  try {
    const stats = db.getDashboardStats();
    return successResponse(stats);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to fetch dashboard stats");
  }
}
