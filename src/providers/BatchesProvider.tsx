"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Batch } from "@/lib/validations/schema";
import { fetchBatches } from "@/lib/services/api";

// Sample data
const initialBatchesData: Batch[] = [
  {
    id: 1,
    name: "Omega",
    class: "11",
    subjects: ["Chemistry", "Physics", "Biology"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Ω",
    iconBg: "bg-blue-500",
  },
  {
    id: 2,
    name: "Sigma",
    class: "11",
    subjects: ["Mathematics", "Chemistry", "Physics"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Σ",
    iconBg: "bg-purple-500",
  },
  {
    id: 3,
    name: "Omega",
    class: "11",
    subjects: ["Physics"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Ω",
    iconBg: "bg-teal-500",
  },
  {
    id: 4,
    name: "Omega",
    class: "12",
    subjects: ["Chemistry"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Ω",
    iconBg: "bg-blue-500",
  },
  {
    id: 5,
    name: "Sigma",
    class: "12",
    subjects: ["Mathematics"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Σ",
    iconBg: "bg-purple-500",
  },
  {
    id: 6,
    name: "Omega",
    class: "12",
    subjects: ["Physics"],
    totalStudents: 120,
    maxStudents: 180,
    status: "active",
    teacher: "Dr. Sarah Wilson",
    icon: "Ω",
    iconBg: "bg-teal-500",
  },
];

interface BatchesContextType {
  batches: Batch[];
  setBatches: (batches: Batch[]) => void;
  isLoading: boolean;
  error: string | null;
  refetch: (params?: {
    class?: string;
    status?: string;
    subject?: string;
  }) => Promise<void>;
  addBatch: (batchData: Omit<Batch, "id">) => Promise<void>;
}

const BatchesContext = createContext<BatchesContextType | undefined>(undefined);

export function BatchesProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async (params?: {
    class?: string;
    status?: string;
    subject?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBatches(params);
      setBatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch batches");
    } finally {
      setIsLoading(false);
    }
  };

  const addBatch = async (batchData: Omit<Batch, "id">) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || "Failed to add batch");
      }

      // Refetch batches to get the updated list
      await refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add batch";
      setError(errorMessage);
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <BatchesContext.Provider
      value={{
        batches,
        setBatches,
        isLoading,
        error,
        refetch,
        addBatch,
      }}
    >
      {children}
    </BatchesContext.Provider>
  );
}

export function useBatches() {
  const context = useContext(BatchesContext);
  if (context === undefined) {
    throw new Error("useBatches must be used within a BatchesProvider");
  }
  return context;
}
