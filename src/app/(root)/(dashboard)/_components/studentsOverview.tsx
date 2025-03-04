import React from "react";
import Link from "next/link";
import Image from "next/image";

interface StudentsOverviewProps {
  totalStudents: number;
  activeCourses: number;
  averageAttendance: number;
  performanceIndex: number;
}

const StudentsOverview = () => {
  return (
    <div className="w-full bg-[#FCFCFC] p-6 rounded-3xl shadow-section border-[1px] border-[#0DA21B8C] hover:border-[#1046168c] px-14">
      <h2 className="text-2xl font-semibold mb-6">Students Overview</h2>

      <div className="grid grid-cols-2 gap-10 mb-6">
        <div>
          <h3 className="text-gray-600 mb-2 md:text-xl">Total Students</h3>
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="21"
              viewBox="0 0 24 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.4 18.9999C22.4 17.0261 20.5078 15.3469 17.8667 14.7245M15.6 19C15.6 16.4963 12.5555 14.4667 8.8 14.4667C5.04446 14.4667 2 16.4963 2 19M15.6 11.0667C18.1037 11.0667 20.1333 9.03702 20.1333 6.53333C20.1333 4.02964 18.1037 2 15.6 2M8.8 11.0667C6.29631 11.0667 4.26667 9.03702 4.26667 6.53333C4.26667 4.02964 6.29631 2 8.8 2C11.3037 2 13.3333 4.02964 13.3333 6.53333C13.3333 9.03702 11.3037 11.0667 8.8 11.0667Z"
                stroke="#13B924"
                strokeWidth="2.26667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-2xl md:text-3xl font-semibold">2284</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-600 mb-2 md:text-xl">Active Courses</h3>
          <div className="flex items-center gap-2">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25 2H5.40021C4.2101 2 3.6146 2 3.16003 2.23161C2.76019 2.43534 2.43534 2.76019 2.23161 3.16003C2 3.6146 2 4.2101 2 5.40021V15.6002C2 16.7903 2 17.3851 2.23161 17.8396C2.43534 18.2395 2.76019 18.5649 3.16003 18.7686C3.61415 19 4.20893 19 5.39672 19H6.25M6.25 2H15.6002C16.7903 2 17.3845 2 17.8391 2.23161C18.239 2.43534 18.5649 2.76019 18.7686 3.16003C19 3.61415 19 4.20893 19 5.39672V15.6038C19 16.7916 19 17.3855 18.7686 17.8396C18.5649 18.2395 18.239 18.5649 17.8391 18.7686C17.385 19 16.7911 19 15.6033 19H6.25M6.25 2V19M10.5 9.4375H14.75M10.5 6.25H14.75"
                stroke="#13B924"
                strokeWidth="2.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-2xl md:text-3xl font-semibold">84</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-600 mb-2 md:text-xl">Average Attendance</h3>
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.08333 19.875C2.93274 19.875 2 18.9423 2 17.7917V1.125H11.375L16.5833 6.33333V17.7917C16.5833 18.9423 15.6506 19.875 14.5 19.875H4.08333Z"
                stroke="#13B924"
                strokeWidth="2.08333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.332 1.125V7.375H16.582"
                stroke="#13B924"
                strokeWidth="2.08333"
                strokeLinejoin="round"
              />
              <path
                d="M12.416 11.5415L8.24935 15.7082L6.16602 13.6248"
                stroke="#13B924"
                strokeWidth="2.08333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-2xl md:text-3xl font-semibold">98%</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-600 mb-2 md:text-xl">Performance Index</h3>
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="21"
              viewBox="0 0 24 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 13.3336V15.3733C2 16.6428 2 17.2771 2.24705 17.7619C2.46436 18.1884 2.81087 18.5359 3.23737 18.7532C3.72176 19 4.35619 19 5.62316 19H22.4002M2 13.3336V2M2 13.3336L6.36718 9.69427L6.3708 9.69137C7.16082 9.03302 7.5566 8.7032 7.98575 8.56924C8.49272 8.41098 9.0388 8.43601 9.52936 8.63952C9.94523 8.81204 10.3099 9.1767 11.0392 9.906L11.0465 9.91332C11.7871 10.654 12.1584 11.0253 12.581 11.1974C13.081 11.4011 13.6377 11.4186 14.1501 11.2486C14.5846 11.1045 14.9814 10.7579 15.7749 10.0636L22.4 4.26667"
                stroke="#13B924"
                strokeWidth="2.26667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-2xl md:text-3xl font-semibold">9.0/10</span>
          </div>
        </div>
      </div>

      <Link
        href="/batches"
        className="bg-[#0DA21B24] hover:bg-green-100 text-[#0DA21B] text-xl md:text-2xl flex items-center justify-center gap-2 py-3 rounded-md transition"
      >
        <span>📚</span>
        View Students
      </Link>
    </div>
  );
};

export default StudentsOverview;
