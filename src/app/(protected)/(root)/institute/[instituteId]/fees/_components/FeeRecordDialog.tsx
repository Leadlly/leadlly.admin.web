"use client";

import React, { useEffect, useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import {
  createFeeRecord,
  updateFeeRecord,
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
    } else {
      setForm({
        ...EMPTY,
        uniqueIdentificationNo: studentDefaults?.uniqueIdentificationNo ?? "",
        studentName: studentDefaults?.studentName ?? "",
        fatherName: studentDefaults?.fatherName ?? "",
        motherName: studentDefaults?.motherName ?? "",
        streamName: studentDefaults?.streamName ?? "",
        courseName: studentDefaults?.courseName ?? "",
        courseCode: studentDefaults?.courseCode ?? "",
        center: studentDefaults?.center ?? "",
        academicSession: studentDefaults?.academicSession ?? EMPTY.academicSession,
        studentId: studentDefaults?.studentId,
      });
    }
  }, [record, open, studentDefaults]);

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
  const additionsTotal = (form.additionalFees ?? [])
    .filter((f) => f.type === "addition")
    .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const deductionsTotal = (form.additionalFees ?? [])
    .filter((f) => f.type === "deduction")
    .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const total = tuition + igstAmt + additionsTotal - deductionsTotal - discountAmt;

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
            {record ? "Edit Fee Record" : "New Fee Record"}
          </DialogTitle>
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
              onChange={(e) => set("uniqueIdentificationNo", e.target.value)}
              disabled={lockUid}
              className={lockUid ? "bg-muted text-muted-foreground" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Used to group all fee records for the same student
            </p>
          </div>

          {/* Academic Session + Payment Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Academic Session</Label>
              <Input
                placeholder="2024-25"
                value={form.academicSession}
                onChange={(e) => set("academicSession", e.target.value)}
              />
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
              <Label>Mother&apos;s Name</Label>
              <Input
                placeholder="Mother's name"
                value={form.motherName}
                onChange={(e) => set("motherName", e.target.value)}
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
              <Label>Center</Label>
              <Input
                placeholder="e.g. Distance Learning"
                value={form.center}
                onChange={(e) => set("center", e.target.value)}
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
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.tuitionFees === 0 ? "" : form.tuitionFees}
                  onChange={(e) => set("tuitionFees", e.target.value)}
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
                />
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-1 max-w-xs">
              <Label>Discount (₹)</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.discount === 0 ? "" : form.discount}
                onChange={(e) => set("discount", e.target.value)}
              />
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
                    className="flex-1"
                    placeholder="Label (e.g. Admission Fee)"
                    value={row.label}
                    onChange={(e) => updateExtraFee(idx, "label", e.target.value)}
                  />
                  <Select
                    value={row.type}
                    onValueChange={(v) =>
                      updateExtraFee(idx, "type", v as "addition" | "deduction")
                    }
                  >
                    <SelectTrigger className="w-32">
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
                    className="w-28"
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
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
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
