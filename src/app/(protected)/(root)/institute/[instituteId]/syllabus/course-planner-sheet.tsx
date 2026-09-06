"use client";

import React, { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import {
  getChapterPlanSheet,
  saveChapterPlanSheet,
} from "@/actions/chapter_plan_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChapterPlanSheetRow,
  ChapterSheetStatus,
} from "@/helpers/types/chapter-plan";

const STATUS_OPTIONS: Array<{ value: ChapterSheetStatus; label: string }> = [
  { value: "not_started", label: "Not started" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
];

const statusStyles: Record<ChapterSheetStatus, string> = {
  not_started: "text-gray-500",
  running: "text-amber-700",
  completed: "text-emerald-700",
};

function asChapterStatus(value: unknown): ChapterSheetStatus {
  const raw = String(value || "").toLowerCase();
  if (raw === "completed" || raw === "done" || raw === "finished") return "completed";
  if (raw === "running") return "running";
  return "not_started";
}

export function CoursePlannerSheet({
  batchId,
  subject,
  batchName,
  standard,
}: {
  batchId: string;
  subject: string;
  batchName?: string;
  standard?: string;
}) {
  const queryClient = useQueryClient();
  const [weeklyLoad, setWeeklyLoad] = useState("5");
  const [session, setSession] = useState("2026-2027");
  const [completionDate, setCompletionDate] = useState("");
  const [rows, setRows] = useState<ChapterPlanSheetRow[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: sheet, isFetching } = useQuery({
    queryKey: ["chapter-plan-sheet", batchId, subject],
    queryFn: () => getChapterPlanSheet(batchId, subject),
    enabled: Boolean(batchId && subject),
  });

  useEffect(() => {
    if (!sheet?.success) return;
    setWeeklyLoad(String(sheet.weeklyLectureLoad ?? 5));
    setSession(sheet.academicSession || "2026-2027");
    setCompletionDate(
      sheet.courseCompletionDate
        ? dayjs(sheet.courseCompletionDate).format("YYYY-MM-DD")
        : ""
    );
    setRows(
      (sheet.rows || []).map((row) => ({
        ...row,
        chapterStatus: asChapterStatus(row.chapterStatus || row.sheetStatus),
      }))
    );
  }, [sheet]);

  const totalLectures = rows.reduce(
    (sum, row) => sum + (Number(row.plannedLectureCount) || 0),
    0
  );

  const updateRow = (chapterId: string, patch: Partial<ChapterPlanSheetRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.chapterId === chapterId ? { ...row, ...patch } : row))
    );
  };

  const handleSave = async () => {
    if (!rows.length) {
      toast.error("No chapters found for this batch and subject");
      return;
    }
    setSaving(true);
    const res = await saveChapterPlanSheet({
      batchId,
      subject,
      weeklyLectureLoad: Number(weeklyLoad) || 0,
      academicSession: session,
      courseCompletionDate: completionDate || null,
      chapters: rows.map((row, index) => ({
        chapterId: row.chapterId,
        sequenceOrder: index + 1,
        plannedLectureCount: Number(row.plannedLectureCount) || 0,
        expectedStartDate: row.expectedStartDate
          ? String(row.expectedStartDate).slice(0, 10)
          : null,
        chapterStatus: row.chapterStatus || "not_started",
      })),
    });
    setSaving(false);
    if (!res.success) {
      toast.error(res.message || "Could not save the course planner");
      return;
    }
    toast.success("Course planner saved");
    queryClient.invalidateQueries({ queryKey: ["chapter-plan-sheet", batchId, subject] });
  };

  if (isFetching && !rows.length) {
    return <div className="py-10 text-center text-gray-400">Loading chapters...</div>;
  }

  if (sheet && !sheet.success) {
    return (
      <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-10 text-center text-red-600">
        {sheet.message || "Could not load the course planner"}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]/40 p-10 text-center text-gray-500">
        No chapters found in the database for {subject}
        {standard ? ` · ${standard}` : ""}.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E9D5FF] bg-white shadow-sm">
      <div className="bg-[#FAF5FF] px-5 py-5 text-center border-b border-[#E9D5FF]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A855F7]">
          Course planner
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Academic session</span>
          <Input
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="h-8 w-[140px] text-center"
          />
        </div>
        <h2 className="mt-3 text-lg md:text-xl font-bold text-gray-900">
          {subject.toUpperCase()}
          {standard ? ` · ${standard}` : ""}
          {batchName ? ` · ${batchName}` : ""}
          {weeklyLoad ? ` · (${weeklyLoad} L/W)` : ""}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 py-4 border-b">
        <div>
          <label className="text-xs font-medium text-gray-500">No. of lectures / week</label>
          <Input
            type="number"
            min="0"
            value={weeklyLoad}
            onChange={(e) => setWeeklyLoad(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">
            Syllabus end / course completion date
          </label>
          <Input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500">
              <th className="p-3 w-16">Sl no</th>
              <th className="p-3">Topic name / sequence</th>
              <th className="p-3 w-36">No of lectures</th>
              <th className="p-3 w-44">Topic start date</th>
              <th className="p-3 w-44">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.chapterId} className="border-t">
                <td className="p-3 font-semibold text-[#A855F7]">{index + 1}</td>
                <td className="p-3 font-medium text-gray-900">{row.topicName}</td>
                <td className="p-3">
                  <Input
                    type="number"
                    min="0"
                    value={row.plannedLectureCount || ""}
                    onChange={(e) =>
                      updateRow(row.chapterId, {
                        plannedLectureCount: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="—"
                  />
                  {row.actualLectureCount > 0 ? (
                    <p className="mt-1 text-[11px] text-gray-400">
                      {row.actualLectureCount} logged
                    </p>
                  ) : null}
                </td>
                <td className="p-3">
                  <Input
                    type="date"
                    value={
                      row.expectedStartDate
                        ? String(row.expectedStartDate).slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      updateRow(row.chapterId, {
                        expectedStartDate: e.target.value || null,
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={row.chapterStatus || "not_started"}
                    onValueChange={(value: ChapterSheetStatus) =>
                      updateRow(row.chapterId, { chapterStatus: value, sheetStatus: value })
                    }
                  >
                    <SelectTrigger
                      className={`h-9 ${statusStyles[row.chapterStatus || "not_started"]}`}
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t bg-gray-50 px-5 py-4">
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Total no. of lectures required:</span>{" "}
            {totalLectures}
          </p>
          <p className="text-gray-500">
            Course completion date:{" "}
            {completionDate ? dayjs(completionDate).format("DD MMMM YYYY") : "—"}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A855F7] hover:bg-[#9333EA]"
        >
          {saving ? "Saving..." : "Save planner"}
        </Button>
      </div>
    </div>
  );
}
