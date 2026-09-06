"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { getInstituteBatch } from "@/actions/batch_actions";
import { listChapterPlans } from "@/actions/chapter_plan_actions";
import { SUBJECT_OPTIONS } from "@/helpers/constants/academic";
import { ChapterPace } from "@/helpers/types/chapter-plan";

const paceTone: Record<ChapterPace, string> = {
  "on-track": "text-emerald-600",
  behind: "text-red-600",
  ahead: "text-sky-600",
};

export default function ChapterPlansPage() {
  const params = useParams();
  const instituteId = params.instituteId as string;
  const [batchId, setBatchId] = useState("");
  const [subject, setSubject] = useState("");

  const { data: batchesRes } = useQuery({
    queryKey: ["institute-batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["chapter-plans", instituteId, batchId, subject],
    queryFn: () =>
      listChapterPlans({
        instituteId,
        batchId: batchId || undefined,
        subject: subject || undefined,
      }),
  });

  const batches = Array.isArray(batchesRes?.data) ? batchesRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chapter plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define the expected sequence for each batch and subject, then compare it with actual lecture logs.
          </p>
        </div>
        <Link
          href={`/institute/${instituteId}/syllabus/new`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#A855F7] px-4 text-sm font-semibold text-white hover:bg-[#9333EA]"
        >
          <Plus className="size-4" />
          New plan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="">All batches</option>
          {batches.map((batch: { _id: string; name?: string }) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="">All subjects</option>
          {SUBJECT_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.rows || []).map((row) => (
            <Link
              key={row.planId}
              href={`/institute/${instituteId}/syllabus/${row.planId}`}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-[#E9D5FF] hover:shadow-md transition-all"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#A855F7]">
                {row.batch.name}
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{row.subject}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {row.chapterCount} chapters · {row.completionPercent}% chapters started
              </p>
              <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#A855F7]"
                  style={{ width: `${row.lectureCompletionPercent}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                <span className={paceTone["on-track"]}>{row.statusCounts["on-track"]} on track</span>
                <span className={paceTone.behind}>{row.statusCounts.behind} behind</span>
                <span className={paceTone.ahead}>{row.statusCounts.ahead} ahead</span>
                <span className={row.sequenceFollowed ? "text-emerald-600" : "text-amber-600"}>
                  {row.sequenceFollowed ? "Sequence followed" : "Sequence drifted"}
                </span>
              </div>
            </Link>
          ))}
          {!data?.rows?.length && (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-[#E9D5FF] p-10 text-center text-gray-500">
              No chapter plans yet. Create one for a batch and subject.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
