"use client";

import React, { use } from "react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { getChapterPlanByClass } from "@/actions/chapter_plan_actions";
import { ChapterPace } from "@/helpers/types/chapter-plan";

const statusStyles: Record<ChapterPace, string> = {
  "on-track": "bg-emerald-50 text-emerald-700",
  behind: "bg-red-50 text-red-700",
  ahead: "bg-sky-50 text-sky-700",
};

export default function AdminClassChapterPlanPage({
  params,
}: {
  params: Promise<{ instituteId: string; classId: string }>;
}) {
  const { instituteId, classId } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["chapter-plan-class", classId],
    queryFn: () => getChapterPlanByClass(classId),
  });

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Loading chapter plan...</div>;
  }

  if (!data?.plan) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E9D5FF] p-10 text-center">
        <p className="font-semibold text-gray-800">No chapter plan for this subject</p>
        <p className="mt-2 text-sm text-gray-500">
          Create one from Chapter plans. Teachers will see it as read-only.
        </p>
        <Link
          href={`/institute/${instituteId}/syllabus/new`}
          className="mt-4 inline-block text-sm font-semibold text-[#A855F7]"
        >
          Create a plan
        </Link>
      </div>
    );
  }

  const comparison = data.comparison;
  const planId = data.plan._id;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A855F7]">
            {data.class?.subject || data.plan.subject}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Plan vs actual</h1>
        </div>
        <Link
          href={`/institute/${instituteId}/syllabus/${planId}`}
          className="text-sm font-semibold text-[#A855F7]"
        >
          Open full comparison
        </Link>
      </div>
      {comparison ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-4">Chapter</th>
                <th className="p-4">Lectures</th>
                <th className="p-4">Start date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {comparison.chapters.map((chapter: {
                chapterId: string;
                chapterName: string;
                plannedLectureCount: number;
                actualLectureCount: number;
                expectedStartDate: string;
                actualStartDate: string | null;
                status: ChapterPace;
              }) => (
                <tr key={chapter.chapterId} className="border-b last:border-0">
                  <td className="p-4 font-medium">{chapter.chapterName}</td>
                  <td className="p-4">
                    {chapter.actualLectureCount} / {chapter.plannedLectureCount}
                  </td>
                  <td className="p-4">
                    {chapter.actualStartDate
                      ? dayjs(chapter.actualStartDate).format("DD MMM YYYY")
                      : "Not started"}
                    <span className="block text-xs text-gray-400">
                      planned {dayjs(chapter.expectedStartDate).format("DD MMM YYYY")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[chapter.status]}`}>
                      {chapter.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Comparison is available on the institute chapter plan page.</p>
      )}
    </div>
  );
}
