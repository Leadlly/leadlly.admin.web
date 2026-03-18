import React from "react";
import InstituteSidebar from "./_components/InstituteSidebar";

const InstituteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <InstituteSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default InstituteLayout;
