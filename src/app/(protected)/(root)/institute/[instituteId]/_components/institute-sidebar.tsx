import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  getActiveInstitute,
  getAllUserInstitutes,
} from "@/actions/institute_actions";
import { getUser } from "@/actions/user_actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import InstituteSwitcher from "./institute-switcher";
import NavMain from "./nav-main";
import NavUser from "./nav-user";

const InstituteSidebar = async ({
  instituteId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { instituteId: string }) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["active_institute", instituteId],
      queryFn: () => getActiveInstitute({ instituteId: instituteId }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["all_institutes"],
      queryFn: getAllUserInstitutes,
    }),
    queryClient.prefetchQuery({
      queryKey: ["current_user"],
      queryFn: getUser,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar {...props}>
        <SidebarHeader>
          <ErrorBoundary fallback={<div>Unable to fetch institutes</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <InstituteSwitcher instituteId={instituteId} />
            </Suspense>
          </ErrorBoundary>
        </SidebarHeader>

        <SidebarContent>
          <NavMain instituteId={instituteId} />
        </SidebarContent>

        <SidebarFooter>
          <ErrorBoundary fallback={<div>Unable to fetch user</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <NavUser />
            </Suspense>
          </ErrorBoundary>
        </SidebarFooter>
      </Sidebar>
    </HydrationBoundary>
  );
};

export default InstituteSidebar;
