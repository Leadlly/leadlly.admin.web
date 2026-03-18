"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Pencil, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";

import {
  getFeeRecords,
  deleteFeeRecord,
  IFeeRecord,
} from "@/actions/fee_actions";
import { getActiveInstitute } from "@/actions/institute_actions";
import FeeRecordDialog from "./_components/FeeRecordDialog";
import { generateFeePdf, PdfMeta } from "./_components/FeePdfGenerator";

export default function FeesPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";

  const [records, setRecords] = useState<IFeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IFeeRecord | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Institute meta for PDF
  const [pdfMeta, setPdfMeta] = useState<PdfMeta>({ instituteName: "" });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch institute meta for PDF
  useEffect(() => {
    if (!instituteId) return;
    getActiveInstitute({ instituteId }).then((res) => {
      if (res?.institute) {
        const inst = res.institute;
        setPdfMeta({
          instituteName: inst.name,
          address: [inst.address1, inst.city, inst.state, inst.pincode]
            .filter(Boolean)
            .join(", "),
          phone: inst.contactNumber,
          website: inst.website,
          email: inst.email,
        });
      }
    });
  }, [instituteId]);

  const fetchRecords = useCallback(async () => {
    if (!instituteId) return;
    setLoading(true);
    try {
      const res = await getFeeRecords(instituteId, page, debouncedSearch);
      if (res.success) {
        setRecords(res.data ?? []);
        setTotalPages(res.totalPages ?? 1);
        setTotal(res.total ?? 0);
      } else {
        toast.error(res.message ?? "Failed to load records");
      }
    } finally {
      setLoading(false);
    }
  }, [instituteId, page, debouncedSearch]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteFeeRecord(instituteId, deleteId);
      if (res.success) {
        toast.success("Record deleted");
        fetchRecords();
      } else {
        toast.error(res.message ?? "Failed to delete");
      }
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const openCreate = () => {
    setEditRecord(null);
    setDialogOpen(true);
  };

  const openEdit = (record: IFeeRecord) => {
    setEditRecord(record);
    setDialogOpen(true);
  };

  const handleGeneratePdf = (record: IFeeRecord) => {
    generateFeePdf(record, pdfMeta).catch(() =>
      toast.error("Failed to generate PDF")
    );
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "—";

  const formatCurrency = (n?: number) =>
    n !== undefined
      ? `₹${n.toLocaleString("en-IN")}`
      : "—";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Fee Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} record{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Add Record
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, form no, course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-section border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form No.</TableHead>
                <TableHead>Ack. No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Total (₹)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No fee records found.{" "}
                    <button
                      onClick={openCreate}
                      className="text-primary underline underline-offset-2"
                    >
                      Add the first one
                    </button>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec._id}>
                    <TableCell className="font-mono text-xs">{rec.formNo}</TableCell>
                    <TableCell className="font-mono text-xs">{rec.acknowledgementNo}</TableCell>
                    <TableCell>
                      <div className="font-medium">{rec.studentName}</div>
                      {rec.fatherName && (
                        <div className="text-xs text-muted-foreground">{rec.fatherName}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{rec.courseName ?? "—"}</div>
                      {rec.courseCode && (
                        <Badge variant="outline" className="text-xs mt-0.5">
                          {rec.courseCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{rec.paymentMode ?? "—"}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(rec.totalAmount)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(rec.paymentDate as unknown as string)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit"
                          onClick={() => openEdit(rec)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Generate PDF"
                          onClick={() => handleGeneratePdf(rec)}
                        >
                          <Download className="size-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          onClick={() => setDeleteId(rec._id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <FeeRecordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        instituteId={instituteId}
        record={editRecord}
        onSuccess={fetchRecords}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee record?</AlertDialogTitle>
            <AlertDialogDescription>
              This record will be soft-deleted and will no longer appear in the list. This action cannot be undone from the UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
