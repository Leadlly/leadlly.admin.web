"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBatches } from "@/providers/BatchesProvider";
import type { Batch } from "@/lib/validations/schema";
import { AddBatchModal } from "@/components/modals/AddBatchModal";

const BatchCard = ({ batch }: { batch: Batch }) => (
  <Card key={batch.id} className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 ${batch.iconBg} rounded-full flex items-center justify-center text-white`}
        >
          {batch.icon}
        </div>
        <div>
          <h3 className="font-semibold">{batch.name}</h3>
          <p className="text-sm text-gray-600">{batch.class}th Class</p>
        </div>
      </div>
      <Badge
        variant="secondary"
        className={
          batch.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }
      >
        {batch.status}
      </Badge>
    </div>

    <div className="mb-4">
      <p className="text-gray-600 mb-1">Subject:</p>
      <p className="font-medium">{batch.subjects.join(", ")}</p>
    </div>

    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600">Total Students:</span>
        <span>
          {batch.totalStudents}/{batch.maxStudents}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full"
          style={{
            width: `${(batch.totalStudents / batch.maxStudents) * 100}%`,
          }}
        ></div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <p className="text-gray-600">-By {batch.teacher}</p>
      <Link href={`/batches/${batch.id}/students`}>
        <Button
          variant="secondary"
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          View More
        </Button>
      </Link>
    </div>
  </Card>
);

export default function BatchesPage() {
  const { batches, isLoading, error, refetch } = useBatches();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    refetch({
      class: classFilter === "all" ? undefined : classFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      subject: subjectFilter === "all" ? undefined : subjectFilter,
    });
  }, [statusFilter, subjectFilter, classFilter]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="text-lg font-semibold mb-2">Error Loading Batches</h3>
          <p>{error}</p>
          <Button
            onClick={() => refetch()}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-800"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Group batches by class
  const class11Batches = batches.filter((batch) => batch.class === "11");
  const class12Batches = batches.filter((batch) => batch.class === "12");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Student Batches of Institute</h1>

      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="subject-filter"
            className="text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger id="subject-filter" className="w-[180px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="class-filter"
            className="text-sm font-medium text-gray-700"
          >
            Class
          </label>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger id="class-filter" className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="11">11th Class</SelectItem>
              <SelectItem value="12">12th Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {(classFilter === "all" || classFilter === "11") &&
          class11Batches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">11th standard</h2>
                <Button
                  variant="outline"
                  className="text-purple-600"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Add batch
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {class11Batches.map((batch) => (
                  <BatchCard key={batch.id} batch={batch} />
                ))}
              </div>
            </div>
          )}

        {(classFilter === "all" || classFilter === "12") &&
          class12Batches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">12th standard</h2>
                <Button
                  variant="outline"
                  className="text-purple-600"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Add batch
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {class12Batches.map((batch) => (
                  <BatchCard key={batch.id} batch={batch} />
                ))}
              </div>
            </div>
          )}

        {batches.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No batches found matching the selected filters.
            </p>
          </div>
        )}
      </div>

      <AddBatchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
