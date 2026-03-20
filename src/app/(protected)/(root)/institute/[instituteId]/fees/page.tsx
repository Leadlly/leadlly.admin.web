"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Printer,
  ArrowLeft,
  Users,
  IndianRupee,
  FileText,
  ChevronRight,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import {
  getFeeRecords,
  getFeeUidGroups,
  deleteFeeRecord,
  IFeeRecord,
  FeeUidGroup,
} from "@/actions/fee_actions";
import { getActiveInstitute } from "@/actions/institute_actions";
import FeeRecordDialog from "./_components/FeeRecordDialog";
import { generateFeePdf, printFeePdf, PdfMeta } from "./_components/FeePdfGenerator";

// ─── UID Block Card ──────────────────────────────────────────────────────────

function UidCard({
  group,
  onClick,
}: {
  group: FeeUidGroup;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/40 transition-all p-5 flex items-start justify-between gap-4 group"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="size-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-base leading-tight">{group.studentName}</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            UID: {group._id}
          </p>
          {group.streamName && (
            <p className="text-xs text-muted-foreground mt-0.5">{group.streamName}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-bold text-primary">
          ₹{(group.totalPaid ?? 0).toLocaleString("en-IN")}
        </span>
        <span className="text-xs text-green-600 font-medium">
          Paid: ₹{(group.totalAmountReceived ?? 0).toLocaleString("en-IN")}
        </span>
        <span className="text-xs text-red-500 font-medium">
          Balance: ₹{(group.totalBalance ?? 0).toLocaleString("en-IN")}
        </span>
        <Badge variant="secondary" className="text-xs">
          {group.recordCount} receipt{group.recordCount !== 1 ? "s" : ""}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
      </div>
    </button>
  );
}

// ─── Fee Receipt View Dialog ─────────────────────────────────────────────────

function FeeReceiptViewDialog({
  open,
  onClose,
  record,
  pdfMeta,
}: {
  open: boolean;
  onClose: () => void;
  record: IFeeRecord | null;
  pdfMeta: PdfMeta;
}) {
  if (!record) return null;

  const handlePrint = () => {
    printFeePdf(record, pdfMeta).catch(() =>
      toast.error("Failed to print receipt")
    );
  };

  const handleDownload = () => {
    generateFeePdf(record, pdfMeta).catch(() =>
      toast.error("Failed to generate PDF")
    );
  };

  const igstAmt = record.igstAmount ?? 0;
  const addFees = record.additionalFees ?? [];
  const amountReceived =
    record.amountReceived ?? 0;
  const balance =
    record.balanceAmount ?? Math.max((record.totalAmount ?? 0) - amountReceived, 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto custom__scrollbar">
        <DialogHeader>
          <DialogTitle>Fee Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* UID + Form no */}
          <div className="bg-muted/40 rounded-lg p-3 grid grid-cols-2 gap-2 font-mono text-xs">
            <div>
              <span className="text-muted-foreground">Form No.</span>
              <p className="font-semibold">{record.formNo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Ack. No.</span>
              <p className="font-semibold">{record.acknowledgementNo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">UID</span>
              <p className="font-semibold">{record.uniqueIdentificationNo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Session</span>
              <p className="font-semibold">{record.academicSession ?? "—"}</p>
            </div>
          </div>

          {/* Student info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Student Name", record.studentName],
              ["Father's Name", record.fatherName],
              ["Mother's Name", record.motherName],
              ["Stream", record.streamName],
              ["Course", record.courseName],
              ["Course Code", record.courseCode],
              ["Center", record.center],
              ["Payment Mode", record.paymentMode],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
          </div>

          {/* Fee breakdown */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/40 px-3 py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
              Fee Particulars
            </div>
            <div className="divide-y">
              <div className="flex justify-between px-3 py-2">
                <span>Tuition Fees</span>
                <span className="font-medium">
                  ₹{(record.tuitionFees ?? 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>IGST @ {record.igstPercent ?? 18}%</span>
                <span className="font-medium">
                  ₹{igstAmt.toLocaleString("en-IN")}
                </span>
              </div>
              {addFees.map((f, i) => (
                <div key={i} className="flex justify-between px-3 py-2">
                  <span>{f.label}</span>
                  <span
                    className={
                      f.type === "deduction"
                        ? "text-red-500 font-medium"
                        : "font-medium"
                    }
                  >
                    {f.type === "deduction" ? "−" : "+"}₹
                    {(f.amount ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              {(record.discount ?? 0) > 0 && (
                <div className="flex justify-between px-3 py-2">
                  <span>Discount</span>
                  <span className="text-red-500 font-medium">
                    −₹{(record.discount ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between px-3 py-2.5 bg-primary/5 font-bold text-primary">
                <span>Total Amount</span>
                <span>₹{(record.totalAmount ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>Amount Received</span>
                <span className="font-medium">₹{amountReceived.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between px-3 py-2.5 bg-red-50 font-semibold text-red-600">
                <span>Balance</span>
                <span>₹{balance.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {record.amountInWords && (
            <p className="text-xs text-muted-foreground italic">
              {record.amountInWords}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <FileText className="size-4" />
            Download PDF
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── UID Detail View (records list under one UID) ────────────────────────────

function UidDetailView({
  uid,
  group,
  instituteId,
  pdfMeta,
  onBack,
}: {
  uid: string;
  group: FeeUidGroup;
  instituteId: string;
  pdfMeta: PdfMeta;
  onBack: () => void;
}) {
  const [records, setRecords] = useState<IFeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IFeeRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<IFeeRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const res = await getFeeRecords(instituteId, 1, "", undefined, uid);
    if (res.success) setRecords(res.data ?? []);
    else toast.error(res.message ?? "Failed to load records");
    setLoading(false);
  }, [instituteId, uid]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteFeeRecord(instituteId, deleteId);
    if (res.success) {
      toast.success("Record deleted");
      fetchRecords();
    } else {
      toast.error(res.message ?? "Failed to delete");
    }
    setDeleteLoading(false);
    setDeleteId(null);
  };

  const studentDefaults = {
    uniqueIdentificationNo: uid,
    studentName: group.studentName,
    fatherName: group.fatherName,
    streamName: group.streamName,
    academicSession: group.academicSession,
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "—";
  const getPaidAmount = (rec: IFeeRecord) =>
    rec.amountReceived ?? 0;
  const getBalanceAmount = (rec: IFeeRecord) =>
    rec.balanceAmount ?? Math.max((rec.totalAmount ?? 0) - getPaidAmount(rec), 0);
  const totalNet = records.reduce((s, r) => s + (r.totalAmount ?? 0), 0);
  const totalPaidAmount = records.reduce((s, r) => s + getPaidAmount(r), 0);
  const totalBalanceAmount = records.reduce((s, r) => s + getBalanceAmount(r), 0);

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">{group.studentName}</h2>
          <p className="text-xs text-muted-foreground font-mono">
            UID: {uid}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditRecord(null);
            setDialogOpen(true);
          }}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Add Another Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Receipts</p>
          <p className="text-2xl font-bold mt-1">{records.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Net Fee</p>
          <p className="text-2xl font-bold mt-1 text-primary">
            ₹{totalNet.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            ₹{totalPaidAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            ₹{totalBalanceAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Records Table (desktop/tablet) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto custom__scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form No.</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Net (₹)</TableHead>
                <TableHead className="text-right">Paid (₹)</TableHead>
                <TableHead className="text-right">Balance (₹)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No records yet.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow
                    key={rec._id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => setReceiptRecord(rec)}
                  >
                    <TableCell className="font-mono text-xs">
                      {rec.formNo}
                    </TableCell>
                    <TableCell>
                      <div>{rec.courseName ?? "—"}</div>
                      {rec.courseCode && (
                        <Badge variant="outline" className="text-xs mt-0.5">
                          {rec.courseCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rec.paymentMode ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      ₹{(rec.totalAmount ?? 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-green-600">
                      ₹{getPaidAmount(rec).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-red-600">
                      ₹{getBalanceAmount(rec).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(rec.paymentDate as unknown as string)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditRecord(rec);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Print"
                          onClick={(e) => {
                            e.stopPropagation();
                            printFeePdf(rec, pdfMeta).catch(() =>
                              toast.error("Failed to print")
                            );
                          }}
                        >
                          <Printer className="size-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(rec._id);
                          }}
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
      </div>

      {/* Records Cards (mobile) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border p-6 text-center text-muted-foreground">
            Loading…
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-muted-foreground">
            No records yet.
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-xl border p-3 shadow-sm"
              onClick={() => setReceiptRecord(rec)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {formatDate(rec.paymentDate as unknown as string)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    Form No: {rec.formNo}
                  </p>
                </div>
                <p className="font-semibold text-primary text-sm">
                  ₹{(rec.totalAmount ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="mt-2 text-sm">
                <p className="font-medium">{rec.courseName ?? "—"}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{rec.paymentMode ?? "—"}</p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <p className="text-green-600 font-medium">
                    Paid: ₹{getPaidAmount(rec).toLocaleString("en-IN")}
                  </p>
                  <p className="text-red-600 font-medium">
                    Balance: ₹{getBalanceAmount(rec).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit"
                  onClick={() => {
                    setEditRecord(rec);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Print"
                  onClick={() => {
                    printFeePdf(rec, pdfMeta).catch(() => toast.error("Failed to print"));
                  }}
                >
                  <Printer className="size-4 text-blue-600" />
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
            </div>
          ))
        )}
      </div>

      {/* Add/Edit dialog - UID locked, student details pre-filled */}
      <FeeRecordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        instituteId={instituteId}
        record={editRecord}
        onSuccess={fetchRecords}
        studentDefaults={studentDefaults}
        lockUid
      />

      {/* Receipt view dialog */}
      <FeeReceiptViewDialog
        open={!!receiptRecord}
        onClose={() => setReceiptRecord(null)}
        record={receiptRecord}
        pdfMeta={pdfMeta}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee record?</AlertDialogTitle>
            <AlertDialogDescription>
              This record will be soft-deleted and will no longer appear in the
              list.
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

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FeesPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";

  const [groups, setGroups] = useState<FeeUidGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedGroup, setSelectedGroup] = useState<FeeUidGroup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pdfMeta, setPdfMeta] = useState<PdfMeta>({ instituteName: "" });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

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
          docLogoUrl: inst.docLogo?.url || inst.logo?.url || "",
        });
      }
    });
  }, [instituteId]);

  const fetchGroups = useCallback(async () => {
    if (!instituteId) return;
    setLoading(true);
    const res = await getFeeUidGroups(instituteId, debouncedSearch);
    console.log("[FeeGroups] API response:", JSON.stringify(
      (res.data ?? []).map((g) => ({
        uid: g._id,
        totalPaid: g.totalPaid,
        totalAmountReceived: g.totalAmountReceived,
        totalBalance: g.totalBalance,
      }))
    ));
    if (res.success) setGroups(res.data ?? []);
    else toast.error(res.message ?? "Failed to load records");
    setLoading(false);
  }, [instituteId, debouncedSearch]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // If a UID is selected, show the detail view
  if (selectedGroup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <UidDetailView
          uid={selectedGroup._id}
          group={selectedGroup}
          instituteId={instituteId}
          pdfMeta={pdfMeta}
          onBack={() => {
            setSelectedGroup(null);
            fetchGroups();
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Fee Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {groups.length} student{groups.length !== 1 ? "s" : ""} with fee
            records
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Record
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Students</p>
            <p className="text-xl font-bold">{groups.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net Fee</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{groups.reduce((s, g) => s + (g.totalPaid ?? 0), 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-green-100 flex items-center justify-center">
            <IndianRupee className="size-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-xl font-bold text-green-600">
              ₹{groups.reduce((s, g) => s + (g.totalAmountReceived ?? 0), 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-red-100 flex items-center justify-center">
            <IndianRupee className="size-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Balance</p>
            <p className="text-xl font-bold text-red-500">
              ₹{groups.reduce((s, g) => s + (g.totalBalance ?? 0), 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name or UID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* UID Block Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <IndianRupee className="size-12 mx-auto mb-3 opacity-20" />
          <p className="text-base font-medium">No fee records yet.</p>
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-2 text-primary underline underline-offset-2 text-sm"
          >
            Add the first record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <UidCard
              key={g._id}
              group={g}
              onClick={() => setSelectedGroup(g)}
            />
          ))}
        </div>
      )}

      {/* Create record dialog */}
      <FeeRecordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        instituteId={instituteId}
        record={null}
        onSuccess={fetchGroups}
      />
    </div>
  );
}
