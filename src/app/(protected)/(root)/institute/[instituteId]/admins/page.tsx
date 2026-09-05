"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Loader2,
  Plus,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import {
  addInstituteAdmin,
  getInstituteAdmins,
  removeInstituteAdmin,
  type InstituteMember,
  type InstituteMemberRole,
} from "@/actions/admin_actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminsPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params.instituteId;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InstituteMemberRole>("manager");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<InstituteMember[]>([]);
  const [canRemoveMembers, setCanRemoveMembers] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const res = await getInstituteAdmins(instituteId);
    if (res.success) {
      setMembers(res.members);
      setCanRemoveMembers(res.canRemoveMembers);
    } else {
      toast.error(res.message ?? "Failed to load admins");
    }
    setLoading(false);
  }, [instituteId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAdd = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter an email address.");
      return;
    }

    setAdding(true);
    const res = await addInstituteAdmin(instituteId, trimmed, role);
    setAdding(false);

    if (res.success) {
      toast.success(res.message ?? "Admin added");
      setEmail("");
      fetchMembers();
    } else {
      toast.error(res.message ?? "Failed to add admin");
    }
  };

  const handleRemove = async (member: InstituteMember) => {
    const res = await removeInstituteAdmin(instituteId, member._id);
    if (res.success) {
      toast.success("Member removed");
      fetchMembers();
    } else {
      toast.error(res.message ?? "Failed to remove member");
    }
  };

  const getInitials = (member: InstituteMember) => {
    const first = member.firstname?.[0] ?? "";
    const last = member.lastname?.[0] ?? "";
    return (first + last).toUpperCase() || member.email[0]?.toUpperCase() || "?";
  };

  return (
    <div className="w-full space-y-6 py-4 md:space-y-8 md:py-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          Institute Admins
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invite admins and managers to help run this institute. Admins can
          remove members; managers cannot.
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-4">
        <h2 className="font-semibold text-base">Add Admin</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Enter an email to instantly assign access. New users can sign in with
          Google using that email.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="shadow-none flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />

          <Select
            value={role}
            onValueChange={(v) => setRole(v as InstituteMemberRole)}
          >
            <SelectTrigger className="w-full sm:w-48 shadow-none">
              <SelectValue placeholder="Invite as" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Invite as Admin</SelectItem>
              <SelectItem value="manager">Invite as Manager</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAdd}
            disabled={adding || !email.trim()}
            className="bg-primary text-white gap-2 sm:w-auto"
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {adding ? "Adding…" : "Add"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-5">
        <div>
          <h2 className="font-semibold text-base">All Members</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {members.length} member{members.length === 1 ? "" : "s"} with
            institute access
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-muted-foreground">
            <UserCog className="h-10 w-10 opacity-20" />
            <p className="text-sm">No admins added yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="space-y-3 md:hidden">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={member.avatar?.url} />
                      <AvatarFallback className="text-xs">
                        {getInitials(member)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium break-words">
                        {`${member.firstname} ${member.lastname ?? ""}`.trim()}
                        {member.isCurrentUser && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground break-all mt-0.5">
                        {member.email}
                      </p>
                    </div>
                    {canRemoveMembers && !member.isCurrentUser && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[calc(100vw-2rem)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove{" "}
                              <span className="font-semibold text-foreground">
                                {member.email}
                              </span>{" "}
                              from this institute?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleRemove(member)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge
                      variant={member.role === "admin" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {member.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        member.status === "Active"
                          ? "text-green-700 border-green-200"
                          : ""
                      }
                    >
                      {member.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      Last login:{" "}
                      {member.lastLogin
                        ? new Date(member.lastLogin).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  {canRemoveMembers && (
                    <TableHead className="w-16 text-center">Remove</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar?.url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {`${member.firstname} ${member.lastname ?? ""}`.trim()}
                            {member.isCurrentUser && (
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={member.role === "admin" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.status === "Active"
                            ? "text-green-700 border-green-200"
                            : ""
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {member.lastLogin
                        ? new Date(member.lastLogin).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never"}
                    </TableCell>
                    {canRemoveMembers && (
                      <TableCell className="text-center">
                        {member.isCurrentUser ? (
                          <span
                            title="You cannot remove yourself"
                            className="inline-flex items-center justify-center w-7 h-7 rounded opacity-30 cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </span>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Remove{" "}
                                  <span className="font-semibold text-foreground">
                                    {member.email}
                                  </span>{" "}
                                  from this institute? They will lose access
                                  immediately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleRemove(member)}
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
