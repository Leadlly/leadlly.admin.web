"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Search, Pencil, Trash2, Download, ChevronLeft, ChevronRight, User, GraduationCap, IndianRupee } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

import { getStudentById } from "@/actions/student_action";
import { getFeeRecords, deleteFeeRecord, IFeeRecord } from "@/actions/fee_actions";
import { getActiveInstitute } from "@/actions/institute_actions";
import FeeRecordDialog from "../../fees/_components/FeeRecordDialog";
import { generateFeePdf, PdfMeta } from "../../fees/_components/FeePdfGenerator";

export default function StudentDetailPage() {
  const params = useParams<{ instituteId: string; studentId: string }>();
  const { instituteId, studentId } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);
  const [studentLoading, setStudentLoading] = useState(true);

  // Fee records state
  const [records, setRecords] = useState<IFeeRecord[]>([]);
  const [feeLoading, setFeeLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IFeeRecord | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // PDF meta
  const [pdfMeta, setPdfMeta] = useState<PdfMeta>({ instituteName: "" });

  // ─── Load student ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) return;
    setStudentLoading(true);
    getStudentById(studentId).then((res) => {
      if (res.success) setStudent(res.student);
    }).finally(() => setStudentLoading(false));
  }, [studentId]);

  // ─── Load institute meta for PDF ───────────────────────────────────────────
  useEffect(() => {
    if (!instituteId) return;
    getActiveInstitute({ instituteId }).then((res) => {
      if (res?.institute) {
        const inst = res.institute;
        setPdfMeta({
          instituteName: inst.name,
          address: [inst.address1, inst.city, inst.state, inst.pincode].filter(Boolean).join(", "),
          phone: inst.contactNumber,
          website: inst.website,
          email: inst.email,
        });
      }
    });
  }, [instituteId]);

  // ─── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  // ─── Load fee records (scoped to this student) ──────────────────────────────
  const fetchRecords = useCallback(async () => {
    if (!instituteId || !studentId) return;
    setFeeLoading(true);
    try {
      const res = await getFeeRecords(instituteId, page, debouncedSearch, studentId);
      if (res.success) {
        setRecords(res.data ?? []);
        setTotalPages(res.totalPages ?? 1);
        setTotal(res.total ?? 0);
      }
    } finally {
      setFeeLoading(false);
    }
  }, [instituteId, studentId, page, debouncedSearch]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ─── Build auto-fill defaults from student data ─────────────────────────────
  const studentDefaults = student
    ? {
        studentName: `${student.firstname ?? ""} ${student.lastname ?? ""}`.trim(),
        fatherName: student.parent?.name ?? "",
        studentId: String(student._id),
      }
    : undefined;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteFeeRecord(instituteId, deleteId);
      if (res.success) { toast.success("Record deleted"); fetchRecords(); }
      else toast.error(res.message ?? "Failed to delete");
    } finally { setDeleteLoading(false); setDeleteId(null); }
  };

  const openCreate = () => { setEditRecord(null); setDialogOpen(true); };
  const openEdit = (rec: IFeeRecord) => { setEditRecord(rec); setDialogOpen(true); };
  const handlePdf = (rec: IFeeRecord) =>
    generateFeePdf(rec, pdfMeta).catch(() => toast.error("Failed to generate PDF"));

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN") : "—";
  const fmtCur = (n?: number) => n !== undefined ? `₹${n.toLocaleString("en-IN")}` : "—";

  const fullName = student
    ? `${student.firstname ?? ""}${student.lastname ? " " + student.lastname : ""}`.trim()
    : "Student";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/institute/${instituteId}/students`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Back to Students
      </Link>

      {/* Student hero card */}
      <div className="bg-white rounded-2xl border shadow-section p-6 mb-6 flex items-center gap-5">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {student?.avatar?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={student.avatar.url} alt={fullName} className="size-16 rounded-full object-cover" />
          ) : (
            <User className="size-7 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {studentLoading ? (
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <h1 className="text-xl font-bold truncate">{fullName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{student?.email ?? ""}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {student?.academic?.standard && (
                  <Badge variant="outline" className="gap-1">
                    <GraduationCap className="size-3" />
                    Class {student.academic.standard}
                  </Badge>
                )}
                {student?.details?.level?.number && (
                  <Badge variant="secondary">
                    Level {student.details.level.number}
                  </Badge>
                )}
                {student?.academic?.competitiveExam && (
                  <Badge variant="outline">{student.academic.competitiveExam}</Badge>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <User className="size-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="fees">
            <IndianRupee className="size-4 mr-1.5" />
            Fee Management
          </TabsTrigger>
        </TabsList>

        {/* ── Overview tab ─────────────────────────────────────────────────── */}
        <TabsContent value="overview">
          {studentLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : student ? (
            <div className="bg-white rounded-2xl border shadow-section p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                ["Full Name", fullName],
                ["Email", student.email],
                ["Phone", student.phone?.personal ?? "—"],
                ["Class / Standard", student.academic?.standard ?? "—"],
                ["Competitive Exam", student.academic?.competitiveExam ?? "—"],
                ["Date of Birth", student.about?.dateOfBirth ?? "—"],
                ["Gender", student.about?.gender ?? "—"],
                ["Parent Name", student.parent?.name ?? "—"],
                ["Parent Phone", student.parent?.phone ?? "—"],
                ["Level", student.details?.level?.number ?? "—"],
                ["Points", student.details?.points?.number ?? "—"],
                ["Streak", student.details?.streak?.number ?? "—"],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Student not found.</p>
          )}
        </TabsContent>

        {/* ── Fee Management tab ───────────────────────────────────────────── */}
        <TabsContent value="fees">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {total} fee record{total !== 1 ? "s" : ""} for this student
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2" size="sm">
              <Plus className="size-4" />
              Add Fee Record
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by form no, course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl border shadow-section overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form No.</TableHead>
                    <TableHead>Ack. No.</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-right">Total (₹)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading…</TableCell>
                    </TableRow>
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No fee records yet.{" "}
                        <button onClick={openCreate} className="text-primary underline">Add one</button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((rec) => (
                      <TableRow key={rec._id}>
                        <TableCell className="font-mono text-xs">{rec.formNo}</TableCell>
                        <TableCell className="font-mono text-xs">{rec.acknowledgementNo}</TableCell>
                        <TableCell>
                          <div>{rec.courseName ?? "—"}</div>
                          {rec.courseCode && <Badge variant="outline" className="text-xs mt-0.5">{rec.courseCode}</Badge>}
                        </TableCell>
                        <TableCell className="text-sm">{rec.paymentMode ?? "—"}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{fmtCur(rec.totalAmount)}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{fmt(rec.paymentDate as unknown as string)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button size="icon" variant="ghost" title="Edit" onClick={() => openEdit(rec)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" title="Download PDF" onClick={() => handlePdf(rec)}>
                              <Download className="size-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" title="Delete" onClick={() => setDeleteId(rec._id)}>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create / Edit dialog — passes student defaults for auto-fill */}
      <FeeRecordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        instituteId={instituteId}
        record={editRecord}
        onSuccess={fetchRecords}
        studentDefaults={studentDefaults}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee record?</AlertDialogTitle>
            <AlertDialogDescription>
              This record will be soft-deleted and won&apos;t appear in the list.
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
