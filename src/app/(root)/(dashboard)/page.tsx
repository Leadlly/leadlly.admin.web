import Image from "next/image";
import React from "react";
import {
  StudentsOverview,
  TeachersOverview,
  InstituteOverview,
} from "../institute/_components";
import { Button } from "@/components/ui/button";

// Mock data for the dashboard
const dashboardData = {
  institute: {
    name: "Chaitanya Bharathi Institute",
    establishedYear: 2001,
    instituteCode: "21XYZ1234",
    address: "123 Education Street, Knowledge City",
    contact: "+1 (555) 123-4567",
    email: "info@ChaitanyaBharathi.com",
  },

  students: {
    totalStudents: 1250,
    activeCourses: 42,
    averageAttendance: 92,
    performanceIndex: 8.7,
  },
  teachers: {
    totalTeachers: 68,
    departments: 12,
    activeClasses: 86,
    satisfactionRate: 9.2,
  },
};

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-6 py-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Institution Overview & Management
        </h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
            <svg
              xmlns=""
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="text-xl py-10">Edit Profile</span>
          </Button>
        </div>
      </div>

      <InstituteOverview
        name={dashboardData.institute.name}
        establishedYear={dashboardData.institute.establishedYear}
        instituteCode={dashboardData.institute.instituteCode}
        address={dashboardData.institute.address}
        contact={dashboardData.institute.contact}
        email={dashboardData.institute.email}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <StudentsOverview
          totalStudents={dashboardData.students.totalStudents}
          activeCourses={dashboardData.students.activeCourses}
          averageAttendance={dashboardData.students.averageAttendance}
          performanceIndex={dashboardData.students.performanceIndex}
        />

        <TeachersOverview
          totalTeachers={dashboardData.teachers.totalTeachers}
          departments={dashboardData.teachers.departments}
          activeClasses={dashboardData.teachers.activeClasses}
          satisfactionRate={dashboardData.teachers.satisfactionRate}
        />
      </div>
    </div>
  );
}
