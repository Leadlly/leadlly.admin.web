"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: (id: string) => `/institute/${id}`,
    exact: true,
  },
  {
    label: "Batches",
    icon: BookOpen,
    href: (id: string) => `/institute/${id}/batches`,
    exact: false,
  },
  {
    label: "Students",
    icon: Users,
    href: (id: string) => `/institute/${id}/students`,
    exact: false,
  },
];

const InstituteSidebar = () => {
  const { instituteId } = useParams<{ instituteId: string }>();
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col gap-1 border-r border-border bg-background pt-6 pb-10 px-3 min-h-[calc(100vh-64px)]">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
        Institute
      </p>
      {navItems.map(({ label, icon: Icon, href, exact }) => {
        const to = href(instituteId ?? "");
        const isActive = exact
          ? pathname === to
          : pathname.startsWith(to);

        return (
          <Link
            key={label}
            href={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
};

export default InstituteSidebar;
