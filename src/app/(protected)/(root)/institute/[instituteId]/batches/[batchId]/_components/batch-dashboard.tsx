"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, ChevronRight, Clock, FileText } from "lucide-react";

import {
  getBatchClasses,
  getBatchDetails,
  getBatchStudents,
} from "@/actions/batch_actions";

interface BatchDashboardProps {
  batchId: string;
  instituteId: string;
}

const TABS = [
  { id: "report", label: "Report" },
  { id: "students", label: "Students" },
  { id: "classes", label: "Classes" },
];

export default function BatchDashboard({
  batchId,
  instituteId,
}: BatchDashboardProps) {
  const [activeTab, setActiveTab] = useState("report");

  const { data: batch, isLoading: isBatchLoading } = useQuery({
    queryKey: ["admin-batch-details", batchId],
    queryFn: () => getBatchDetails(batchId),
  });

  const { data: classes, isLoading: isClassesLoading } = useQuery({
    queryKey: ["admin-batch-classes", batchId],
    queryFn: () => getBatchClasses(batchId),
  });

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["admin-batch-students", batchId],
    queryFn: () => getBatchStudents(batchId),
    enabled: activeTab === "students",
  });

  if (isBatchLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-100 rounded-xl w-2/3 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm font-medium">
        Batch not found.
      </div>
    );
  }

  const syllabusProgress = batch.batchReport?.syllabusProgress ?? 0;
  const totalClasses = batch.batchReport?.totalClasses ?? 0;
  const completedClasses = batch.batchReport?.completedClasses ?? 0;
  const classProgress =
    totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;
  const totalMinutes = batch.batchReport?.totalDuration ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const pendingClasses = batch.batchReport?.pendingClasses ?? 0;
  const totalStudents =
    studentsData?.students?.length ?? batch.batchReport?.totalStudents ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Batch header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {batch.name}
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-medium">
          {batch.standard}th Standard
          {batch.subjects?.length ? ` · ${batch.subjects.join(", ")}` : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-purple-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Report Tab */}
      {activeTab === "report" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: progress + metrics */}
            <div className="flex flex-col gap-5">
              {/* Progress bars */}
              <div className="bg-white rounded-2xl p-5 border border-purple-50 space-y-4">
                <h2 className="text-base font-bold text-gray-900">
                  Progress Overview
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px] font-bold text-gray-700">
                    <span>Syllabus Completed</span>
                    <span>{syllabusProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${syllabusProgress}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px] font-bold text-gray-700">
                    <span>Classes Completed</span>
                    <span>{classProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${classProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Total Classes
                  </span>
                  <span className="text-3xl font-bold text-purple-500">
                    {totalClasses}
                  </span>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Total Hours
                  </span>
                  <span className="text-3xl font-bold text-purple-500">
                    {totalHours}
                  </span>
                </div>
                <div className="bg-teal-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Pending Classes
                  </span>
                  <span className="text-3xl font-bold text-teal-600">
                    {pendingClasses}
                  </span>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Students
                  </span>
                  <span className="text-3xl font-bold text-amber-600">
                    {totalStudents}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Syllabus Report */}
            <div className="bg-white rounded-2xl p-5 border border-purple-50 flex flex-col max-h-[380px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-purple-50 p-2 rounded-xl">
                    <FileText className="size-5 text-purple-500" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900">
                    Syllabus Report
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("classes")}
                  className="flex items-center text-purple-500 text-[12px] font-bold hover:underline underline-offset-4"
                >
                  View All <ChevronRight className="size-3.5 ml-0.5" strokeWidth={3} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {isClassesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : classes && classes.length > 0 ? (
                  classes.slice(0, 8).map((cls: any) => (
                    <div
                      key={cls._id}
                      className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {cls.subject}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {cls.topic || "Discussion"}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full shrink-0 ml-2">
                        {dayjs(cls.date).format("DD MMM")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic py-4 text-center">
                    No classes yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div>
          {isStudentsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : studentsData?.students && studentsData.students.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {studentsData.students.map((student: any) => (
                <div
                  key={student._id}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center text-center hover:bg-purple-50/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                    {student.firstname?.charAt(0) ?? "U"}
                    {student.lastname?.charAt(0) ?? ""}
                  </div>
                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {student.firstname} {student.lastname}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Class {student.academic?.standard ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm font-medium">
              No students enrolled in this batch yet.
            </div>
          )}
        </div>
      )}

      {/* Classes Tab */}
      {activeTab === "classes" && (
        <div className="space-y-3">
          {isClassesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            classes.map((cls: any) => (
              <div
                key={cls._id}
                className="bg-white rounded-2xl p-4 flex items-center justify-between group hover:bg-purple-50/40 transition-colors border border-transparent hover:border-purple-100"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-500 transition-colors shrink-0">
                    <Calendar className="text-purple-500 group-hover:text-white size-5 transition-colors" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                      {cls.subject ?? "Subject"} — {cls.topic ?? "Topic"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-400">
                      {cls.date && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          <Calendar className="size-3" />
                          {dayjs(cls.date).format("DD MMM, YYYY")}
                        </span>
                      )}
                      {cls.startTime && cls.endTime && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          <Clock className="size-3" />
                          {cls.startTime} – {cls.endTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-purple-400 transition-colors size-5 shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm font-medium">
              No classes scheduled for this batch yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
