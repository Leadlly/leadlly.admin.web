"use client";

import React, { use, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClassDetails } from "@/actions/batch_actions";
import {
  getChapters,
  getTopicsWithSubtopics,
} from "@/actions/questionbank_actions";
import {
  createTodaysWork,
  getTodaysLecture,
  updateTodaysWork,
} from "@/actions/lecture_actions";
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, Check, Loader2, Plus, Paperclip, X, FileQuestion, Upload, FileText, Trash2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import dayjs from "dayjs";
import { format } from "date-fns";
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from "@/actions/announcement_actions";
import { createQuizForClass, getClassQuizzes, deleteQuiz } from "@/actions/quiz_actions";
import { useFileUpload } from "@/hooks/use-file-upload";
import { createNote, createDPP, getNotes, getDPPs, deleteNote, deleteDPP } from "@/actions/classwork_actions";

interface ChapterItem {
  _id: string;
  name: string;
}

interface SubtopicItem {
  _id: string;
  name: string;
}

interface TopicItem {
  _id: string;
  name: string;
  subtopics: SubtopicItem[];
}

const HOUR_OPTIONS = [1, 2, 3];

const Page = ({ params }: { params: Promise<{ classId: string }> }) => {
  const { classId } = use(params);
  const queryClient = useQueryClient();

  const { data: classData, isLoading } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  const batchId =
    typeof classData?.batch === "object" ? classData?.batch._id : classData?.batch;
  const batchStandard =
    typeof classData?.batch === "object" ? classData?.batch.standard : "12";
  const subject = classData?.subject || "";

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [customHours, setCustomHours] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [nothingDoneToday, setNothingDoneToday] = useState(false);

  const [chapterPopoverOpen, setChapterPopoverOpen] = useState(false);
  const [topicPopoverOpen, setTopicPopoverOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterItem | null>(null);

  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  // topicSelected=true means the topic row itself is checked;
  // entry exists in map if topicSelected OR at least one subtopic is selected
  const [selectedTopics, setSelectedTopics] = useState<
    Map<string, { topic: TopicItem; topicSelected: boolean; selectedSubtopics: Set<string> }>
  >(new Map());

  const [homework, setHomework] = useState("");

  const [existingLecture, setExistingLecture] = useState<any>(null);
  const isUpdateMode = !!existingLecture;
  const prefillDoneRef = React.useRef(false);

  useEffect(() => {
    if (!subject || !batchStandard) return;
    const fetchChapters = async () => {
      setChaptersLoading(true);
      try {
        const data = await getChapters(subject, batchStandard);
        setChapters(data.chapters || []);
      } catch {
        toast.error("Failed to load chapters");
      } finally {
        setChaptersLoading(false);
      }
    };
    fetchChapters();
  }, [subject, batchStandard]);

  useEffect(() => {
    if (!classId) return;
    const fetchExisting = async () => {
      try {
        const lecture = await getTodaysLecture(classId, dateStr);
        if (lecture) {
          setExistingLecture(lecture);
          const durationHrs = Math.round((lecture.duration || 60) / 60);
          if (HOUR_OPTIONS.includes(durationHrs)) {
            setSelectedHours(durationHrs);
          } else {
            setCustomHours(durationHrs || 1);
            setShowCustomInput(true);
          }
        } else {
          setExistingLecture(null);
          setSelectedHours(null);
          setCustomHours(null);
          setShowCustomInput(false);
          setSelectedChapter(null);
          setSelectedTopics(new Map());
          prefillDoneRef.current = false;
        }
      } catch {
        setExistingLecture(null);
      }
    };
    fetchExisting();
  }, [classId, dateStr]);

  useEffect(() => {
    if (prefillDoneRef.current || !existingLecture || chapters.length === 0) return;
    const existingChapter = existingLecture.chapters?.[0];
    if (existingChapter) {
      const match = chapters.find((c) => c._id === existingChapter._id);
      setSelectedChapter(match || { _id: existingChapter._id, name: existingChapter.name });
    }
  }, [existingLecture, chapters]);

  useEffect(() => {
    if (!selectedChapter) {
      setTopics([]);
      return;
    }
    const fetchTopics = async () => {
      setTopicsLoading(true);
      try {
        const data = await getTopicsWithSubtopics(subject, batchStandard, selectedChapter._id);
        setTopics(data.topics || []);
      } catch {
        toast.error("Failed to load topics");
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, [selectedChapter, subject, batchStandard]);

  useEffect(() => {
    if (prefillDoneRef.current || !existingLecture || topics.length === 0) return;
    const existingTopicIds = new Set(existingLecture.topics?.map((t: any) => t._id) || []);
    // subtopics may be stored at top-level or nested in topics[].subtopics
    const existingSubtopicIds = new Set([
      ...(existingLecture.subtopics?.map((s: any) => s._id) || []),
      ...(existingLecture.topics?.flatMap((t: any) => (t.subtopics || []).map((s: any) => s._id)) || []),
    ]);
    const prefilled = new Map<string, { topic: TopicItem; topicSelected: boolean; selectedSubtopics: Set<string> }>();
    for (const topic of topics) {
      const topicSelected = existingTopicIds.has(topic._id);
      const subs = new Set<string>();
      for (const sub of topic.subtopics) {
        if (existingSubtopicIds.has(sub._id)) subs.add(sub._id);
      }
      if (topicSelected || subs.size > 0) {
        prefilled.set(topic._id, { topic, topicSelected, selectedSubtopics: subs });
      }
    }
    if (prefilled.size > 0) setSelectedTopics(prefilled);
    prefillDoneRef.current = true;
  }, [existingLecture, topics]);

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = useCallback((topic: TopicItem) => {
    setSelectedTopics((prev) => {
      const next = new Map(prev);
      const entry = next.get(topic._id);
      if (entry?.topicSelected) {
        // Deselect topic and clear all its subtopics
        next.delete(topic._id);
      } else {
        // Select topic and auto-select all subtopics
        const allSubtopics = new Set<string>(topic.subtopics.map((s) => s._id));
        next.set(topic._id, {
          topic,
          topicSelected: true,
          selectedSubtopics: allSubtopics,
        });
        setExpandedTopics((e) => new Set(e).add(topic._id));
      }
      return next;
    });
  }, []);

  const toggleSubtopic = useCallback((topic: TopicItem, subtopicId: string) => {
    setSelectedTopics((prev) => {
      const next = new Map(prev);
      const entry = next.get(topic._id);
      const subs = new Set(entry?.selectedSubtopics ?? new Set<string>());
      if (subs.has(subtopicId)) {
        subs.delete(subtopicId);
      } else {
        subs.add(subtopicId);
      }
      if (subs.size === 0) {
        next.delete(topic._id);
      } else {
        // If topic was fully selected and a subtopic is now unchecked,
        // switch to "specific subtopics" mode (topicSelected = false).
        next.set(topic._id, { topic, topicSelected: false, selectedSubtopics: subs });
      }
      return next;
    });
    setExpandedTopics((e) => new Set(e).add(topic._id));
  }, []);

  const toggleTopicExpand = useCallback((topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }, []);

  const getDurationMinutes = () => {
    if (showCustomInput && customHours) return customHours * 60;
    if (selectedHours) return selectedHours * 60;
    return 60;
  };

  const isUnchanged = isUpdateMode && !!existingLecture && !!selectedChapter && (
    existingLecture.chapters?.[0]?._id === selectedChapter._id &&
    existingLecture.duration === getDurationMinutes() &&
    existingLecture.topics?.length === Array.from(selectedTopics.values()).filter(e => e.topicSelected).length &&
    (existingLecture.topics?.every((t: any) => selectedTopics.get(t._id)?.topicSelected) ?? false)
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedChapter) throw new Error("Please select a chapter");
      if (selectedTopics.size === 0 && !nothingDoneToday) throw new Error("Please select at least one topic or subtopic");

      // Build topics payload:
      // - topicSelected=true  → whole topic goes to planner; subtopics: []
      // - topicSelected=false → only the individually-selected subtopics go to planner
      const topicsPayload = Array.from(selectedTopics.values()).map(({ topic, topicSelected, selectedSubtopics }) => ({
        _id: topic._id,
        name: topic.name,
        subtopics: topicSelected
          ? []
          : topic.subtopics
              .filter((s) => selectedSubtopics.has(s._id))
              .map((s) => ({ _id: s._id, name: s.name })),
      }));
      const allSubtopics = topicsPayload.flatMap((t) =>
        t.subtopics.map((s) => ({ _id: s._id, name: s.name }))
      );

      const payload = {
        chapter: [{ _id: selectedChapter._id, name: selectedChapter.name }],
        topics: topicsPayload,
        subtopics: allSubtopics,
        duration: getDurationMinutes(),
      };

      if (isUpdateMode) return updateTodaysWork(existingLecture._id, payload);
      return createTodaysWork({ classId, batchId, ...payload });
    },
    onSuccess: () => {
      toast.success(
        isUpdateMode
          ? "Work updated! Student planners are being refreshed."
          : "Today's work saved! Student planners are being updated."
      );
      queryClient.invalidateQueries({ queryKey: ["class-details", classId] });
      queryClient.invalidateQueries({ queryKey: ["teacher-report"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["class-lectures", classId] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save today's work");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div>
    );
  }

  if (!classData) {
    return (
      <div className="p-8 text-center text-gray-500">Class details not found.</div>
    );
  }

  const selectedTopicNames = Array.from(selectedTopics.values())
    .filter(({ topicSelected }) => topicSelected)
    .map(({ topic }) => topic.name);
  const totalSelectedSubtopics = Array.from(selectedTopics.values()).reduce(
    (acc, { selectedSubtopics }) => acc + selectedSubtopics.size, 0
  );

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 md:space-y-5">
      {/* Date Picker */}
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-bold text-gray-900">Manage Class</h2>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 px-3 rounded-lg border-gray-200 bg-white text-sm font-semibold gap-2",
                !isToday && "border-purple-300 text-purple-700"
              )}
            >
              <CalendarIcon className="size-4" />
              {isToday ? "Today" : format(selectedDate, "dd MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                  prefillDoneRef.current = false;
                }
              }}
              disabled={(date) => date > new Date()}
              className="rounded-xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Add Work Card */}
      <div className="bg-purple-50/60 rounded-2xl p-4 md:p-6 space-y-5">
        <h2 className="text-base md:text-lg font-bold text-gray-900">
          Add Work for Students
        </h2>

        {/* Class Hours */}
        <div className="space-y-2.5">
          <label className="text-sm font-bold text-gray-800">Class Hours</label>
          <div className="flex items-center gap-2 flex-wrap">
            {HOUR_OPTIONS.map((hr) => (
              <button
                key={hr}
                onClick={() => {
                  setSelectedHours(hr);
                  setShowCustomInput(false);
                  setCustomHours(null);
                  setNothingDoneToday(false);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold border transition-all",
                  selectedHours === hr && !showCustomInput
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                )}
              >
                {hr} hour{hr > 1 ? "s" : ""}
              </button>
            ))}
            {showCustomInput ? (
              <input
                type="number"
                min={1}
                max={12}
                value={customHours || ""}
                onChange={(e) => {
                  setCustomHours(Number(e.target.value) || null);
                  setSelectedHours(null);
                }}
                placeholder="hrs"
                className="w-16 px-3 py-2 rounded-lg text-sm font-semibold border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setShowCustomInput(true);
                  setSelectedHours(null);
                  setNothingDoneToday(false);
                }}
                className="size-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-purple-300 transition-all"
              >
                <Plus className="size-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Select Chapter */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800">Select chapter</label>
          <Popover open={chapterPopoverOpen} onOpenChange={setChapterPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={nothingDoneToday}
                className={cn(
                  "w-full justify-between text-left h-11 rounded-lg bg-white",
                  !selectedChapter && "text-muted-foreground"
                )}
              >
                <span className="flex-1 truncate">
                  {selectedChapter
                    ? selectedChapter.name
                    : chaptersLoading
                    ? "Loading chapters..."
                    : "Choose the Chapter"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
              <Command>
                <CommandInput placeholder="Search chapter..." />
                <CommandList className="max-h-[200px]">
                  <CommandEmpty>No chapter found.</CommandEmpty>
                  <CommandGroup>
                    {chaptersLoading ? (
                      <CommandItem disabled>
                        <Loader2 className="animate-spin size-4 mr-2" />
                        Loading...
                      </CommandItem>
                    ) : (
                      chapters.map((chapter) => (
                        <CommandItem
                          key={chapter._id}
                          value={chapter.name}
                          onSelect={() => {
                            setSelectedChapter(chapter);
                            setSelectedTopics(new Map());
                            prefillDoneRef.current = true;
                            setChapterPopoverOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedChapter?._id === chapter._id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {chapter.name}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Select Topics */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800">
            Select Topics &amp; Subtopics
            {selectedTopics.size > 0 && (
              <span className="ml-1.5 text-xs font-normal text-purple-600">
                ({selectedTopicNames.length > 0 ? `${selectedTopicNames.length} topic${selectedTopicNames.length > 1 ? "s" : ""}` : ""}
                {selectedTopicNames.length > 0 && totalSelectedSubtopics > 0 ? ", " : ""}
                {totalSelectedSubtopics > 0 ? `${totalSelectedSubtopics} subtopic${totalSelectedSubtopics > 1 ? "s" : ""}` : ""})
              </span>
            )}
          </label>
          <Popover open={topicPopoverOpen} onOpenChange={setTopicPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={!selectedChapter || nothingDoneToday}
                className={cn(
                  "w-full justify-between text-left h-auto min-h-11 rounded-lg bg-white py-2",
                  selectedTopics.size === 0 && "text-muted-foreground"
                )}
              >
                <span className="flex-1 truncate text-sm">
                  {selectedTopics.size > 0
                    ? selectedTopicNames.length > 0
                      ? selectedTopicNames.join(", ") + (totalSelectedSubtopics > 0 ? ` + ${totalSelectedSubtopics} subtopic${totalSelectedSubtopics > 1 ? "s" : ""}` : "")
                      : `${totalSelectedSubtopics} subtopic${totalSelectedSubtopics > 1 ? "s" : ""} selected`
                    : topicsLoading
                    ? "Loading topics..."
                    : "Choose topics or subtopics"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
              {topicsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin size-4 mr-2 text-purple-500" />
                  <span className="text-sm text-gray-500">Loading topics...</span>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-sm text-gray-400 p-4 text-center">
                  No topics found
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto divide-y">
                  {topics.map((topic) => {
                    const entry = selectedTopics.get(topic._id);
                    const isTopicChecked = entry?.topicSelected ?? false;
                    const isExpanded = expandedTopics.has(topic._id);
                    const hasSubtopics = topic.subtopics.length > 0;
                    const selectedSubCount = entry?.selectedSubtopics.size ?? 0;
                    return (
                      <div key={topic._id} className="divide-y">
                        <div className="px-3 py-2.5 flex items-center gap-2">
                          <div
                            className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
                            onClick={() => toggleTopic(topic)}
                          >
                            <Checkbox checked={isTopicChecked} />
                            <span className="text-sm font-medium text-gray-800 flex-1">
                              {topic.name}
                            </span>
                            {selectedSubCount > 0 && (
                              <span className="text-xs text-purple-500 font-medium shrink-0">
                                {selectedSubCount}/{topic.subtopics.length}
                              </span>
                            )}
                          </div>
                          {hasSubtopics && (
                            <button
                              onClick={() => toggleTopicExpand(topic._id)}
                              className="p-1 rounded hover:bg-gray-100 text-gray-400 shrink-0"
                            >
                              {isExpanded ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        {isExpanded && hasSubtopics && (
                          <div className="bg-purple-50/40 divide-y divide-purple-100/50">
                            {topic.subtopics.map((sub) => {
                              const isSubSelected = entry?.selectedSubtopics.has(sub._id) ?? false;
                              return (
                                <div
                                  key={sub._id}
                                  className="flex items-center gap-2 pl-8 pr-3 py-2 cursor-pointer hover:bg-purple-50"
                                  onClick={() => toggleSubtopic(topic, sub._id)}
                                >
                                  <Checkbox
                                    checked={isSubSelected}
                                    className="size-3.5"
                                  />
                                  <span className="text-xs text-gray-600">{sub.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Nothing Done Today */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setNothingDoneToday(!nothingDoneToday);
              if (!nothingDoneToday) {
                setSelectedChapter(null);
                setSelectedTopics(new Map());
                setSelectedHours(null);
                setShowCustomInput(false);
                setCustomHours(null);
              }
            }}
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center transition-all",
              nothingDoneToday
                ? "border-purple-600 bg-purple-600"
                : "border-gray-300 bg-white"
            )}
          >
            {nothingDoneToday && (
              <div className="size-2 rounded-full bg-white" />
            )}
          </button>
          <span className="text-sm font-medium text-gray-700">Nothing Done Today</span>
        </div>

        {/* Add Button */}
        <div className="flex justify-center">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-2.5 rounded-full cursor-pointer"
            disabled={
              mutation.isPending ||
              isUnchanged ||
              (!nothingDoneToday && (!selectedChapter || selectedTopics.size === 0))
            }
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdateMode ? "Updating..." : "Adding..."}
              </>
            ) : isUpdateMode ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </div>

      {/* Additional Homework */}
      <div className="bg-purple-50/60 rounded-2xl p-4 md:p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Additional Homework</h3>
        <textarea
          value={homework}
          onChange={(e) => setHomework(e.target.value)}
          placeholder="Enter Your Homework details...."
          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[100px] resize-none"
        />

        <div className="flex items-center gap-3">
          <NotesUploadButton
            classId={classId}
            batchId={batchId || ""}
            subject={subject}
            dateStr={dateStr}
          />
          <DPPUploadButton
            classId={classId}
            batchId={batchId || ""}
            subject={subject}
            dateStr={dateStr}
          />
        </div>

        <ExistingNotesDPPList classId={classId} dateStr={dateStr} />
      </div>

      {/* Create Quiz */}
      <QuizSection
        classId={classId}
        batchId={batchId || ""}
        instituteId={classData?.instituteId || ""}
        subject={subject}
        batchStandard={batchStandard}
        chapters={chapters}
        chaptersLoading={chaptersLoading}
        dateStr={dateStr}
      />

      {/* Announcement */}
      <AnnouncementSection classId={classId} dateStr={dateStr} />
    </div>
  );
};

const QuizSection = ({
  classId,
  batchId,
  instituteId,
  subject,
  batchStandard,
  chapters,
  chaptersLoading,
  dateStr,
}: {
  classId: string;
  batchId: string;
  instituteId: string;
  subject: string;
  batchStandard: string | number;
  chapters: ChapterItem[];
  chaptersLoading: boolean;
  dateStr: string;
}) => {
  const queryClient = useQueryClient();
  const [quizChapter, setQuizChapter] = useState<ChapterItem | null>(null);
  const [quizChapterPopoverOpen, setQuizChapterPopoverOpen] = useState(false);

  const [quizTopics, setQuizTopics] = useState<TopicItem[]>([]);
  const [quizTopicsLoading, setQuizTopicsLoading] = useState(false);
  const [quizSelectedTopicIds, setQuizSelectedTopicIds] = useState<Set<string>>(new Set());
  const [quizTopicPopoverOpen, setQuizTopicPopoverOpen] = useState(false);

  const [questionsNumber, setQuestionsNumber] = useState(10);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!quizChapter) {
      setQuizTopics([]);
      setQuizSelectedTopicIds(new Set());
      return;
    }
    const fetchTopics = async () => {
      setQuizTopicsLoading(true);
      try {
        const data = await getTopicsWithSubtopics(subject, batchStandard, quizChapter._id);
        setQuizTopics(data.topics || []);
      } catch {
        toast.error("Failed to load topics");
      } finally {
        setQuizTopicsLoading(false);
      }
    };
    fetchTopics();
  }, [quizChapter, subject, batchStandard]);

  const toggleQuizTopic = useCallback((topicId: string) => {
    setQuizSelectedTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  }, []);

  const handleCreateQuiz = async () => {
    if (!quizChapter) {
      toast.error("Please select a chapter");
      return;
    }
    if (quizSelectedTopicIds.size === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (questionsNumber < 1 || questionsNumber > 75) {
      toast.error("Questions must be between 1 and 75");
      return;
    }

    setIsCreating(true);
    try {
      const res = await createQuizForClass({
        classId,
        batchId,
        instituteId,
        subject,
        chapterId: quizChapter._id,
        chapterName: quizChapter.name,
        topicIds: Array.from(quizSelectedTopicIds),
        questionsNumber,
      });

      if (res.success) {
        toast.success(res.message || "Quiz created successfully!");
        setQuizChapter(null);
        setQuizSelectedTopicIds(new Set());
        setQuestionsNumber(10);
        queryClient.invalidateQueries({ queryKey: ["existing-quizzes", classId, dateStr] });
      } else {
        toast.error(res.message || "Failed to create quiz");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTopicNames = quizTopics
    .filter((t) => quizSelectedTopicIds.has(t._id))
    .map((t) => t.name);

  return (
    <div className="bg-purple-50/60 rounded-2xl p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileQuestion className="size-5 text-purple-600" />
        <h3 className="text-base font-bold text-gray-900">Create Quiz</h3>
      </div>

      {/* Select Chapter */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-800">Select Chapter</label>
        <Popover open={quizChapterPopoverOpen} onOpenChange={setQuizChapterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between text-left h-11 rounded-lg bg-white",
                !quizChapter && "text-muted-foreground"
              )}
            >
              <span className="flex-1 truncate">
                {quizChapter
                  ? quizChapter.name
                  : chaptersLoading
                  ? "Loading chapters..."
                  : "Choose the Chapter"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
            <Command>
              <CommandInput placeholder="Search chapter..." />
              <CommandList className="max-h-[200px]">
                <CommandEmpty>No chapter found.</CommandEmpty>
                <CommandGroup>
                  {chaptersLoading ? (
                    <CommandItem disabled>
                      <Loader2 className="animate-spin size-4 mr-2" />
                      Loading...
                    </CommandItem>
                  ) : (
                    chapters.map((chapter) => (
                      <CommandItem
                        key={chapter._id}
                        value={chapter.name}
                        onSelect={() => {
                          setQuizChapter(chapter);
                          setQuizSelectedTopicIds(new Set());
                          setQuizChapterPopoverOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            quizChapter?._id === chapter._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {chapter.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Select Topics */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-800">Select Topics</label>
        <Popover open={quizTopicPopoverOpen} onOpenChange={setQuizTopicPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled={!quizChapter}
              className={cn(
                "w-full justify-between text-left h-11 rounded-lg bg-white",
                quizSelectedTopicIds.size === 0 && "text-muted-foreground"
              )}
            >
              <span className="flex-1 truncate">
                {quizSelectedTopicIds.size > 0
                  ? selectedTopicNames.join(", ")
                  : quizTopicsLoading
                  ? "Loading topics..."
                  : "Choose the Topics"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
            {quizTopicsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin size-4 mr-2 text-purple-500" />
                <span className="text-sm text-gray-500">Loading topics...</span>
              </div>
            ) : quizTopics.length === 0 ? (
              <div className="text-sm text-gray-400 p-4 text-center">
                No topics found
              </div>
            ) : (
              <div className="max-h-[250px] overflow-y-auto divide-y">
                {quizTopics.map((topic) => {
                  const isSelected = quizSelectedTopicIds.has(topic._id);
                  return (
                    <div key={topic._id} className="px-3 py-2">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
                        onClick={() => toggleQuizTopic(topic._id)}
                      >
                        <Checkbox checked={isSelected} />
                        <span className="text-sm font-medium text-gray-800">
                          {topic.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Number of Questions */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-800">
          Number of Questions <span className="font-normal text-gray-500">(max 75)</span>
        </label>
        <input
          type="number"
          min={1}
          max={75}
          value={questionsNumber}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val > 75) setQuestionsNumber(75);
            else if (val < 1) setQuestionsNumber(1);
            else setQuestionsNumber(val);
          }}
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-center pt-1">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-2.5 rounded-full cursor-pointer"
          disabled={isCreating || !quizChapter || quizSelectedTopicIds.size === 0}
          onClick={handleCreateQuiz}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Quiz"
          )}
        </Button>
      </div>

      <ExistingQuizzesList classId={classId} dateStr={dateStr} />
    </div>
  );
};

const NotesUploadButton = ({ classId, batchId, subject, dateStr }: { classId: string; batchId: string; subject: string; dateStr: string }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    uploadedFile,
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileSelect,
    handleFileChange,
    removeFile,
  } = useFileUpload({
    folder: "notes",
    maxSizeMB: 30,
    onError: (msg) => toast.error(msg),
  });

  const isImageFile = uploadedFile?.fileType &&
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(uploadedFile.fileType.toLowerCase());

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!uploadedFile?.fileUrl) {
      toast.error("Please upload a file");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createNote({
        title: title.trim(),
        batchId,
        classId,
        subject,
        fileUrl: uploadedFile.fileUrl,
        fileType: uploadedFile.fileType,
      });

      if (res.success) {
        toast.success("Note added successfully");
        setTitle("");
        removeFile();
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["existing-notes", classId, dateStr] });
      } else {
        toast.error(res.message || "Failed to add note");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex-1 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 h-10 text-sm font-semibold cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add Notes
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Notes</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="size-4 text-gray-500" />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp" />

            {!uploadedFile ? (
              <button
                onClick={triggerFileSelect}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-xl py-6 hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
              >
                <Upload className="size-8 text-purple-400" />
                <span className="text-sm text-gray-500">Click to upload file (max 30MB)</span>
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {isImageFile && uploadedFile.previewUrl && (
                  <div className="w-full max-h-36 overflow-hidden bg-gray-100">
                    <img src={uploadedFile.previewUrl} alt={uploadedFile.title} className="w-full h-full max-h-36 object-contain" />
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-purple-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700 truncate block">{uploadedFile.title}</span>
                      {isUploading && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-32">
                            <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{uploadProgress}%</span>
                        </div>
                      )}
                      {!isUploading && uploadedFile.fileUrl && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <Check className="size-3" /> Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-1 hover:bg-gray-100 rounded-full shrink-0 ml-2">
                    <X className="size-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full h-10 cursor-pointer"
              disabled={isSubmitting || isUploading || !title.trim() || !uploadedFile?.fileUrl}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Note"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const DPPUploadButton = ({ classId, batchId, subject, dateStr }: { classId: string; batchId: string; subject: string; dateStr: string }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    uploadedFile,
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileSelect,
    handleFileChange,
    removeFile,
  } = useFileUpload({
    folder: "dpp",
    maxSizeMB: 30,
    onError: (msg) => toast.error(msg),
  });

  const isImageFile = uploadedFile?.fileType &&
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(uploadedFile.fileType.toLowerCase());

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!uploadedFile?.fileUrl) {
      toast.error("Please upload a file");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createDPP({
        title: title.trim(),
        description: description.trim() || title.trim(),
        batchId,
        classId,
        subject,
        attachments: [
          {
            fileName: uploadedFile.title,
            fileUrl: uploadedFile.fileUrl,
            fileType: uploadedFile.fileType,
          },
        ],
      });

      if (res.success) {
        toast.success("DPP created successfully");
        setTitle("");
        setDescription("");
        removeFile();
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["existing-dpps", classId, dateStr] });
      } else {
        toast.error(res.message || "Failed to create DPP");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex-1 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 h-10 text-sm font-semibold cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add DPP
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add DPP</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="size-4 text-gray-500" />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="DPP title..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[70px] resize-none"
            />

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp" />

            {!uploadedFile ? (
              <button
                onClick={triggerFileSelect}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-xl py-6 hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
              >
                <Upload className="size-8 text-purple-400" />
                <span className="text-sm text-gray-500">Click to upload file (max 30MB)</span>
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {isImageFile && uploadedFile.previewUrl && (
                  <div className="w-full max-h-36 overflow-hidden bg-gray-100">
                    <img src={uploadedFile.previewUrl} alt={uploadedFile.title} className="w-full h-full max-h-36 object-contain" />
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-purple-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700 truncate block">{uploadedFile.title}</span>
                      {isUploading && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-32">
                            <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{uploadProgress}%</span>
                        </div>
                      )}
                      {!isUploading && uploadedFile.fileUrl && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <Check className="size-3" /> Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-1 hover:bg-gray-100 rounded-full shrink-0 ml-2">
                    <X className="size-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full h-10 cursor-pointer"
              disabled={isSubmitting || isUploading || !title.trim() || !uploadedFile?.fileUrl}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save DPP"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const AnnouncementSection = ({ classId, dateStr }: { classId: string; dateStr: string }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    uploadedFile: attachment,
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileSelect,
    handleFileChange,
    removeFile,
  } = useFileUpload({
    folder: "announcements",
    maxSizeMB: 30,
    onError: (msg) => toast.error(msg),
  });

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please enter announcement content");
      return;
    }

    if (isUploading) {
      toast.error("Please wait for the file to finish uploading");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAnnouncement({
        content,
        classId,
        attachment: attachment
          ? {
              title: attachment.title,
              fileUrl: attachment.fileUrl,
              fileType: attachment.fileType,
            }
          : undefined,
      });

      if (res.success) {
        toast.success("Announcement posted successfully");
        setContent("");
        removeFile();
        queryClient.invalidateQueries({ queryKey: ["existing-announcements", classId, dateStr] });
      } else {
        toast.error(res.message || "Failed to post announcement");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImagePreview = attachment?.fileType &&
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(attachment.fileType.toLowerCase());

  return (
    <div className="bg-purple-50/60 rounded-2xl p-4 md:p-6 space-y-4">
      <h3 className="text-base font-bold text-gray-900">Announcement</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write an announcement for the class...."
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[100px] resize-none"
      />

      {attachment && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isImagePreview && attachment.previewUrl && (
            <div className="relative w-full max-h-48 overflow-hidden bg-gray-50">
              <img
                src={attachment.previewUrl}
                alt={attachment.title}
                className="w-full h-full max-h-48 object-contain"
              />
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Paperclip className="size-4 text-purple-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block">
                  {attachment.title}
                </span>
                {isUploading && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-32">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{uploadProgress}%</span>
                  </div>
                )}
                {!isUploading && attachment.fileUrl && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <Check className="size-3" /> Uploaded
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2"
            >
              <X className="size-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-300 h-9 text-xs font-semibold cursor-pointer"
            onClick={triggerFileSelect}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Paperclip className="size-3.5 mr-1.5" />
                Add Attachment
              </>
            )}
          </Button>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-full cursor-pointer"
          disabled={isSubmitting || isUploading || !content.trim()}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>

      <ExistingAnnouncementsList classId={classId} dateStr={dateStr} />
    </div>
  );
};

const ExistingNotesDPPList = ({ classId, dateStr }: { classId: string; dateStr: string }) => {
  const queryClient = useQueryClient();

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ["existing-notes", classId, dateStr],
    queryFn: () => getNotes({ classId, date: dateStr }),
    enabled: !!classId,
  });

  const { data: dppsData, isLoading: dppsLoading } = useQuery({
    queryKey: ["existing-dpps", classId, dateStr],
    queryFn: () => getDPPs({ classId, date: dateStr }),
    enabled: !!classId,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existing-notes", classId, dateStr] });
      toast.success("Note deleted");
    },
    onError: () => toast.error("Failed to delete note"),
  });

  const deleteDPPMutation = useMutation({
    mutationFn: deleteDPP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existing-dpps", classId, dateStr] });
      toast.success("DPP deleted");
    },
    onError: () => toast.error("Failed to delete DPP"),
  });

  const notes = notesData?.notes || [];
  const dpps = dppsData?.dpps || dppsData?.assignments || [];

  if (notesLoading || dppsLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
        <Loader2 className="size-3.5 animate-spin" /> Loading...
      </div>
    );
  }

  if (notes.length === 0 && dpps.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      {notes.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>
          {notes.map((note: any) => (
            <div key={note._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-3.5 text-purple-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{note.title}</span>
              </div>
              <button
                onClick={() => deleteNoteMutation.mutate(note._id)}
                disabled={deleteNoteMutation.isPending}
                className="p-1 hover:bg-red-50 rounded-full transition-colors shrink-0"
              >
                <Trash2 className="size-3.5 text-red-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
      {dpps.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DPP</p>
          {dpps.map((dpp: any) => (
            <div key={dpp._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-3.5 text-blue-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{dpp.title}</span>
              </div>
              <button
                onClick={() => deleteDPPMutation.mutate(dpp._id)}
                disabled={deleteDPPMutation.isPending}
                className="p-1 hover:bg-red-50 rounded-full transition-colors shrink-0"
              >
                <Trash2 className="size-3.5 text-red-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExistingQuizzesList = ({ classId, dateStr }: { classId: string; dateStr: string }) => {
  const queryClient = useQueryClient();

  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ["existing-quizzes", classId, dateStr],
    queryFn: () => getClassQuizzes({ classId, date: dateStr }),
    enabled: !!classId,
  });

  const deleteQuizMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existing-quizzes", classId, dateStr] });
      toast.success("Quiz deleted");
    },
    onError: () => toast.error("Failed to delete quiz"),
  });

  const quizzes = quizzesData?.quizzes || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
        <Loader2 className="size-3.5 animate-spin" /> Loading...
      </div>
    );
  }

  if (quizzes.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quizzes for this day</p>
      {quizzes.map((quiz: any) => (
        <div key={quiz._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileQuestion className="size-3.5 text-purple-500 shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {quiz.totalQuestions || 0} questions{quiz.chapterName ? ` · ${quiz.chapterName}` : ""}
            </span>
          </div>
          <button
            onClick={() => deleteQuizMutation.mutate(quiz._id)}
            disabled={deleteQuizMutation.isPending}
            className="p-1 hover:bg-red-50 rounded-full transition-colors shrink-0"
          >
            <Trash2 className="size-3.5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

const ExistingAnnouncementsList = ({ classId, dateStr }: { classId: string; dateStr: string }) => {
  const queryClient = useQueryClient();

  const { data: announcementsData, isLoading } = useQuery({
    queryKey: ["existing-announcements", classId, dateStr],
    queryFn: () => getAnnouncements({ classId, date: dateStr }),
    enabled: !!classId,
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existing-announcements", classId, dateStr] });
      toast.success("Announcement deleted");
    },
    onError: () => toast.error("Failed to delete announcement"),
  });

  const announcements = announcementsData?.announcements || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
        <Loader2 className="size-3.5 animate-spin" /> Loading...
      </div>
    );
  }

  if (announcements.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Announcements for this day</p>
      {announcements.map((a: any) => (
        <div key={a._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className="size-3.5 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{a.content?.slice(0, 60)}{a.content?.length > 60 ? "..." : ""}</span>
          </div>
          <button
            onClick={() => deleteAnnouncementMutation.mutate(a._id)}
            disabled={deleteAnnouncementMutation.isPending}
            className="p-1 hover:bg-red-50 rounded-full transition-colors shrink-0"
          >
            <Trash2 className="size-3.5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Page;
