"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Phone, BookOpen } from "lucide-react";

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
  const teacherPhone =
    teacher?.phone?.personal ?? teacher?.phone?.other ?? "";
  const teacherSubjects: string[] = Array.isArray(teacher?.subjects)
    ? teacher.subjects.filter(Boolean)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 md:space-y-6">
      <div>
        <Link href={`/institute/${instituteId}/teachers`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
      </div>

      <div className="mb-2 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{teacherName}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          {teacher?.email ? (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {teacher.email}
            </span>
          ) : null}
          {teacherPhone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" />
              {teacherPhone}
            </span>
          ) : null}
        </div>
        {teacherSubjects.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <BookOpen className="size-3.5 text-gray-400" />
            {teacherSubjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <TeacherDashboardReport dashboard={dashboard} />
    </div>
  );
}
