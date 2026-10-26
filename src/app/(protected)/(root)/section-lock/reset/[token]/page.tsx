"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { Loader2 } from "lucide-react";

import { resetSectionPassword } from "@/actions/section_lock_actions";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetSectionPasswordPage() {
  const params = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextPassword = password.trim();
    if (nextPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    setError("");
    const res = await resetSectionPassword(params.token, nextPassword);
    setSubmitting(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    setDone(true);
  };

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md items-center px-4">
      <div className="w-full space-y-4 rounded-2xl bg-white p-6 shadow-section">
        <h1 className="text-xl font-semibold">Reset section password</h1>
        {done ? (
          <p className="text-sm text-muted-foreground">
            The section password is updated. Go back to the institute portal and
            use the new password. Locked pages ask for it again after a refresh
            or a new tab.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You must be logged in as an institute admin. This link expires in
              15 minutes.
            </p>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
