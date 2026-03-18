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
import {
  createFeeRecord,
  updateFeeRecord,
  FeeRecordData,
  IFeeRecord,
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
    studentName: string;
    fatherName?: string;
    studentId?: string;
  };
}

const EMPTY: FeeRecordData = {
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
}: Props) => {
  const [form, setForm] = useState<FeeRecordData>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({
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
        studentName: studentDefaults?.studentName ?? "",
        fatherName: studentDefaults?.fatherName ?? "",
        studentId: studentDefaults?.studentId,
      });
    }
  }, [record, open, studentDefaults]);

  const set = (key: keyof FeeRecordData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Live computed preview
  const igstAmt = Math.round((Number(form.tuitionFees) * Number(form.igstPercent)) / 100);
  const total = Number(form.tuitionFees) + igstAmt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      toast.error("Student name is required");
      return;
    }
    if (!form.tuitionFees || Number(form.tuitionFees) <= 0) {
      toast.error("Please enter a valid tuition fee amount");
      return;
    }
    setLoading(true);
    try {
      const payload: FeeRecordData = {
        ...form,
        tuitionFees: Number(form.tuitionFees),
        igstPercent: Number(form.igstPercent),
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
          {/* Academic Session */}
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
          <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <p className="font-semibold text-sm">Fee Details</p>
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
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Tuition Fees</span>
              <span></span>
              <span className="text-right font-medium">₹{Number(form.tuitionFees).toLocaleString("en-IN")}</span>
              <span className="text-muted-foreground">IGST @ {form.igstPercent}%</span>
              <span></span>
              <span className="text-right font-medium">₹{igstAmt.toLocaleString("en-IN")}</span>
              <span className="font-semibold border-t pt-1 mt-1">Total Amount</span>
              <span></span>
              <span className="text-right font-bold border-t pt-1 mt-1 text-primary">₹{total.toLocaleString("en-IN")}</span>
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
