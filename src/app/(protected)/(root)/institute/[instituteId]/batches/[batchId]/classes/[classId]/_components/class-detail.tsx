"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BookOpen, Calendar, Clock, Clock3, Presentation } from "lucide-react";

import { getClassDetails } from "@/actions/batch_actions";

export default function ClassDetail({ classId }: { classId: string }) {
  const { data: cls, isLoading } = useQuery({
    queryKey: ["admin-class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm font-medium">
        Class not found.
      </div>
    );
  }

  const report = cls.classReport ?? {};
  const stats = [
    { label: "Total Lectures", value: report.totalLectures ?? 0, icon: Presentation, color: "bg-purple-50 text-purple-500" },
    { label: "Total Duration", value: `${report.totalDuration ?? 0} min`, icon: Clock3, color: "bg-teal-50 text-teal-600" },
    { label: "Syllabus", value: `${report.syllabusCompleted ?? 0}%`, icon: BookOpen, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {cls.subject}
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            {cls.topic ?? "General Discussion"}
          </p>
          {cls.name && (
            <p className="text-gray-500 text-sm mt-0.5">{cls.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-500 font-medium shrink-0">
          {cls.date && (
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4 text-purple-400" />
              {dayjs(cls.date).format("dddd, DD MMMM YYYY")}
            </span>
          )}
          {cls.startTime && cls.endTime && (
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-purple-400" />
              {cls.startTime} – {cls.endTime}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3"
          >
            <div className={`p-3 rounded-xl ${stat.color.split(" ")[0]}`}>
              <stat.icon className={`h-6 w-6 ${stat.color.split(" ")[1]}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent topics */}
      {cls.recentTopics && cls.recentTopics.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Lectures</h2>
          <div className="space-y-3">
            {cls.recentTopics.map((topic: { id: string; name: string; date: string; duration: number }) => (
              <div
                key={topic.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{topic.name}</p>
                  {topic.date && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {dayjs(topic.date).format("DD MMM, YYYY")}
                    </p>
                  )}
                </div>
                {topic.duration > 0 && (
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full shrink-0 ml-3">
                    {topic.duration} min
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {cls.description && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed text-sm">{cls.description}</p>
        </div>
      )}
    </div>
  );
}
