import React from "react";

import Image from "next/image";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import InstituteSidebar from "./_components/institute-sidebar";
import MobileBottomNav from "./_components/mobile-bottom-nav";

const InstituteLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ instituteId: string }>;
}) => {
  const { instituteId } = await params;

  return (
    <SidebarProvider>
      <InstituteSidebar instituteId={instituteId} />
      <div className="flex flex-col min-h-svh w-full min-w-0 flex-1 bg-background">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4 md:static md:border-none md:bg-background md:px-6 md:py-3">
          <SidebarTrigger className="h-9 w-9" />

          <Image
            src="/leadlly.jpeg"
            alt="Leadlly"
            width={50}
            height={50}
            className="h-9 w-9 rounded-lg"
          />
        </header>

        <main
          data-institute-content
          className="custom__scrollbar w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-3 sm:px-4 md:pb-10 md:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav instituteId={instituteId} />
    </SidebarProvider>
  );
};

export default InstituteLayout;
