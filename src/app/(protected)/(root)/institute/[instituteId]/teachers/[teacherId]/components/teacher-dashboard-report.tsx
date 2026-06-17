"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Layers,
  ClipboardList,
  BookOpen,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
} from "lucide-react";
import { formatStandardLabel } from "@/helpers/constants/academic";
import {
  BATCH_CHART_COLORS,
  buildBatchColorMapFromPerformance,
  getBatchStyle,
} from "@/helpers/constants/batch-colors";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const overviewCards = (data: any) => [
  {
    label: "Active Batches",
    value: data.activeBatches,
    icon: Layers,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    valueColor: "text-purple-700",
  },
  {
    label: "Total Classes",
    value: data.totalClasses,
    icon: ClipboardList,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-blue-700",
  },
  {
    label: "Lectures Taken",
    value: data.totalLectures,
    icon: BookOpen,
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    valueColor: "text-orange-700",
  },
  {
    label: "Total Students",
    value: data.totalStudents,
    icon: Users,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    valueColor: "text-indigo-700",
  },
];

const BATCH_COLORS = BATCH_CHART_COLORS;

const CLASSES_TAKEN_BG = [
  "bg-amber-50",
  "bg-blue-50",
  "bg-green-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-cyan-50",
];

const CLASSES_TAKEN_TEXT = [
  "text-amber-600",
  "text-blue-600",
  "text-green-600",
  "text-purple-600",
  "text-pink-600",
  "text-cyan-600",
];

const BATCH_DOTS = [
  { border: "border-amber-300", bg: "bg-amber-100" },
  { border: "border-blue-300", bg: "bg-blue-200" },
  { border: "border-green-300", bg: "bg-green-100" },
  { border: "border-purple-300", bg: "bg-purple-200" },
];

