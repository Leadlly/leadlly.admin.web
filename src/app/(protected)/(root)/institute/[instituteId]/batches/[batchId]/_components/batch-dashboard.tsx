"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, ChevronRight, Clock, FileText, Plus } from "lucide-react";

import {
  getBatchClasses,
  getBatchDetails,
  getBatchStudents,
} from "@/actions/batch_actions";
import {
  formatCompetitiveExamLabel,
  formatStandardBadgeLabel,
} from "@/helpers/constants/academic";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();

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
  const completedChapters = batch.batchReport?.completedChapters ?? 0;
  const totalChapters = batch.batchReport?.totalChapters ?? 0;
  const syllabusProgressValue = Math.max(0, Math.min(100, syllabusProgress));
  const totalLectures = batch.batchReport?.totalLectures ?? 0;
  const totalClasses = batch.batchReport?.totalClasses ?? 0;
  const totalMinutes = batch.batchReport?.totalDuration ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalStudents =
    studentsData?.students?.length ?? batch.batchReport?.totalStudents ?? 0;
  const syllabusReport = batch.syllabusReport || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Batch header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {batch.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-sm text-gray-400 font-medium">
            {formatStandardBadgeLabel(batch.standard)}
          </span>
          {batch.competitiveExam ? (
            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700">
              {formatCompetitiveExamLabel(batch.competitiveExam)}
            </span>
          ) : null}
          {batch.subjects?.length ? (
            <span className="text-sm text-gray-400 font-medium">
              · {batch.subjects.join(", ")}
            </span>
          ) : null}
        </div>
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
        <div className="flex flex-col space-y-4 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <div className="bg-white border border-[#F2E0FF] rounded-[28px] md:rounded-[32px] p-6 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-8">
                  Syllabus Completed
                </h2>

                <div className="flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-5xl md:text-6xl font-extrabold text-[#A855F7] tracking-tight">
                      {completedChapters}/{totalChapters}
                    </p>
                    <p className="text-base md:text-lg text-gray-500 font-medium mt-4 leading-snug">
                      Chapters<br />completed so far
                    </p>
                  </div>

                  <div
                    className="size-32 md:size-40 rounded-full p-3 md:p-4 shrink-0"
                    style={{
                      background: `conic-gradient(#A855F7 ${syllabusProgressValue * 3.6}deg, #F3E8FF 0deg)`,
                    }}
                    aria-label={`${syllabusProgressValue}% syllabus completed`}
                  >
                    <div className="size-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        {syllabusProgressValue}%
                      </span>
                      <span className="text-sm md:text-base text-gray-500 font-medium mt-1">
                        overall
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <h2 className="text-base md:text-[18px] font-bold text-gray-900 tracking-tight">Lectures taken</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5">
                  <div className="bg-[#FAF5FF] rounded-2xl md:rounded-[20px] p-3 md:p-5 flex flex-col items-center justify-center gap-1 md:gap-1.5 lg:gap-2 transition-transform hover:scale-[1.02]">
                    <div className="text-gray-600 font-bold text-[11px] md:text-[13px]">Total Lectures</div>
                    <div className="text-[#A855F7] text-2xl md:text-3xl lg:text-4xl font-bold">{totalLectures}</div>
                  </div>

                  <div className="bg-[#FAF5FF] rounded-2xl md:rounded-[20px] p-3 md:p-5 flex flex-col items-center justify-center gap-1 md:gap-1.5 lg:gap-2 transition-transform hover:scale-[1.02]">
                    <div className="text-gray-600 font-bold text-[11px] md:text-[13px]">Total Time</div>
                    <div className="text-[#A855F7] text-2xl md:text-3xl lg:text-4xl font-bold flex items-baseline gap-1">
                      {totalHours} <span className="text-base md:text-lg lg:text-xl font-bold">hr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <h2 className="text-base md:text-[18px] font-bold text-gray-900 tracking-tight">Batch Overview</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-[#F0FDFA] rounded-2xl md:rounded-[20px] p-3 md:p-5 flex flex-col items-center justify-center gap-1">
                    <div className="text-gray-600 font-bold text-[11px] md:text-[13px]">Total Classes</div>
                    <div className="text-[#0D9488] text-2xl md:text-3xl font-bold">{totalClasses}</div>
                  </div>
                  <div className="bg-[#FFFBEB] rounded-2xl md:rounded-[20px] p-3 md:p-5 flex flex-col items-center justify-center gap-1">
                    <div className="text-gray-600 font-bold text-[11px] md:text-[13px]">Students</div>
                    <div className="text-[#D97706] text-2xl md:text-3xl font-bold">{totalStudents}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              <h2 className="text-[18px] font-bold text-transparent select-none hidden lg:block">Spacer</h2>
              <div className="bg-white border border-[#F2E0FF] rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6 h-full shadow-sm max-h-[430px] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#FAF5FF] p-2 rounded-xl">
                      <FileText className="size-5 text-[#A855F7]" />
                    </div>
                    <h3 className="text-[16px] font-bold text-gray-900">Syllabus Report</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("classes")}
                    className="flex items-center text-[#A855F7] text-[13px] font-bold hover:underline underline-offset-4"
                  >
                    View Classes <ChevronRight className="size-4 ml-0.5" strokeWidth={3} />
                  </button>
                </div>

                <div className="mt-2 space-y-4 flex-1 overflow-y-auto pr-2">
                  {syllabusReport.length > 0 ? (
                    syllabusReport.map((day: any) => (
                      <div key={day.date} className="space-y-2 border-b border-gray-50 pb-4 last:border-b-0">
                        <div className="font-bold text-gray-900 text-[13px]">
                          {dayjs(day.date).format("DD MMM, YYYY")}
                        </div>
                        <div className="space-y-2">
                          {day.lectures.map((lecture: any) => (
                            <div key={lecture._id} className="rounded-xl bg-gray-50 p-3">
                              <p className="font-bold text-gray-800 text-sm capitalize">
                                {lecture.subject || lecture.title || "Lecture"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 capitalize">
                                Chapters: {(lecture.chapters || []).map((item: any) => item.name).join(", ") || "No chapter"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 capitalize">
                                Topics: {(lecture.topics || []).map((item: any) => item.name).join(", ") || "No topic"}
                              </p>
                              {(lecture.subtopics || []).length > 0 && (
                                <p className="text-xs text-purple-600 mt-1 capitalize">
                                  Subtopics: {lecture.subtopics.map((item: any) => item.name).join(", ")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-[13px] italic font-medium px-2 py-4">
                      No syllabus work added yet
                    </div>
                  )}
                </div>
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
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              {classes ? `${classes.length} class${classes.length !== 1 ? "es" : ""}` : ""}
            </p>
          </div>

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
                className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3 group hover:bg-purple-50/40 transition-colors border border-transparent hover:border-purple-100"
              >
                <Link
                  href={`/institute/${instituteId}/batches/${batchId}/classes/${cls._id}`}
                  className="flex items-center gap-4 min-w-0 flex-1"
                >
                  <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-500 transition-colors shrink-0">
                    <Calendar className="text-purple-500 group-hover:text-white size-5 transition-colors" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                      {cls.subject ?? "Subject"}
                      {cls.topic ? ` — ${cls.topic}` : ""}
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
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white h-9 text-xs font-bold px-3 gap-1.5 cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    onClick={() =>
                      router.push(
                        `/institute/${instituteId}/batches/${batchId}/classes/${cls._id}/add-work`
                      )
                    }
                  >
                    <Plus className="size-4" />
                    Add Work
                  </Button>
                  <ChevronRight className="text-gray-300 group-hover:text-purple-400 transition-colors size-5" />
                </div>
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
