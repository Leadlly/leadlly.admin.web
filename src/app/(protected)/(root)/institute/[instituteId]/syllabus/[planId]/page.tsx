"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import { getChapterPlan, updateChapterPlan } from "@/actions/chapter_plan_actions";
import { Button } from "@/components/ui/button";
import { ChapterPace } from "@/helpers/types/chapter-plan";

import { PlanEditor } from "../plan-editor";

const statusStyles: Record<ChapterPace, string> = {
  "on-track": "bg-emerald-50 text-emerald-700",
  behind: "bg-red-50 text-red-700",
  ahead: "bg-sky-50 text-sky-700",
};

export default function ChapterPlanDetailPage() {
  const params = useParams();
  const instituteId = params.instituteId as string;
  const planId = params.planId as string;
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["chapter-plan", planId],
    queryFn: () => getChapterPlan(planId),
  });

  if (isLoading) return <div className="py-10 text-gray-500">Loading plan...</div>;
  if (!data?.plan || !data.comparison) {
    return <div className="py-10 text-gray-500">Plan not found.</div>;
  }

  const { plan, comparison } = data;
  const batch = typeof plan.batch === "object" ? plan.batch : null;

  return (
    <div className="space-y-6">
      <Link href={`/institute/${instituteId}/syllabus`} className="text-sm text-gray-500 hover:text-gray-800">
        Back to chapter plans
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A855F7]">
            {batch?.name}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{plan.subject}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Planned vs actual from existing lecture logs. Teachers cannot edit this plan.
          </p>
        </div>
        <Button variant="outline" onClick={() => setEditing((value) => !value)}>
          {editing ? "Close editor" : "Edit plan"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Chapters started" value={`${comparison.completionPercent}%`} />
        <SummaryCard label="Lectures vs plan" value={`${comparison.lectureCompletionPercent}%`} />
        <SummaryCard
          label="Sequence"
          value={comparison.sequenceFollowed ? "Followed" : "Drifted"}
        />
        <SummaryCard
          label="Behind"
          value={String(comparison.statusCounts.behind)}
          tone={comparison.statusCounts.behind > 0 ? "behind" : "ok"}
        />
      </div>

      {editing && (
        <div className="rounded-2xl border border-[#F2E0FF] bg-[#FAF5FF]/40 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Update sequence</h2>
          <PlanEditor
            batchId={batch?._id || ""}
            subject={plan.subject}
            initialChapters={plan.chapters.map((chapter) => ({
              chapterId: chapter.chapterId,
              sequenceOrder: chapter.sequenceOrder,
              plannedLectureCount: chapter.plannedLectureCount,
              expectedStartDate: chapter.expectedStartDate,
            }))}
            submitLabel="Save changes"
            onSubmit={async (chapters) => {
              const res = await updateChapterPlan(planId, chapters);
              if (!res.success) {
                toast.error(res.message || "Could not update the plan");
                return;
              }
              toast.success("Chapter plan updated");
              setEditing(false);
              queryClient.invalidateQueries({ queryKey: ["chapter-plan", planId] });
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-4">#</th>
              <th className="p-4">Chapter</th>
              <th className="p-4">Lectures</th>
              <th className="p-4">Start date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {comparison.chapters.map((chapter, index) => {
              const planned = chapter.plannedLectureCount ?? 0;
              const actual = chapter.actualLectureCount ?? 0;
              return (
              <tr key={chapter.chapterId || index} className="border-b last:border-0">
                <td className="p-4 font-semibold text-[#A855F7]">{chapter.sequenceOrder || index + 1}</td>
                <td className="p-4 font-medium text-gray-900">
                  {chapter.chapterName || "Untitled chapter"}
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">{actual}</span>
                      <span className="text-gray-400"> / {planned}</span>
                    </p>
                    <div className="h-1.5 w-28 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#A855F7]"
                        style={{
                          width: `${Math.min(100, (actual / Math.max(planned, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-gray-900">
                    {chapter.actualStartDate
                      ? dayjs(chapter.actualStartDate).format("DD MMM YYYY")
                      : "Not started"}
                  </p>
                  <p className="text-xs text-gray-400">
                    planned {dayjs(chapter.expectedStartDate).format("DD MMM YYYY")}
                  </p>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[chapter.status]}`}>
                    {chapter.status}
                  </span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "behind" | "ok";
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone === "behind" ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