const ClassesTakenSection = ({
  totalLectures,
  totalTeachingHours,
  batchPerformance,
}: {
  totalLectures: number;
  totalTeachingHours: number;
  batchPerformance: any[];
}) => {
  const [mode, setMode] = useState<"numbers" | "hours">("numbers");
  const [showAll, setShowAll] = useState(false);

  const displayedBatches = showAll ? batchPerformance : batchPerformance.slice(0, 3);

  const totalHoursForBatch = (batch: any) => {
    const totalPerLecture = totalLectures > 0 ? totalTeachingHours / totalLectures : 0;
    return Math.round((batch.totalLectures || 0) * totalPerLecture * 10) / 10;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 text-base md:text-lg mb-4">Lectures taken</h3>

      <div className="flex border-b border-gray-100 mb-5">
        <button
          onClick={() => setMode("numbers")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            mode === "numbers" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          In numbers
          {mode === "numbers" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setMode("hours")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            mode === "hours" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          In hours
          {mode === "hours" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">
            Total {mode === "numbers" ? "Lectures" : "Hours"}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-purple-600">
            {mode === "numbers" ? totalLectures : totalTeachingHours}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {batchPerformance.slice(0, 4).map((_, i) => (
            <div
              key={i}
              className={`size-6 md:size-7 rounded-md border-2 ${BATCH_DOTS[i % BATCH_DOTS.length].border} ${BATCH_DOTS[i % BATCH_DOTS.length].bg}`}
            />
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
          const value = mode === "numbers" ? batch.totalLectures : totalHoursForBatch(batch);

          return (
            <div key={batch.batchId} className={`${bgClass} rounded-xl p-3 md:p-4 text-center`}>
              <p className="text-xs font-semibold text-gray-600 truncate mb-1" title={batch.batchName}>
                {batch.batchName}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${textClass}`}>{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function TeacherDashboardReport({ dashboard }: { dashboard: any }) {
  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const weekScrollRef = useRef<HTMLDivElement>(null);

  const ov = dashboard.overview;
  const cards = overviewCards(ov);
  const teachingStreak = dashboard.teachingStreak || {
    currentStreak: 0,
    recentDays: [],
  };
  const streakCount = teachingStreak.currentStreak ?? 0;
  const streakMessage =
    streakCount >= 7
      ? "Amazing consistency! Keep it up."
      : streakCount > 0
        ? "Great work! Teach today to keep your streak."
        : "Start teaching today to begin your streak.";

  const monthlyTrend = dashboard.monthlyTrend || [];
  const batchColorMap = buildBatchColorMapFromPerformance(dashboard.batchPerformance || []);
  const calendarLectures = dashboard.lectures || [];

  const getLecturesForDay = (date: Date, lectures: any[] = []) =>
    lectures.filter((lecture: any) =>
      isSameDay(new Date(lecture.lectureDate), date)
    );

  const calendarData = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const current = addDays(start, i);
      const classes = getLecturesForDay(current, calendarLectures);
      return {
        day: format(current, "EEE")[0],
        date: format(current, "d"),
        classes,
        isToday: isSameDay(current, today),
      };
    });
  };

  const weekData = calendarData();
  const monthStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const monthEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthLectures = calendarLectures;
  const visibleMonthDays = monthDays.filter((day) => isSameMonth(day, visibleMonth));

  useEffect(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const todayIndex = Array.from({ length: 7 }, (_, index) =>
      isSameDay(addDays(start, index), today)
    ).findIndex(Boolean);

    const container = weekScrollRef.current;
    if (!container || todayIndex < 0) return;

    const todayCard = container.children[todayIndex] as HTMLElement | undefined;
    todayCard?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
  }, [calendarLectures.length]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3">Overview</h2>

        <div className="mb-2 md:mb-3 rounded-xl md:rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-orange-50 p-3 md:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-xl bg-white/80 p-2 md:p-2.5 shadow-sm shrink-0">
                <Flame className="size-6 md:size-7 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-medium text-fuchsia-600 uppercase tracking-wide">
                  Teaching Streak
                </p>
                <p className="text-xl md:text-3xl font-bold text-fuchsia-700 leading-tight">
                  {streakCount} Day{streakCount === 1 ? "" : "s"}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate">{streakMessage}</p>
              </div>
            </div>

            {teachingStreak.recentDays?.length > 0 && (
              <div className="hidden sm:flex items-end gap-1.5 md:gap-2 shrink-0">
                {teachingStreak.recentDays.map((day: any) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <div
                      className={`size-2.5 md:size-3 rounded-full ${
                        day.taught
                          ? "bg-gradient-to-b from-orange-400 to-fuchsia-500"
                          : "bg-gray-200"
                      } ${day.isToday ? "ring-2 ring-fuchsia-300 ring-offset-1" : ""}`}
                    />
                    <span className="text-[9px] md:text-[10px] font-medium text-gray-400">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {teachingStreak.recentDays?.length > 0 && (
            <div className="mt-3 flex sm:hidden items-center justify-between gap-1">
              {teachingStreak.recentDays.map((day: any) => (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`size-2.5 rounded-full ${
                      day.taught
                        ? "bg-gradient-to-b from-orange-400 to-fuchsia-500"
                        : "bg-gray-200"
                    } ${day.isToday ? "ring-2 ring-fuchsia-300" : ""}`}
                  />
                  <span className="text-[8px] font-medium text-gray-400">{day.label?.[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-xl md:rounded-2xl p-3 md:p-4 flex items-start gap-2 md:gap-3 border border-transparent`}
            >
              <div className={`${card.iconBg} rounded-lg md:rounded-xl p-1.5 md:p-2`}>
                <card.icon className={`size-4 md:size-5 ${card.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">{card.label}</p>
                <p className={`text-lg md:text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClassesTakenSection
        totalLectures={ov.totalLectures}
        totalTeachingHours={ov.totalTeachingHours}
        batchPerformance={dashboard.batchPerformance || []}
      />

      <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">Calendar</h3>
          <button
            type="button"
            onClick={() => setIsMonthCalendarOpen(true)}
            className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
          >
            View All &rsaquo;
          </button>
        </div>
        <div className="w-full max-w-full overflow-hidden rounded-xl border border-gray-100">
          <div
            ref={weekScrollRef}
            className="flex w-full max-w-full overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch]"
          >
            {weekData.map((item, i) => (
              <div
                key={i}
                className={`shrink-0 snap-center w-[31vw] min-w-[96px] max-w-[124px] sm:min-w-[108px] md:w-[14.28%] md:max-w-none md:min-w-[132px] min-h-[140px] md:min-h-[148px] border-r last:border-r-0 border-gray-100 p-2 md:p-3 flex flex-col gap-2 ${
                  item.isToday ? "bg-purple-50/80" : "bg-gray-50/40"
                }`}
              >
                <div className="flex flex-col items-center border-b border-gray-100 pb-2 mb-1">
                  <span className={`font-bold text-[11px] md:text-xs ${item.isToday ? "text-purple-600" : "text-gray-500"}`}>
                    {item.day}
                  </span>
                  <span
                    className={`mt-1 size-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      item.isToday ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-100"
                    }`}
                  >
                    {item.date}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                  {item.classes.slice(0, 2).map((cls: any, ci: number) => {
                    const batchStyle = getBatchStyle(batchColorMap, cls, ci);
                    return (
                      <div
                        key={cls._id || `${item.date}-${ci}`}
                        className={`bg-white border rounded-md px-1.5 py-1 text-[9px] md:text-[10px] font-semibold capitalize ${batchStyle.border}`}
                        style={{ borderLeftWidth: 3, borderLeftColor: batchStyle.accent }}
                      >
                        <p className={`truncate leading-tight ${batchStyle.text}`}>
                          {cls.batch?.name || "Batch"}
                        </p>
                        <p className="text-gray-600 truncate leading-tight">
                          {cls.class?.subject || cls.title || "Lecture"}
                        </p>
                      </div>
                    );
                  })}
                  {item.classes.length > 2 && (
                    <div className="text-[9px] md:text-[10px] font-semibold text-purple-600 text-center">
                      +{item.classes.length - 2} more
                    </div>
                  )}
                  {item.classes.length === 0 && (
                    <div className="flex-1 flex items-center justify-center rounded-md border border-dashed border-gray-200 text-[9px] md:text-[10px] font-medium text-gray-300 text-center px-1">
                      No lectures
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 font-medium md:hidden">
          Swipe sideways to see the full week
        </p>
      </div>

      {isMonthCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-2 sm:p-3 md:p-6 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl md:rounded-3xl shadow-xl w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 p-3 sm:p-4 md:p-5">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base md:text-lg">Lecture Calendar</h3>
                <p className="text-xs text-gray-400 font-medium">{format(visibleMonth, "MMMM yyyy")}</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
                  className="size-8 sm:size-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleMonth(new Date())}
                  className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-purple-50 text-purple-600 text-[11px] sm:text-xs font-bold hover:bg-purple-100 cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
                  className="size-8 sm:size-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="size-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMonthCalendarOpen(false)}
                  className="size-8 sm:size-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Close calendar"
                >
                  <X className="size-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-3 sm:p-4 md:p-5 flex-1">
              <div className="md:hidden space-y-2">
                {visibleMonthDays.map((day) => {
                  const lectures = getLecturesForDay(day, monthLectures);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`rounded-xl border p-3 ${
                        isToday ? "border-purple-200 bg-purple-50/60" : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className={`text-sm font-bold ${isToday ? "text-purple-700" : "text-gray-800"}`}>
                          {format(day, "EEE, d MMM")}
                        </p>
                        {lectures.length > 0 && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">
                            {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>

                      {lectures.length > 0 ? (
                        <div className="space-y-1.5">
                          {lectures.map((lecture: any, lectureIndex: number) => {
                            const batchStyle = getBatchStyle(batchColorMap, lecture, lectureIndex);
                            return (
                              <div
                                key={lecture._id}
                                className={`rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 border ${batchStyle.bg} ${batchStyle.border}`}
                                style={{ borderLeftWidth: 3, borderLeftColor: batchStyle.accent }}
                              >
                                <p className={`capitalize ${batchStyle.text}`}>
                                  {lecture.batch?.name || "Batch"}
                                </p>
                                <p className="capitalize text-gray-600 font-medium">
                                  {lecture.class?.subject || lecture.title || "Lecture"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 font-medium">No lectures</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wide text-gray-400 pb-1">
                    {day}
                  </div>
                ))}

                {monthDays.map((day) => {
                  const lectures = getLecturesForDay(day, monthLectures);
                  const isCurrentMonth = isSameMonth(day, visibleMonth);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[118px] rounded-2xl border p-2 flex flex-col gap-1.5 ${
                        isToday
                          ? "border-purple-300 bg-purple-50/70"
                          : isCurrentMonth
                            ? "border-gray-100 bg-white"
                            : "border-gray-50 bg-gray-50/70 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isToday ? "text-purple-600" : "text-gray-600"}`}>
                          {format(day, "d")}
                        </span>
                        {lectures.length > 0 && (
                          <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-600">
                            {lectures.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        {lectures.slice(0, 3).map((lecture: any, lectureIndex: number) => {
                          const batchStyle = getBatchStyle(batchColorMap, lecture, lectureIndex);
                          return (
                            <div
                              key={lecture._id}
                              className={`rounded-lg px-2 py-1 text-[10px] font-semibold text-gray-700 border ${batchStyle.bg} ${batchStyle.border}`}
                              style={{ borderLeftWidth: 3, borderLeftColor: batchStyle.accent }}
                            >
                              <p className={`truncate capitalize ${batchStyle.text}`}>
                                {lecture.batch?.name || "Batch"}
                              </p>
                              <p className="truncate capitalize text-gray-600">
                                {lecture.class?.subject || lecture.title || "Lecture"}
                              </p>
                            </div>
                          );
                        })}
                        {lectures.length > 3 && (
                          <p className="text-center text-[10px] font-bold text-purple-600">
                            +{lectures.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {monthlyTrend.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Monthly Trends</h3>
          <Chart
            type="line"
            height={240}
            series={[
              { name: "Lectures Taken", type: "column", data: monthlyTrend.map((m: any) => m.lectures) },
              { name: "Teaching Hours", type: "line", data: monthlyTrend.map((m: any) => m.teachingHours || 0) },
            ]}
            options={{
              chart: { toolbar: { show: false }, zoom: { enabled: false } },
              colors: ["#a855f7", "#06b6d4"],
              dataLabels: { enabled: false },
              stroke: { curve: "smooth", width: [0, 3] },
              plotOptions: { bar: { borderRadius: 6, columnWidth: "42%" } },
              fill: { opacity: [0.85, 1] },
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

      {dashboard.batchPerformance?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Batch Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {dashboard.batchPerformance.map((batch: any, i: number) => {
              const color = BATCH_COLORS[i % BATCH_COLORS.length];
              const trimmedName =
                batch.batchName?.length > 40 ? batch.batchName.slice(0, 40) + "..." : batch.batchName;
              const syllabusPct = batch.syllabusCompleted || 0;
              const subjects = batch.subjects?.length ? batch.subjects : ["Subject not set"];
              const bgColor =
                i % BATCH_COLORS.length === 0
                  ? "bg-orange-50/70"
                  : i % BATCH_COLORS.length === 1
                    ? "bg-blue-50/70"
                    : i % BATCH_COLORS.length === 2
                      ? "bg-green-50/70"
                      : i % BATCH_COLORS.length === 3
                        ? "bg-purple-50/70"
                        : "bg-gray-50/70";

              return (
                <div key={batch.batchId} className={`rounded-2xl p-5 space-y-3 ${bgColor}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold capitalize text-base truncate" style={{ color }} title={batch.batchName}>
                        {trimmedName}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium truncate">
                        {subjects.map((subject: string) => subject).join(", ")}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        batch.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      Standard {formatStandardLabel(batch.standard)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-white/70 p-2">
                      <span className="text-gray-500">Classes</span>
                      <p className="font-bold text-gray-800 text-lg">{batch.totalClasses}</p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2">
                      <span className="text-gray-500">Students</span>
                      <p className="font-bold text-gray-800 text-lg">{batch.totalStudents}</p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2">
                      <span className="text-gray-500">Lectures Done</span>
                      <p className="font-bold text-gray-800 text-lg">{batch.totalLectures}</p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2">
                      <span className="text-gray-500">Syllabus</span>
                      <p className="font-bold text-gray-800 text-lg">{syllabusPct}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Recent Activity</h3>
          {dashboard.recentLectures?.length > 0 ? (
            <div className="space-y-1">
              {dashboard.recentLectures.map((lec: any, lecIndex: number) => {
                const chapter = lec.chapters?.[0]?.name;
                const topic = lec.topics?.[0]?.name;
                const subtopic = lec.subtopics?.[0]?.name;
                const batchStyle = getBatchStyle(batchColorMap, lec, lecIndex);

                return (
                  <div key={lec._id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
                    <div className={`${batchStyle.bg} rounded-lg p-2 shrink-0 mt-0.5 border ${batchStyle.border}`}>
                      <BookOpen className="size-4" style={{ color: batchStyle.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-[15px] text-gray-900 truncate capitalize leading-tight">
                            {lec.title || chapter || topic || "Lecture"}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-md shrink-0 capitalize truncate max-w-[200px] mt-0.5 border ${batchStyle.bg} ${batchStyle.text} ${batchStyle.border}`}
                        >
                          {lec.batchName?.length > 40 ? lec.batchName.slice(0, 40) + "..." : lec.batchName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400">
                        <Clock className="size-3" />
                        <span>{lec.duration} min</span>
                        <span className="mx-1">&middot;</span>
                        <span>{dayjs(lec.lectureDate).fromNow()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                        {topic && (
                          <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-600 capitalize">
                            Topic: {topic}
                          </span>
                        )}
                        {subtopic && (
                          <span className="rounded-full bg-purple-50 px-2 py-1 font-medium text-purple-600 capitalize">
                            Subtopic: {subtopic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
    </div>
  );
}
