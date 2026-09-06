"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getInstituteBatch } from "@/actions/batch_actions";
import { SUBJECT_OPTIONS } from "@/helpers/constants/academic";

import { CoursePlannerSheet } from "./course-planner-sheet";
import { SearchSelect } from "./search-select";

type BatchOption = {
  _id: string;
  name?: string;
  subjects?: string[];
  standard?: string;
};

export default function CoursePlannerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const instituteId = params.instituteId as string;

  const [batchId, setBatchId] = useState(searchParams.get("batchId") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");

  const { data: batchesRes } = useQuery({
    queryKey: ["institute-batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });
  const batches: BatchOption[] = Array.isArray(batchesRes?.data) ? batchesRes.data : [];
  const selectedBatch = batches.find((batch) => batch._id === batchId);

  const subjectOptions = useMemo(() => {
    const fromBatch = (selectedBatch?.subjects || []).filter(Boolean);
    const list = fromBatch.length ? fromBatch : [...SUBJECT_OPTIONS];
    return list.map((item) => ({ value: item, label: item }));
  }, [selectedBatch]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (batchId) next.set("batchId", batchId);
    if (subject) next.set("subject", subject);
    const query = next.toString();
    router.replace(
      `/institute/${instituteId}/syllabus${query ? `?${query}` : ""}`,
      { scroll: false }
    );
  }, [batchId, subject, instituteId, router]);

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Course planner</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a batch and subject. The chapter list comes from the syllabus database.
          Fill lecture counts and topic start dates like the Excel planner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SearchSelect
          value={batchId}
          placeholder="Select batch"
          options={batches.map((batch) => ({
            value: batch._id,
            label: batch.name || "Untitled batch",
          }))}
          onChange={(value) => {
            setBatchId(value);
            setSubject("");
          }}
        />
        <SearchSelect
          value={subject}
          placeholder="Select subject"
          disabled={!batchId}
          options={subjectOptions}
          onChange={setSubject}
        />
      </div>

      {!batchId || !subject ? (
        <div className="rounded-2xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]/40 p-10 text-center text-gray-500">
          Choose a batch and subject to open the course planner sheet.
        </div>
      ) : (
        <CoursePlannerSheet
          batchId={batchId}
          subject={subject}
          batchName={selectedBatch?.name}
          standard={selectedBatch?.standard}
        />
      )}
    </div>
  );
}
