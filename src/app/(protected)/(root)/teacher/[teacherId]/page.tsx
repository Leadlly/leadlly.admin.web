import React from "react";
import {
  TeacherHeader,
  TeacherStats,
  TeacherClasses,
  TeacherPerformance,
} from "./_components";

// This would typically come from an API or database
const getTeacherData = (teacherId: string) => {
  // Mock data for demonstration
  return {
    id: teacherId,
    name: "Dr. Sarah Johnson",
    joinedYear: 2018,
    teacherCode: "TCH" + teacherId,
    email: "sarah.johnson@institute.com",
    address: "456 Education Ave, City, Country",
    contact: "+1234567890",
    stats: {
      activeClasses: 8,
      totalStudents: 245,
      averageAttendance: 98,
      satisfactionRate: 9.0,
    },
    classes: [
      {
        id: "c1",
        name: "Advanced Mathematics",
        subject: "Mathematics",
        students: 32,
        schedule: "Mon, Wed 10:00 AM",
      },
      {
        id: "c2",
        name: "Physics 101",
        subject: "Physics",
        students: 28,
        schedule: "Tue, Thu 1:00 PM",
      },
      {
        id: "c3",
        name: "Chemistry Lab",
        subject: "Chemistry",
        students: 24,
        schedule: "Fri 9:00 AM",
      },
      {
        id: "c4",
        name: "Computer Science",
        subject: "CS",
        students: 30,
        schedule: "Mon, Wed 2:00 PM",
      },
    ],
    performanceData: [
      { category: "Student Feedback", score: 9.2, maxScore: 10 },
      { category: "Attendance Rate", score: 98, maxScore: 100 },
      { category: "Course Completion", score: 95, maxScore: 100 },
      { category: "Academic Results", score: 8.7, maxScore: 10 },
    ],
    // Added monthly performance data for charts
    monthlyPerformance: [
      {
        month: "Jan",
        studentFeedback: 8.5,
        attendanceRate: 94,
        courseCompletion: 92,
      },
      {
        month: "Feb",
        studentFeedback: 8.7,
        attendanceRate: 95,
        courseCompletion: 93,
      },
      {
        month: "Mar",
        studentFeedback: 8.9,
        attendanceRate: 96,
        courseCompletion: 94,
      },
      {
        month: "Apr",
        studentFeedback: 9.0,
        attendanceRate: 97,
        courseCompletion: 94,
      },
      {
        month: "May",
        studentFeedback: 9.1,
        attendanceRate: 98,
        courseCompletion: 95,
      },
      {
        month: "Jun",
        studentFeedback: 9.2,
        attendanceRate: 98,
        courseCompletion: 95,
      },
    ],
  };
};

export default function TeacherPage({
  params,
}: {
  params: { teacherId: string };
}) {
  const teacherData = getTeacherData(params.teacherId);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Teacher Dashboard
        </h1>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <TeacherHeader
        teacherId={teacherData.id}
        name={teacherData.name}
        joinedYear={teacherData.joinedYear}
        teacherCode={teacherData.teacherCode}
        email={teacherData.email}
        address={teacherData.address}
        contact={teacherData.contact}
      />

      <TeacherStats
        activeClasses={teacherData.stats.activeClasses}
        totalStudents={teacherData.stats.totalStudents}
        averageAttendance={teacherData.stats.averageAttendance}
        satisfactionRate={teacherData.stats.satisfactionRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <TeacherPerformance
            performanceData={teacherData.performanceData}
            monthlyPerformance={teacherData.monthlyPerformance}
          />
        </div>
        <div className="lg:col-span-3">
          <TeacherClasses classes={teacherData.classes} />
        </div>
      </div>
    </div>
  );
}
