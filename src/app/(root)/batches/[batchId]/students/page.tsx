"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data for students in a batch
const getStudentsData = (batchId: string) => {
  // This would typically come from an API or database
  return {
    batchInfo: {
      id: batchId,
      name: batchId.includes("omega") ? "Omega" : "Sigma",
      standard: batchId.startsWith("11") ? "11th Class" : "12th Class",
      subjects: batchId.includes("omega")
        ? ["Physics", "Chemistry"]
        : ["Mathematics"],
      teacher: "Dr. Sarah Wilson",
    },
    students: [
      {
        id: "s1",
        name: "Alex Johnson",
        rollNumber: "R2023001",
        attendance: 92,
        performance: 8.7,
        email: "alex.j@student.edu",
        contact: "+1234567890",
      },
      {
        id: "s2",
        name: "Emma Williams",
        rollNumber: "R2023002",
        attendance: 98,
        performance: 9.5,
        email: "emma.w@student.edu",
        contact: "+1234567891",
      },
      {
        id: "s3",
        name: "Michael Brown",
        rollNumber: "R2023003",
        attendance: 85,
        performance: 7.8,
        email: "michael.b@student.edu",
        contact: "+1234567892",
      },
      {
        id: "s4",
        name: "Sophia Davis",
        rollNumber: "R2023004",
        attendance: 94,
        performance: 4.9,
        email: "sophia.d@student.edu",
        contact: "+1234567893",
      },
      {
        id: "s5",
        name: "James Miller",
        rollNumber: "R2023005",
        attendance: 90,
        performance: 8.2,
        email: "james.m@student.edu",
        contact: "+1234567894",
      },
      {
        id: "s6",
        name: "Olivia Wilson",
        rollNumber: "R2023006",
        attendance: 96,
        performance: 9.1,
        email: "olivia.w@student.edu",
        contact: "+1234567895",
      },
      {
        id: "s7",
        name: "William Taylor",
        rollNumber: "R2023007",
        attendance: 88,
        performance: 7.9,
        email: "william.t@student.edu",
        contact: "+1234567896",
      },
      {
        id: "s8",
        name: "Ava Anderson",
        rollNumber: "R2023008",
        attendance: 93,
        performance: 8.6,
        email: "ava.a@student.edu",
        contact: "+1234567897",
      },
    ],
  };
};

export default function BatchStudentsPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = useState<{
    batchId: string;
  } | null>(null);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  if (!unwrappedParams) {
    return <div>Loading...</div>;
  }

  const { batchInfo, students } = getStudentsData(unwrappedParams.batchId);

  // Function to handle filtering
  const handleFilter = (filter: string) => {
    setFilter(filter);
  };

  // Filter students based on performance
  const filteredStudents = students.filter((student) => {
    if (filter === "Excellent") return student.performance >= 8.5;
    if (filter === "Optimal")
      return student.performance >= 7 && student.performance < 8.5;
    if (filter === "Insufficient") return student.performance < 7;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <Link
            href="/batches"
            className="text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Batches
          </Link>
        </div>
        <Button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
          Add Student
        </Button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-section mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-6">
          <h1 className="text-2xl font-bold ">
            {batchInfo.name} - {batchInfo.standard}
            <span className="  text-sm md:ml-2">
              <p
                className="text-gray-900 font-medium"
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.75rem",
                  textAlign: "center",
                }}
              >
                Subjects: {batchInfo.subjects.join(", ")} | Teacher:{" "}
                {batchInfo.teacher}
              </p>
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant={filter === "All" ? "default" : "outline"}
                className={
                  filter === "All"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : ""
                }
                onClick={() => handleFilter("All")}
              >
                All
              </Button>
              <Button
                variant={filter === "Excellent" ? "default" : "outline"}
                className={
                  filter === "Excellent"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : ""
                }
                onClick={() => handleFilter("Excellent")}
              >
                Excellent
              </Button>
              <Button
                variant={filter === "Optimal" ? "default" : "outline"}
                className={
                  filter === "Optimal"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : ""
                }
                onClick={() => handleFilter("Optimal")}
              >
                Optimal
              </Button>
              <Button
                variant={filter === "Insufficient" ? "default" : "outline"}
                className={
                  filter === "Insufficient"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : ""
                }
                onClick={() => handleFilter("Insufficient")}
              >
                Insufficient
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`border rounded-3xl p-6 shadow-md h-48 ${
                student.performance >= 8.5
                  ? "bg-green-100"
                  : student.performance >= 7
                  ? "bg-yellow-100"
                  : "bg-red-100"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold border-2">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div className="text-md font-medium text-gray-900">
                    {student.name}
                  </div>
                  <div className="text-sm text-gray-900">
                    {batchInfo.standard}
                  </div>
                </div>
              </div>
              <div className="mb-2 p-4">
                <span className="font-medium text-sm">Performance: </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${
                      student.performance >= 8.5
                        ? "bg-green-500"
                        : student.performance >= 7
                        ? "bg-yellow-500"
                        : student.performance >= 5.5
                        ? "bg-gray-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${student.performance * 10}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-500">
                  {student.performance}/10
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <div className="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredStudents.length}</span> of{" "}
            <span className="font-medium">{students.length}</span> students
          </div>
          <div className="flex space-x-2">
            <Button className="px-3 py-1 border rounded-md bg-gray-100 text-blue-600 hover:bg-blue-100">
              Previous
            </Button>
            <Button className="px-3 py-1 border rounded-md bg-purple-600 text-white ">
              1
            </Button>
            <Button className="px-3 py-1 border rounded-md bg-gray-100 text-blue-600 hover:bg-blue-100">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
