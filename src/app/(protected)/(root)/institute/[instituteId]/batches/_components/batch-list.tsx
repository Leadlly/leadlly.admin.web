"use client";

import React, { useRef, useState } from "react";

import Link from "next/link";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, ImagePlus, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteBatch, getInstituteBatch, updateBatch } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
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

  const [name, setName] = useState(batch?.name ?? "");
  const [standard, setStandard] = useState(batch?.standard ?? "");
  const [description, setDescription] = useState(batch?.description ?? "");
  const [subjects, setSubjects] = useState(batch?.subjects?.join(", ") ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync fields when dialog opens for a different batch
  React.useEffect(() => {
    if (open && batch) {
      setName(batch.name);
      setStandard(batch.standard);
      setDescription(batch.description ?? "");
      setSubjects(batch.subjects?.join(", ") ?? "");
      setCoverFile(null);
      setCoverPreview(null);
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
      const subjectsArray = subjects
        ? subjects.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

      const res = await updateBatch(batch._id, {
        name,
        standard,
        description: description || undefined,
        subjects: subjectsArray,
        ...(coverFile ? { coverImage: { name: coverFile.name, type: coverFile.type } } : {}),
      });

      if (res?.success) {
        if (coverFile && res.coverImageUploadUrl) {
          await fetch(res.coverImageUploadUrl, {
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
            <label className="text-sm font-medium" htmlFor="edit-subjects">
              Subjects <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              id="edit-subjects"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g. Physics, Chemistry"
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <p className="text-xs text-muted-foreground">Separate multiple subjects with commas</p>
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

// ── Main BatchList ─────────────────────────────────────────────────────────
export default function BatchList({ instituteId }: { instituteId: string }) {
  const queryClient = useQueryClient();
  const [filterStandard, setFilterStandard] = useState("");
  const [filterLabel, setFilterLabel] = useState("All Standards");

  const [assignDialog, setAssignDialog] = useState<{ open: boolean; batchId: string; batchName: string }>(
    { open: false, batchId: "", batchName: "" }
  );
  const [editBatch, setEditBatch] = useState<ApiBatch | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiBatch | null>(null);

  const { data } = useSuspenseQuery({
    queryKey: ["institute_batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });

  const batches: ApiBatch[] = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (batchId: string) => deleteBatch(batchId),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Batch deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["institute_batches", instituteId] });
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

  const uniqueStandards = Array.from(new Set(batches.map((b) => b.standard))).sort(
    (a, b) => Number(a) - Number(b)
  );

  const filteredBatches = batches
    .filter((batch) => (filterStandard ? batch.standard === filterStandard : true))
    .sort((a, b) => Number(a.standard) - Number(b.standard));

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>
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
      {filteredBatches.length > 0 ? (
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
                  <div className={`w-11 h-11 shrink-0 ${getBatchLogoBg(batch.name)} rounded-xl flex items-center justify-center text-white`}>
                    {batch.name.toLowerCase().includes("omega") ? (
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
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => { setEditBatch(batch); setEditOpen(true); }}
                          className="gap-2 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit Batch
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
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">No batches found. Try adjusting your filters or add a new batch.</p>
        </div>
      )}

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
    </>
  );
}
