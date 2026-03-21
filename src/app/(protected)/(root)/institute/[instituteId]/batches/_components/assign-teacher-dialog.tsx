"use client";

import React, { useEffect, useState } from "react";

import { Check, Loader2, UserCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import {
  assignTeachersToBatch,
  getBatchTeachers,
  getInstituteTeachers,
} from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Teacher {
  _id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  academic?: { degree?: string | null; schoolOrCollegeName?: string | null } | null;
}

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  batchName: string;
  instituteId: string;
}

function teacherDisplayName(t: Teacher) {
  return `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim() || "Teacher";
}

function TeacherAvatar({
  teacher,
  size = "md",
  selected = false,
}: {
  teacher: Teacher;
  size?: "sm" | "md";
  selected?: boolean;
}) {
  const initial = teacherDisplayName(teacher).charAt(0).toUpperCase();
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 ${
        selected
          ? "bg-purple-500 text-white"
          : "bg-white text-purple-500 border border-purple-200"
      }`}
    >
      {selected ? <Check className="size-3.5" strokeWidth={3} /> : initial}
    </div>
  );
}

export default function AssignTeacherDialog({
  open,
  onOpenChange,
  batchId,
  batchName,
  instituteId,
}: AssignTeacherDialogProps) {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [assignedTeachers, setAssignedTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open || !instituteId || !batchId) return;
    setSelectedIds([]);
    setSearch("");
    setLoading(true);

    Promise.all([
      getInstituteTeachers(instituteId),
      getBatchTeachers(batchId),
    ])
      .then(([allRes, assignedRes]) => {
        const all = allRes.success ? (allRes.teachers as Teacher[]) : [];
        const assigned = assignedRes.success ? (assignedRes.teachers as Teacher[]) : [];

        if (!allRes.success) toast.error(allRes.message ?? "Failed to load teachers");

        const assignedIds = new Set(assigned.map((t) => t._id));
        setAssignedTeachers(assigned);
        // Only show unassigned teachers in the selectable list
        setAllTeachers(all.filter((t) => !assignedIds.has(t._id)));
      })
      .finally(() => setLoading(false));
  }, [open, instituteId, batchId]);

  const toggleTeacher = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      const res = await assignTeachersToBatch(instituteId, batchId, selectedIds);
      if (res.success) {
        toast.success("Teachers assigned successfully");
        onOpenChange(false);
      } else {
        toast.error(res.message ?? "Failed to assign teachers");
      }
    } catch {
      toast.error("Failed to assign teachers");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = allTeachers.filter((t) => {
    const name = teacherDisplayName(t).toLowerCase();
    const email = (t.email ?? "").toLowerCase();
    const q = search.trim().toLowerCase();
    return !q || name.includes(q) || email.includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold">Assign Teachers</DialogTitle>
          <p className="text-sm text-gray-400 mt-0.5">
            Batch: <span className="font-semibold text-gray-700">{batchName}</span>
          </p>
        </DialogHeader>

        {/* Already assigned teachers section */}
        {assignedTeachers.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/60">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-green-500" />
              Already Assigned ({assignedTeachers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {assignedTeachers.map((t) => {
                const name = teacherDisplayName(t);
                const subject =
                  t.academic?.degree ?? t.academic?.schoolOrCollegeName ?? "";
                return (
                  <div
                    key={t._id}
                    title={t.email ?? name}
                    className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full pl-1 pr-2.5 py-0.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-green-800 leading-none">
                      {name}
                    </span>
                    {subject && (
                      <span className="text-[10px] text-green-600 leading-none">
                        · {subject}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Selectable teacher list (unassigned only) */}
        <div className="flex-1 overflow-y-auto px-6 py-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 text-purple-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              {search
                ? "No teachers match your search."
                : allTeachers.length === 0
                ? "All institute teachers are already assigned to this batch."
                : "No teachers found for this institute."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((teacher) => {
                const name = teacherDisplayName(teacher);
                const subject =
                  teacher.academic?.degree ??
                  teacher.academic?.schoolOrCollegeName ??
                  "";
                const isSelected = selectedIds.includes(teacher._id);

                return (
                  <button
                    key={teacher._id}
                    onClick={() => toggleTeacher(teacher._id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-purple-50 border border-purple-200"
                        : "bg-gray-50 border border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <TeacherAvatar teacher={teacher} selected={isSelected} />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isSelected ? "text-purple-700" : "text-gray-900"
                        }`}
                      >
                        {name}
                      </p>
                      {(teacher.email || subject) && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {[subject, teacher.email].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            {selectedIds.length > 0
              ? `${selectedIds.length} teacher${selectedIds.length > 1 ? "s" : ""} selected`
              : "Select teachers to assign"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-lg shadow-none"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssign}
              disabled={submitting || selectedIds.length === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" /> Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5 mr-1.5" /> Assign
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
