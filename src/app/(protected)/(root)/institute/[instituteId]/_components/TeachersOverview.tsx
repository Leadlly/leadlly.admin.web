import React from "react";

import Link from "next/link";

interface TeachersOverviewProps {
  totalTeachers: number;
  activeClasses: number;
  instituteId: string;
}

const TeachersOverview = ({
  totalTeachers,
  activeClasses,
  instituteId,
}: TeachersOverviewProps) => {
  return (
    <div className="bg-white px-4 sm:px-8 py-6 sm:py-10 rounded-3xl border-2 border-blue-400 shadow-section">
      <h2 className="text-xl sm:text-2xl font-bold ml-6">Teachers Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-4 sm:p-8">
        <div>
          <h3 className="text-gray-600 mb-2">Total Teachers</h3>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
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
            <span className="text-3xl font-bold">{totalTeachers}</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-600 mb-2">Active Classes</h3>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-3xl font-bold">{activeClasses}</span>
          </div>
        </div>
      </div>

      <Link
        href={`/institute/${instituteId}/teachers`}
        className="font-bold text-lg sm:text-xl bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center gap-2 py-3 rounded-xl transition"
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
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </svg>
        View Teachers
      </Link>
    </div>
  );
};

export default TeachersOverview;
