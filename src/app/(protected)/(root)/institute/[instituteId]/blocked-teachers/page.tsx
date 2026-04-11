"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";

import { getBlockedTeachers, unblockTeacher } from "@/actions/teacher_actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BlockedTeacher = {
  _id: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  academic?: { degree?: string | null; schoolOrCollegeName?: string | null } | null;
  blockedAt?: string | null;
};

function teacherName(t: BlockedTeacher) {
  return `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim() || "Teacher";
}

export default function BlockedTeachersPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";

  const [teachers, setTeachers] = useState<BlockedTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockConfirm, setUnblockConfirm] = useState<{ id: string; name: string } | null>(null);
  const [unblockSubmitting, setUnblockSubmitting] = useState(false);

  useEffect(() => {
    if (!instituteId) return;
    setLoading(true);
    getBlockedTeachers(instituteId)
      .then((res) => {
        if (res.success) setTeachers(res.teachers);
        else toast.error(res.message ?? "Failed to load blocked teachers");
      })
      .catch(() => toast.error("Failed to load blocked teachers"))
      .finally(() => setLoading(false));
  }, [instituteId]);

  const handleUnblock = async () => {
    if (!unblockConfirm) return;
    setUnblockSubmitting(true);
    try {
      const res = await unblockTeacher(instituteId, unblockConfirm.id);
      if (res.success) {
        toast.success(`${unblockConfirm.name} has been unblocked`);
        setTeachers((prev) => prev.filter((t) => t._id !== unblockConfirm.id));
        setUnblockConfirm(null);
      } else {
        toast.error(res.message ?? "Failed to unblock teacher");
      }
    } catch {
      toast.error("Failed to unblock teacher");
    } finally {
      setUnblockSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href={`/institute/${instituteId}/teachers`}
          className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
        >
          ← Back to Teachers
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <ShieldOff className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blocked Teachers</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Teachers removed from this institute. They cannot access the mentor portal.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="py-20 text-center">
          <ShieldCheck className="h-12 w-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No blocked teachers</p>
          <p className="text-sm text-gray-400 mt-1">All teachers in this institute have full access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {teachers.map((teacher) => {
            const name = teacherName(teacher);
            const subject = teacher.academic?.degree ?? teacher.academic?.schoolOrCollegeName ?? null;
            const blockedDate = teacher.blockedAt
              ? new Date(teacher.blockedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={teacher._id}
                className="bg-white rounded-2xl p-5 flex flex-col border border-red-100 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{name}</h3>
                    <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">
                      {subject ?? "Teacher"}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded tracking-wide uppercase bg-red-100 text-red-600 shrink-0">
                    Blocked
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 mb-4">
                  {teacher.email && (
                    <p className="truncate mb-0.5">
                      <span className="text-gray-500">Email:</span> {teacher.email}
                    </p>
                  )}
                  {blockedDate && (
                    <p>
                      <span className="text-gray-500">Blocked on:</span> {blockedDate}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => setUnblockConfirm({ id: teacher._id, name })}
                  className="mt-auto h-8 text-xs rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white shadow-none w-full"
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                  Restore Access
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Unblock confirmation */}
      <AlertDialog open={!!unblockConfirm} onOpenChange={(v) => { if (!v) setUnblockConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore access for &quot;{unblockConfirm?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This teacher will be unblocked and will be able to access the mentor portal again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unblockSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnblock}
              disabled={unblockSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-600"
            >
              {unblockSubmitting ? "Restoring..." : "Restore Access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
