"use client";

import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

import { getInstituteBatch, getTeacherAssignedBatches } from "@/actions/batch_actions";
import {
  assignBatchesToTeacher,
  getInstituteTeachers,
} from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logger } from "@/lib/logger";

type ApiBatch = {
  _id: string;
  name?: string;
  standard?: string;
};

type ApiTeacher = {
  _id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: { personal?: number | null; other?: number | null } | null;
  academic?: {
    schoolOrCollegeName?: string | null;
    degree?: string | null;
  } | null;
};

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  contact: string;
}

function batchLabel(b: ApiBatch) {
  const name = b.name ?? "Batch";
  const std = b.standard ? ` (${b.standard}th)` : "";
  return `${name}${std}`;
}

export default function TeachersPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  // All institute batches (loaded once)
  const [allBatches, setAllBatches] = useState<ApiBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  // Assign dialog state
  const [assignOpen, setAssignOpen] = useState(false);
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const [assignedBatchIds, setAssignedBatchIds] = useState<Set<string>>(new Set());
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [batchSearch, setBatchSearch] = useState("");

  // ── Load teachers ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!instituteId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getInstituteTeachers(instituteId)
      .then((res) => {
        if (cancelled) return;
        if (!res.success) {
          setError(res.message ?? "Error loading teachers");
          return;
        }
        setTeachers(
          (res.teachers ?? []).map((t: ApiTeacher) => ({
            id: String(t._id),
            name: `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim() || "Teacher",
            subject: (t.academic?.degree ?? t.academic?.schoolOrCollegeName ?? "—").toString(),
            email: t.email ?? "",
            contact: String(t.phone?.personal ?? t.phone?.other ?? "—"),
          }))
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Error loading teachers. Please try again later.");
          logger.error("Error loading teachers", { err });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [instituteId]);

  // Reset batches when institute changes
  useEffect(() => { setAllBatches([]); }, [instituteId]);

  const ensureBatchesLoaded = async () => {
    if (batchesLoading) return;
    if (allBatches.length > 0) return;
    setBatchesLoading(true);
    try {
      const res = await getInstituteBatch(instituteId);
      if (res?.success) setAllBatches((res?.data ?? []) as ApiBatch[]);
      else toast.error(res?.message ?? "Failed to load batches");
    } catch {
      toast.error("Failed to load batches");
    } finally {
      setBatchesLoading(false);
    }
  };

  // ── Open assign dialog ────────────────────────────────────────────────────
  const openAssignDialog = async (teacherId: string) => {
    setActiveTeacherId(teacherId);
    setSelectedBatchIds([]);
    setBatchSearch("");
    setAssignedBatchIds(new Set());
    setAssignOpen(true);
    setAssignedLoading(true);

    try {
      await ensureBatchesLoaded();
      const res = await getTeacherAssignedBatches(teacherId);
      if (res.success) setAssignedBatchIds(new Set(res.batchIds));
    } catch {
      // ignore — just show all batches
    } finally {
      setAssignedLoading(false);
    }
  };

  // ── Dialog: available (unassigned) batches ────────────────────────────────
  const availableBatches = useMemo(
    () => allBatches.filter((b) => !assignedBatchIds.has(b._id)),
    [allBatches, assignedBatchIds]
  );

  const filteredBatches = useMemo(() => {
    const q = batchSearch.trim().toLowerCase();
    if (!q) return availableBatches;
    return availableBatches.filter((b) => batchLabel(b).toLowerCase().includes(q));
  }, [availableBatches, batchSearch]);

  const alreadyAssignedBatches = useMemo(
    () => allBatches.filter((b) => assignedBatchIds.has(b._id)),
    [allBatches, assignedBatchIds]
  );

  const toggleBatch = (id: string) =>
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAssign = async () => {
    if (!activeTeacherId || selectedBatchIds.length === 0) return;
    setAssignSubmitting(true);
    try {
      const res = await assignBatchesToTeacher(instituteId, activeTeacherId, selectedBatchIds);
      if (res.success) {
        toast.success("Batches assigned successfully");
        setAssignOpen(false);
        setSelectedBatchIds([]);
      } else {
        toast.error(res.message ?? "Failed to assign batches");
      }
    } catch {
      toast.error("Failed to assign batches");
    } finally {
      setAssignSubmitting(false);
    }
  };

  // ── Teacher list filtering ────────────────────────────────────────────────
  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const t of teachers) if (t.subject && t.subject !== "—") set.add(t.subject);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase().replace(/\s+/g, " ");
    return teachers.filter((t) => {
      const matchesSub =
        selectedSubject === "All" || t.subject === selectedSubject;
      if (!matchesSub) return false;
      if (!q) return true;
      const name = (t.name ?? "").toLowerCase().replace(/\s+/g, " ");
      const subject = (t.subject ?? "").toLowerCase();
      const email = (t.email ?? "").toLowerCase();
      const contact = String(t.contact ?? "")
        .toLowerCase()
        .replace(/\s+/g, "");
      return (
        name.includes(q) ||
        subject.includes(q) ||
        email.includes(q) ||
        contact.includes(q.replace(/\s+/g, ""))
      );
    });
  }, [teachers, searchTerm, selectedSubject]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>{error}
        </div>
      </div>
    );
  }

  const subjectFilterLabel =
    selectedSubject === "All" ? "All subjects" : selectedSubject;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Teachers of Institute
        </h1>
      </div>

      {/* Toolbar — aligned with batch list */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search teachers..."
            autoComplete="off"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-left min-w-[160px] hover:bg-gray-50 transition-colors">
              <span className="flex-1 truncate">{subjectFilterLabel}</span>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-72 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => setSelectedSubject("All")}
              >
                All subjects
              </DropdownMenuItem>
              {subjects.map((sub) => (
                <DropdownMenuItem
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Teacher cards — same shell as batch cards */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl p-5 flex flex-col border border-gray-200 shadow-sm hover:bg-gray-50/70 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 truncate">
                    {teacher.name}
                  </h3>
                  <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">
                    {teacher.subject !== "—" ? teacher.subject : "Teacher"}
                  </p>
                </div>
              </div>

              <div className="text-[12px] mb-3 text-gray-500">
                Email:{" "}
                <span className="font-semibold text-gray-800 break-all">
                  {teacher.email || "—"}
                </span>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button
                  asChild
                  className="flex-1 h-8 text-xs rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white shadow-none"
                >
                  <Link href={`/institute/${instituteId}/teachers/${teacher.id}`}>
                    View Teacher
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-8 text-xs rounded-lg font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-none"
                  onClick={() => openAssignDialog(teacher.id)}
                >
                  Assign Batch
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">
            No teachers found. Try adjusting your search or subject filter.
          </p>
        </div>
      )}

      {/* ── Assign Batch Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={assignOpen}
        onOpenChange={(v) => {
          setAssignOpen(v);
          if (!v) { setSelectedBatchIds([]); setActiveTeacherId(null); }
        }}
      >
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold">Assign Batches</DialogTitle>
            <p className="text-sm text-gray-400 mt-0.5">
              Teacher:{" "}
              <span className="font-semibold text-gray-700">
                {teachers.find((t) => t.id === activeTeacherId)?.name ?? ""}
              </span>
            </p>
          </DialogHeader>

          {/* Already-assigned batches */}
          {(assignedLoading || alreadyAssignedBatches.length > 0) && (
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Already Assigned
              </p>
              {assignedLoading ? (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="size-3.5 animate-spin" /> Loading...
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {alreadyAssignedBatches.map((b) => (
                    <Badge
                      key={b._id}
                      variant="secondary"
                      className="bg-green-50 text-green-700 border border-green-200 rounded-full text-xs"
                    >
                      {batchLabel(b)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search batches..."
                value={batchSearch}
                onChange={(e) => setBatchSearch(e.target.value)}
                className="w-full pl-4 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
              {batchSearch && (
                <button
                  onClick={() => setBatchSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Selectable batch list (unassigned only) */}
          <div className="flex-1 overflow-y-auto px-6 py-3 min-h-0">
            {batchesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 text-purple-500 animate-spin" />
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                {batchSearch
                  ? "No batches match your search."
                  : availableBatches.length === 0
                  ? "All batches are already assigned to this teacher."
                  : "No batches found for this institute."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBatches.map((batch) => {
                  const isSelected = selectedBatchIds.includes(batch._id);
                  return (
                    <button
                      key={batch._id}
                      onClick={() => toggleBatch(batch._id)}
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
                            : "bg-white text-purple-600 border border-purple-200"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="size-4" strokeWidth={3} />
                        ) : (
                          (batch.name ?? "B").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
                          {batch.name ?? "Batch"}
                        </p>
                        {batch.standard && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Standard: {batch.standard}th
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
              {selectedBatchIds.length > 0
                ? `${selectedBatchIds.length} batch${selectedBatchIds.length > 1 ? "es" : ""} selected`
                : "Select batches to assign"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignOpen(false)}
                disabled={assignSubmitting}
                className="rounded-lg shadow-none"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={assignSubmitting || selectedBatchIds.length === 0}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-none"
              >
                {assignSubmitting ? (
                  <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Assigning...</>
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
