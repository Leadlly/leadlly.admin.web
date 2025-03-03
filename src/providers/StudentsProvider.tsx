"use client";

import { createContext, useContext, useState } from "react";
import type { Student } from "@/lib/validations/schema";
import { fetchStudentsByBatch } from "@/lib/services/api";

interface StudentsContextType {
  students: Student[];
  setStudents: (students: Student[]) => void;
  getStudentsByBatchId: (
    batchId: string,
    params?: {
      performanceLevel?: string;
      search?: string;
    }
  ) => Promise<Student[]>;
  isLoading: boolean;
  error: string | null;
}

const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudentsByBatchId = async (
    batchId: string,
    params?: {
      performanceLevel?: string;
      search?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStudentsByBatch(batchId, params);
      setStudents(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch students";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentsContext.Provider
      value={{ students, setStudents, getStudentsByBatchId, isLoading, error }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
}
