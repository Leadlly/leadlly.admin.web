import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Link from "next/link";

import { QueryClient, useQuery } from "@tanstack/react-query";
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

  // const handleAddTeachers = async () => {
  //   try {
  //     const emails = teacherEmails
  //       .split("\n")
  //       .map((email) => email.trim())
  //       .filter((email) => email);
  //     const result = await addTeacherToInstitute(params.instituteId, emails);

  //     if (result.success) {
  //       toast.success(result.message);
  //     } else {
  //       toast.error(result.message);
  //     }

  //     setTeacherEmails("");
  //     setIsAddTeachersOpen(false);
  //   } catch (error) {
  //     console.error("Error adding teachers:", error);
  //     toast.error("Failed to add teachers. Please try again.");
  //   }
  // };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-6 py-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Institution Overview & Management
        </h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/institute/${instituteId}/batches`}>
            <Button>
              <span>View Batches</span>
            </Button>
          </Link>
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span>Edit</span>
          </Button>
        </div>
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
            <AddStudentsDialog instituteId={instituteId} />
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
            {/* <Dialog
              open={isAddTeachersOpen}
              onOpenChange={setIsAddTeachersOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                  Add Teachers
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Teachers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-emails">
                      Enter teacher email addresses (one per line)
                    </Label>
                    <Textarea
                      id="teacher-emails"
                      placeholder="teacher1@example.com&#10;teacher2@example.com"
                      rows={6}
                      value={teacherEmails}
                      onChange={(e) => setTeacherEmails(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddTeachers}
                  >
                    Add Teachers
                  </Button>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>
          <TeachersOverview
            totalTeachers={dashboardData.teachers.totalTeachers}
            departments={dashboardData.teachers.departments}
            activeClasses={dashboardData.teachers.activeClasses}
            satisfactionRate={dashboardData.teachers.satisfactionRate}
          />
        </div>
      </div>
    </div>
  );
}
