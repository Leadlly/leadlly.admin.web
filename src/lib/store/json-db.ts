import fs from "fs";
import path from "path";
import type { Batch, Student } from "@/lib/validations/schema";

// Define the data directory path
const DATA_DIR = path.join(process.cwd(), "data");
const BATCHES_FILE = path.join(DATA_DIR, "batches.json");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");

// Initial data
const initialBatches: Batch[] = [
  {
    id: 1,
    name: "Morning Physics",
    class: "11",
    subjects: ["physics"],
    totalStudents: 0,
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
    totalStudents: 0,
    maxStudents: 25,
    status: "active",
    teacher: "Dr. Johnson",
    icon: "🧪",
    iconBg: "bg-green-500",
  },
  {
    id: 3,
    name: "Mathematics Advanced",
    class: "11",
    subjects: ["mathematics"],
    totalStudents: 0,
    maxStudents: 25,
    status: "active",
    teacher: "Dr. Williams",
    icon: "📐",
    iconBg: "bg-purple-500",
  },
];

const initialStudents: Student[] = [
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

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files with default data if they don't exist
if (!fs.existsSync(BATCHES_FILE)) {
  fs.writeFileSync(BATCHES_FILE, JSON.stringify(initialBatches, null, 2));
}

if (!fs.existsSync(STUDENTS_FILE)) {
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(initialStudents, null, 2));
}

class JsonDB {
  private static instance: JsonDB;
  private batches: Batch[];
  private students: Student[];
  private batchIdCounter: number;
  private studentIdCounter: number;

  private constructor() {
    // Load data from files
    this.batches = JSON.parse(fs.readFileSync(BATCHES_FILE, "utf-8"));
    this.students = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));

    // Initialize ID counters
    this.batchIdCounter = Math.max(...this.batches.map((b) => b.id)) + 1;
    this.studentIdCounter = Math.max(...this.students.map((s) => s.id)) + 1;
  }

  public static getInstance(): JsonDB {
    if (!JsonDB.instance) {
      JsonDB.instance = new JsonDB();
    }
    return JsonDB.instance;
  }

  private saveBatches(): void {
    fs.writeFileSync(BATCHES_FILE, JSON.stringify(this.batches, null, 2));
  }

  private saveStudents(): void {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(this.students, null, 2));
  }

  // Batch methods
  public getBatches(filters?: {
    class?: string;
    status?: string;
    subject?: string;
  }): Batch[] {
    let filteredBatches = [...this.batches];

    if (filters) {
      if (filters.class && filters.class !== "all") {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.class === filters.class
        );
      }
      if (filters.status && filters.status !== "all") {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.status === filters.status
        );
      }
      if (filters.subject) {
        filteredBatches = filteredBatches.filter((batch) =>
          batch.subjects.includes(filters.subject!)
        );
      }
    }

    return filteredBatches;
  }

  public addBatch(batchData: Omit<Batch, "id">): Batch {
    const newBatch = {
      ...batchData,
      id: this.batchIdCounter++,
      totalStudents: 0,
    };
    this.batches.push(newBatch);
    this.saveBatches();
    return newBatch;
  }

  public updateBatch(id: number, batchData: Partial<Batch>): Batch {
    const index = this.batches.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Batch with id ${id} not found`);
    }
    this.batches[index] = { ...this.batches[index], ...batchData };
    this.saveBatches();
    return this.batches[index];
  }

  public deleteBatch(id: number): void {
    const index = this.batches.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Batch with id ${id} not found`);
    }
    this.batches.splice(index, 1);
    this.saveBatches();
  }

  // Student methods
  public getStudents(
    batchId?: string,
    filters?: {
      performanceLevel?: string;
      search?: string;
    }
  ): Student[] {
    let filteredStudents = [...this.students];

    if (filters) {
      if (filters.performanceLevel && filters.performanceLevel !== "all") {
        filteredStudents = filteredStudents.filter(
          (student) => student.performanceLevel === filters.performanceLevel
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredStudents = filteredStudents.filter((student) =>
          student.name.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredStudents;
  }

  public addStudent(studentData: Omit<Student, "id">): Student {
    const newStudent = {
      ...studentData,
      id: this.studentIdCounter++,
    };
    this.students.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  public updateStudent(id: number, studentData: Partial<Student>): Student {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Student with id ${id} not found`);
    }
    this.students[index] = { ...this.students[index], ...studentData };
    this.saveStudents();
    return this.students[index];
  }

  public deleteStudent(id: number): void {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Student with id ${id} not found`);
    }
    this.students.splice(index, 1);
    this.saveStudents();
  }

  // Dashboard stats
  public getDashboardStats() {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(
      (student) => student.status === "active"
    ).length;
    const inactiveStudents = totalStudents - activeStudents;

    const averageAttendance = Math.round(
      this.students.reduce((sum, student) => sum + student.attendance, 0) /
        totalStudents
    );

    const performanceScores = {
      excellent: 10,
      optimal: 8,
      inefficient: 5,
    };

    const performanceIndex = Number(
      (
        this.students.reduce(
          (sum, student) =>
            sum +
            performanceScores[
              student.performanceLevel as keyof typeof performanceScores
            ],
          0
        ) / totalStudents
      ).toFixed(1)
    );

    const performanceDistribution = {
      excellent: this.students.filter(
        (student) => student.performanceLevel === "excellent"
      ).length,
      optimal: this.students.filter(
        (student) => student.performanceLevel === "optimal"
      ).length,
      inefficient: this.students.filter(
        (student) => student.performanceLevel === "inefficient"
      ).length,
    };

    const totalTeachers = new Set(this.batches.map((batch) => batch.teacher))
      .size;
    const departments = new Set(this.batches.flatMap((batch) => batch.subjects))
      .size;
    const activeClasses = this.batches.filter(
      (batch) => batch.status === "active"
    ).length;
    const satisfactionRate = 9.2; // Placeholder - would come from teacher ratings

    const totalBatches = this.batches.length;
    const activeCourses = this.batches.filter(
      (batch) => batch.status === "active"
    ).length;
    const batchDistribution = {
      class11: this.batches.filter((batch) => batch.class === "11").length,
      class12: this.batches.filter((batch) => batch.class === "12").length,
    };

    return {
      totalStudents,
      activeCourses,
      averageAttendance,
      performanceIndex,
      totalTeachers,
      departments,
      activeClasses,
      satisfactionRate,
      totalBatches,
      activeStudents,
      inactiveStudents,
      performanceDistribution,
      batchDistribution,
    };
  }
}

export const db = JsonDB.getInstance();
