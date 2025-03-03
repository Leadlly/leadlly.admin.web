import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Book, CheckCircle, BarChart } from "lucide-react";

interface StudentsOverviewProps {
  totalStudents: number;
  activeCourses: number;
  averageAttendance: string;
  performanceIndex: string;
}

const StudentsOverview: React.FC<StudentsOverviewProps> = ({
  totalStudents,
  activeCourses,
  averageAttendance,
  performanceIndex,
}) => {
  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: <Users size={18} color="#13B924" />,
    },
    {
      label: "Active Courses",
      value: activeCourses,
      icon: <Book size={18} color="#13B924" />,
    },
    {
      label: "Average Attendance",
      value: averageAttendance,
      icon: <CheckCircle size={18} color="#13B924" />,
    },
    {
      label: "Performance Index",
      value: performanceIndex,
      icon: <BarChart size={18} color="#13B924" />,
    },
  ];

  return (
    <Card className="p-4 px-6 bg-white border-[#0DA21B8C]">
      <h2 className="text-xl font-semibold">Students Overview</h2>
      <div className="grid grid-cols-2 mt-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col mt-2">
            <p>{stat.label}</p>
            <p className="flex gap-3 items-center">
              {stat.icon}
              <span className="text-xl font-bold">{stat.value ?? "N/A"}</span>
            </p>
          </div>
        ))}
      </div>
      <Button
        asChild
        className="mt-6 w-full text-green-500 bg-[#0DA21B24] hover:bg-[#0da21b40] font-bold transition"
      >
        <Link href="/batches">📚 View Students</Link>
      </Button>
    </Card>
  );
};

export default StudentsOverview;
