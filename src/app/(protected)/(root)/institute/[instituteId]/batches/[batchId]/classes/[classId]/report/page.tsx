"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getClassDetails } from "@/actions/batch_actions";
import { getDPPs, getNotes } from "@/actions/classwork_actions";
import { getClassQuizzes } from "@/actions/quiz_actions";
import { ChevronRight, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const Page = ({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) => {
  const { instituteId, batchId, classId } = use(params);
  const searchParams = useSearchParams();
  const base = `/institute/${instituteId}/batches/${batchId}/classes/${classId}`;

  const { data: classData, isLoading } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ["class-report-notes", classId],
    queryFn: () => getNotes({ classId }),
    enabled: !!classId,
  });

  const { data: dppsData, isLoading: dppsLoading } = useQuery({
    queryKey: ["class-report-dpps", classId],
    queryFn: () => getDPPs({ classId }),
    enabled: !!classId,
  });

  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ["class-report-quizzes", classId],
    queryFn: () => getClassQuizzes({ classId }),
    enabled: !!classId,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading class report...</div>;
  }

  if (!classData) {
    return <div className="p-8 text-center text-gray-500">Class details not found.</div>;
  }

  const report = classData.classReport || {};
  const syllabusProgress = report.syllabusCompleted || 0;
  const completedChapters = report.completedChapters || 0;
  const totalChapters = report.totalChapters || 0;
  const syllabusProgressValue = Math.max(0, Math.min(100, syllabusProgress));

  const totalLectures = report.totalLectures || 0;
  const totalMinutes = report.totalDuration || 0;
  const totalHours = Math.floor(totalMinutes / 60);

  const syllabusReport = classData.syllabusReport || [];
  const notes = notesData?.notes || [];
  const dpps = dppsData?.dpps || dppsData?.assignments || [];
  const quizzes = quizzesData?.quizzes || [];
  const materialLoading = notesLoading || dppsLoading || quizzesLoading;
  const query = searchParams.toString();
  const syllabusReportHref = `${base}/report/syllabus${query ? `?${query}` : ""}`;
  const getMaterialHref = (type: string) =>
    `${base}/report/material/${type}${query ? `?${query}` : ""}`;

  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-4 md:space-y-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="space-y-2 md:space-y-3">
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
              <h2 className="text-base md:text-[18px] font-bold text-gray-900 tracking-tight">Material Given</h2>
              <div className="bg-white border border-[#F2E0FF] rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6 shadow-sm space-y-4">
                {materialLoading ? (
                  <div className="text-sm text-gray-400 font-medium animate-pulse">Loading material...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MaterialSummaryCard
                      title="Written Notes"
                      count={notes.length}
                      href={getMaterialHref("notes")}
                      colorClass="text-[#A855F7]"
                      bgClass="bg-[#FAF5FF]"
                    />
                    <MaterialSummaryCard
                      title="DPP"
                      count={dpps.length}
                      href={getMaterialHref("dpps")}
                      colorClass="text-blue-600"
                      bgClass="bg-blue-50"
                    />
                    <MaterialSummaryCard
                      title="Quizzes"
                      count={quizzes.length}
                      href={getMaterialHref("quizzes")}
                      colorClass="text-amber-600"
                      bgClass="bg-amber-50"
                    />
                  </div>
                )}
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
                <Link
                  href={syllabusReportHref}
                  className="flex items-center text-[#A855F7] text-[13px] font-bold hover:underline underline-offset-4"
                >
                  View All <ChevronRight className="size-4 ml-0.5" strokeWidth={3} />
                </Link>
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
                            <p className="font-bold text-gray-800 text-sm capitalize">{lecture.title || "Lecture"}</p>
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
                  <div className="text-gray-400 text-[13px] italic font-medium px-2 py-4">No syllabus work added yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialSummaryCard = ({
  title,
  count,
  href,
  colorClass,
  bgClass,
}: {
  title: string;
  count: number;
  href: string;
  colorClass: string;
  bgClass: string;
}) => (
  <div className={`${bgClass} rounded-2xl p-4 space-y-3`}>
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{count}</p>
    </div>
    <Link
      href={href}
      className={`inline-flex items-center text-xs font-bold ${colorClass} hover:underline underline-offset-4`}
    >
      View more <ChevronRight className="size-3.5 ml-0.5" strokeWidth={3} />
    </Link>
  </div>
);

export default Page;
