import React, { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getBatchDetails, getBatchClasses } from "@/actions/batch_actions";

import BatchDashboard from "./_components/batch-dashboard";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string }>;
}) {
  const { instituteId, batchId } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin-batch-details", batchId],
      queryFn: () => getBatchDetails(batchId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["admin-batch-classes", batchId],
      queryFn: () => getBatchClasses(batchId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/institute/${instituteId}/batches`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Batches
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
          </div>
        }
      >
        <BatchDashboard batchId={batchId} instituteId={instituteId} />
      </Suspense>
    </HydrationBoundary>
  );
}
