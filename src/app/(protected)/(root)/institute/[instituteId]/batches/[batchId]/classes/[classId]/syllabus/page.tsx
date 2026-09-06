"use client";

import React, { use } from "react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getClassDetails } from "@/actions/batch_actions";
import { CoursePlannerSheet } from "@/app/(protected)/(root)/institute/[instituteId]/syllabus/course-planner-sheet";

export default function AdminClassChapterPlanPage({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) {
  const { instituteId, batchId, classId } = use(params);
  const { data: classDoc, isLoading } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Loading course planner...</div>;
  }

  const subject = classDoc?.subject;
  const batchName = classDoc?.batch?.name;
  const standard = classDoc?.batch?.standard || classDoc?.standard;

  if (!subject) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E9D5FF] p-10 text-center text-gray-500">
        This class does not have a subject yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A855F7]">
            {subject}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Course planner</h1>
        </div>
        <Link
          href={`/institute/${instituteId}/syllabus?batchId=${batchId}&subject=${encodeURIComponent(subject)}`}
          className="text-sm font-semibold text-[#A855F7]"
        >
          Open full planner
        </Link>
      </div>
      <CoursePlannerSheet
        batchId={batchId}
        subject={subject}
        batchName={batchName}
        standard={standard}
        readOnly
      />
    </div>
  );
}
