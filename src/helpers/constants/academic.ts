export const COMPETITIVE_EXAM_OPTIONS = [
  { value: "jee", label: "JEE" },
  { value: "neet", label: "NEET" },
  { value: "boards", label: "Board" },
] as const;

export type CompetitiveExamValue =
  (typeof COMPETITIVE_EXAM_OPTIONS)[number]["value"];

export function formatCompetitiveExamLabel(
  exam?: string | null
): string {
  if (!exam) return "";
  switch (exam.toLowerCase()) {
    case "jee":
      return "JEE";
    case "neet":
      return "NEET";
    case "boards":
    case "board":
      return "Board";
    default:
      return exam.toUpperCase();
  }
}

export function formatBatchMetaLabel(
  standard: string,
  competitiveExam?: string | null
): string {
  const std = formatStandardBadgeLabel(standard);
  const exam = formatCompetitiveExamLabel(competitiveExam);
  return exam ? `${std} · ${exam}` : std;
}

export const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Maths", "Biology"] as const;

export const QUESTION_BANK_STANDARDS = ["11", "12", "13"] as const;

export const FALLBACK_STANDARDS = ["9", "10", "11", "12", "13"] as const;

export const INSTITUTE_STANDARD_OPTIONS = ["6", "7", "8", "9", "10", "11", "12", "13"] as const;

export function formatStandardLabel(standard: string): string {
  if (standard === "13") return "Dropper";
  return standard;
}

export function formatGradeLabel(standard: string): string {
  if (standard === "13") return "Dropper";
  return `Grade ${standard}`;
}

export function formatClassLabel(standard: string): string {
  if (standard === "13") return "Dropper";
  return `Class ${standard}`;
}

export function formatStandardFilterLabel(standard: string): string {
  if (standard === "13") return "Dropper";
  return `${standard}th Standard`;
}

export function formatStandardBadgeLabel(standard: string): string {
  if (standard === "13") return "Dropper";
  return `${standard}th Class`;
}
