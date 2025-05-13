"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  StudentsOverview,
  TeachersOverview,
  InstituteOverview,
} from "../../institute/_components";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addStudentsToInstitute } from "@/actions/student_action";
import { addTeacherToInstitute } from "@/actions/mentor_actions";
import { toast } from "sonner";

export default function Dashboard({ params }: { params: { instituteId: string } }) {
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [isAddTeachersOpen, setIsAddTeachersOpen] = useState(false);
  const [studentEmails, setStudentEmails] = useState("");
  const [teacherEmails, setTeacherEmails] = useState("");

  // Get institute data from Redux store
  const instituteData = useAppSelector((state) => state.institute.institute);

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

  const handleAddStudents = async () => {
    try {
      const emails = studentEmails.split('\n').map(email => email.trim()).filter(email => email);
      const result = await addStudentsToInstitute(params.instituteId, emails);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      setStudentEmails("");
      setIsAddStudentsOpen(false);
    } catch (error) {
      console.error("Error adding students:", error);
      toast.error("Failed to add students. Please try again.");
    }
  };

  const handleAddTeachers = async () => {
    try {
      const emails = teacherEmails.split('\n').map(email => email.trim()).filter(email => email);
      const result = await addTeacherToInstitute(params.instituteId, emails);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      setTeacherEmails("");
      setIsAddTeachersOpen(false);
    } catch (error) {
      console.error("Error adding teachers:", error);
      toast.error("Failed to add teachers. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-6 py-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Institution Overview & Management
        </h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/institute/${params?.instituteId}/batches`}>
            <Button className="bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
              <span className="text-xl">View Batches</span>
            </Button>
          </Link>
          <Button className="bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="text-xl py-10">Edit Profile</span>
          </Button>
        </div>
      </div>

      <InstituteOverview
        name={instituteData?.name || "Institute Name"}
        instituteCode={instituteData?.instituteCode || "N/A"}
        contact={instituteData?.contact || "N/A"}
        email={instituteData?.email || "N/A"}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Students</h2>
            <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                  Add Students
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Students</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-emails">
                      Enter student email addresses (one per line)
                    </Label>
                    <Textarea
                      id="student-emails"
                      placeholder="student1@example.com&#10;student2@example.com"
                      rows={6}
                      value={studentEmails}
                      onChange={(e) => setStudentEmails(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleAddStudents}
                  >
                    Add Students
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <StudentsOverview
            totalStudents={dashboardData.students.totalStudents}
            activeCourses={dashboardData.students.activeCourses}
            averageAttendance={dashboardData.students.averageAttendance}
            performanceIndex={dashboardData.students.performanceIndex}
            params={params}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Teachers</h2>
            <Dialog open={isAddTeachersOpen} onOpenChange={setIsAddTeachersOpen}>
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
            </Dialog>
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
