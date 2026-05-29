"use client";

import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ImagePlus, MoreHorizontal, Pencil, PowerOff, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteBatch, getInstituteBatch, updateBatch } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AssignTeacherDialog from "./assign-teacher-dialog";
import CreateBatch from "./create-batch";

interface ApiBatch {
  _id: string;
  name: string;
  standard: string;
  status: "Active" | "Inactive" | "Completed";
  description?: string;
  subjects?: string[];
  images?: { url: string; key: string }[];
  payment?: {
    subscriptionType: "Free" | "Paid";
    amount: number;
    currency: string;
  };
  createdAt?: string;
  totalStudents?: number;
  totalCapacity?: number;
}

const getBatchLogoBg = (batchName: string) => {
  switch (batchName) {
    case "Omega": return "bg-blue-500";
    case "Sigma": return "bg-purple-500";
    case "Alpha": return "bg-teal-500";
    case "Beta":  return "bg-yellow-500";
    default:      return "bg-indigo-500";
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Active":    return "bg-green-100 text-green-600";
    case "Inactive":  return "bg-gray-100 text-gray-500";
    case "Completed": return "bg-blue-100 text-blue-600";
    default:          return "bg-gray-100 text-gray-500";
  }
};

// ── Edit Batch Dialog ──────────────────────────────────────────────────────
function EditBatchDialog({
  batch,
  instituteId,
  open,
  onOpenChange,
}: {
  batch: ApiBatch | null;
  instituteId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Maths"] as const;
  const [name, setName] = useState(batch?.name ?? "");
  const [standard, setStandard] = useState(batch?.standard ?? "");
  const [description, setDescription] = useState(batch?.description ?? "");
  const [subjects, setSubjects] = useState<string[]>(batch?.subjects ?? []);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync fields when dialog opens for a different batch
  React.useEffect(() => {
    if (open && batch) {
      setName(batch.name);
      setStandard(batch.standard);
      setDescription(batch.description ?? "");
      setSubjects(batch.subjects ?? []);
      setCoverFile(null);
      setCoverPreview(batch.images?.[0]?.url ?? null);
    }
  }, [open, batch]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Cover image must be less than 5MB"); return; }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch) return;
    setSubmitting(true);
    try {
      const subjectsArray = subjects.length > 0 ? subjects : undefined;

      const res = await updateBatch(batch._id, {
        name,
        standard,
        description: description || undefined,
        subjects: subjectsArray,
        ...(coverFile ? { images: [{ name: coverFile.name, type: coverFile.type }] } : {}),
      });

      if (res?.success) {
        if (coverFile && res.data?.signedUrls?.[0]) {
          await fetch(res.data.signedUrls[0], {
            method: "PUT",
            body: coverFile,
            headers: { "Content-Type": coverFile.type },
          });
        }
        toast.success("Batch updated successfully");
        queryClient.invalidateQueries({ queryKey: ["institute_batches", instituteId] });
        onOpenChange(false);
      } else {
        toast.error(res?.message ?? "Failed to update batch");
      }
    } catch {
      toast.error("Failed to update batch");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Batch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Cover image */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Cover Image <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div
              className="relative w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCoverFile(null); setCoverPreview(null); if (coverInputRef.current) coverInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="h-7 w-7 text-gray-400 mb-1.5" />
                  <p className="text-xs text-gray-400">Click to upload new cover</p>
                </>
              )}
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          {/* Batch name */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="edit-name">
              Batch Name <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Standard */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="edit-standard">
              Standard <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-standard"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              required
              placeholder="e.g. 11"
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Subjects */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Subjects <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {SUBJECT_OPTIONS.map((subject) => {
                const checked = subjects.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => {
                      if (checked) {
                        setSubjects(subjects.filter((s) => s !== subject));
                      } else {
                        setSubjects([...subjects, subject]);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      checked
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="edit-description">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of this batch..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting} className="rounded-lg shadow-none">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-none min-w-[100px]">
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type StatusFilter = "All" | "Active" | "Inactive" | "Completed";

// ── Main BatchList ─────────────────────────────────────────────────────────
export default function BatchList({ instituteId }: { instituteId: string }) {
  const queryClient = useQueryClient();
  const [filterStandard, setFilterStandard] = useState("");
  const [filterLabel, setFilterLabel] = useState("All Standards");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [assignDialog, setAssignDialog] = useState<{ open: boolean; batchId: string; batchName: string }>(
    { open: false, batchId: "", batchName: "" }
  );
  const [editBatch, setEditBatch] = useState<ApiBatch | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiBatch | null>(null);
  const [deactivateConfirm, setDeactivateConfirm] = useState<ApiBatch | null>(null);

  // Debounce search input so we don't fire a request on every keystroke
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [searchQuery]);

  // All filters go into the query key so React Query refetches when any changes
  const { data, isFetching } = useQuery({
    queryKey: ["institute_batches", instituteId, filterStatus, filterStandard, debouncedSearch],
    queryFn: () =>
      getInstituteBatch(instituteId, {
        status: filterStatus === "All" ? undefined : filterStatus,
        standard: filterStandard || undefined,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const batches: ApiBatch[] = data?.data ?? [];

  // Invalidate all variations of institute_batches for this institute
  const invalidateBatches = () =>
    queryClient.invalidateQueries({ queryKey: ["institute_batches", instituteId] });

  const deleteMutation = useMutation({
    mutationFn: (batchId: string) => deleteBatch(batchId),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Batch deleted successfully");
        invalidateBatches();
      } else {
        toast.error(res?.message ?? "Failed to delete batch");
      }
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error("Failed to delete batch");
      setDeleteConfirm(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (batch: ApiBatch) =>
      updateBatch(batch._id, { status: batch.status === "Inactive" ? "Active" : "Inactive" }),
    onSuccess: (res, batch) => {
      if (res?.success) {
        const action = batch.status === "Inactive" ? "activated" : "deactivated";
        toast.success(`Batch ${action} successfully`);
        invalidateBatches();
      } else {
        toast.error(res?.message ?? "Failed to update batch status");
      }
      setDeactivateConfirm(null);
    },
    onError: () => {
      toast.error("Failed to update batch status");
      setDeactivateConfirm(null);
    },
  });

  // Unique standards derived from currently returned batches (for dropdown options when no filter active)
  const uniqueStandards = Array.from(new Set(batches.map((b) => b.standard))).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Batches are already filtered by the API — just sort client-side
  const filteredBatches = [...batches].sort((a, b) => Number(a.standard) - Number(b.standard));

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>

          {/* Standard dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm text-left min-w-[150px] hover:bg-gray-50 transition-colors">
              <span className="flex-1">{filterLabel}</span>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => { setFilterStandard(""); setFilterLabel("All Standards"); }}>
                All Standards
              </DropdownMenuItem>
              {uniqueStandards.map((standard) => (
                <DropdownMenuItem
                  key={standard}
                  onClick={() => { setFilterStandard(standard); setFilterLabel(`${standard}th Standard`); }}
                >
                  {standard}th Standard
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter pills */}
          {(["All", "Active", "Inactive", "Completed"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filterStatus === s
                  ? s === "Active"
                    ? "bg-green-500 text-white border-green-500"
                    : s === "Inactive"
                    ? "bg-gray-400 text-white border-gray-400"
                    : s === "Completed"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-purple-500 text-white border-purple-500"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batches…"
              className="pl-8 h-9 w-44 shadow-none text-sm border-gray-200 rounded-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <CreateBatch
          instituteId={instituteId}
          standard={filterStandard}
          trigger={
            <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-none h-9 px-5 text-sm rounded-lg font-medium">
              + Add Batch
            </Button>
          }
        />
      </div>

      {/* Batch grid */}
      {isFetching && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-purple-500" />
        </div>
      )}
      {!isFetching && filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredBatches.map((batch) => {
            const totalStudents = batch.totalStudents ?? 0;

            return (
              <div
                key={batch._id}
                className="bg-white rounded-2xl p-5 flex flex-col border border-gray-200 shadow-sm hover:bg-gray-50/70 hover:border-gray-300 transition-colors"
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 shrink-0 rounded-xl overflow-hidden ${batch.images?.[0]?.url ? "" : `${getBatchLogoBg(batch.name)} flex items-center justify-center text-white`}`}>
                    {batch.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={batch.images[0].url} alt={batch.name} className="w-full h-full object-cover" />
                    ) : batch.name.toLowerCase().includes("omega") ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{batch.name}</h3>
                    <p className="text-gray-400 text-[11px] font-medium mt-0.5">{batch.standard}th Class</p>
                  </div>
                  {/* Status + ⋯ menu */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center tracking-wide uppercase ${getStatusStyle(batch.status)}`}>
                      {batch.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => { setEditBatch(batch); setEditOpen(true); }}
                          className="gap-2 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit Batch
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeactivateConfirm(batch)}
                          className="gap-2 cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                        >
                          <PowerOff className="h-3.5 w-3.5" />
                          {batch.status === "Inactive" ? "Activate Batch" : "Deactivate Batch"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm(batch)}
                          className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="text-[12px] mb-4 mt-auto text-gray-500">
                  Students: <span className="font-bold text-gray-900">{totalStudents}</span>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1 h-8 text-xs rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white shadow-none">
                    <Link href={`/institute/${instituteId}/batches/${batch._id}`}>View Batch</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs rounded-lg font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-none"
                    onClick={() => setAssignDialog({ open: true, batchId: batch._id, batchName: batch.name })}
                  >
                    Assign Teacher
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isFetching ? (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">
            {filterStatus !== "All" || filterStandard || debouncedSearch
              ? "No batches match the current filters."
              : "No batches found. Add a new batch to get started."}
          </p>
        </div>
      ) : null}

      {/* Assign Teacher dialog */}
      <AssignTeacherDialog
        open={assignDialog.open}
        onOpenChange={(v) => setAssignDialog((prev) => ({ ...prev, open: v }))}
        batchId={assignDialog.batchId}
        batchName={assignDialog.batchName}
        instituteId={instituteId}
      />

      {/* Edit Batch dialog */}
      <EditBatchDialog
        batch={editBatch}
        instituteId={instituteId}
        open={editOpen}
        onOpenChange={(v) => { setEditOpen(v); if (!v) setEditBatch(null); }}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(v) => { if (!v) setDeleteConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteConfirm?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the batch and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm._id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate / Activate confirmation */}
      <AlertDialog open={!!deactivateConfirm} onOpenChange={(v) => { if (!v) setDeactivateConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deactivateConfirm?.status === "Inactive" ? "Activate" : "Deactivate"} &quot;{deactivateConfirm?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deactivateConfirm?.status === "Inactive"
                ? "This will mark the batch as Active, making it visible and accessible to students."
                : "This will mark the batch as Inactive. Students will no longer be able to access this batch."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deactivateMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deactivateConfirm && deactivateMutation.mutate(deactivateConfirm)}
              disabled={deactivateMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500"
            >
              {deactivateMutation.isPending
                ? "Updating..."
                : deactivateConfirm?.status === "Inactive" ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
