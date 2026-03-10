"use client";

import React, { useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Plus } from "lucide-react";

import {
  getActiveInstitute,
  getAllUserInstitutes,
} from "@/actions/institute_actions";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

import CreateInstituteForm from "../../create-institute/_components/create-institute-form";

const MainHeader = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { instituteId } = useParams<{ instituteId: string }>();
  const router = useRouter();

  const { data: activeInstitute } = useQuery({
    queryKey: ["active_institute", instituteId],
    queryFn: () => getActiveInstitute({ instituteId }),
  });

  const { data: institutes } = useSuspenseQuery({
    queryKey: ["all_institutes"],
    queryFn: getAllUserInstitutes,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <Image src={"/leadlly.jpeg"} alt="Leadlly" width={60} height={60} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"lg"}>
              <span>
                {activeInstitute?.institute.name || "Select Institute"}
              </span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              My Institutes
            </DropdownMenuLabel>
            {institutes?.institutes?.map((institute) => (
              <DropdownMenuItem
                key={institute._id}
                className={cn(
                  "flex items-center justify-between",
                  institute._id === activeInstitute?.institute._id &&
                    "bg-primary/10 text-primary"
                )}
                onClick={() => router.replace(`/institute/${institute._id}`)}
              >
                <span>{institute.name}</span>
                {institute._id === activeInstitute?.institute._id && (
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
    </div>
  );
};

export default MainHeader;
