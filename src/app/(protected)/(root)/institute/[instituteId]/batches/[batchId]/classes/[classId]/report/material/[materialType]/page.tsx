"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, ChevronLeft, ExternalLink, FileQuestion, FileText } from "lucide-react";
import { getDPPs, getNotes } from "@/actions/classwork_actions";
import { getClassQuizzes } from "@/actions/quiz_actions";

const MATERIAL_CONFIG = {
  notes: {
    title: "Written Notes",
    emptyText: "No notes shared yet",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  dpps: {
    title: "DPP",
    emptyText: "No DPP shared yet",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  quizzes: {
    title: "Quizzes",
    emptyText: "No quizzes shared yet",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
} as const;

type MaterialType = keyof typeof MATERIAL_CONFIG;

const MaterialDetailPage = ({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string; materialType: string }>;
}) => {
  const { instituteId, batchId, classId, materialType } = use(params);
  const searchParams = useSearchParams();
  const type = materialType as MaterialType;
  const config = MATERIAL_CONFIG[type];
  const base = `/institute/${instituteId}/batches/${batchId}/classes/${classId}`;
  const query = searchParams.toString();

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ["class-report-material-notes", classId],
    queryFn: () => getNotes({ classId }),
    enabled: type === "notes",
  });

  const { data: dppsData, isLoading: dppsLoading } = useQuery({
    queryKey: ["class-report-material-dpps", classId],
    queryFn: () => getDPPs({ classId }),
    enabled: type === "dpps",
  });

  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ["class-report-material-quizzes", classId],
    queryFn: () => getClassQuizzes({ classId }),
    enabled: type === "quizzes",
  });

  const reportHref = `${base}/report${query ? `?${query}` : ""}`;

  if (!config) {
    return <div className="p-8 text-center text-gray-500">Material section not found.</div>;
  }

  const items =
    type === "notes"
      ? notesData?.notes || []
      : type === "dpps"
        ? dppsData?.dpps || dppsData?.assignments || []
        : quizzesData?.quizzes || [];
  const isLoading = notesLoading || dppsLoading || quizzesLoading;

  return (
    <div className="w-full pb-10 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Link
            href={reportHref}
            className="inline-flex items-center gap-1.5 mb-3 text-sm font-bold text-purple-600 hover:text-purple-700"
          >
            <ChevronLeft className="size-4" />
            Back to Report
          </Link>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{config.title}</h2>
          <p className="text-sm text-gray-500 font-medium">
            {items.length} total {config.title.toLowerCase()} shared for this class.
          </p>
        </div>

        <div className={`${config.bg} rounded-2xl px-5 py-3`}>
          <p className="text-[11px] uppercase font-bold text-gray-500">Total</p>
          <p className={`text-2xl font-bold ${config.color}`}>{items.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-400 animate-pulse">Loading material...</div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item: any) =>
            type === "quizzes" ? (
              <QuizCard key={item._id} quiz={item} />
            ) : (
              <AttachmentCard key={item._id} item={item} type={type} />
            )
          )}
        </div>
      ) : (
        <div className="min-h-[300px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-8">
          <BookOpen className="size-10 text-gray-300 mb-3" />
          <p className="font-bold text-gray-500">{config.emptyText}</p>
        </div>
      )}
    </div>
  );
};

const AttachmentCard = ({ item, type }: { item: any; type: "notes" | "dpps" }) => {
  const attachments = item.attachments || [];
  const createdAt = item.uploadedAt || item.createdAt || item.dueDate;
  const color = type === "notes" ? "text-purple-500" : "text-blue-500";

  return (
    <div className="bg-white border border-[#F2E0FF] rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <div className="bg-gray-50 p-2 rounded-xl">
          <FileText className={`size-5 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 capitalize truncate">{item.title || "Untitled"}</h3>
          <p className="text-xs font-medium text-gray-400">
            {createdAt ? dayjs(createdAt).format("DD MMM, YYYY") : "No date"}
          </p>
        </div>
      </div>

      {attachments.length > 0 ? (
        <div className="space-y-1.5">
          {attachments.map((attachment: any, index: number) => (
            <a
              key={`${attachment.fileUrl || attachment.fileName}-${index}`}
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2 hover:bg-purple-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700 truncate">
                {attachment.fileName || `Attachment ${index + 1}`}
              </span>
              <ExternalLink className="size-3.5 text-gray-400 shrink-0" />
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-400">
          No attachment available
        </p>
      )}
    </div>
  );
};

const QuizCard = ({ quiz }: { quiz: any }) => {
  const topics = quiz.topics?.length ? quiz.topics.join(", ") : "No topic";
  const subtopics = quiz.subtopics?.length ? quiz.subtopics.join(", ") : "";

  return (
    <div className="bg-white border border-[#F2E0FF] rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <div className="bg-amber-50 p-2 rounded-xl">
          <FileQuestion className="size-5 text-amber-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 capitalize truncate">
            {quiz.chapterName ? `${quiz.chapterName} Quiz` : "Quiz"}
          </h3>
          <p className="text-xs font-medium text-gray-400">
            {quiz.createdAt ? dayjs(quiz.createdAt).format("DD MMM, YYYY") : "No date"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <MaterialInfo label="Chapter" value={quiz.chapterName || "No chapter"} />
        <MaterialInfo label="Topics" value={topics} />
        {subtopics && <MaterialInfo label="Subtopics" value={subtopics} highlight />}
        <MaterialInfo label="Questions" value={`${quiz.totalQuestions || 0}`} />
      </div>
    </div>
  );
};

const MaterialInfo = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide font-bold text-gray-400">{label}</p>
    <p className={`font-semibold capitalize ${highlight ? "text-purple-600" : "text-gray-700"}`}>{value}</p>
  </div>
);

export default MaterialDetailPage;
