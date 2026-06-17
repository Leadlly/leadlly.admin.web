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
