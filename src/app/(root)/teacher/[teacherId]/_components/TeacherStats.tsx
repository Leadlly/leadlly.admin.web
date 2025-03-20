import React from "react";

interface TeacherStatsProps {
  activeClasses: number;
  totalStudents: number;
  averageAttendance: number;
  satisfactionRate: number;
}

const TeacherStats = ({
  activeClasses,
  totalStudents,
  averageAttendance,
  satisfactionRate,
}: TeacherStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Active Classes"
        value={activeClasses}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-500"
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
        }
        color="indigo"
        trend={+5}
      />

      <StatCard
        title="Total Students"
        value={totalStudents}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500"
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
        }
        color="green"
        trend={+12}
      />

      <StatCard
        title="Average Attendance"
        value={`${averageAttendance}%`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        }
        color="yellow"
        trend={+2}
      />

      <StatCard
        title="Satisfaction Rate"
        value={`${satisfactionRate}/10`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        }
        color="rose"
        trend={+0.3}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "indigo" | "green" | "yellow" | "rose";
  trend?: number;
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      text: "text-indigo-800",
      trend: "text-indigo-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
      trend: "text-green-600",
    },
    yellow: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      text: "text-amber-800",
      trend: "text-amber-600",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-600",
      text: "text-rose-800",
      trend: "text-rose-600",
    },
  };

  return (
    <div
      className={`${colorClasses[color].bg} p-6 rounded-xl shadow-sm border ${colorClasses[color].border} relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>{icon}</div>
      </div>
      <p className={`text-3xl font-bold ${colorClasses[color].text}`}>
        {value}
      </p>

      {trend && (
        <div className="flex items-center mt-2">
          {trend > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
          <span
            className={`text-sm ml-1 ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}% from last month
          </span>
        </div>
      )}

      {/* Background decorative element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10 rounded-full bg-black"></div>
    </div>
  );
};

export default TeacherStats;
