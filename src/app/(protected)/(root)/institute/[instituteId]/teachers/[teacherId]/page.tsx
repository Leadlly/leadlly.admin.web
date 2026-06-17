"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { getTeacherDashboardById } from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";
import TeacherDashboardReport from "./components/teacher-dashboard-report";

export default function TeacherDetailPage() {
  const params = useParams<{ instituteId: string; teacherId: string }>();
  const { instituteId, teacherId } = params ?? {};

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTeacherDashboardById(teacherId);
        if (cancelled) return;
        if (!res.success) {
          setError(res.message ?? "Failed to load teacher data");
          return;
        }
        setDashboard(res.data);
      } catch {
        if (!cancelled) setError("Failed to load teacher data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-8 text-purple-500" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href={`/institute/${instituteId}/teachers`}>
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="size-4" /> Back to Teachers
          </Button>
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error ?? "No data available"}
        </div>
      </div>
    );
  }

  const teacher = dashboard.teacher;
  const teacherName =
    `${teacher?.firstname ?? ""} ${teacher?.lastname ?? ""}`.trim() || "Teacher";

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 md:space-y-6">
      <div>
        <Link href={`/institute/${instituteId}/teachers`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
      </div>

      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{teacherName}</h1>
        {teacher?.email && <p className="text-gray-500 text-sm">{teacher.email}</p>}
      </div>

      <TeacherDashboardReport dashboard={dashboard} />
    </div>
  );
}
