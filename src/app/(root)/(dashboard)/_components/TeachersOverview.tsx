import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookMarked, Presentation, Smile, Users } from "lucide-react";

interface TeachersOverviewProps {
  totalTeachers: number;
  departments: number;
  activeClasses: number;
  satisfactionRate: string;
}

const TeachersOverview: React.FC<TeachersOverviewProps> = (props) => {
  const { totalTeachers, departments, activeClasses, satisfactionRate } = props;

  const teacherStats = [
    {
      label: "Total Teachers",
      value: totalTeachers,
      icon: <Users size={18} />,
    },
    {
      label: "Departments",
      value: departments,
      icon: <BookMarked size={18} />,
    },
    {
      label: "Active Classes",
      value: activeClasses,
      icon: <Presentation size={18} />,
    },
    {
      label: "Satisfaction Rate",
      value: satisfactionRate,
      icon: <Smile size={18} />,
    },
  ];

  return (
    <Card className="p-4 px-6 bg-white border-[#2E77D58C]">
      <h2 className="text-xl font-semibold">Teachers Overview</h2>
      <div className="grid grid-cols-2 mt-2 gap-4">
        {teacherStats.map((stat, index) => (
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
        className="w-full mt-6 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold transition-colors"
      >
        <Link href="/teachers">🎓 View Teachers</Link>
      </Button>
    </Card>
  );
};

export default TeachersOverview;
