import React from "react";

import Link from "next/link";

interface StudentsOverviewProps {
  totalStudents: number;
  averageAttendance: number;
  instituteId?: string;
}

const StudentsOverview = ({
  totalStudents,
  averageAttendance,
  instituteId,
}: StudentsOverviewProps) => {
  return (
    <div className="bg-white px-4 sm:px-8 py-6 sm:py-10 rounded-3xl border-2 border-green-400 shadow-section">
      <h2 className="text-xl sm:text-2xl font-bold ml-6">Students Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-4 sm:p-8">
        <div>
          <h3 className="text-gray-600 mb-2">Total Students</h3>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-3xl font-bold">{totalStudents}</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-600 mb-2">Average Attendance</h3>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-3xl font-bold">{averageAttendance}%</span>
          </div>
        </div>
      </div>

      <Link
        href={`/institute/${instituteId}/students`}
        className="font-bold text-lg sm:text-xl bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center gap-2 py-3 transition rounded-2xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        View Students
      </Link>
    </div>
  );
};

export default StudentsOverview;
