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
      <div className="flex flex-col h-screen container mx-auto px-4 sm:px-6 lg:px-8 bg-background">
        <div className="flex items-center justify-between">
          <SidebarTrigger />

          <Image
            src="/leadlly.jpeg"
            alt="Leadlly"
            width={50}
            height={50}
            className="w-10 h-10"
          />
        </div>

        <main className="flex-1 overflow-y-auto custom__scrollbar pb-24 md:pb-10 pt-3">
          {children}
        </main>
      </div>
      <MobileBottomNav instituteId={instituteId} />
    </SidebarProvider>
  );
};

export default InstituteLayout;
