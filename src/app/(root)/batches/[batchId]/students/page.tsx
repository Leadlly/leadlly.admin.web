"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { StudentPerformanceLevel } from "@/lib/validations/schema";
import { useStudents } from "@/providers/StudentsProvider";
import { useParams } from "next/navigation";

export default function StudentsPage() {
  const params = useParams();
  const batchId = params.batchId as string;
  const { getStudentsByBatchId, students, isLoading, error } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState<
    StudentPerformanceLevel | "all"
  >("all");

  const fetchStudents = async () => {
    try {
      await getStudentsByBatchId(batchId, {
        performanceLevel:
          performanceFilter === "all" ? undefined : performanceFilter,
        search: searchQuery || undefined,
      });
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchStudents();
    }
  }, [batchId, performanceFilter, searchQuery]);

  // Performance level styling
  const performanceLevelStyles = {
    excellent: {
      background: "bg-green-50",
      progressBar: "bg-green-500 w-4/5",
    },
    optimal: {
      background: "bg-yellow-50",
      progressBar: "bg-yellow-500 w-3/5",
    },
    inefficient: {
      background: "bg-red-50",
      progressBar: "bg-red-500 w-2/5",
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="text-lg font-semibold mb-2">Error Loading Students</h3>
          <p>{error}</p>
          <Button
            onClick={fetchStudents}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-800"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (!students || students.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No students found matching the filters.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className={`p-4 ${
              performanceLevelStyles[student.performanceLevel].background
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.avatar} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">Class: {student.class}</p>
              </div>
              <div className="ml-auto">
                <span className="text-sm">{student.emoji}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Level:</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    performanceLevelStyles[student.performanceLevel].progressBar
                  }`}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Students Info</h1>

      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search a student"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={performanceFilter === "all" ? "default" : "outline"}
              className={
                performanceFilter === "all"
                  ? "bg-purple-500 hover:bg-purple-600"
                  : ""
              }
              onClick={() => setPerformanceFilter("all")}
            >
              All
            </Button>
            <Button
              variant={
                performanceFilter === "excellent" ? "default" : "outline"
              }
              className={
                performanceFilter === "excellent"
                  ? "bg-green-500 hover:bg-green-600"
                  : ""
              }
              onClick={() => setPerformanceFilter("excellent")}
            >
              Excellent
            </Button>
            <Button
              variant={performanceFilter === "optimal" ? "default" : "outline"}
              className={
                performanceFilter === "optimal"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : ""
              }
              onClick={() => setPerformanceFilter("optimal")}
            >
              Optimal
            </Button>
            <Button
              variant={
                performanceFilter === "inefficient" ? "default" : "outline"
              }
              className={
                performanceFilter === "inefficient"
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }
              onClick={() => setPerformanceFilter("inefficient")}
            >
              Inefficient
            </Button>
          </div>
          <Button variant="outline" className="p-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
