"use client";

import React, { useEffect, useMemo, useState } from "react";

import { ArrowDown, ArrowUp, Check, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getPlanChapters } from "@/actions/chapter_plan_actions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlannedChapterInput } from "@/helpers/types/chapter-plan";
import { cn } from "@/lib/utils";

type EditorRow = {
  chapterId: string;
  plannedLectureCount: string;
  expectedStartDate: string;
};

type TaxonomyChapter = { _id: string; name: string };

const emptyRow = (): EditorRow => ({
  chapterId: "",
  plannedLectureCount: "8",
  expectedStartDate: "",
});

function ChapterSearchSelect({
  value,
  chapters,
  usedIds,
  loading,
  onChange,
}: {
  value: string;
  chapters: TaxonomyChapter[];
  usedIds: Set<string>;
  loading: boolean;
  onChange: (chapterId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = chapters.find((chapter) => chapter._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between text-left h-10 rounded-md bg-white font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <span className="flex-1 truncate">
            {selected ? selected.name : loading ? "Loading chapters..." : "Search chapter"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
        <Command>
          <CommandInput placeholder="Search chapter..." />
          <CommandList className="max-h-[240px]">
            <CommandEmpty>No chapter found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <CommandItem disabled>
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Loading...
                </CommandItem>
              ) : (
                chapters.map((chapter) => {
                  const taken = usedIds.has(chapter._id) && chapter._id !== value;
                  return (
                    <CommandItem
                      key={chapter._id}
                      value={chapter.name}
                      disabled={taken}
                      onSelect={() => {
                        onChange(chapter._id);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === chapter._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {chapter.name}
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PlanEditor({
  batchId,
  subject,
  initialChapters,
  submitLabel,
  onSubmit,
}: {
  batchId: string;
  subject: string;
  initialChapters?: PlannedChapterInput[];
  submitLabel: string;
  onSubmit: (chapters: PlannedChapterInput[]) => Promise<void>;
}) {
  const [rows, setRows] = useState<EditorRow[]>([emptyRow()]);
  const [taxonomy, setTaxonomy] = useState<TaxonomyChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!batchId || !subject) {
      setTaxonomy([]);
      return;
    }
    setLoadingChapters(true);
    getPlanChapters(batchId, subject)
      .then((res) => setTaxonomy(res.chapters || []))
      .finally(() => setLoadingChapters(false));
  }, [batchId, subject]);

  useEffect(() => {
    if (!initialChapters?.length) return;
    setRows(
      [...initialChapters]
        .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0))
        .map((chapter) => ({
          chapterId: chapter.chapterId,
          plannedLectureCount: String(chapter.plannedLectureCount ?? ""),
          expectedStartDate: String(chapter.expectedStartDate || "").slice(0, 10),
        }))
    );
  }, [initialChapters]);

  const used = useMemo(
    () => new Set(rows.map((row) => row.chapterId).filter(Boolean)),
    [rows]
  );

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= rows.length) return;
    setRows((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const handleSave = async () => {
    const chapters: PlannedChapterInput[] = [];
    for (const [index, row] of rows.entries()) {
      if (!row.chapterId || !row.expectedStartDate || !row.plannedLectureCount) {
        toast.error("Each chapter needs a name, lecture count, and start date");
        return;
      }
      chapters.push({
        chapterId: row.chapterId,
        sequenceOrder: index + 1,
        plannedLectureCount: Number(row.plannedLectureCount),
        expectedStartDate: row.expectedStartDate,
      });
    }
    setSaving(true);
    try {
      await onSubmit(chapters);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <div
          key={`${row.chapterId}-${index}`}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="md:col-span-1 flex items-center text-sm font-bold text-[#A855F7]">
            {index + 1}
          </div>
          <div className="md:col-span-5">
            <ChapterSearchSelect
              value={row.chapterId}
              chapters={taxonomy}
              usedIds={used}
              loading={loadingChapters}
              onChange={(chapterId) =>
                setRows((prev) =>
                  prev.map((item, i) => (i === index ? { ...item, chapterId } : item))
                )
              }
            />
          </div>
          <Input
            className="md:col-span-2"
            type="number"
            min="1"
            value={row.plannedLectureCount}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, plannedLectureCount: e.target.value } : item
                )
              )
            }
            placeholder="Lectures"
          />
          <Input
            className="md:col-span-3"
            type="date"
            value={row.expectedStartDate}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, expectedStartDate: e.target.value } : item
                )
              )
            }
          />
          <div className="md:col-span-1 flex items-center justify-end gap-1">
            <button type="button" onClick={() => move(index, -1)} className="p-1 text-gray-400">
              <ArrowUp className="size-4" />
            </button>
            <button type="button" onClick={() => move(index, 1)} className="p-1 text-gray-400">
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
              className="p-1 text-gray-400"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => setRows((prev) => [...prev, emptyRow()])}>
          <Plus className="size-4 mr-1" />
          Add chapter
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !batchId || !subject}
          className="bg-[#A855F7] hover:bg-[#9333EA]"
        >
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
