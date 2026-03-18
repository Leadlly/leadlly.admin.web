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

export default function BatchList({ instituteId }: { instituteId: string }) {
  const [filters, setFilters] = useState({
    standard: "",
  });
  const [filterLabels, setFilterLabels] = useState({
    standard: "All Standards",
  });

  const { data } = useSuspenseQuery({
    queryKey: ["institute_batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });

  const batches: ApiBatch[] = data?.data ?? [];

  const handleFilterChange = (value: string, label: string) => {
    setFilters({ standard: value });
    setFilterLabels({ standard: label });
  };

  const filteredBatches = batches.filter((batch) =>
    filters.standard ? batch.standard === filters.standard : true
  );

  // Group by standard
  const batchesByStandard = filteredBatches.reduce(
    (acc, batch) => {
      if (!acc[batch.standard]) acc[batch.standard] = [];
      acc[batch.standard].push(batch);
      return acc;
    },
    {} as Record<string, ApiBatch[]>
  );

  const sortedStandards = Object.keys(batchesByStandard).sort(
    (a, b) => Number(a) - Number(b)
  );

  return (
    <>
      <div className="bg-white p-4 md:p-6 lg:p-8 mb-8 border-2 shadow-inner rounded-3xl">
        <div className="flex items-center gap-4">
          <span className="font-medium">Filter by :</span>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-between w-full border rounded-md px-4 py-2 text-left">
                <span>{filterLabels.standard}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => handleFilterChange("", "All Standards")}
                >
                  All Standards
                </DropdownMenuItem>
                {Array.from(new Set(batches.map((b) => b.standard)))
                  .sort((a, b) => Number(a) - Number(b))
                  .map((standard) => (
                    <DropdownMenuItem
                      key={standard}
                      onClick={() =>
                        handleFilterChange(standard, `${standard} Standard`)
                      }
                    >
                      {standard} Standard
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {sortedStandards.length > 0 ? (
        <div className="flex flex-col gap-8">
          {sortedStandards.map((standard) => (
            <div
              key={standard}
              className="bg-white rounded-4xl border-2 p-6 md:p-8 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                  {standard}th standard
                </h2>
                <CreateBatch
                  instituteId={instituteId}
                  standard={standard}
                  trigger={
                    <Button variant="link" className="font-semibold px-3">
                      <span className="mr-1.5 text-lg leading-none">+</span> Add
                      batch
                    </Button>
                  }
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {batchesByStandard[standard].map((batch) => {
                  const totalStudents = batch.totalStudents ?? 0;
                  const totalCapacity = batch.totalCapacity ?? 180;
                  const progress = Math.min(
                    (totalStudents / Math.max(totalCapacity, 1)) * 100,
                    100
                  );

                  return (
                    <div
                      key={batch._id}
                      className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className={`w-12 h-12 shrink-0 ${getBatchLogoBg(
                            batch.name
                          )} rounded-full flex items-center justify-center text-white`}
                        >
                          {batch.name.toLowerCase().includes("omega") ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
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
                              className="h-6 w-6"
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
                          <h3 className="font-bold text-base text-gray-900 truncate tracking-tight">
                            {batch.name}
                          </h3>
                          <p className="text-gray-400 text-[11px] font-medium">
                            {batch.standard}th Class
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded flex items-center shrink-0 tracking-wide uppercase">
                          {batch.status}
                        </span>
                      </div>

                      <div className="text-[13px] mb-3 text-gray-500">
                        Subject :{" "}
                        <span className="font-semibold text-gray-900">
                          {batch.subjects && batch.subjects.length > 0
                            ? batch.subjects.join(", ")
                            : "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[13px] mb-2 mt-auto">
                        <div className="text-gray-500">
                          Total Students :{" "}
                          <span className="font-bold text-gray-900">
                            {totalStudents}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-800">
                          {totalStudents}/{totalCapacity}
                        </div>
                      </div>

                      <div className="w-full bg-gray-200/80 rounded-full h-[6px] mb-5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-[6px] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          asChild
                          className="bg-purple-500 hover:bg-purple-600 text-white shadow-none h-8 px-5 text-xs rounded-[8px] font-medium tracking-wide"
                        >
                          <Link
                            href={`/institute/${instituteId}/batches/${batch._id}`}
                          >
                            View More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-4xl text-center border-2 border-dashed">
          <p className="text-gray-600">
            No batches found. Try adjusting your filters.
          </p>
        </div>
      )}
    </>
  );
}
