export type ChapterPace = "on-track" | "behind" | "ahead";

export interface PlannedChapterInput {
  chapterId: string;
  sequenceOrder?: number;
  plannedLectureCount: number;
  expectedStartDate: string;
}

export interface ComparedChapter {
  chapterId: string;
  chapterName: string;
  sequenceOrder: number;
  plannedLectureCount: number;
  expectedStartDate: string;
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
  chapters: Array<{
    chapterId: string;
    chapterName: string;
    sequenceOrder: number;
    plannedLectureCount: number;
    expectedStartDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
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
