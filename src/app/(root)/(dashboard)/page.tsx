import Image from "next/image";
import React from "react";
import { StudentsOverview, TeachersOverview, InstituteOverview } from "./_components";

// Mock data for the dashboard
const dashboardData = {
  institute: {
    name: "Leadlly Academy",
    establishedYear: 2010,
    instituteCode: "LA-2010",
    address: "123 Education Street, Knowledge City",
    contact: "+1 (555) 123-4567",
    email: "info@leadlly-academy.com"
  },
  students: {
    totalStudents: 1250,
    activeCourses: 42,
    averageAttendance: 92,
    performanceIndex: 8.7
  },
  teachers: {
    totalTeachers: 68,
    departments: 12,
    activeClasses: 86,
    satisfactionRate: 9.2
  }
};

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Generate Report
          </button>
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
