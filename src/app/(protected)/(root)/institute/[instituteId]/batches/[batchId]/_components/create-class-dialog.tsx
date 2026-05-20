"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createClass } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Maths"] as const;

const EMPTY = {
  subjectName: "",
  className: "",
  topic: "",
  date: "",
  startTime: "",
  endTime: "",
};

interface Props {
  batchId: string;
}

export default function CreateClassDialog({ batchId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: () =>
      createClass({
        batchId,
        subjectName: form.subjectName,
        className: form.className || undefined,
        topic: form.topic || undefined,
        date: form.date || undefined,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Class created successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-batch-classes", batchId] });
        setOpen(false);
        setForm(EMPTY);
      } else {
        toast.error(res.message ?? "Failed to create class");
      }
    },
    onError: () => toast.error("Failed to create class"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectName) {
      toast.error("Please select a subject");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-none h-9 px-4 text-sm rounded-lg font-medium gap-1.5">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label>
              Subject <span className="text-destructive">*</span>
            </Label>
            <Select value={form.subjectName} onValueChange={(v) => set("subjectName", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class name */}
          <div className="space-y-1.5">
            <Label>Class Name <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              placeholder="e.g. Morning Batch Physics"
              value={form.className}
              onChange={(e) => set("className", e.target.value)}
            />
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <Label>Topic <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              placeholder="e.g. Thermodynamics"
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label>Date <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          {/* Start / End time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Time <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Time <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
              className="rounded-lg shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-none min-w-[120px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating…
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
