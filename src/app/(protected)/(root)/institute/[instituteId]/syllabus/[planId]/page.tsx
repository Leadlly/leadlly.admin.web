"use client";

import React, { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getChapterPlan } from "@/actions/chapter_plan_actions";

export default function ChapterPlanDetailRedirect() {
  const params = useParams();
  const router = useRouter();
  const instituteId = params.instituteId as string;
  const planId = params.planId as string;

  const { data } = useQuery({
    queryKey: ["chapter-plan", planId],
    queryFn: () => getChapterPlan(planId),
  });

  useEffect(() => {
    if (!data?.plan) return;
    const batch =
      typeof data.plan.batch === "object" ? data.plan.batch._id : data.plan.batch;
    const subject = data.plan.subject;
    if (!batch || !subject) {
      router.replace(`/institute/${instituteId}/syllabus`);
      return;
    }
    router.replace(
      `/institute/${instituteId}/syllabus?batchId=${batch}&subject=${encodeURIComponent(subject)}`
    );
  }, [data, instituteId, router]);

  return <div className="py-10 text-center text-gray-500">Opening course planner...</div>;
}
