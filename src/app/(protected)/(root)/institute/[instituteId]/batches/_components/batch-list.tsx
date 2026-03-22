"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { getInstituteBatch } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AssignTeacherDialog from "./assign-teacher-dialog";
import CreateBatch from "./create-batch";

interface ApiBatch {
  _id: string;
  name: string;
  standard: string;
  status: "Active" | "Inactive" | "Completed";
  payment?: {
    subscriptionType: "Free" | "Paid";
    amount: number;
    currency: string;
  };
  createdAt?: string;
  subjects?: string[];
  totalStudents?: number;
  totalCapacity?: number;
}

const getBatchLogoBg = (batchName: string) => {
  switch (batchName) {
    case "Omega":
      return "bg-blue-500";
    case "Sigma":
      return "bg-purple-500";
    case "Alpha":
      return "bg-teal-500";
    case "Beta":
      return "bg-yellow-500";
    default:
      return "bg-indigo-500";
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-600";
    case "Inactive":
      return "bg-gray-100 text-gray-500";
    case "Completed":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export default function BatchList({ instituteId }: { instituteId: string }) {
  const [filterStandard, setFilterStandard] = useState("");
  const [filterLabel, setFilterLabel] = useState("All Standards");
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    batchId: string;
    batchName: string;
  }>({ open: false, batchId: "", batchName: "" });

  const { data } = useSuspenseQuery({
    queryKey: ["institute_batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });

  const batches: ApiBatch[] = data?.data ?? [];

  const uniqueStandards = Array.from(new Set(batches.map((b) => b.standard))).sort(
    (a, b) => Number(a) - Number(b)
  );

  const filteredBatches = batches
    .filter((batch) => (filterStandard ? batch.standard === filterStandard : true))
    .sort((a, b) => Number(a.standard) - Number(b.standard));

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm text-left min-w-[150px] hover:bg-gray-50 transition-colors">
              <span className="flex-1">{filterLabel}</span>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setFilterStandard("");
                  setFilterLabel("All Standards");
                }}
              >
                All Standards
              </DropdownMenuItem>
              {uniqueStandards.map((standard) => (
                <DropdownMenuItem
                  key={standard}
                  onClick={() => {
                    setFilterStandard(standard);
                    setFilterLabel(`${standard}th Standard`);
                  }}
                >
                  {standard}th Standard
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CreateBatch
          instituteId={instituteId}
          standard={filterStandard}
          trigger={
            <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-none h-9 px-5 text-sm rounded-lg font-medium">
              + Add Batch
            </Button>
          }
        />
      </div>

      {/* Batch grid */}
      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredBatches.map((batch) => {
            const totalStudents = batch.totalStudents ?? 0;

            return (
              <div
                key={batch._id}
                className="bg-white rounded-2xl p-5 flex flex-col border border-gray-200 shadow-sm hover:bg-gray-50/70 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-11 h-11 shrink-0 ${getBatchLogoBg(batch.name)} rounded-xl flex items-center justify-center text-white`}
                  >
                    {batch.name.toLowerCase().includes("omega") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">
                      {batch.name}
                    </h3>
                    <p className="text-gray-400 text-[11px] font-medium mt-0.5">
                      {batch.standard}th Class
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center shrink-0 tracking-wide uppercase ${getStatusStyle(batch.status)}`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="text-[12px] mb-3 text-gray-500">
                  Subject:{" "}
                  <span className="font-semibold text-gray-800">
                    {batch.subjects && batch.subjects.length > 0
                      ? batch.subjects.join(", ")
                      : "Not specified"}
                  </span>
                </div>

                <div className="text-[12px] mb-4 mt-auto text-gray-500">
                  Students:{" "}
                  <span className="font-bold text-gray-900">{totalStudents}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1 h-8 text-xs rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white shadow-none"
                  >
                    <Link href={`/institute/${instituteId}/batches/${batch._id}`}>
                      View Batch
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs rounded-lg font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-none"
                    onClick={() =>
                      setAssignDialog({
                        open: true,
                        batchId: batch._id,
                        batchName: batch.name,
                      })
                    }
                  >
                    Assign Teacher
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">
            No batches found. Try adjusting your filters or add a new batch.
          </p>
        </div>
      )}

      <AssignTeacherDialog
        open={assignDialog.open}
        onOpenChange={(v) =>
          setAssignDialog((prev) => ({ ...prev, open: v }))
        }
        batchId={assignDialog.batchId}
        batchName={assignDialog.batchName}
        instituteId={instituteId}
      />
    </>
  );
}
