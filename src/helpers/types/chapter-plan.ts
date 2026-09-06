export type ChapterPace = "on-track" | "behind" | "ahead";

export interface PlannedChapterInput {
  chapterId: string;
  sequenceOrder?: number;
  plannedLectureCount: number;
  expectedStartDate?: string | null;
}

export interface ComparedChapter {
  chapterId: string;
  chapterName: string;
  sequenceOrder: number;
  plannedLectureCount: number;
  expectedStartDate: string | null;
  actualLectureCount: number;
  actualStartDate: string | null;
  status: ChapterPace;
}

export interface ChapterPlanComparison {
  chapters: ComparedChapter[];
  completionPercent: number;
  lectureCompletionPercent: number;
  sequenceFollowed: boolean;
  statusCounts: Record<ChapterPace, number>;
}

export interface ChapterPlanRecord {
  _id: string;
  batch: string | { _id: string; name?: string; standard?: string };
  subject: string;
  weeklyLectureLoad?: number;
  academicSession?: string;
  courseCompletionDate?: string | null;
  chapters: Array<{
    chapterId: string;
    chapterName: string;
    sequenceOrder: number;
    plannedLectureCount: number;
    expectedStartDate: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterPlanSheetRow {
  slNo: number;
  chapterId: string;
  topicName: string;
  plannedLectureCount: number;
  expectedStartDate: string | null;
  actualLectureCount: number;
  actualStartDate: string | null;
  sheetStatus: string;
  pace: ChapterPace;
}

export interface ChapterPlanSheet {
  success: boolean;
  batch: { _id: string; name: string; standard: string; subjects: string[] };
  subject: string;
  plan: ChapterPlanRecord | null;
  rows: ChapterPlanSheetRow[];
  weeklyLectureLoad: number;
  academicSession: string;
  courseCompletionDate: string | null;
  totalLecturesRequired: number;
  message?: string;
}

export interface ChapterPlanListRow {
  planId: string;
  subject: string;
  batch: { _id: string; name: string; standard: string };
  chapterCount: number;
  completionPercent: number;
  lectureCompletionPercent: number;
  sequenceFollowed: boolean;
  statusCounts: Record<ChapterPace, number>;
  updatedAt: string;
}
