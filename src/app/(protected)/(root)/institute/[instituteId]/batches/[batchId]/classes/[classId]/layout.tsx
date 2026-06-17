import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ClassTab from "./_components/class-tab";

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) {
  const { instituteId, batchId } = await params;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/institute/${instituteId}/batches/${batchId}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Batch
        </Link>
      </div>

      <ClassTab />
      <div className="flex-1 w-full bg-white">{children}</div>
    </div>
  );
}
