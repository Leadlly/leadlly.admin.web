"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Hash,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  addInstituteUINs,
  deleteInstituteUIN,
  getInstituteUINs,
  type UINRecord,
} from "@/actions/uin_actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const PAGE_LIMIT = 50;

type AssignedFilter = "all" | "true" | "false";

export default function UINsPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params.instituteId;

  /* ── Add UINs state ── */
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  /* ── Table state ── */
  const [uins, setUins] = useState<UINRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [assignedFilter, setAssignedFilter] = useState<AssignedFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ── Fetch ── */
  const fetchUINs = useCallback(async () => {
    setLoading(true);
    const res = await getInstituteUINs(instituteId, {
      page,
      limit: PAGE_LIMIT,
      assigned: assignedFilter === "all" ? undefined : assignedFilter,
    });
    if (res.success) {
      setUins(res.uins);
      setTotal(res.total);
    }
    setLoading(false);
  }, [instituteId, page, assignedFilter]);

  useEffect(() => {
    fetchUINs();
  }, [fetchUINs]);

  /* ── Add ── */
  const handleAdd = async () => {
    const rawList = input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawList.length === 0) {
      toast.error("Please enter at least one UID.");
      return;
    }

    setAdding(true);
    const res = await addInstituteUINs(instituteId, rawList);
    setAdding(false);

    if (res.success) {
      toast.success(res.message ?? "UIDs added");
      setInput("");
      setPage(1);
      fetchUINs();
    } else {
      toast.error(res.message ?? "Failed to add UIDs");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (uid: UINRecord) => {
    const res = await deleteInstituteUIN(uid._id, instituteId);
    if (res.success) {
      toast.success("UID deleted");
      fetchUINs();
    } else {
      toast.error(res.message ?? "Failed to delete UID");
    }
  };

  /* ── Client-side search filter (over current page) ── */
  const displayed = search.trim()
    ? uins.filter((u) =>
        u.uin.toLowerCase().includes(search.trim().toLowerCase())
      )
    : uins;

  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const assignedCount = uins.filter((u) => u.isAssigned).length;
  const unassignedCount = uins.filter((u) => !u.isAssigned).length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Hash className="h-7 w-7 text-primary" />
          Unique Identification Numbers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add UIDs for your institute students. Once assigned to a student they
          cannot be deleted.
        </p>
      </div>

      {/* ── Add UIDs card ── */}
      <div className="bg-white rounded-3xl shadow-section p-5 md:p-7 space-y-4">
        <h2 className="font-semibold text-base">Add UIDs</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Enter one UID per line <em>or</em> separate them with commas.
          Duplicates are automatically skipped.
        </p>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`UID001\nUID002, UID003\nUID004`}
          rows={5}
          className="font-mono text-sm shadow-none resize-none"
        />

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleAdd}
            disabled={adding || !input.trim()}
            className="bg-primary text-white gap-2"
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {adding ? "Adding…" : "Add UIDs"}
          </Button>

          {input.trim() && (
            <span className="text-xs text-muted-foreground">
              {
                input
                  .split(/[\n,]+/)
                  .map((s) => s.trim())
                  .filter(Boolean).length
              }{" "}
              UID(s) to add
            </span>
          )}

          {input && (
            <button
              onClick={() => setInput("")}
              className="text-xs text-destructive flex items-center gap-1 hover:underline"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-3xl shadow-section p-5 md:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-base">All UIDs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total:{" "}
              <span className="font-medium text-foreground">{total}</span>
              {" · "}Assigned:{" "}
              <span className="font-medium text-green-600">{assignedCount}</span>
              {" · "}Unassigned:{" "}
              <span className="font-medium text-yellow-600">{unassignedCount}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Assigned filter */}
            {(["all", "false", "true"] as AssignedFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => { setAssignedFilter(f); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  assignedFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {f === "all" ? "All" : f === "true" ? "Assigned" : "Unassigned"}
              </button>
            ))}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search UID…"
                className="pl-8 h-8 w-40 shadow-none text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-muted-foreground">
            <Hash className="h-10 w-10 opacity-20" />
            <p className="text-sm">
              {total === 0
                ? "No UIDs added yet. Use the form above to add some."
                : "No UIDs match the current filter."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-16 text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map((uid, index) => (
                  <TableRow key={uid._id} className="hover:bg-muted/20">
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {(page - 1) * PAGE_LIMIT + index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium text-sm tracking-wide">
                        {uid.uin}
                      </span>
                    </TableCell>
                    <TableCell>
                      {uid.isAssigned ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Assigned
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-300 gap-1 font-medium"
                        >
                          <Circle className="h-3 w-3" />
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {uid.assignedToStudent ? (
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {`${uid.assignedToStudent.firstname} ${uid.assignedToStudent.lastname ?? ""}`.trim()}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {uid.assignedToStudent.email}
                          </p>
                        </div>
                      ) : uid.isAssigned ? (
                        <span className="text-xs text-muted-foreground italic">ID: {String(uid.assignedTo)}</span>
                      ) : (
                        <span className="text-muted-foreground/50 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(uid.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {uid.isAssigned ? (
                        <span
                          title="Cannot delete an assigned UID"
                          className="inline-flex items-center justify-center w-7 h-7 rounded opacity-30 cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete UID?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-mono font-semibold text-foreground">
                                  {uid.uin}
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(uid)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
