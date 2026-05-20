import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { getClassDetails } from "@/actions/batch_actions";
import ClassDetail from "./_components/class-detail";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) {
  const { instituteId, batchId, classId } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-class-details", classId],
    queryFn: () => getClassDetails(classId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/institute/${instituteId}/batches/${batchId}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Batch
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
          </div>
        }
      >
        <ClassDetail classId={classId} />
      </Suspense>
    </HydrationBoundary>
  );
}
