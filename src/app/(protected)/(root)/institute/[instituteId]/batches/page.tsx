import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getInstituteBatch } from "@/actions/batch_actions";

import BatchList from "./_components/batch-list";

export default async function BatchesPage({
  params,
}: {
  params: Promise<{ instituteId: string }>;
}) {
  const { instituteId } = await params;

  const queryClient = new QueryClient();

  // Prefetch the batches route.
  await queryClient.prefetchQuery({
    queryKey: ["institute_batches", instituteId],
    queryFn: () => getInstituteBatch(instituteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Student Batches of Institute
        </h1>
      </div>

      <ErrorBoundary
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">
                Failed to load batches. Please try again later.
              </span>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            </div>
          }
        >
          <BatchList instituteId={instituteId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
