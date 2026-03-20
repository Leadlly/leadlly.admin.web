import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getActiveInstitute } from "@/actions/institute_actions";
import { getInstituteBatch } from "@/actions/batch_actions";
import { getInstituteStudents } from "@/actions/student_action";
import { getInstituteTeachers } from "@/actions/teacher_actions";
import InstituteOverview from "./_components/InstituteOverview";
import StudentsOverview from "./_components/StudentsOverview";
import TeachersOverview from "./_components/TeachersOverview";

type DashboardStudent = {
  academic?: { competitiveExam?: string | null } | null;
  details?: { level?: { number?: number | null } | null } | null;
};

type DashboardTeacher = {
  academic?: {
    degree?: string | null;
    schoolOrCollegeName?: string | null;
  } | null;
};

export default async function Dashboard({
  params,
}: {
  params: Promise<{ instituteId: string }>;
}) {
  const { instituteId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["active_institute", instituteId],
    queryFn: () => getActiveInstitute({ instituteId }),
  });

  const [studentsRes, teachersRes, batchesRes] = await Promise.all([
    getInstituteStudents(instituteId),
    getInstituteTeachers(instituteId),
    getInstituteBatch(instituteId).catch(() => ({ success: false, data: [] })),
  ]);

  const students: DashboardStudent[] = studentsRes.success
    ? ((studentsRes.students ?? []) as DashboardStudent[])
    : [];
  const teachers: DashboardTeacher[] = teachersRes.success
    ? ((teachersRes.teachers ?? []) as DashboardTeacher[])
    : [];
  const batches = Array.isArray((batchesRes as { data?: unknown[] })?.data)
    ? ((batchesRes as { data: unknown[] }).data ?? [])
    : [];

  const activeCourses = new Set(
    students
      .map((s) => s?.academic?.competitiveExam)
      .filter(Boolean),
  ).size;
  const avgLevel =
    students.length > 0
      ? students.reduce((sum, s) => {
          return sum + Number(s?.details?.level?.number ?? 0);
        }, 0) / students.length
      : 0;
  const departments = new Set(
    teachers
      .map((t) => {
        return t?.academic?.degree ?? t?.academic?.schoolOrCollegeName;
      })
      .filter(Boolean),
  ).size;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Institution Overview & Management
        </h1>
      </div>

      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <InstituteOverview instituteId={instituteId} />
        </Suspense>
      </ErrorBoundary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Students</h2>
          </div>
          <StudentsOverview
            totalStudents={students.length}
            activeCourses={activeCourses}
            averageAttendance={0}
            performanceIndex={Number(avgLevel.toFixed(1))}
            instituteId={instituteId}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Teachers</h2>
          </div>
          <TeachersOverview
            totalTeachers={teachers.length}
            departments={departments}
            activeClasses={batches.length}
            satisfactionRate={0}
            instituteId={instituteId}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
