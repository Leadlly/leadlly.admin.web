"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

import {
  getSectionLock,
  verifySectionPassword,
  type SectionLock,
} from "@/actions/section_lock_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageKeyFromPath } from "@/lib/sectionLockPages";

type SectionLockContextValue = {
  reload: () => Promise<void>;
};

const SectionLockContext = createContext<SectionLockContextValue | null>(null);

export function useSectionLock() {
  return useContext(SectionLockContext);
}

const SectionLockGate = ({
  instituteId,
  children,
}: {
  instituteId: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [config, setConfig] = useState<SectionLock | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  // shortcut: unlock lives in memory only, so a refresh or a new tab locks the pages again
  const [unlockedId, setUnlockedId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reload = useCallback(async () => {
    const res = await getSectionLock(instituteId);
    if (res.success && res.lock) {
      setConfig(res.lock);
      setStatus("ready");
      return;
    }
    setStatus("error");
  }, [instituteId]);

  useEffect(() => {
    setStatus("loading");
    setPassword("");
    setError("");
    reload();
  }, [reload]);

  const pageKey = pageKeyFromPath(pathname, instituteId);
  const unlocked = unlockedId === instituteId;
  const locked =
    status === "ready" &&
    Boolean(pageKey) &&
    Boolean(config?.enabled) &&
    Boolean(config?.hasPassword) &&
    Boolean(pageKey && config?.lockedPages.includes(pageKey));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await verifySectionPassword(instituteId, password);
    setSubmitting(false);
    if (res.success) {
      setPassword("");
      setUnlockedId(instituteId);
      return;
    }
    setError(res.message || "Incorrect password");
  };

  let body = children;
  if (pageKey && status === "loading") {
    body = (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  } else if (pageKey && status === "error") {
    body = (
      <div className="mx-auto max-w-md py-16 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t check whether this section is locked.
        </p>
        <Button type="button" variant="outline" onClick={() => reload()}>
          Retry
        </Button>
      </div>
    );
  } else if (locked && !unlocked) {
    body = (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-md items-center">
        <form
          onSubmit={onSubmit}
          className="w-full space-y-4 rounded-2xl bg-white p-6 shadow-section"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">This section is locked</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the section password to open this page and the other locked
            pages. They lock again when you refresh or open a new tab.
          </p>
          <div className="space-y-2">
            <Label htmlFor="section-password">Section password</Label>
            <div className="relative">
              <Input
                id="section-password"
                name="sectionPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="shadow-none pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting || !password} className="w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock"}
          </Button>
          <Link
            href={`/institute/${instituteId}/settings`}
            className="block text-center text-sm text-primary underline-offset-4 hover:underline"
          >
            Section settings
          </Link>
        </form>
      </div>
    );
  }

  return (
    <SectionLockContext.Provider value={{ reload }}>{body}</SectionLockContext.Provider>
  );
};

export default SectionLockGate;
