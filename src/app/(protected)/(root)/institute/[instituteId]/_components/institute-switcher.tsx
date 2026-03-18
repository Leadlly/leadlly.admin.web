"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  getActiveInstitute,
  getAllUserInstitutes,
} from "@/actions/institute_actions";
import CreateInstituteForm from "@/components/create-institute-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const InstituteSwitcher = ({ instituteId }: { instituteId: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const { isMobile } = useSidebar();

  const { data: activeInstitute } = useSuspenseQuery({
    queryKey: ["active_institute", instituteId],
    queryFn: () => getActiveInstitute({ instituteId: instituteId }),
  });

  const { data: institutes } = useSuspenseQuery({
    queryKey: ["all_institutes"],
    queryFn: getAllUserInstitutes,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar>
                  <AvatarImage src={activeInstitute.institute?.logo?.url} />
                  <AvatarFallback>
                    {activeInstitute?.institute?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {activeInstitute?.institute?.name || "Select Institute"}
                </span>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                My Institutes
              </DropdownMenuLabel>
              {institutes?.institutes?.map((institute) => (
                <DropdownMenuItem
                  key={institute._id}
                  className={cn(
                    "flex items-center justify-between",
                    institute._id === activeInstitute?.institute?._id &&
                      "bg-primary/10 text-primary"
                  )}
                  onClick={() => router.replace(`/institute/${institute._id}`)}
                >
                  <span>{institute.name}</span>
                  {institute._id === activeInstitute?.institute?._id && (
                    <Check className="size-4" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Plus className="mr-2 size-4" />
                  <span>Add Institute</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogContent className="max-h-[95dvh] overflow-y-auto sm:max-w-2xl w-full custom__scrollbar">
        <DialogHeader>
          <DialogTitle>Add Institute</DialogTitle>
          <DialogDescription>
            Add a new institute to your account.
          </DialogDescription>
        </DialogHeader>

        <CreateInstituteForm setDialogOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default InstituteSwitcher;
