"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceData {
  category: string;
  score: number;
  maxScore: number;
}

interface MonthlyPerformance {
  month: string;
  studentFeedback: number;
  attendanceRate: number;
  courseCompletion: number;
}

interface TeacherPerformanceProps {
  performanceData: PerformanceData[];
  monthlyPerformance: MonthlyPerformance[];
}

const TeacherPerformance = ({
  performanceData,
  monthlyPerformance,
}: TeacherPerformanceProps) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [activeMetric, setActiveMetric] = useState<string>("All");

  // Modified to add more visual appeal with gradient styles
  const getProgressBarColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "from-green-500 to-green-300";
    if (percentage >= 75) return "from-blue-500 to-blue-300";
    if (percentage >= 60) return "from-yellow-500 to-yellow-300";
    return "from-red-500 to-red-300";
  };

  // Filter chart data based on active metric
  const getChartData = () => {
    if (activeMetric === "All") return monthlyPerformance;

    return monthlyPerformance.map((data) => ({
      month: data.month,
      [activeMetric]:
        data[activeMetric as keyof Omit<MonthlyPerformance, "month">],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Performance Metrics</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType("line")}
            className={`p-2 rounded-md ${
              chartType === "line"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-md ${
              chartType === "bar"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Radial Progress Indicators */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {performanceData.map((item, index) => {
          const percentage = Math.round((item.score / item.maxScore) * 100);
          return (
            <div key={index} className="text-center">
              <div className="relative h-24 w-24 mx-auto">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="2"
                  />
                  <path
                    className={`circle ${
                      percentage >= 90
                        ? "stroke-green-500"
                        : percentage >= 75
                        ? "stroke-blue-500"
                        : percentage >= 60
                        ? "stroke-yellow-500"
                        : "stroke-red-500"
                    }`}
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <text x="18" y="20.35" className="percentage">
                    {percentage}%
                  </text>
                </svg>
              </div>
              <p className="text-sm font-medium mt-2">{item.category}</p>
              <p className="text-xs text-gray-500">
                {item.score}/{item.maxScore}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Metric Selector */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => setActiveMetric("All")}
          className={`px-3 py-1 text-xs rounded-full ${
            activeMetric === "All"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All Metrics
        </button>
        <button
          onClick={() => setActiveMetric("studentFeedback")}
          className={`px-3 py-1 text-xs rounded-full ${
            activeMetric === "studentFeedback"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Student Feedback
        </button>
        <button
          onClick={() => setActiveMetric("attendanceRate")}
          className={`px-3 py-1 text-xs rounded-full ${
            activeMetric === "attendanceRate"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveMetric("courseCompletion")}
          className={`px-3 py-1 text-xs rounded-full ${
            activeMetric === "courseCompletion"
              ? "bg-amber-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Completion
        </button>
      </div>

      {/* Charts */}
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={getChartData()}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(activeMetric === "All" ||
                activeMetric === "studentFeedback") && (
                <Line
                  type="monotone"
                  dataKey="studentFeedback"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                  name="Feedback"
                />
              )}
              {(activeMetric === "All" ||
                activeMetric === "attendanceRate") && (
                <Line
                  type="monotone"
                  dataKey="attendanceRate"
                  stroke="#3b82f6"
                  name="Attendance"
                />
              )}
              {(activeMetric === "All" ||
                activeMetric === "courseCompletion") && (
                <Line
                  type="monotone"
                  dataKey="courseCompletion"
                  stroke="#f59e0b"
                  name="Completion"
                />
              )}
            </LineChart>
          ) : (
            <BarChart
              data={getChartData()}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(activeMetric === "All" ||
                activeMetric === "studentFeedback") && (
                <Bar dataKey="studentFeedback" fill="#10b981" name="Feedback" />
              )}
              {(activeMetric === "All" ||
                activeMetric === "attendanceRate") && (
                <Bar
                  dataKey="attendanceRate"
                  fill="#3b82f6"
                  name="Attendance"
                />
              )}
              {(activeMetric === "All" ||
                activeMetric === "courseCompletion") && (
                <Bar
                  dataKey="courseCompletion"
                  fill="#f59e0b"
                  name="Completion"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .circular-chart {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          max-height: 100%;
          overflow: visible;
        }

        .circle-bg {
          stroke: #f3f4f6;
          fill: none;
        }

        .circle {
          fill: none;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dasharray 0.8s ease;
        }

        .percentage {
          fill: #6b7280;
          font-family: sans-serif;
          font-size: 0.3rem;
          text-anchor: middle;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default TeacherPerformance;
