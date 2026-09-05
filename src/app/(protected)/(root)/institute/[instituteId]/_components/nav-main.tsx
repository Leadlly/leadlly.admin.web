"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GraduationCap, Hash, IndianRupee, Library, LucideIcon } from "lucide-react";
import { BookOpen, LayoutDashboard, Shield, Users } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  {
    label: "Teachers",
    icon: GraduationCap,
    href: (id: string) => `/institute/${id}/teachers`,
    exact: false,
  },
  {
    label: "Fee Management",
    icon: IndianRupee,
    href: (id: string) => `/institute/${id}/fees`,
    exact: false,
  },
  {
    label: "Student UIDs",
    icon: Hash,
    href: (id: string) => `/institute/${id}/uins`,
    exact: false,
  },
  {
    label: "Admins",
    icon: Shield,
    href: (id: string) => `/institute/${id}/admins`,
    exact: false,
  },
  {
    label: "Question Bank",
    icon: Library,
    href: (id: string) => `/institute/${id}/question-bank`,
    exact: false,
  },
];

const NavMain = ({ instituteId }: { instituteId: string }) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              isActive={
                item.exact
                  ? pathname === item.href(instituteId)
                  : pathname.startsWith(item.href(instituteId))
              }
            >
              <Link href={item.href(instituteId)}>
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
