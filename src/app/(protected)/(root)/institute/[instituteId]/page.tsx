import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Link from "next/link";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getActiveInstitute } from "@/actions/institute_actions";
import { addTeacherToInstitute } from "@/actions/mentor_actions";
import { addStudentsToInstitute } from "@/actions/student_action";
import { Button } from "@/components/ui/button";

import AddStudentsDialog from "./_components/add-students-dialog";
import InstituteOverview from "./_components/InstituteOverview";
import StudentsOverview from "./_components/StudentsOverview";
import TeachersOverview from "./_components/TeachersOverview";

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

  // const [isAddTeachersOpen, setIsAddTeachersOpen] = useState(false);
  // const [studentEmails, setStudentEmails] = useState("");
  // const [teacherEmails, setTeacherEmails] = useState("");

  // // Get institute data from Redux store
  // const instituteData = useAppSelector((state) => state.institute.institute);

  // Mock data for students and teachers (would come from API in real app)
  const dashboardData = {
    students: {
      totalStudents: 1250,
      activeCourses: 42,
      averageAttendance: 92,
      performanceIndex: 8.7,
    },
    teachers: {
      totalTeachers: 68,
      departments: 12,
      activeClasses: 86,
      satisfactionRate: 9.2,
    },
  };

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
            totalStudents={dashboardData.students.totalStudents}
            activeCourses={dashboardData.students.activeCourses}
            averageAttendance={dashboardData.students.averageAttendance}
            performanceIndex={dashboardData.students.performanceIndex}
            instituteId={instituteId}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Teachers</h2>
          </div>
          <TeachersOverview
            totalTeachers={dashboardData.teachers.totalTeachers}
            departments={dashboardData.teachers.departments}
            activeClasses={dashboardData.teachers.activeClasses}
            satisfactionRate={dashboardData.teachers.satisfactionRate}
            instituteId={instituteId}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
