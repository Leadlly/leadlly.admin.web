"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import {
  createFeeRecord,
  updateFeeRecord,
  getFeeRecordsByUid,
  FeeRecordData,
  IFeeRecord,
  AdditionalFeeItem,
} from "@/actions/fee_actions";

const PAYMENT_MODES = [
  "Online Lumpsum Amount",
  "Cash",
  "Cheque",
  "DD",
  "NEFT/RTGS",
  "UPI",
  "Card",
];

// Generate academic session options: 4 years back → 2 years ahead
function generateSessionOptions(): string[] {
  const now = new Date();
  // Indian academic year starts in April; if current month < April use prev year as start
  const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const sessions: string[] = [];
  for (let y = currentYear - 4; y <= currentYear + 2; y++) {
    sessions.push(`${y}-${String(y + 1).slice(2)}`);
  }
  return sessions.reverse(); // most recent first
}

const SESSION_OPTIONS = generateSessionOptions();

interface Props {
  open: boolean;
  onClose: () => void;
  instituteId: string;
  record?: IFeeRecord | null;
  onSuccess: () => void;
  studentDefaults?: {
    uniqueIdentificationNo?: string;
    studentName: string;
    fatherName?: string;
    motherName?: string;
    streamName?: string;
    courseName?: string;
    courseCode?: string;
    center?: string;
    academicSession?: string;
    studentId?: string;
    // Session-level fee — pre-filled and locked for installments
    tuitionFees?: number;
    igstPercent?: number;
    discount?: number;
    nextInstallmentNo?: number;
    // Sum of all previous installments already paid (used for balance calculation)
    alreadyPaidTotal?: number;
  };
  lockUid?: boolean;
}

const EMPTY: FeeRecordData = {
  uniqueIdentificationNo: "",
  studentName: "",
  fatherName: "",
  motherName: "",
  streamName: "",
  courseName: "",
  courseCode: "",
  center: "",
  paymentMode: "Online Lumpsum Amount",
  tuitionFees: 0,
  amountReceived: 0,
  igstPercent: 18,
  discount: 0,
  additionalFees: [],
  amountInWords: "",
  paymentDate: new Date().toISOString().split("T")[0],
  academicSession: `${new Date().getFullYear()}-${String(
    new Date().getFullYear() + 1
  ).slice(2)}`,
};

