import React from "react";
import Image from "next/image";

interface TeacherHeaderProps {
  teacherId: string;
  name: string;
  joinedYear: number;
  teacherCode: string;
  email: string;
  address: string;
  contact: string;
}

const TeacherHeader = ({
  teacherId,
  name,
  joinedYear,
  teacherCode,
  email,
  address,
  contact,
}: TeacherHeaderProps) => {
  return (
    <div className="bg-[#eef2ff] px-4 py-6 md:px-8 md:py-8 rounded-3xl mb-6 shadow-sm border border-indigo-100">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white p-2 md:p-3 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-indigo-50 opacity-50"></div>
          <Image
            src="/placeholder-teacher.jpg"
            alt={name}
            width={100}
            height={100}
            className="rounded-3xl relative z-10"
          />
        </div>

        <div className="flex-1">
          <div className="inline-block bg-indigo-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-3xl mb-2">
            Joined in {joinedYear}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {name}
          </h1>
          <p className="text-gray-700 mt-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
              />
            </svg>
            Teacher Code: {teacherCode}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white shadow-sm border border-indigo-100">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <span className="text-gray-700 text-sm">{address}</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white shadow-sm border border-indigo-100">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <span className="text-gray-700 text-sm">{contact}</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white shadow-sm border border-indigo-100">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <span className="text-gray-700 text-sm">{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHeader;
