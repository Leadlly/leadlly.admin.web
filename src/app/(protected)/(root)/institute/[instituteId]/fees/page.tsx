"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  X,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import {
  getFeeRecords,
  getFeeUidGroups,
  deleteFeeRecord,
  IFeeRecord,
  FeeUidGroup,
} from "@/actions/fee_actions";
import { getActiveInstitute } from "@/actions/institute_actions";
import { logger } from "@/lib/logger";
import FeeRecordDialog from "./_components/FeeRecordDialog";
import { generateFeePdf, printFeePdf, PdfMeta, InstallmentContext } from "./_components/FeePdfGenerator";

function formatRupee(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function displayRupee(value: number, amountsVisible: boolean): string {
  if (amountsVisible) return formatRupee(value);
  return formatRupee(value).replace(/\d/g, "•");
}

function FeeAmountsToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2 shrink-0"
    >
      {visible ? (
        <EyeOff className="size-4" aria-hidden />
      ) : (
        <Eye className="size-4" aria-hidden />
      )}
      {visible ? "Hide fee amounts" : "Show fee amounts"}
    </Button>
  );
}

// ─── UID Block Card ──────────────────────────────────────────────────────────

function UidCard({
  group,
  onClick,
  amountsVisible,
}: {
  group: FeeUidGroup;
  onClick: () => void;
  amountsVisible: boolean;
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
      <div className="flex flex-col items-end gap-1 shrink-0 tabular-nums">
        <span className="text-sm font-bold text-primary">
          {displayRupee(group.totalPaid ?? 0, amountsVisible)}
        </span>
        <span className="text-xs text-green-600 font-medium">
          Paid: {displayRupee(group.totalAmountReceived ?? 0, amountsVisible)}
        </span>
        <span className="text-xs text-red-500 font-medium">
          Balance: {displayRupee(group.totalBalance ?? 0, amountsVisible)}
        </span>
        <Badge variant="secondary" className="text-xs">
          {group.recordCount} installment{group.recordCount !== 1 ? "s" : ""}
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
  installmentContext,
  amountsVisible,
}: {
  open: boolean;
  onClose: () => void;
  record: IFeeRecord | null;
  pdfMeta: PdfMeta;
  installmentContext?: InstallmentContext;
  amountsVisible: boolean;
}) {
  if (!record) return null;

  const handlePrint = () => {
    printFeePdf(record, pdfMeta, installmentContext).catch(() =>
      toast.error("Failed to print receipt")
    );
  };

  const handleDownload = () => {
    generateFeePdf(record, pdfMeta, installmentContext).catch(() =>
      toast.error("Failed to generate PDF")
    );
  };

  const igstAmt = record.igstAmount ?? 0;
  const addFees = record.additionalFees ?? [];
  const amountReceived = record.amountReceived ?? 0;
  const sessionNetFee = installmentContext?.sessionNetFee ?? (record.totalAmount ?? 0);
  const alreadyPaid = installmentContext ? installmentContext.alreadyPaidTotal : 0;
  const balance = Math.max(sessionNetFee - alreadyPaid - amountReceived, 0);

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
            <div className="col-span-2">
              <span className="text-muted-foreground">Installment</span>
              <p className="font-semibold">#{record.installmentNo ?? 1}</p>
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
                <span className="font-medium tabular-nums">
                  {displayRupee(record.tuitionFees ?? 0, amountsVisible)}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>IGST @ {record.igstPercent ?? 18}%</span>
                <span className="font-medium tabular-nums">
                  {displayRupee(igstAmt, amountsVisible)}
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
                    {f.type === "deduction" ? "−" : "+"}
                    {displayRupee(f.amount ?? 0, amountsVisible)}
                  </span>
                </div>
              ))}
              {(record.discount ?? 0) > 0 && (
                <div className="flex justify-between px-3 py-2">
                  <span>Discount</span>
                  <span className="text-red-500 font-medium tabular-nums">
                    −{displayRupee(record.discount ?? 0, amountsVisible)}
                  </span>
                </div>
              )}
              <div className="flex justify-between px-3 py-2.5 bg-primary/5 font-bold text-primary">
                <span>Session Net Fee</span>
                <span className="tabular-nums">{displayRupee(sessionNetFee, amountsVisible)}</span>
              </div>
              {(installmentContext?.previousInstallments ?? []).map((inst) => (
                <div key={inst.no} className="flex justify-between px-3 py-2 text-muted-foreground">
                  <span>Installment {inst.no}</span>
                  <span className="font-medium text-green-600 tabular-nums">
                    {displayRupee(inst.amount, amountsVisible)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2">
                <span>Installment {record.installmentNo ?? 1}</span>
                <span className="font-medium text-green-600 tabular-nums">
                  {displayRupee(amountReceived, amountsVisible)}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2.5 bg-red-50 font-semibold text-red-600">
                <span>Balance Due</span>
                <span className="tabular-nums">{displayRupee(balance, amountsVisible)}</span>
              </div>
            </div>
          </div>

          {record.amountInWords && (
            <p className="text-xs text-muted-foreground italic">
              {amountsVisible
                ? record.amountInWords
                : "•".repeat(Math.min(record.amountInWords.length, 24))}
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
  amountsVisible,
  onToggleAmounts,
}: {
  uid: string;
  group: FeeUidGroup;
  instituteId: string;
  pdfMeta: PdfMeta;
  onBack: () => void;
  amountsVisible: boolean;
  onToggleAmounts: () => void;
}) {
  const [records, setRecords] = useState<IFeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IFeeRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<IFeeRecord | null>(null);
  const [receiptContext, setReceiptContext] = useState<InstallmentContext | undefined>();
  const [sessionFilter, setSessionFilter] = useState<string>("all");

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

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "—";
  const getPaidAmount = (rec: IFeeRecord) =>
    rec.amountReceived ?? 0;

  // ── Session-aware stats ─────────────────────────────────────────────────────
  // Group records by academicSession; net fee per session = totalAmount of installmentNo=1
  const sessionGroups = useMemo(() => {
    const map = new Map<string, IFeeRecord[]>();
    for (const r of records) {
      const s = r.academicSession ?? "Unknown";
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(r);
    }
    // Sort each group by installmentNo asc
    map.forEach((recs, key) =>
      map.set(key, [...recs].sort((a, b) => (a.installmentNo ?? 1) - (b.installmentNo ?? 1)))
    );
    return map;
  }, [records]);

  // Total net = sum of each session's first installment totalAmount
  const totalNetFee = useMemo(() => {
    let sum = 0;
    sessionGroups.forEach((recs) => {
      sum += recs[0]?.totalAmount ?? 0;
    });
    return sum;
  }, [sessionGroups]);

  const totalPaidAmount = records.reduce((s, r) => s + getPaidAmount(r), 0);
  const totalBalanceAmount = Math.max(totalNetFee - totalPaidAmount, 0);

  // Unique sessions for filter dropdown
  const availableSessions = useMemo(
    () => Array.from(sessionGroups.keys()).sort((a, b) => b.localeCompare(a)),
    [sessionGroups]
  );

  // Records shown in the table (filtered by selected session)
  const filteredRecords = useMemo(
    () => sessionFilter === "all" ? records : records.filter((r) => r.academicSession === sessionFilter),
    [records, sessionFilter]
  );

  const studentDefaults = {
    uniqueIdentificationNo: uid,
    studentName: group.studentName,
    fatherName: group.fatherName,
    streamName: group.streamName,
    academicSession: group.academicSession,
    tuitionFees: group.sessionTuitionFees,
    igstPercent: group.sessionIgstPercent,
    discount: group.sessionDiscount,
    nextInstallmentNo: records.length + 1,
    alreadyPaidTotal: totalPaidAmount,
  };

  // Build InstallmentContext scoped to the SAME session as the record
  const getInstallmentContext = (rec: IFeeRecord): InstallmentContext => {
    const recSession = rec.academicSession ?? "";
    const sessionRecs = (sessionGroups.get(recSession) ?? [...records])
      .sort((a, b) => (a.installmentNo ?? 1) - (b.installmentNo ?? 1));
    const sessionNetFee = sessionRecs[0]?.totalAmount ?? 0;
    const thisNo = rec.installmentNo ?? 1;
    const previous = sessionRecs.filter((r) => (r.installmentNo ?? 1) < thisNo);
    const alreadyPaidTotal = previous.reduce((s, r) => s + (r.amountReceived ?? 0), 0);
    const previousInstallments = previous.map((r) => ({
      no: r.installmentNo ?? 1,
      amount: r.amountReceived ?? 0,
    }));
    return { installmentNo: thisNo, sessionNetFee, alreadyPaidTotal, previousInstallments };
  };

  // Balance for a record = session net fee minus all payments up to and including this installment
  const getBalanceAmount = (rec: IFeeRecord) => {
    const ctx = getInstallmentContext(rec);
    return Math.max(ctx.sessionNetFee - ctx.alreadyPaidTotal - (rec.amountReceived ?? 0), 0);
  };

  const openReceipt = (rec: IFeeRecord) => {
    setReceiptRecord(rec);
    setReceiptContext(getInstallmentContext(rec));
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 -ml-2 w-fit"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <FeeAmountsToggle visible={amountsVisible} onToggle={onToggleAmounts} />
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
          Add Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Installments</p>
          <p className="text-2xl font-bold mt-1">{records.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Net Fee</p>
          <p className="text-2xl font-bold mt-1 text-primary tabular-nums">
            {displayRupee(totalNetFee, amountsVisible)}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-bold mt-1 text-green-600 tabular-nums">
            {displayRupee(totalPaidAmount, amountsVisible)}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold mt-1 text-red-600 tabular-nums">
            {displayRupee(totalBalanceAmount, amountsVisible)}
          </p>
        </div>
      </div>

      {/* Session filter */}
      {availableSessions.length > 1 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-muted-foreground">Filter by session:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSessionFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                sessionFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              All Sessions
            </button>
            {availableSessions.map((s) => (
              <button
                key={s}
                onClick={() => setSessionFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  sessionFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Records Table (desktop/tablet) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto custom__scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Installment</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Amount Paid (₹)</TableHead>
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
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No records for this session.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((rec) => (
                  <TableRow
                    key={rec._id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => openReceipt(rec)}
                  >
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary rounded-full px-2 py-0.5">
                        #{rec.installmentNo ?? 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {rec.academicSession ?? "—"}
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
                    <TableCell className="text-right font-semibold tabular-nums text-green-600">
                      {displayRupee(getPaidAmount(rec), amountsVisible)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-red-600">
                      {displayRupee(getBalanceAmount(rec), amountsVisible)}
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
                            printFeePdf(rec, pdfMeta, getInstallmentContext(rec)).catch(() =>
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
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-muted-foreground">
            No records for this session.
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-xl border p-3 shadow-sm"
              onClick={() => openReceipt(rec)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="inline-flex items-center text-xs font-semibold bg-primary/10 text-primary rounded-full px-2 py-0.5 shrink-0">
                    #{rec.installmentNo ?? 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {formatDate(rec.paymentDate as unknown as string)}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      Form No: {rec.formNo}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-green-600 text-sm tabular-nums">
                  {displayRupee(getPaidAmount(rec), amountsVisible)}
                </p>
              </div>
              <div className="mt-2 text-sm">
                <p className="font-medium">{rec.courseName ?? "—"}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{rec.paymentMode ?? "—"}</p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <p className="text-green-600 font-medium tabular-nums">
                    Paid: {displayRupee(getPaidAmount(rec), amountsVisible)}
                  </p>
                  <p className="text-red-600 font-medium tabular-nums">
                    Balance: {displayRupee(getBalanceAmount(rec), amountsVisible)}
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
                    printFeePdf(rec, pdfMeta, getInstallmentContext(rec)).catch(() => toast.error("Failed to print"));
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
        onClose={() => { setReceiptRecord(null); setReceiptContext(undefined); }}
        record={receiptRecord}
        pdfMeta={pdfMeta}
        installmentContext={receiptContext}
        amountsVisible={amountsVisible}
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
  const [feeAmountsVisible, setFeeAmountsVisible] = useState(false);

  // ── Filters ─────────────────────────────────────────────────────────────────
  const [filterSession, setFilterSession] = useState<string>("All");
  const [filterStream, setFilterStream] = useState<string>("All");
  const [filterPending, setFilterPending] = useState(false);

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
    logger.debug("Fee groups API response", {
      groups: (res.data ?? []).map((g) => ({
        uid: g._id,
        totalPaid: g.totalPaid,
        totalAmountReceived: g.totalAmountReceived,
        totalBalance: g.totalBalance,
      })),
    });
    if (res.success) setGroups(res.data ?? []);
    else toast.error(res.message ?? "Failed to load records");
    setLoading(false);
  }, [instituteId, debouncedSearch]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // ── Derived filter options ──────────────────────────────────────────────────
  const allSessions = useMemo(() => {
    const s = new Set<string>();
    groups.forEach((g) => { if (g.academicSession) s.add(g.academicSession); });
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [groups]);

  const allStreams = useMemo(() => {
    const s = new Set<string>();
    groups.forEach((g) => { if (g.streamName) s.add(g.streamName); });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (filterSession !== "All" && g.academicSession !== filterSession) return false;
      if (filterStream !== "All" && g.streamName !== filterStream) return false;
      if (filterPending && (g.totalBalance ?? 0) <= 0) return false;
      return true;
    });
  }, [groups, filterSession, filterStream, filterPending]);

  const hasActiveFilters = filterSession !== "All" || filterStream !== "All" || filterPending;

  // ── Stats for currently filtered set ───────────────────────────────────────
  const filteredNetTotal    = filteredGroups.reduce((s, g) => s + (g.totalPaid ?? 0), 0);
  const filteredPaidTotal   = filteredGroups.reduce((s, g) => s + (g.totalAmountReceived ?? 0), 0);
  const filteredBalanceTotal = filteredGroups.reduce((s, g) => s + (g.totalBalance ?? 0), 0);

  // If a UID is selected, show the detail view
  if (selectedGroup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <UidDetailView
          uid={selectedGroup._id}
          group={selectedGroup}
          instituteId={instituteId}
          pdfMeta={pdfMeta}
          amountsVisible={feeAmountsVisible}
          onToggleAmounts={() => setFeeAmountsVisible((v) => !v)}
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
            {hasActiveFilters
              ? `${filteredGroups.length} of ${groups.length} student${groups.length !== 1 ? "s" : ""}`
              : `${groups.length} student${groups.length !== 1 ? "s" : ""} with fee records`}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Record
        </Button>
      </div>

      <div className="mb-4">
        <FeeAmountsToggle
          visible={feeAmountsVisible}
          onToggle={() => setFeeAmountsVisible((v) => !v)}
        />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Students</p>
            <p className="text-xl font-bold">{filteredGroups.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Net</p>
            <p className="text-xl font-bold text-blue-600 tabular-nums">
              {displayRupee(filteredNetTotal, feeAmountsVisible)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-green-100 flex items-center justify-center">
            <IndianRupee className="size-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-xl font-bold text-green-600 tabular-nums">
              {displayRupee(filteredPaidTotal, feeAmountsVisible)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-red-100 flex items-center justify-center">
            <IndianRupee className="size-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Balance</p>
            <p className="text-xl font-bold text-red-500 tabular-nums">
              {displayRupee(filteredBalanceTotal, feeAmountsVisible)}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or UID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Academic Session filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 h-8 text-xs ${filterSession !== "All" ? "border-primary text-primary bg-primary/5" : ""}`}
              >
                {filterSession === "All" ? "Academic Session" : filterSession}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                className={filterSession === "All" ? "font-semibold text-primary" : ""}
                onClick={() => setFilterSession("All")}
              >
                All Sessions
              </DropdownMenuItem>
              {allSessions.map((s) => (
                <DropdownMenuItem
                  key={s}
                  className={filterSession === s ? "font-semibold text-primary" : ""}
                  onClick={() => setFilterSession(s)}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Stream / Class filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 h-8 text-xs ${filterStream !== "All" ? "border-primary text-primary bg-primary/5" : ""}`}
              >
                {filterStream === "All" ? "Class / Stream" : filterStream}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                className={filterStream === "All" ? "font-semibold text-primary" : ""}
                onClick={() => setFilterStream("All")}
              >
                All Classes
              </DropdownMenuItem>
              {allStreams.map((s) => (
                <DropdownMenuItem
                  key={s}
                  className={filterStream === s ? "font-semibold text-primary" : ""}
                  onClick={() => setFilterStream(s)}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pending fees toggle */}
          <Button
            variant="outline"
            size="sm"
            className={`gap-1.5 h-8 text-xs ${filterPending ? "border-red-500 text-red-600 bg-red-50" : ""}`}
            onClick={() => setFilterPending((v) => !v)}
          >
            <IndianRupee className="size-3" />
            Pending Fees
          </Button>

          {/* Clear all */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setFilterSession("All");
                setFilterStream("All");
                setFilterPending(false);
              }}
            >
              <X className="size-3" />
              Clear filters
            </Button>
          )}
        </div>
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
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <IndianRupee className="size-12 mx-auto mb-3 opacity-20" />
          {hasActiveFilters ? (
            <>
              <p className="text-base font-medium">No students match the selected filters.</p>
              <button
                onClick={() => { setFilterSession("All"); setFilterStream("All"); setFilterPending(false); }}
                className="mt-2 text-primary underline underline-offset-2 text-sm"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="text-base font-medium">No fee records yet.</p>
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-2 text-primary underline underline-offset-2 text-sm"
              >
                Add the first record
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((g) => (
            <UidCard
              key={g._id}
              group={g}
              amountsVisible={feeAmountsVisible}
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
