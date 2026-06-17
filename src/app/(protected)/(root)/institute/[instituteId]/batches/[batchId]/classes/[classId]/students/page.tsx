"use client";

import React, { use, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClassDetails, getBatchStudents } from "@/actions/batch_actions";
import { getBackgroundColor } from "@/helpers/constants/efficiency";
import { neutralEmoji, moodEmojis } from "@/helpers/constants/moodEmojis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatClassLabel } from "@/helpers/constants/academic";
import Progressbar from "@/components/shared/Progressbar";
import { formatDate } from "@/helpers/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const StudentsPage = ({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) => {
  const { instituteId, classId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: () => getClassDetails(classId),
    staleTime: 0,
  });

  const batchId = useMemo(() => {
    if (!classData) return null;
    const batch = classData.batch;
    if (!batch) return null;
    if (typeof batch === "string") return batch;
    if (typeof batch === "object" && batch._id) return String(batch._id);
    return null;
  }, [classData]);

  const {
    data: studentsData,
    isLoading: studentsLoading,
    isFetched: studentsFetched,
  } = useQuery({
    queryKey: ["batch-students", batchId],
    queryFn: () => getBatchStudents(batchId!),
    enabled: !!batchId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const students = useMemo(() => {
    if (!studentsData) return [];
    if (studentsData.students && Array.isArray(studentsData.students))
      return studentsData.students;
    if (Array.isArray(studentsData)) return studentsData;
    return [];
  }, [studentsData]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s: { firstname?: string; lastname?: string }) =>
        s.firstname?.toLowerCase().includes(q) ||
        s.lastname?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const isLoading =
    classLoading ||
    (!classLoading && !!batchId && (studentsLoading || !studentsFetched));

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading students...
      </div>
    );
  }

  if (!batchId) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
        Could not find the batch for this class.
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
        No students are currently allocated to this batch.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search a Student"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        </div>
        <button className="size-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
          <SlidersHorizontal className="size-4 text-gray-600" />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {filteredStudents.map((student: { _id: string }) => (
          <StudentListCard
            key={student._id}
            student={student}
            instituteId={instituteId}
          />
        ))}
        {filteredStudents.length === 0 && searchQuery && (
          <div className="p-6 text-center text-gray-400 text-sm">
            No students found matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};

const StudentListCard = ({
  student,
  instituteId,
}: {
  student: {
    _id: string;
    firstname?: string;
    lastname?: string;
    avatar?: { url?: string };
    academic?: { standard?: number | string };
    details?: {
      report?: { dailyReport?: { date?: string; overall?: number } };
      mood?: Array<{ day: string; emoji?: string }>;
      level?: { number?: number };
    };
  };
  instituteId: string;
}) => {
  const today = new Date().toISOString().split("T")[0];

  const efficiency = useMemo(() => {
    const dailyReport = student.details?.report?.dailyReport;
    if (!dailyReport?.date) return 0;
    const reportDate = formatDate(new Date(dailyReport.date));
    const todayFormatted = formatDate(new Date(Date.now()));
    return reportDate === todayFormatted ? dailyReport.overall || 0 : 0;
  }, [student.details?.report?.dailyReport]);

  const cardBg = useMemo(() => getBackgroundColor(efficiency), [efficiency]);

  const studentMoods = student.details?.mood;
  const currentDateMoodIndex = studentMoods?.findIndex(
    (mood) => mood.day === today
  );
  const moodEmoji =
    currentDateMoodIndex !== undefined &&
    currentDateMoodIndex >= 0 &&
    studentMoods?.[currentDateMoodIndex]?.emoji
      ? studentMoods[currentDateMoodIndex].emoji
      : null;
  const moodOption = moodEmoji
    ? moodEmojis[moodEmoji as keyof typeof moodEmojis]
    : neutralEmoji;

  const levelNumber = student.details?.level?.number || 0;
  const levelProgress = Math.min(levelNumber * 10, 100);

  return (
    <Link href={`/institute/${instituteId}/students/${student._id}`}>
      <div
        className={`${cardBg} rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all hover:shadow-md cursor-pointer`}
      >
        <Avatar className="size-12 md:size-14 shrink-0">
          <AvatarImage
            src={student.avatar?.url}
            alt={`${student.firstname}'s avatar`}
          />
          <AvatarFallback className="bg-white/60 text-gray-700 font-bold text-lg">
            {student.firstname?.charAt(0) || "U"}
            {student.lastname?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-0.5">
          <h3 className="font-bold text-sm md:text-base text-gray-900 truncate">
            {student.firstname} {student.lastname}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {formatClassLabel(String(student.academic?.standard ?? ""))}
          </p>
          <div className="flex items-center gap-2">
            <Image
              src={moodOption.moodImg}
              alt="mood"
              width={18}
              height={18}
              className="size-4 md:size-[18px]"
            />
            <span className="text-xs font-semibold text-gray-700">Level :</span>
            <Progressbar
              value={levelProgress}
              indicatorClassName="h-[5px] md:h-[6px]"
              progressClassName="h-[5px] md:h-[6px] w-20 md:w-24"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentsPage;
