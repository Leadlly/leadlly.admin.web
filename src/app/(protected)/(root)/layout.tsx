import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getAllUserInstitutes } from "@/actions/institute_actions";

import MainHeader from "./_components/main-header";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["all_institutes"],
    queryFn: getAllUserInstitutes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Unable to fetch institutes</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <MainHeader />
        </Suspense>
      </ErrorBoundary>
      <div>{children}</div>
    </HydrationBoundary>
  );
};

export default MainLayout;
