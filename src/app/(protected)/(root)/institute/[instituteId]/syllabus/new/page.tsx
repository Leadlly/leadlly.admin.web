"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getInstituteBatch } from "@/actions/batch_actions";
import { createChapterPlan } from "@/actions/chapter_plan_actions";
import { SUBJECT_OPTIONS } from "@/helpers/constants/academic";

import { PlanEditor } from "../plan-editor";

export default function NewChapterPlanPage() {
  const params = useParams();
  const router = useRouter();
  const instituteId = params.instituteId as string;
  const [batchId, setBatchId] = useState("");
  const [subject, setSubject] = useState("");

  const { data: batchesRes } = useQuery({
    queryKey: ["institute-batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });
  const batches = Array.isArray(batchesRes?.data) ? batchesRes.data : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href={`/institute/${instituteId}/syllabus`} className="text-sm text-gray-500 hover:text-gray-800">
        Back to chapter plans
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New chapter plan</h1>
        <p className="mt-1 text-sm text-gray-500">
          One save creates the locked sequence teachers will see. Only admins can edit it later.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="">Select batch</option>
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
          <option value="">Select subject</option>
          {SUBJECT_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <PlanEditor
        batchId={batchId}
        subject={subject}
        submitLabel="Save plan"
        onSubmit={async (chapters) => {
          const res = await createChapterPlan({ batchId, subject, chapters });
          if (!res.success) {
            toast.error(res.message || "Could not create the plan");
            return;
          }
          toast.success("Chapter plan created");
          router.push(`/institute/${instituteId}/syllabus/${res.plan._id}`);
        }}
      />
    </div>
  );
}
