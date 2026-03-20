"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Layers,
  ClipboardList,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  Users,
  Palette,
  ArrowLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getTeacherDashboardById } from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime);

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
const BATCH_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#a855f7", "#ef4444", "#06b6d4"];
const SUBJECT_COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

const CLASSES_TAKEN_BG = [
  "bg-amber-50", "bg-blue-50", "bg-green-50", "bg-purple-50", "bg-pink-50", "bg-cyan-50",
];
const CLASSES_TAKEN_TEXT = [
  "text-amber-600", "text-blue-600", "text-green-600", "text-purple-600", "text-pink-600", "text-cyan-600",
];
const BATCH_DOTS = [
  { border: "border-amber-300", bg: "bg-amber-100" },
  { border: "border-blue-300", bg: "bg-blue-200" },
  { border: "border-green-300", bg: "bg-green-100" },
  { border: "border-purple-300", bg: "bg-purple-200" },
];

const overviewCards = (data: any) => [
  { label: "Active Batches", value: data.activeBatches, sub: `${data.totalBatches} total`, icon: Layers, bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", valueColor: "text-purple-700" },
  { label: "Total Classes", value: data.totalClasses, sub: `${data.completionRate}% completed`, icon: ClipboardList, bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700" },
  { label: "Completed", value: data.completedClasses, sub: `${data.scheduledClasses} this week`, icon: CheckCircle2, bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700" },
  { label: "Cancelled", value: data.cancelledClasses, sub: "", icon: XCircle, bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-500", valueColor: "text-red-600" },
  { label: "Lectures Given", value: data.totalLectures, sub: `0 this week`, icon: BookOpen, bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600", valueColor: "text-orange-700" },
  { label: "Teaching Hours", value: data.totalTeachingHours, sub: `0h this week`, icon: Clock, bg: "bg-teal-50", iconBg: "bg-teal-100", iconColor: "text-teal-600", valueColor: "text-teal-700" },
  { label: "Total Students", value: data.totalStudents, sub: "", icon: Users, bg: "bg-indigo-50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", valueColor: "text-indigo-700" },
  { label: "Subjects", value: data.uniqueSubjects?.length || 0, sub: data.uniqueSubjects?.join(", ") || "", icon: Palette, bg: "bg-pink-50", iconBg: "bg-pink-100", iconColor: "text-pink-600", valueColor: "text-pink-700" },
];

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
    return () => { cancelled = true; };
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-8 text-blue-500" />
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

  const ov = dashboard.overview;
  const cards = overviewCards(ov);
  const teacher = dashboard.teacher;
  const teacherName = `${teacher?.firstname ?? ""} ${teacher?.lastname ?? ""}`.trim() || "Teacher";

  const monthlyTrend = dashboard.monthlyTrend || [];
  const subjectDist = dashboard.subjectDistribution || [];
  const attendanceData = dashboard.overallAttendance || { percentage: 0, present: 0, absent: 0, total: 0 };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 md:space-y-6">
      <div>
        <Link href={`/institute/${instituteId}/teachers`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{teacherName}</h1>
        {teacher?.email && <p className="text-gray-500 text-sm">{teacher.email}</p>}
      </div>

      {/* Overview Cards */}
      <div>
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {cards.map((card, i) => (
            <div key={i} className={`${card.bg} rounded-xl md:rounded-2xl p-3 md:p-4 flex items-start gap-2 md:gap-3 border border-transparent`}>
              <div className={`${card.iconBg} rounded-lg md:rounded-xl p-1.5 md:p-2`}>
                <card.icon className={`size-4 md:size-5 ${card.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">{card.label}</p>
                <p className={`text-lg md:text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
                {card.sub && <p className="text-[9px] md:text-[11px] text-gray-400 font-medium truncate">{card.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes Taken */}
      <ClassesTakenSection
        totalClasses={ov.totalClasses}
        totalTeachingHours={ov.totalTeachingHours}
        batchPerformance={dashboard.batchPerformance || []}
      />

      {/* Monthly Trend */}
      {monthlyTrend.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Monthly Trend</h3>
          <Chart
            type="area"
            height={200}
            series={[
              { name: "Completed", data: monthlyTrend.map((m: any) => m.completed) },
              { name: "Cancelled", data: monthlyTrend.map((m: any) => m.cancelled) },
              { name: "Lectures", data: monthlyTrend.map((m: any) => m.lectures) },
            ]}
            options={{
              chart: { toolbar: { show: false }, zoom: { enabled: false } },
              colors: ["#a855f7", "#ef4444", "#06b6d4"],
              dataLabels: { enabled: false },
              stroke: { curve: "smooth", width: 2.5 },
              fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] } },
              xaxis: {
                categories: monthlyTrend.map((m: any) => m.month),
                labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: { labels: { style: { fontSize: "11px", colors: "#9ca3af" } } },
              grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
              legend: {
                position: "top",
                horizontalAlign: "right",
                fontSize: "12px",
                fontWeight: 500,
                markers: { size: 6, shape: "circle" as const },
                labels: { colors: "#6b7280" },
              },
              tooltip: { theme: "light" },
            }}
          />
        </div>
      )}

      {/* Batch Performance */}
      {dashboard.batchPerformance?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Batch Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {dashboard.batchPerformance.map((batch: any, i: number) => {
              const color = BATCH_COLORS[i % BATCH_COLORS.length];
              const trimmedName = batch.batchName?.length > 40 ? batch.batchName.slice(0, 40) + "..." : batch.batchName;
              const completionPct = batch.totalClasses > 0 ? Math.round((batch.completedClasses / batch.totalClasses) * 100) : 0;
              const bgColor = i % BATCH_COLORS.length === 0 ? "bg-orange-50/70" : i % BATCH_COLORS.length === 1 ? "bg-blue-50/70" : i % BATCH_COLORS.length === 2 ? "bg-green-50/70" : i % BATCH_COLORS.length === 3 ? "bg-purple-50/70" : "bg-gray-50/70";
              return (
                <div key={batch.batchId?.toString()} className={`rounded-2xl p-5 space-y-3 ${bgColor}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold capitalize text-base truncate" style={{ color }} title={batch.batchName}>{trimmedName}</h4>
                      <p className="text-xs text-gray-400 font-medium">Standard {batch.standard}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${batch.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {batch.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Classes</span><span className="font-bold text-gray-800">{batch.totalClasses}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="font-bold text-green-600">{batch.completedClasses}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Lectures</span><span className="font-bold text-gray-800">{batch.totalLectures}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Students</span><span className="font-bold text-gray-800">{batch.totalStudents}</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Completion</span>
                      <span className="font-bold">{completionPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(completionPct, 2)}%`, backgroundColor: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Distribution + Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Subject Distribution</h3>
          {subjectDist.length > 0 ? (
            <div className="flex gap-6">
              <div className="shrink-0">
                <Chart
                  type="bar"
                  width={160}
                  height={subjectDist.length * 40 + 40}
                  series={[
                    { name: "Classes", data: subjectDist.map((s: any) => s.classes) },
                    { name: "Lectures", data: subjectDist.map((s: any) => s.lectures) },
                  ]}
                  options={{
                    chart: { toolbar: { show: false }, stacked: false },
                    plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 2 } },
                    colors: ["#a855f7", "#3b82f6"],
                    xaxis: {
                      categories: subjectDist.map((s: any) => {
                        const name = s.subject || "";
                        return name.charAt(0).toUpperCase() + name.slice(1);
                      }),
                      labels: { style: { fontSize: "8px", colors: "#9ca3af" } },
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: { labels: { style: { fontSize: "9px", colors: "#6b7280", fontWeight: 500 } } },
                    dataLabels: { enabled: false },
                    legend: { show: false },
                    grid: { show: false },
                    tooltip: { theme: "light" },
                  }}
                />
              </div>
              <div className="flex-1 space-y-3 pt-1">
                {subjectDist.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: SUBJECT_COLORS[i % SUBJECT_COLORS.length] }} />
                    <span className="text-sm font-bold text-gray-800 capitalize flex-1 truncate">{s.subject}</span>
                    <span className="text-[11px] text-gray-400 font-medium shrink-0 whitespace-nowrap">
                      {s.classes} cls / {s.lectures} lec  {s.totalHours ?? 0}h
                    </span>
                  </div>
                ))}
                <div className="flex gap-4 pt-2 text-[10px] text-gray-400 border-t border-gray-50">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500" />Classes</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500" />Lectures</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No subject data</div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Attendance Overview</h3>
          <div className="flex items-center gap-8">
            <div className="relative shrink-0">
              <Chart
                type="radialBar"
                width={150}
                height={150}
                series={[attendanceData.percentage]}
                options={{
                  plotOptions: {
                    radialBar: {
                      startAngle: -135,
                      endAngle: 135,
                      hollow: { size: "58%" },
                      track: { background: "#f3f4f6", strokeWidth: "100%" },
                      dataLabels: {
                        name: { show: false },
                        value: {
                          fontSize: "22px",
                          fontWeight: "800",
                          color: "#1f2937",
                          offsetY: 8,
                          formatter: (val: number) => `${val}%`,
                        },
                      },
                    },
                  },
                  colors: ["#f59e0b"],
                  stroke: { lineCap: "round" },
                }}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">Present</span>
                </div>
                <span className="font-bold text-gray-800 text-base">{attendanceData.present}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-gray-600">Absent</span>
                </div>
                <span className="font-bold text-gray-800 text-base">{attendanceData.absent}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2.5">
                  <Users className="size-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Total Records</span>
                </div>
                <span className="font-bold text-gray-800 text-base">{attendanceData.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Recent Activity</h3>
        {dashboard.recentLectures?.length > 0 ? (
          <div className="space-y-1">
            {dashboard.recentLectures.map((lec: any) => (
              <div key={lec._id?.toString()} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
                <div className="bg-purple-50 rounded-lg p-2 shrink-0 mt-0.5">
                  <BookOpen className="size-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[15px] text-gray-900 truncate capitalize leading-tight">
                        {lec.title || lec.chapters?.[0]?.name || lec.topics?.[0]?.name || "Lecture"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{lec.subject || ""}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 bg-purple-50 text-purple-600 rounded-md shrink-0 capitalize truncate max-w-[200px] mt-0.5">
                      {lec.batchName?.length > 40 ? lec.batchName.slice(0, 40) + "..." : lec.batchName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400">
                    <Clock className="size-3" />
                    <span>{lec.duration} min</span>
                    <span className="mx-1">&middot;</span>
                    <span>{dayjs(lec.lectureDate).fromNow()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
            ))}
            <p className="text-center text-xs text-gray-300 font-medium">No recent lectures</p>
          </div>
        )}
      </div>
    </div>
  );
}

const ClassesTakenSection = ({
  totalClasses,
  totalTeachingHours,
  batchPerformance,
}: {
  totalClasses: number;
  totalTeachingHours: number;
  batchPerformance: any[];
}) => {
  const [mode, setMode] = useState<"numbers" | "hours">("numbers");
  const [showAll, setShowAll] = useState(false);

  const displayedBatches = showAll ? batchPerformance : batchPerformance.slice(0, 3);

  const totalHoursForBatch = (batch: any) => {
    const totalPerClass = totalClasses > 0 ? totalTeachingHours / totalClasses : 0;
    return Math.round(batch.totalClasses * totalPerClass * 10) / 10;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4">Classes taken</h3>

      <div className="flex border-b border-gray-100 mb-5">
        <button
          onClick={() => setMode("numbers")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-colors relative cursor-pointer ${mode === "numbers" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          In numbers
          {mode === "numbers" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-500 rounded-full" />}
        </button>
        <button
          onClick={() => setMode("hours")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-colors relative cursor-pointer ${mode === "hours" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          In hours
          {mode === "hours" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-500 rounded-full" />}
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">Total {mode === "numbers" ? "Classes" : "Hours"}</p>
          <p className="text-3xl md:text-4xl font-bold text-purple-600">
            {mode === "numbers" ? totalClasses : totalTeachingHours}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {batchPerformance.slice(0, 4).map((_, i) => (
            <div key={i} className={`size-6 md:size-7 rounded-md border-2 ${BATCH_DOTS[i % BATCH_DOTS.length].border} ${BATCH_DOTS[i % BATCH_DOTS.length].bg}`} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-800">Batch wise</p>
        {batchPerformance.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 cursor-pointer"
          >
            {showAll ? "Show less" : "Show all"}
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3">
        {displayedBatches.map((batch: any, i: number) => {
          const bgClass = CLASSES_TAKEN_BG[i % CLASSES_TAKEN_BG.length];
          const textClass = CLASSES_TAKEN_TEXT[i % CLASSES_TAKEN_TEXT.length];
          const value = mode === "numbers" ? batch.totalClasses : totalHoursForBatch(batch);

          return (
            <div key={batch.batchId?.toString()} className={`${bgClass} rounded-xl p-3 md:p-4 text-center`}>
              <p className="text-xs font-semibold text-gray-600 truncate mb-1" title={batch.batchName}>{batch.batchName}</p>
              <p className={`text-xl md:text-2xl font-bold ${textClass}`}>{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
