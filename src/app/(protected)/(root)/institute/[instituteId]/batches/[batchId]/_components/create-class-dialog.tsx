"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

import { SUBJECT_OPTIONS } from "@/helpers/constants/academic";

const EMPTY = {
  subjectName: "",
  className: "",
  topic: "",
  date: "",
};

interface Props {
  batchId: string;
  instituteId: string;
}

export default function CreateClassDialog({ batchId, instituteId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();
  const router = useRouter();

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
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Class created successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-batch-classes", batchId] });
        setOpen(false);
        setForm(EMPTY);
        const classId = res.data?.class?._id;
        if (classId) {
          router.push(
            `/institute/${instituteId}/batches/${batchId}/classes/${classId}/add-work`
          );
        }
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
        <Button className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white h-9 text-sm font-bold shadow-sm px-4 gap-1.5">
          <Plus className="size-4" />
          Add Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Create Class
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.subjectName}
              onValueChange={(v) => set("subjectName", v)}
            >
              <SelectTrigger className="w-full">
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

          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">
              Class Name{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              placeholder="e.g. Morning Batch Physics"
              value={form.className}
              onChange={(e) => set("className", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">
              Topic{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              placeholder="e.g. Thermodynamics"
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">
              Date{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 shadow-md w-full sm:w-auto px-8"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
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
