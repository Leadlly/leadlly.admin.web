"use client";

import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { Search } from "lucide-react";

import { getInstituteBatch } from "@/actions/batch_actions";
import {
  assignBatchesToTeacher,
  getInstituteTeachers,
} from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxCollection,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

type ApiBatch = {
  _id: string;
  name?: string;
  standard?: string;
};

type ApiTeacher = {
  _id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: { personal?: number | null; other?: number | null } | null;
  academic?: {
    schoolOrCollegeName?: string | null;
    degree?: string | null;
  } | null;
};

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  contact: string;
  activeClasses: number | null;
  totalStudents: number | null;
}

export default function TeachersPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const [batches, setBatches] = useState<ApiBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const anchor = useComboboxAnchor();

  const batchById = useMemo(() => {
    return new Map(batches.map((b) => [b._id, b] as const));
  }, [batches]);

  const batchIds = useMemo(() => batches.map((b) => b._id), [batches]);

  const formatBatchLabel = (batchId: string) => {
    const b = batchById.get(batchId);
    if (!b) return batchId;
    const name = b.name ?? "Batch";
    const standard = b.standard ? ` (${b.standard}th)` : "";
    return `${name}${standard}`;
  };

  useEffect(() => {
    if (!instituteId) return;

    let isCancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getInstituteTeachers(instituteId);
        if (isCancelled) return;

        if (!res.success) {
          setError(res.message ?? "Error loading teachers");
          setTeachers([]);
          return;
        }

        const mapped: Teacher[] = (res.teachers ?? []).map((t: ApiTeacher) => {
          const name = `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim();
          const subject = (t.academic?.degree ?? t.academic?.schoolOrCollegeName ?? "—").toString();
          const contactValue = t.phone?.personal ?? t.phone?.other;

          return {
            id: String(t._id),
            name: name || "Teacher",
            subject,
            email: t.email ?? "",
            contact: contactValue != null ? String(contactValue) : "—",
            // Backend endpoint does not currently return these stats.
            activeClasses: null,
            totalStudents: null,
          };
        });

        setTeachers(mapped);
      } catch (err) {
        if (isCancelled) return;
        setError("Error loading teachers. Please try again later.");
        console.error("Error fetching teachers:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [instituteId]);

  useEffect(() => {
    // When institute changes, clear previously loaded batches.
    setBatches([]);
  }, [instituteId]);

  const loadBatches = async () => {
    if (!instituteId) return;
    setBatchesLoading(true);
    try {
      const res = await getInstituteBatch(instituteId);
      if (res?.success) {
        setBatches((res?.data ?? []) as ApiBatch[]);
      } else {
        toast.error(res?.message ?? "Failed to load batches");
      }
    } catch (e) {
      toast.error("Failed to load batches");
      console.error("Failed to load batches:", e);
    } finally {
      setBatchesLoading(false);
    }
  };

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const t of teachers) {
      if (t.subject && t.subject !== "—") set.add(t.subject);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [teachers]);

  // Filtering logic
  const filteredTeachers = teachers.filter((teacher) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSubject = selectedSubject === "All" || teacher.subject === selectedSubject;
    if (!matchesSubject) return false;
    if (!q) return true;

    return (
      teacher.name.toLowerCase().includes(q) ||
      teacher.subject.toLowerCase().includes(q) ||
      teacher.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Teachers</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl">
          Add Teacher
        </Button>
      </div>

      {/* Search & Subject Filter */}
      <div className="bg-white p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Subject Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={selectedSubject === "All" ? "default" : "outline"}
            className={
              selectedSubject === "All"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("All")}
          >
            All
          </Button>

          {subjects.map((sub) => (
            <Button
              key={sub}
              variant={selectedSubject === sub ? "default" : "outline"}
              className={
                selectedSubject === sub
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : ""
              }
              onClick={() => setSelectedSubject(sub)}
            >
              {sub}
            </Button>
          ))}
        </div>
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="shadow-xl transition rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-lg truncate">{teacher.name}</p>
                      <p className="text-gray-500 text-sm font-normal truncate">{teacher.subject !== "—" ? teacher.subject : ""}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mt-1">
                    <Link
                      href={`/institute/${instituteId}/teachers/${teacher.id}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                      >
                        View Teacher
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        setActiveTeacherId(teacher.id);
                        setSelectedBatchIds([]);
                        setAssignOpen(true);
                        if (batches.length === 0 && !batchesLoading) {
                          void loadBatches();
                        }
                      }}
                    >
                      Assign Batch
                    </Button>
                  </div>
                </CardContent>
              </Card>
          ))
        ) : (
          <p className="text-gray-600">
            No teachers found. Try adjusting your search.
          </p>
        )}
      </div>

      <Dialog
        open={assignOpen}
        onOpenChange={(v) => {
          setAssignOpen(v);
          if (!v) {
            setSelectedBatchIds([]);
            setActiveTeacherId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Assign batches
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            {batchesLoading && batches.length === 0 ? (
              <div className="py-6 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : batches.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4">
                No batches found for this institute.
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Select multiple batches to assign:
                </p>

                <Combobox
                  multiple
                  autoHighlight
                  items={batchIds}
                  value={selectedBatchIds}
                  onValueChange={(value) => {
                    setSelectedBatchIds(value as string[]);
                  }}
                >
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((id: string) => (
                            <ComboboxChip key={id}>
                              {formatBatchLabel(id)}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Search batches..." />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>

                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No batches found.</ComboboxEmpty>
                    <ComboboxList>
                      <ComboboxCollection>
                        {(id) => (
                          <ComboboxItem key={id} value={id}>
                            {formatBatchLabel(id as string)}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={assignSubmitting}
                onClick={() => setAssignOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={
                  assignSubmitting ||
                  !activeTeacherId ||
                  selectedBatchIds.length === 0
                }
                onClick={async () => {
                  if (!activeTeacherId) return;
                  setAssignSubmitting(true);
                  try {
                    const res = await assignBatchesToTeacher(
                      instituteId,
                      activeTeacherId,
                      selectedBatchIds
                    );
                    if (res.success) {
                      toast.success("Batches assigned successfully");
                      setAssignOpen(false);
                      setSelectedBatchIds([]);
                    } else {
                      toast.error(res.message ?? "Failed to assign batches");
                    }
                  } catch (e) {
                    toast.error("Failed to assign batches");
                    console.error("Assign batches error:", e);
                  } finally {
                    setAssignSubmitting(false);
                  }
                }}
              >
                {assignSubmitting ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