const FeeRecordDialog = ({
  open,
  onClose,
  instituteId,
  record,
  onSuccess,
  studentDefaults,
  lockUid = false,
}: Props) => {
  const [form, setForm] = useState<FeeRecordData>(EMPTY);
  const [loading, setLoading] = useState(false);

  // ── UID + session lookup state ─────────────────────────────────────────────
  // Holds the records found for the current UID+session combination
  const [uidRecords, setUidRecords] = useState<IFeeRecord[]>([]);
  const [uidLookupState, setUidLookupState] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const uidDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Whether tuition fee is locked:
  // Only lock when records actually exist for the currently selected UID+session.
  // lockUid only prevents changing the UID input — fee editability depends solely on DB records.
  const hasUidRecords = uidRecords.length > 0;
  const isLookupLoading = uidLookupState === "loading";
  // While loading, treat as locked to avoid flash of editable fields
  const isFeeLocked = !record && (isLookupLoading || hasUidRecords);

  // Compute installment info from UID lookup (installmentNo 1 when no records yet)
  const nextInstallmentNo = hasUidRecords ? uidRecords.length + 1 : 1;
  const alreadyPaidTotal = hasUidRecords
    ? uidRecords.reduce((s, r) => s + (r.amountReceived ?? 0), 0)
    : 0;

  // ── Lookup helper ──────────────────────────────────────────────────────────
  const lookupUid = async (uid: string, session: string) => {
    if (!uid.trim()) return;
    setUidLookupState("loading");
    const res = await getFeeRecordsByUid(instituteId, uid.trim(), session);
    if (!res.success) {
      setUidLookupState("idle");
      return;
    }
    const found = res.data ?? [];
    setUidRecords(found);
    setUidLookupState(found.length > 0 ? "found" : "notfound");

    if (found.length > 0) {
      const first = found[0];
      // Pre-fill student details and session-level fees from the first record.
      // Never overwrite academicSession — always keep what the user selected.
      setForm((prev) => ({
        ...prev,
        studentName: first.studentName || prev.studentName,
        fatherName: first.fatherName ?? prev.fatherName,
        motherName: first.motherName ?? prev.motherName,
        streamName: first.streamName ?? prev.streamName,
        courseName: first.courseName ?? prev.courseName,
        courseCode: first.courseCode ?? prev.courseCode,
        center: first.center ?? prev.center,
        // academicSession intentionally NOT overwritten — user controls it
        tuitionFees: first.tuitionFees ?? prev.tuitionFees,
        igstPercent: first.igstPercent ?? prev.igstPercent,
        discount: first.discount ?? prev.discount,
        additionalFees: first.additionalFees ?? prev.additionalFees,
        amountReceived: 0,
      }));
    } else {
      // No records for this UID+session — reset fee fields so teacher fills fresh.
      // Keep student identity fields and academicSession as-is.
      setForm((prev) => ({
        ...prev,
        tuitionFees: 0,
        igstPercent: 18,
        discount: 0,
        additionalFees: [],
        amountReceived: 0,
      }));
    }
  };

  // Debounced UID trigger
  const onUidChange = (val: string) => {
    set("uniqueIdentificationNo", val);
    // Reset lookup state immediately when UID changes
    setUidRecords([]);
    setUidLookupState("idle");
    if (uidDebounceRef.current) clearTimeout(uidDebounceRef.current);
    if (!val.trim()) return;
    uidDebounceRef.current = setTimeout(() => {
      lookupUid(val, form.academicSession ?? EMPTY.academicSession!);
    }, 600);
  };

  // When session changes, re-lookup for this UID+session
  const onSessionChange = (val: string) => {
    set("academicSession", val);
    if (form.uniqueIdentificationNo.trim()) {
      setUidRecords([]);
      setUidLookupState("loading");
      lookupUid(form.uniqueIdentificationNo, val);
    }
  };

  useEffect(() => {
    if (record) {
      setForm({
        uniqueIdentificationNo: record.uniqueIdentificationNo ?? "",
        studentName: record.studentName,
        fatherName: record.fatherName ?? "",
        motherName: record.motherName ?? "",
        streamName: record.streamName ?? "",
        courseName: record.courseName ?? "",
        courseCode: record.courseCode ?? "",
        center: record.center ?? "",
        paymentMode: record.paymentMode ?? "Online Lumpsum Amount",
        tuitionFees: record.tuitionFees,
        amountReceived: record.amountReceived ?? 0,
        igstPercent: record.igstPercent ?? 18,
        discount: record.discount ?? 0,
        additionalFees: record.additionalFees ?? [],
        amountInWords: record.amountInWords ?? "",
        paymentDate: record.paymentDate
          ? record.paymentDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        academicSession: record.academicSession ?? EMPTY.academicSession,
        studentId: record.studentId ?? studentDefaults?.studentId,
      });
      setUidRecords([]);
      setUidLookupState("idle");
    } else {
      // Default to current academic session regardless of what session the group is in
      const currentSession = EMPTY.academicSession!;
      const uid = studentDefaults?.uniqueIdentificationNo ?? "";
      setForm({
        ...EMPTY,
        uniqueIdentificationNo: uid,
        studentName: studentDefaults?.studentName ?? "",
        fatherName: studentDefaults?.fatherName ?? "",
        motherName: studentDefaults?.motherName ?? "",
        streamName: studentDefaults?.streamName ?? "",
        courseName: studentDefaults?.courseName ?? "",
        courseCode: studentDefaults?.courseCode ?? "",
        center: studentDefaults?.center ?? "",
        academicSession: currentSession,
        studentId: studentDefaults?.studentId,
        tuitionFees: 0,
        igstPercent: 18,
        discount: 0,
        amountReceived: 0,
      });
      setUidRecords([]);
      setUidLookupState("idle");
      // When opening from UidDetailView (lockUid), auto-lookup the UID in current session
      if (lockUid && uid) {
        lookupUid(uid, currentSession);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, open]);

  const set = (key: keyof FeeRecordData, value: string | number | AdditionalFeeItem[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addExtraFeeRow = () => {
    if ((form.additionalFees ?? []).length >= 4) {
      toast.error("Maximum 4 additional fee rows allowed");
      return;
    }
    setForm((prev) => ({
      ...prev,
      additionalFees: [
        ...(prev.additionalFees ?? []),
        { label: "", amount: 0, type: "addition" },
      ],
    }));
  };

  const updateExtraFee = (
    idx: number,
    field: keyof AdditionalFeeItem,
    value: string | number
  ) =>
    setForm((prev) => {
      const rows = [...(prev.additionalFees ?? [])];
      rows[idx] = { ...rows[idx], [field]: value } as AdditionalFeeItem;
      return { ...prev, additionalFees: rows };
    });

  const removeExtraFee = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      additionalFees: (prev.additionalFees ?? []).filter((_, i) => i !== idx),
    }));

  // Live computed preview
  const tuition = Number(form.tuitionFees) || 0;
  const igstPct = Number(form.igstPercent) || 0;
  const igstAmt = Math.round((tuition * igstPct) / 100);
  const discountAmt = Number(form.discount) || 0;
  const amountReceived = Number(form.amountReceived) || 0;
  const additionsTotal = (form.additionalFees ?? [])
    .filter((f) => f.type === "addition")
    .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const deductionsTotal = (form.additionalFees ?? [])
    .filter((f) => f.type === "deduction")
    .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const sessionNetFee = tuition + igstAmt + additionsTotal - deductionsTotal - discountAmt;

  // For installments: remaining balance before this payment = sessionNetFee - already paid
  const alreadyPaid = isFeeLocked ? alreadyPaidTotal : 0;
  const remainingBeforeThis = isFeeLocked
    ? Math.max(sessionNetFee - alreadyPaid, 0)
    : sessionNetFee;
  const balance = Math.max(remainingBeforeThis - amountReceived, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.uniqueIdentificationNo.trim()) {
      toast.error("Unique Identification Number is required");
      return;
    }
    if (!form.studentName.trim()) {
      toast.error("Student name is required");
      return;
    }
    if (!form.tuitionFees || Number(form.tuitionFees) < 0) {
      toast.error("Please enter a valid tuition fee amount");
      return;
    }
    setLoading(true);
    try {
      const payload: FeeRecordData = {
        ...form,
        tuitionFees: Number(form.tuitionFees),
        amountReceived: Number(form.amountReceived) || 0,
        igstPercent: Number(form.igstPercent),
        discount: Number(form.discount) || 0,
        additionalFees: (form.additionalFees ?? []).map((f) => ({
          ...f,
          amount: Number(f.amount) || 0,
        })),
      };
      const res = record
        ? await updateFeeRecord(instituteId, record._id, payload)
        : await createFeeRecord(instituteId, payload);

      if (res.success) {
        toast.success(record ? "Record updated" : "Record created");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[95dvh] overflow-y-auto custom__scrollbar">
        <DialogHeader>
          <DialogTitle>
            {record
              ? `Edit Fee Record — Installment ${record.installmentNo ?? 1}`
              : hasUidRecords
              ? `Add Installment ${nextInstallmentNo}`
              : "New Fee Record"}
          </DialogTitle>
          {hasUidRecords && (
            <p className="text-xs text-muted-foreground mt-1">
              Session fees pre-filled from existing records. Change session to load fees for a different year.
            </p>
          )}
          {uidLookupState === "notfound" && (lockUid || form.uniqueIdentificationNo.trim()) && (
            <p className="text-xs text-muted-foreground mt-1">
              No records found for this session — enter fee details for a fresh entry.
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Unique ID - mandatory */}
          <div className="space-y-1">
            <Label>
              Unique Identification Number{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. UID-2024-001"
              value={form.uniqueIdentificationNo}
              onChange={(e) => onUidChange(e.target.value)}
              disabled={lockUid}
              className={lockUid ? "bg-muted text-muted-foreground" : ""}
            />
            {/* Lookup status indicator */}
            {!lockUid && form.uniqueIdentificationNo.trim() && (
              <div className="flex items-center gap-1.5 text-xs">
                {uidLookupState === "loading" && (
                  <>
                    <Loader2 className="size-3 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Looking up UID…</span>
                  </>
                )}
                {uidLookupState === "found" && (
                  <>
                    <CheckCircle2 className="size-3 text-green-600" />
                    <span className="text-green-700 font-medium">
                      {uidRecords.length} existing record{uidRecords.length > 1 ? "s" : ""} found —
                      student details &amp; session fees pre-filled.{" "}
                      {hasUidRecords && `Next installment: #${nextInstallmentNo}`}
                    </span>
                  </>
                )}
                {uidLookupState === "notfound" && (
                  <span className="text-muted-foreground">
                    No records found for this UID — creating a new entry.
                  </span>
                )}
              </div>
            )}
            {uidLookupState === "idle" && !lockUid && (
              <p className="text-xs text-muted-foreground">
                Used to group all fee records for the same student
              </p>
            )}
          </div>

          {/* Academic Session + Payment Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Academic Session</Label>
              <Select
                value={form.academicSession ?? ""}
                onValueChange={onSessionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={form.paymentDate}
                onChange={(e) => set("paymentDate", e.target.value)}
              />
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>
                Student Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Full name"
                value={form.studentName}
                onChange={(e) => set("studentName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Father&apos;s Name</Label>
              <Input
                placeholder="Father's name"
                value={form.fatherName}
                onChange={(e) => set("fatherName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Stream</Label>
              <Input
                placeholder="e.g. JEE (Main + Advanced)"
                value={form.streamName}
                onChange={(e) => set("streamName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Course Name</Label>
              <Input
                placeholder="e.g. Leader Test Series"
                value={form.courseName}
                onChange={(e) => set("courseName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Course Code</Label>
              <Input
                placeholder="e.g. 161153"
                value={form.courseCode}
                onChange={(e) => set("courseCode", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Payment Mode</Label>
              <Select
                value={form.paymentMode}
                onValueChange={(v) => set("paymentMode", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_MODES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fee Section */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <p className="font-semibold text-sm">Fee Details</p>

            {/* Base tuition + IGST */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>
                  Tuition Fees (₹) <span className="text-destructive">*</span>
                  {isFeeLocked && (
                    <span className="ml-1 text-xs text-muted-foreground font-normal">(session fee)</span>
                  )}
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.tuitionFees === 0 ? "" : form.tuitionFees}
                  onChange={(e) => set("tuitionFees", e.target.value)}
                  disabled={isFeeLocked}
                  className={isFeeLocked ? "bg-muted text-muted-foreground" : ""}
                />
              </div>
              <div className="space-y-1">
                <Label>IGST (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.igstPercent}
                  onChange={(e) => set("igstPercent", e.target.value)}
                  disabled={isFeeLocked}
                  className={isFeeLocked ? "bg-muted text-muted-foreground" : ""}
                />
              </div>
            </div>

            {/* Discount + Installment payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.discount === 0 ? "" : form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                  disabled={isFeeLocked}
                  className={isFeeLocked ? "bg-muted text-muted-foreground" : ""}
                />
              </div>
              <div className="space-y-1">
                <Label>
                  {isFeeLocked
                    ? `Installment ${nextInstallmentNo} Amount (₹)`
                    : "Paid Fee / Amount Received (₹)"}
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.amountReceived === 0 ? "" : form.amountReceived}
                  onChange={(e) => set("amountReceived", e.target.value)}
                />
                {isFeeLocked && (
                  <p className="text-xs text-muted-foreground">
                    Enter only the amount paid in this installment
                  </p>
                )}
              </div>
            </div>

            {/* Additional fee rows */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Additional / Other Charges
                </p>
                {(form.additionalFees ?? []).length < 4 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addExtraFeeRow}
                    className="gap-1 h-7 text-xs"
                  >
                    <Plus className="size-3" /> Add Row
                  </Button>
                )}
              </div>
              {(form.additionalFees ?? []).map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    className="flex-1 min-w-0"
                    placeholder="Label"
                    value={row.label}
                    onChange={(e) => updateExtraFee(idx, "label", e.target.value)}
                  />
                  <Select
                    value={row.type}
                    onValueChange={(v) =>
                      updateExtraFee(idx, "type", v as "addition" | "deduction")
                    }
                  >
                    <SelectTrigger className="w-24 sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition (+)</SelectItem>
                      <SelectItem value="deduction">Deduction (−)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    className="w-20 sm:w-28"
                    placeholder="0"
                    value={row.amount === 0 ? "" : row.amount}
                    onChange={(e) => updateExtraFee(idx, "amount", Number(e.target.value))}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeExtraFee(idx)}
                    className="shrink-0 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Live summary */}
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tuition Fees</span>
                <span className="font-medium">₹{tuition.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>IGST @ {form.igstPercent}%</span>
                <span className="font-medium">₹{igstAmt.toLocaleString("en-IN")}</span>
              </div>
              {(form.additionalFees ?? []).map((f, i) =>
                f.label ? (
                  <div key={i} className="flex justify-between text-muted-foreground">
                    <span>{f.label}</span>
                    <span className={f.type === "deduction" ? "text-red-500 font-medium" : "font-medium"}>
                      {f.type === "deduction" ? "−" : "+"}₹
                      {(Number(f.amount) || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : null
              )}
              {discountAmt > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="text-red-500 font-medium">
                    −₹{discountAmt.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-1 mt-1 text-primary text-base">
                <span>Session Net Fee</span>
                <span>₹{sessionNetFee.toLocaleString("en-IN")}</span>
              </div>

              {/* Installment breakdown — only shown when adding subsequent installments */}
              {isFeeLocked && alreadyPaid > 0 && (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Previously Paid
                      {nextInstallmentNo > 2
                        ? ` (Installments 1–${nextInstallmentNo - 1})`
                        : " (Installment 1)"}
                    </span>
                    <span className="text-green-600 font-medium">
                      −₹{alreadyPaid.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground border-b pb-1">
                    <span>Remaining Balance</span>
                    <span className="font-medium text-orange-500">
                      ₹{remainingBeforeThis.toLocaleString("en-IN")}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>
                  {isFeeLocked
                    ? `Installment ${nextInstallmentNo} Amount`
                    : "Amount Received"}
                </span>
                <span className="font-medium text-green-600">
                  −₹{amountReceived.toLocaleString("en-IN")}
                </span>
              </div>
              <div className={`flex justify-between font-semibold border-t pt-1 mt-1 ${balance === 0 ? "text-green-600" : ""}`}>
                <span>Balance After This Payment</span>
                <span className={balance === 0 ? "text-green-600" : "text-red-500"}>
                  ₹{balance.toLocaleString("en-IN")}
                  {balance === 0 && " ✓"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Amount in Words</Label>
            <Input
              placeholder="e.g. Twelve Thousand Five Hundred Only"
              value={form.amountInWords}
              onChange={(e) => set("amountInWords", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : record ? "Update Record" : "Create Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeeRecordDialog;
