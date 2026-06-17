"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, ChevronLeft, Clock, FileText } from "lucide-react";
import { getClassDetails } from "@/actions/batch_actions";

const SyllabusReportPage = ({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) => {
  const { instituteId, batchId, classId } = use(params);
  const searchParams = useSearchParams();
  const base = `/institute/${instituteId}/batches/${batchId}/classes/${classId}`;
  const query = searchParams.toString();

  const { data: classData, isLoading } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading syllabus report...</div>;
  }

  if (!classData) {
    return <div className="p-8 text-center text-gray-500">Class details not found.</div>;
  }

  const syllabusReport = classData.syllabusReport || [];
  const totalLectures = syllabusReport.reduce(
    (sum: number, day: any) => sum + (day.lectures?.length || 0),
    0
  );
  const reportHref = `${base}/report${query ? `?${query}` : ""}`;

  return (
    <div className="w-full pb-10 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Link
            href={reportHref}
            className="inline-flex items-center gap-1.5 mb-3 text-sm font-bold text-purple-600 hover:text-purple-700"
          >
            <ChevronLeft className="size-4" />
            Back to Report
          </Link>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Syllabus Report</h2>
          <p className="text-sm text-gray-500 font-medium">
            Date-wise work added by teachers for this class.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="rounded-2xl bg-purple-50 px-4 py-3">
            <p className="text-[11px] uppercase font-bold text-gray-500">Days</p>
            <p className="text-xl font-bold text-purple-600">{syllabusReport.length}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-4 py-3">
            <p className="text-[11px] uppercase font-bold text-gray-500">Lectures</p>
            <p className="text-xl font-bold text-blue-600">{totalLectures}</p>
          </div>
        </div>
      </div>

      {syllabusReport.length > 0 ? (
        <div className="space-y-4">
          {syllabusReport.map((day: any) => (
            <div key={day.date} className="bg-white border border-[#F2E0FF] rounded-2xl md:rounded-[24px] p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAF5FF] p-2 rounded-xl">
                    <FileText className="size-5 text-[#A855F7]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{dayjs(day.date).format("DD MMM, YYYY")}</h3>
                    <p className="text-xs font-medium text-gray-400">
                      {day.lectures?.length || 0} lecture{day.lectures?.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(day.lectures || []).map((lecture: any) => (
                  <div key={lecture._id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-gray-900 capitalize">{lecture.title || "Lecture"}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-gray-400">
                        <Clock className="size-3.5" />
                        <span>{lecture.duration || 0} min</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <ReportRow
                        label="Chapters"
                        value={(lecture.chapters || []).map((item: any) => item.name).join(", ") || "No chapter"}
                      />
                      <ReportRow
                        label="Topics"
                        value={(lecture.topics || []).map((item: any) => item.name).join(", ") || "No topic"}
                      />
                      {(lecture.subtopics || []).length > 0 && (
                        <ReportRow
                          label="Subtopics"
                          value={lecture.subtopics.map((item: any) => item.name).join(", ")}
                          highlight
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-8">
          <BookOpen className="size-10 text-gray-300 mb-3" />
          <p className="font-bold text-gray-500">No syllabus work added yet</p>
          <p className="text-sm text-gray-400 mt-1">Saved teacher work will appear here date-wise.</p>
        </div>
      )}
    </div>
  );
};

const ReportRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">{label}</p>
    <p className={`font-semibold capitalize ${highlight ? "text-purple-600" : "text-gray-700"}`}>{value}</p>
  </div>
);

export default SyllabusReportPage;
