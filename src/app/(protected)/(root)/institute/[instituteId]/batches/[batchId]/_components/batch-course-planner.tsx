"use client";

import React, { useMemo, useState } from "react";

import { CoursePlannerSheet } from "@/app/(protected)/(root)/institute/[instituteId]/syllabus/course-planner-sheet";
import { SearchSelect } from "@/app/(protected)/(root)/institute/[instituteId]/syllabus/search-select";

export function BatchCoursePlanner({
  batchId,
  batchName,
  standard,
  subjects,
}: {
  batchId: string;
  batchName?: string;
  standard?: string;
  subjects?: string[];
}) {
  const subjectOptions = useMemo(() => {
    const list = (subjects || []).filter(Boolean);
    return list.map((item) => ({ value: item, label: item }));
  }, [subjects]);

  const [subject, setSubject] = useState(subjectOptions[0]?.value || "");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">
          Same course planner the institute admin filled. This view is read-only.
        </p>
        {subjectOptions.length > 1 ? (
          <div className="mt-3 max-w-sm">
            <SearchSelect
              value={subject}
              placeholder="Select subject"
              options={subjectOptions}
              onChange={setSubject}
            />
          </div>
        ) : null}
      </div>

      {!subject ? (
        <div className="rounded-2xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]/40 p-10 text-center text-gray-500">
          This batch has no subjects yet.
        </div>
      ) : (
        <CoursePlannerSheet
          batchId={batchId}
          subject={subject}
          batchName={batchName}
          standard={standard}
          readOnly
        />
      )}
    </div>
  );
}
