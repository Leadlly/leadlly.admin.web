import React from 'react';
import { 
  TeacherHeader, 
  TeacherStats, 
  TeacherClasses, 
  TeacherPerformance 
} from './_components';

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
      satisfactionRate: 9.0
    },
    classes: [
      { id: "c1", name: "Advanced Mathematics", subject: "Mathematics", students: 32, schedule: "Mon, Wed 10:00 AM" },
      { id: "c2", name: "Physics 101", subject: "Physics", students: 28, schedule: "Tue, Thu 1:00 PM" },
      { id: "c3", name: "Chemistry Lab", subject: "Chemistry", students: 24, schedule: "Fri 9:00 AM" },
      { id: "c4", name: "Computer Science", subject: "CS", students: 30, schedule: "Mon, Wed 2:00 PM" },
    ],
    performanceData: [
      { category: "Student Feedback", score: 9.2, maxScore: 10 },
      { category: "Attendance Rate", score: 98, maxScore: 100 },
      { category: "Course Completion", score: 95, maxScore: 100 },
      { category: "Academic Results", score: 8.7, maxScore: 10 },
    ]
  };
};

export default function TeacherPage({ params }: { params: { teacherId: string } }) {
  const teacherData = getTeacherData(params.teacherId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Profile</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
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
        <div className="lg:col-span-2">
          <TeacherClasses classes={teacherData.classes} />
        </div>
        <div>
          <TeacherPerformance performanceData={teacherData.performanceData} />
        </div>
      </div>
    </div>
  );
}
