'use client';

import { PencilLine } from "lucide-react";
import { InstituteOverview, StatisticsOverview } from "./_components";
import { Users, BookText, ClipboardCheck, ChartLine } from "lucide-react";


// Mock data for the dashboard
const data = {
  institute: {
    name: "Chaitanya Bharathi Institute",
    establishedYear: 2001,
    instituteCode: "21XYZ1234", 
    address: "123, Main Stree, City, Country",
    contact: "+1234567890",
    email: "info@institute.com",
    instituteLogo: "/images/institute-image.png"
  },
  students: {
    totalStudents: 2284,
    activeCourses: 84,
    averageAttendance: 98,
    performanceIndex: 9.0
  },
  teachers: {
    totalTeachers: 24,
    departments: 14,
    activeClasses: 98,
    satisfactionRate: 9.0
  }
};

const studentStats = [
  {
    label: "Total Students",
    value: data.students.totalStudents,
    icon: Users
  },
  {
    label: "Active Courses",
    value: data.students.activeCourses,
    icon: BookText
  },
  {
    label: "Average Attendance",
    value: `${data.students.averageAttendance}%`,
    icon: ClipboardCheck
  },
  {
    label: "Performance Index",
    value: `${data.students.performanceIndex}/10`,
    icon: ChartLine
  }
];

const teacherStats = [
  {
    label: "Total Teachers",
    value: data.teachers.totalTeachers,
    icon: Users
  },
  {
    label: "Departments",
    value: data.teachers.departments,
    icon: BookText
  },
  {
    label: "Active Classes",
    value: data.teachers.activeClasses,
    icon: ClipboardCheck
  },
  {
    label: "Satisfaction Rate",
    value: `${data.teachers.satisfactionRate}/10`,
    icon: ChartLine
  }
];

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Institute Overview and Management</h1>
        <div className="flex gap-2">
          <button className="bg-customPurple text-white px-6 py-2 rounded-md hover:bg-customHoverPurple transition">
            <div className="flex items-center gap-1">
              <PencilLine size={16} />&nbsp;
              <span>Edit</span>
            </div>
          </button>
        </div>
      </div>

      <InstituteOverview 
        name={data.institute.name}
        establishedYear={data.institute.establishedYear}
        instituteCode={data.institute.instituteCode}
        address={data.institute.address}
        contact={data.institute.contact}
        email={data.institute.email}
        instituteLogo={data.institute.instituteLogo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <StatisticsOverview 
          title="Students Overview"
          stats={studentStats}
          variant="student"
          linkHref="/batches"
          linkText="View Students"
        />

        <StatisticsOverview 
          title="Teachers Overview"
          stats={teacherStats}
          variant="teacher"
          linkHref="/teachers"
          linkText="View Teachers"
        />
      </div>
    </div>
  );
}