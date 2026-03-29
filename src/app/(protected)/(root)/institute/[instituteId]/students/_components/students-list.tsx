"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";

import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Matches leadlly.student.api userModel schema
type Student = {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  academic?: {
    standard?: number | string | null;
    competitiveExam?: string | null; // "jee" | "neet"
    coachingMode?: string | null;    // "online" | "offline" | "hybrid"
  };
  details?: {
    level?: { number?: number | null } | null;
    // level.number = student's progress level (1–10), default 1, increases as they progress
  };
};

const BG_COLORS = [
  "bg-green-50 border-green-200",
  "bg-yellow-50 border-yellow-200",
  "bg-blue-50 border-blue-200",
  "bg-purple-50 border-purple-200",
  "bg-pink-50 border-pink-200",
  "bg-orange-50 border-orange-200",
];

// academic.competitiveExam — only "jee" and "neet" are supported by the platform
const EXAM_OPTIONS = [
  { label: "All Exams", value: "all" },
  { label: "JEE", value: "jee" },
  { label: "NEET", value: "neet" },
];

// academic.coachingMode — standard values used in the platform
const COACHING_MODE_OPTIONS = [
  { label: "All Modes", value: "all" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Hybrid", value: "hybrid" },
];

// Level is details.level.number (default 1, max ~10) — student's platform progress rank
const LEVEL_GROUPS = [
  { label: "All Levels", value: "all" },
  { label: "Beginner  (Lvl 1–3)", value: "beginner" },
  { label: "Intermediate  (Lvl 4–6)", value: "intermediate" },
  { label: "Advanced  (Lvl 7–10)", value: "advanced" },
];

const SORT_OPTIONS = [
  { label: "Name (A → Z)", value: "name_asc" },
  { label: "Name (Z → A)", value: "name_desc" },
  { label: "Level (High → Low)", value: "level_desc" },
  { label: "Level (Low → High)", value: "level_asc" },
  { label: "Class (High → Low)", value: "class_desc" },
  { label: "Class (Low → High)", value: "class_asc" },
];

function getLevelGroup(n: number) {
  if (n <= 3) return "beginner";
  if (n <= 6) return "intermediate";
  return "advanced";
}

function getLevelBadgeClass(n: number) {
  if (n >= 7) return "bg-green-100 text-green-700";
  if (n >= 4) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function StudentsList({
  students,
  instituteId,
}: {
  students: Student[];
  instituteId: string;
}) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [coachingFilter, setCoachingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name_asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Derive unique option sets dynamically from real data ── */
  const classOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      const std = s?.academic?.standard;
      if (std !== null && std !== undefined && String(std).trim() !== "")
        set.add(String(std));
    });
    return ["all", ...Array.from(set).sort((a, b) => Number(a) - Number(b))];
  }, [students]);

  /* ── Apply all filters + sort ── */
  const filtered = useMemo(() => {
    // DEBUG — remove after confirming filters work
    console.log("=== STUDENT FILTER DEBUG ===");
    console.log("Total students received:", students.length);
    console.log("examFilter:", examFilter, "| coachingFilter:", coachingFilter, "| classFilter:", classFilter, "| levelFilter:", levelFilter);
    console.log(
      "Sample competitiveExam values (first 10):",
      students.slice(0, 10).map((s) => ({
        name: `${s.firstname ?? ""} ${s.lastname ?? ""}`.trim(),
        competitiveExam: s?.academic?.competitiveExam,
        coachingMode: s?.academic?.coachingMode,
        standard: s?.academic?.standard,
      }))
    );

    let list = [...students];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => {
        const name = `${s.firstname ?? ""} ${s.lastname ?? ""}`.toLowerCase();
        return name.includes(q) || (s.email ?? "").toLowerCase().includes(q);
      });
    }

    if (classFilter !== "all") {
      list = list.filter(
        (s) => String(s?.academic?.standard ?? "") === classFilter
      );
    }

    if (levelFilter !== "all") {
      list = list.filter((s) => {
        const n = s?.details?.level?.number ?? 1;
        return getLevelGroup(n) === levelFilter;
      });
    }

    if (examFilter !== "all") {
      list = list.filter(
        (s) =>
          (s?.academic?.competitiveExam ?? "").trim().toLowerCase() ===
          examFilter.toLowerCase()
      );
    }

    if (coachingFilter !== "all") {
      list = list.filter(
        (s) =>
          (s?.academic?.coachingMode ?? "").trim().toLowerCase() ===
          coachingFilter.toLowerCase()
      );
    }

    list.sort((a, b) => {
      const nameA = `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim();
      const nameB = `${b.firstname ?? ""} ${b.lastname ?? ""}`.trim();
      const levelA = a?.details?.level?.number ?? 1;
      const levelB = b?.details?.level?.number ?? 1;
      const classA = Number(a?.academic?.standard ?? 0);
      const classB = Number(b?.academic?.standard ?? 0);

      switch (sortBy) {
        case "name_asc":  return nameA.localeCompare(nameB);
        case "name_desc": return nameB.localeCompare(nameA);
        case "level_desc": return levelB - levelA;
        case "level_asc":  return levelA - levelB;
        case "class_desc": return classB - classA;
        case "class_asc":  return classA - classB;
        default: return 0;
      }
    });

    return list;
  }, [students, search, classFilter, levelFilter, examFilter, coachingFilter, sortBy]);

  const activeFilterCount = [
    classFilter !== "all",
    levelFilter !== "all",
    examFilter !== "all",
    coachingFilter !== "all",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch("");
    setClassFilter("all");
    setLevelFilter("all");
    setExamFilter("all");
    setCoachingFilter("all");
    setSortBy("name_asc");
  };

  return (
    <div className="space-y-4">
      {/* ── Top bar: search + filter toggle + sort + view ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 shadow-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-10 px-3"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-44 shadow-none text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Expandable filter panel ── */}
      {filtersOpen && (
        <div className="bg-muted/40 rounded-xl border border-border p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* 1. Class / Standard — academic.standard */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              Class / Standard
            </label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="shadow-none bg-white">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "All Classes" : `Grade ${c}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Competitive Exam — academic.competitiveExam: "jee" | "neet" */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Competitive Exam
            </label>
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="shadow-none bg-white">
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Level Group — details.level.number (default 1, increases with progress) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Level{" "}
              <span className="text-[10px] text-muted-foreground/70">
                (platform progress rank)
              </span>
            </label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="shadow-none bg-white">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_GROUPS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Coaching Mode — academic.coachingMode: "online" | "offline" | "hybrid" */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Coaching Mode
            </label>
            <Select value={coachingFilter} onValueChange={setCoachingFilter}>
              <SelectTrigger className="shadow-none bg-white">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                {COACHING_MODE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      )}

      {/* ── Active filter chips ── */}
      {(activeFilterCount > 0 || search) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {search && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearch("")}>
              &quot;{search}&quot; <X className="h-3 w-3" />
            </Badge>
          )}
          {classFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setClassFilter("all")}>
              Grade {classFilter} <X className="h-3 w-3" />
            </Badge>
          )}
          {examFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setExamFilter("all")}>
              {EXAM_OPTIONS.find((o) => o.value === examFilter)?.label} <X className="h-3 w-3" />
            </Badge>
          )}
          {levelFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setLevelFilter("all")}>
              {LEVEL_GROUPS.find((g) => g.value === levelFilter)?.label} <X className="h-3 w-3" />
            </Badge>
          )}
          {coachingFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setCoachingFilter("all")}>
              {COACHING_MODE_OPTIONS.find((o) => o.value === coachingFilter)?.label} <X className="h-3 w-3" />
            </Badge>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-destructive underline-offset-2 hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Result count ── */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{students.length}</span>{" "}
        student{students.length !== 1 ? "s" : ""}
      </p>

      {/* ── Student cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
          <Search className="h-10 w-10 opacity-30" />
          <p className="text-sm">No students match the current filters.</p>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student, index) => {
            const bg = BG_COLORS[index % BG_COLORS.length];
            const firstname = student?.firstname ?? "Student";
            const lastname = student?.lastname ?? "";
            const fullName = `${firstname} ${lastname}`.trim();
            const standard = student?.academic?.standard ?? "–";
            const level = student?.details?.level?.number ?? 1;
            const email = student?.email ?? "";
            const exam = student?.academic?.competitiveExam;

            return (
              <Link
                key={student._id ?? index}
                href={`/institute/${instituteId}/students/${student._id}`}
                className={`${bg} border rounded-2xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{fullName}</h3>
                    {email && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{email}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs bg-white/70 border rounded-full px-2 py-0.5 text-gray-600">
                        Grade {standard}
                      </span>
                      {exam && (
                        <span className="text-xs bg-white/70 border rounded-full px-2 py-0.5 text-gray-600">
                          {exam}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${getLevelBadgeClass(level)}`}>
                    Lvl {level}
                  </span>
                </div>
                <p className="text-xs text-primary font-medium mt-1">View details →</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {filtered.map((student, index) => {
            const firstname = student?.firstname ?? "Student";
            const lastname = student?.lastname ?? "";
            const fullName = `${firstname} ${lastname}`.trim();
            const standard = student?.academic?.standard ?? "–";
            const level = student?.details?.level?.number ?? 1;
            const email = student?.email ?? "";
            const exam = student?.academic?.competitiveExam;

            return (
              <Link
                key={student._id ?? index}
                href={`/institute/${instituteId}/students/${student._id}`}
                className="flex items-center justify-between px-4 py-3 bg-white hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{fullName}</p>
                  {email && (
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4 text-xs">
                  <span className="text-muted-foreground hidden sm:inline">
                    Grade <span className="font-medium text-foreground">{standard}</span>
                  </span>
                  {exam && (
                    <span className="hidden md:inline text-muted-foreground border rounded-full px-2 py-0.5">
                      {exam}
                    </span>
                  )}
                  <span className={`font-semibold px-2 py-1 rounded-full ${getLevelBadgeClass(level)}`}>
                    Lvl {level}
                  </span>
                  <span className="text-primary">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
