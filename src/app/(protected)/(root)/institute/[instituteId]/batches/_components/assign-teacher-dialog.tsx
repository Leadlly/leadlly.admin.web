"use client";

import React, { useEffect, useState } from "react";

import { Check, Loader2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import {
  assignTeachersToBatch,
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

export default function AssignTeacherDialog({
  open,
  onOpenChange,
  batchId,
  batchName,
  instituteId,
}: AssignTeacherDialogProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open || !instituteId) return;
    setSelectedIds([]);
    setSearch("");
    setLoading(true);

    getInstituteTeachers(instituteId)
      .then((res) => {
        setTeachers(res.success ? (res.teachers as Teacher[]) : []);
        if (!res.success) toast.error(res.message ?? "Failed to load teachers");
      })
      .finally(() => setLoading(false));
  }, [open, instituteId]);

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

  const filtered = teachers.filter((t) => {
    const name = `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim().toLowerCase();
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

        <div className="flex-1 overflow-y-auto px-6 py-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 text-purple-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              {search ? "No teachers match your search." : "No teachers found for this institute."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((teacher) => {
                const name = `${teacher.firstname ?? ""} ${teacher.lastname ?? ""}`.trim() || "Teacher";
                const subject = teacher.academic?.degree ?? teacher.academic?.schoolOrCollegeName ?? "";
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
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected
                          ? "bg-purple-500 text-white"
                          : "bg-white text-purple-500 border border-purple-200"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="size-4" strokeWidth={3} />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
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
