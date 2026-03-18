"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronsUpDown, LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { getUser } from "@/actions/user_actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

const NavUser = () => {
  const { isMobile } = useSidebar();

  const { data } = useSuspenseQuery({
    queryKey: ["current_user"],
    queryFn: getUser,
  });

  const user = data.admin;

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to logout");
      }

      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error) {
      console.log(error);

      toast.error("Failed to logout");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar.url}
                  alt={user.firstname + " " + user.lastname}
                />
                <AvatarFallback className="rounded-lg">
                  {user.firstname.charAt(0).toUpperCase() +
                    user.lastname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.firstname + " " + user.lastname}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar.url}
                    alt={user.firstname + " " + user.lastname}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.firstname.charAt(0).toUpperCase() +
                      user.lastname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.firstname + " " + user.lastname}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
