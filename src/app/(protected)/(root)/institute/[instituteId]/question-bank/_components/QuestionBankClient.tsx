"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  FileDown,
  Loader2,
  Search,
} from "lucide-react";

import {
  getQBSubjects,
  getQBChapters,
  getQBTopicsWithSubtopics,
  getQBQuestions,
} from "@/actions/question_bank_actions";
import type {
  QBChapter,
  QBTopic,
  QBSubtopic,
  QBQuestion,
  QBPagination,
} from "@/actions/question_bank_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateQuestionBankPdf } from "./QuestionPdfGenerator";

const STANDARDS = ["11", "12"];
const OPTION_LABELS = ["A", "B", "C", "D"];
const PAGE_SIZE = 10;

function sanitize(text: string): string {
  return (text ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export default function QuestionBankClient() {
  // ── Standard → subjects (fetched from API) ──────────────────────────────────
  const [standard, setStandard] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // ── Subject → chapters ──────────────────────────────────────────────────────
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState<QBChapter[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // ── Chapters → topics ───────────────────────────────────────────────────────
  const [topicsMap, setTopicsMap] = useState<Record<string, QBTopic[]>>({});
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // ── Topics → subtopics ──────────────────────────────────────────────────────
  const [allSubtopics, setAllSubtopics] = useState<QBSubtopic[]>([]);
  const [selectedSubtopicIds, setSelectedSubtopicIds] = useState<string[]>([]);

  // ── Question count input ────────────────────────────────────────────────────
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [noOfQuestionsError, setNoOfQuestionsError] = useState("");

  // ── Loading / results ───────────────────────────────────────────────────────
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [questions, setQuestions] = useState<QBQuestion[]>([]);
  const [pagination, setPagination] = useState<QBPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const lastParamsRef = useRef<{
    subjectName: string;
    standard: string;
    chapterIds: string[];
    topicIds: string[];
    subtopicIds: string[];
    noOfQuestions: number;
  } | null>(null);

  // ── Fetch subjects when standard changes ───────────────────────────────────
  useEffect(() => {
    if (!standard) {
      setSubjects([]);
      setSubject("");
      setChapters([]);
      setSelectedChapterIds([]);
      setTopicsMap({});
      setSelectedTopicIds([]);
      setAllSubtopics([]);
      setSelectedSubtopicIds([]);
      return;
    }
    setLoadingSubjects(true);
    setSubject("");
    setChapters([]);
    setSelectedChapterIds([]);
    setTopicsMap({});
    setSelectedTopicIds([]);
    setAllSubtopics([]);
    setSelectedSubtopicIds([]);
    setHasFetched(false);
    setQuestions([]);
    setPagination(null);

    getQBSubjects(standard).then((res) => {
      setSubjects(res.subjectList ?? []);
      setLoadingSubjects(false);
    });
  }, [standard]);

  // ── Fetch chapters when subject changes ────────────────────────────────────
  useEffect(() => {
    if (!subject || !standard) {
      setChapters([]);
      setSelectedChapterIds([]);
      setTopicsMap({});
      setSelectedTopicIds([]);
      setAllSubtopics([]);
      setSelectedSubtopicIds([]);
      return;
    }
    setLoadingChapters(true);
    setSelectedChapterIds([]);
    setTopicsMap({});
    setSelectedTopicIds([]);
    setAllSubtopics([]);
    setSelectedSubtopicIds([]);

    getQBChapters(subject, standard).then((res) => {
      setChapters(res.chapters ?? []);
      setLoadingChapters(false);
    });
  }, [subject, standard]);

  // ── Fetch topics (with subtopics) when selected chapters change ─────────────
  useEffect(() => {
    if (!subject || !standard || selectedChapterIds.length === 0) {
      setTopicsMap({});
      setSelectedTopicIds([]);
      setAllSubtopics([]);
      setSelectedSubtopicIds([]);
      return;
    }
    setLoadingTopics(true);
    setSelectedTopicIds([]);
    setAllSubtopics([]);
    setSelectedSubtopicIds([]);

    Promise.all(
      selectedChapterIds.map((cid) =>
        getQBTopicsWithSubtopics(subject, standard, cid).then((res) => ({
          cid,
          topics: res.topics ?? [],
        }))
      )
    ).then((results) => {
      const map: Record<string, QBTopic[]> = {};
      results.forEach(({ cid, topics }) => {
        map[cid] = topics;
      });
      setTopicsMap(map);
      setLoadingTopics(false);
    });
  }, [subject, standard, selectedChapterIds]);

  // ── Derive subtopics from selected topics ───────────────────────────────────
  useEffect(() => {
    const allTopics = Object.values(topicsMap).flat();
    const selectedTopics = allTopics.filter((t) =>
      selectedTopicIds.includes(t._id)
    );
    const subtopics: QBSubtopic[] = [];
    const seen = new Set<string>();
    for (const t of selectedTopics) {
      for (const s of t.subtopics ?? []) {
        if (!seen.has(s._id)) {
          seen.add(s._id);
          subtopics.push(s);
        }
      }
    }
    setAllSubtopics(subtopics);
    setSelectedSubtopicIds((prev) =>
      prev.filter((id) => subtopics.some((s) => s._id === id))
    );
  }, [topicsMap, selectedTopicIds]);

  // ── Derived option lists ────────────────────────────────────────────────────
  const chapterOptions: MultiSelectOption[] = chapters.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const allTopics = Object.values(topicsMap).flat();
  const topicOptions: MultiSelectOption[] = allTopics.map((t) => ({
    value: t._id,
    label: t.name,
  }));

  const subtopicOptions: MultiSelectOption[] = allSubtopics.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  // ── Fetch questions ─────────────────────────────────────────────────────────
  const fetchQuestions = useCallback(
    async (page: number) => {
      if (!subject || !standard) return;
      const num = parseInt(noOfQuestions, 10);
      if (!noOfQuestions || isNaN(num) || num < 1) {
        setNoOfQuestionsError("Please enter a valid number of questions.");
        return;
      }
      setNoOfQuestionsError("");
      setLoadingQuestions(true);
      setFetchError("");

      const params = {
        subjectName: subject,
        standard,
        chapterIds: selectedChapterIds,
        topicIds: selectedTopicIds,
        subtopicIds: selectedSubtopicIds,
        noOfQuestions: num,
        page,
        limit: PAGE_SIZE,
      };
      lastParamsRef.current = {
        subjectName: subject,
        standard,
        chapterIds: selectedChapterIds,
        topicIds: selectedTopicIds,
        subtopicIds: selectedSubtopicIds,
        noOfQuestions: num,
      };

      const res = await getQBQuestions(params);
      setLoadingQuestions(false);

      if (!res.success || !res.questions) {
        setFetchError(res.message ?? "Failed to fetch questions.");
        setQuestions([]);
        setPagination(null);
        return;
      }

      setQuestions(res.questions);
      setPagination(res.pagination ?? null);
      setCurrentPage(page);
      setHasFetched(true);
    },
    [
      subject,
      standard,
      selectedChapterIds,
      selectedTopicIds,
      selectedSubtopicIds,
      noOfQuestions,
    ]
  );

  const handleFetch = () => {
    fetchQuestions(1);
  };

  const handlePageChange = (page: number) => {
    if (!lastParamsRef.current) return;
    const p = lastParamsRef.current;
    setLoadingQuestions(true);
    setFetchError("");
    getQBQuestions({ ...p, page, limit: PAGE_SIZE }).then((res) => {
      setLoadingQuestions(false);
      if (!res.success || !res.questions) {
        setFetchError(res.message ?? "Failed to fetch questions.");
        return;
      }
      setQuestions(res.questions);
      setPagination(res.pagination ?? null);
      setCurrentPage(page);
    });
  };

  // ── Generate PDF: re-fetches all pages with a high limit ────────────────────
  const handleGeneratePdf = async () => {
    if (!lastParamsRef.current || !pagination) return;
    setGeneratingPdf(true);

    const p = lastParamsRef.current;
    // Fetch all questions in one shot (up to the requested total)
    const res = await getQBQuestions({ ...p, page: 1, limit: p.noOfQuestions });
    const allQs: QBQuestion[] = res.questions ?? [];

    await generateQuestionBankPdf(allQs, {
      subject,
      standard: `Class ${standard}`,
      title: `${subject} — Question Bank`,
    });

    setGeneratingPdf(false);
  };

  const canFetch = !!subject && !!standard && !!noOfQuestions && !loadingQuestions;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Question Bank</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Select filters, fetch questions randomly, and generate a PDF.
        </p>
      </div>

      {/* Filter card */}
      <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Standard — pick first, drives subject list */}
          <div className="space-y-1.5">
            <Label>
              Class / Standard <span className="text-destructive">*</span>
            </Label>
            <Select
              value={standard}
              onValueChange={(v) => {
                setStandard(v);
                setHasFetched(false);
                setQuestions([]);
                setPagination(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {STANDARDS.map((s) => (
                  <SelectItem key={s} value={s}>
                    Class {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject — fetched based on standard */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              Subject <span className="text-destructive">*</span>
              {loadingSubjects && <Loader2 className="size-3 animate-spin" />}
            </Label>
            <Select
              value={subject}
              onValueChange={(v) => {
                setSubject(v);
                setHasFetched(false);
                setQuestions([]);
                setPagination(null);
              }}
              disabled={!standard || loadingSubjects}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !standard
                      ? "Select class first"
                      : loadingSubjects
                      ? "Loading…"
                      : "Select subject"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* No. of questions */}
          <div className="space-y-1.5">
            <Label>
              No. of Questions <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 30"
              value={noOfQuestions}
              onChange={(e) => {
                setNoOfQuestions(e.target.value);
                setNoOfQuestionsError("");
              }}
            />
            {noOfQuestionsError && (
              <p className="text-destructive text-xs">{noOfQuestionsError}</p>
            )}
          </div>

          {/* Chapters */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              Chapters
              {loadingChapters && <Loader2 className="size-3 animate-spin" />}
            </Label>
            <MultiSelect
              options={chapterOptions}
              selected={selectedChapterIds}
              onChange={setSelectedChapterIds}
              placeholder={
                !subject
                  ? "Select subject first"
                  : loadingChapters
                  ? "Loading…"
                  : "All chapters"
              }
              disabled={!subject || loadingChapters}
            />
          </div>

          {/* Topics */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              Topics
              {loadingTopics && <Loader2 className="size-3 animate-spin" />}
            </Label>
            <MultiSelect
              options={topicOptions}
              selected={selectedTopicIds}
              onChange={setSelectedTopicIds}
              placeholder={
                selectedChapterIds.length === 0
                  ? "Select chapters first"
                  : loadingTopics
                  ? "Loading…"
                  : "All topics"
              }
              disabled={selectedChapterIds.length === 0 || loadingTopics}
            />
          </div>

          {/* Subtopics */}
          <div className="space-y-1.5">
            <Label>Subtopics</Label>
            <MultiSelect
              options={subtopicOptions}
              selected={selectedSubtopicIds}
              onChange={setSelectedSubtopicIds}
              placeholder={
                selectedTopicIds.length === 0
                  ? "Select topics first"
                  : subtopicOptions.length === 0
                  ? "No subtopics available"
                  : "All subtopics"
              }
              disabled={
                selectedTopicIds.length === 0 || subtopicOptions.length === 0
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleFetch} disabled={!canFetch}>
            {loadingQuestions && !hasFetched ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Search className="mr-2 size-4" />
            )}
            Fetch Questions
          </Button>

          {hasFetched && pagination && (
            <Button
              variant="outline"
              onClick={handleGeneratePdf}
              disabled={generatingPdf || questions.length === 0}
            >
              {generatingPdf ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 size-4" />
              )}
              Generate PDF
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      )}

      {/* Results */}
      {hasFetched && (
        <div className="space-y-4">
          {/* Summary */}
          {pagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {pagination.total}
                </span>{" "}
                questions
                {pagination.totalAvailable > pagination.total && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({pagination.totalAvailable} in DB, showing requested{" "}
                    {pagination.total})
                  </span>
                )}
              </p>
              <Badge variant="secondary">
                Page {currentPage} / {pagination.totalPages}
              </Badge>
            </div>
          )}

          {/* Question list */}
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
              No questions found for the selected filters.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, qi) => {
                const globalIdx = (currentPage - 1) * PAGE_SIZE + qi + 1;
                return (
                  <div
                    key={q._id}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <p className="text-sm font-medium leading-relaxed">
                      <span className="mr-2 text-muted-foreground">
                        {globalIdx}.
                      </span>
                      {sanitize(q.question)}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {q.options.map((opt, oi) => (
                          <div
                            key={opt._id ?? oi}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="shrink-0 font-medium text-foreground">
                              ({OPTION_LABELS[oi] ?? oi + 1})
                            </span>
                            <span>{sanitize(opt.name)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      {q.level && (
                        <Badge variant="outline" className="text-xs">
                          {q.level}
                        </Badge>
                      )}
                      {q.topics?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || loadingQuestions}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - currentPage) <= 2
                  )
                  .reduce<(number | "…")[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                      acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-1 text-muted-foreground text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        className="size-8 p-0"
                        disabled={loadingQuestions}
                        onClick={() => handlePageChange(p as number)}
                      >
                        {p}
                      </Button>
                    )
                  )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  currentPage >= pagination.totalPages || loadingQuestions
                }
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
