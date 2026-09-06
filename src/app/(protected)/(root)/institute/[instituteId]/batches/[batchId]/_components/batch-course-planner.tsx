"use client";

import React, { useEffect, useMemo, useState } from "react";

import { CoursePlannerSheet } from "@/app/(protected)/(root)/institute/[instituteId]/syllabus/course-planner-sheet";
import { SearchSelect } from "@/app/(protected)/(root)/institute/[instituteId]/syllabus/search-select";
import { SUBJECT_OPTIONS } from "@/helpers/constants/academic";

export function BatchCoursePlanner({
  batchId,
  batchName,
  standard,
  subjects,
  classSubjects,
}: {
  batchId: string;
  batchName?: string;
  standard?: string;
  subjects?: string[];
  classSubjects?: string[];
}) {
  const subjectOptions = useMemo(() => {
    const fromBatch = (subjects || []).filter(Boolean);
    const fromClasses = (classSubjects || []).filter(Boolean);
    const merged = [...new Set([...fromBatch, ...fromClasses])];
    const list = merged.length ? merged : [...SUBJECT_OPTIONS];
    return list.map((item) => ({ value: item, label: item }));
  }, [subjects, classSubjects]);

  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (!subject && subjectOptions[0]) {
      setSubject(subjectOptions[0].value);
      return;
    }
    if (subject && !subjectOptions.some((option) => option.value === subject)) {
      setSubject(subjectOptions[0]?.value || "");
    }
  }, [subject, subjectOptions]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <SearchSelect
          value={subject}
          placeholder="Select subject"
          options={subjectOptions}
          onChange={setSubject}
        />
      </div>

      {!subject ? (
        <div className="rounded-2xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]/40 p-10 text-center text-gray-500">
          Choose a subject to open the course planner.
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
