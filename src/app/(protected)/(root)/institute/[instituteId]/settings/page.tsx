"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Loader2, Plus, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  getSectionLock,
  requestSectionPasswordReset,
  saveSectionLock,
  type SectionLock,
  type SectionResetEmail,
} from "@/actions/section_lock_actions";
import { useSectionLock } from "../_components/section-lock-gate";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LOCKABLE_PAGES } from "@/lib/sectionLockPages";

export default function InstituteSettingsPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params.instituteId;
  const sectionLock = useSectionLock();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saved, setSaved] = useState<SectionLock | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [lockedPages, setLockedPages] = useState<string[]>([]);
  const [emails, setEmails] = useState<SectionResetEmail[]>([]);
  const [draftEmail, setDraftEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetLine, setResetLine] = useState("");

  const applyLock = (lock: SectionLock) => {
    setSaved(lock);
    setEnabled(lock.enabled);
    setLockedPages(lock.lockedPages);
    setEmails(lock.resetEmails);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getSectionLock(instituteId);
    if (res.success && res.lock) {
      applyLock(res.lock);
      setLoadError("");
    } else {
      setLoadError(res.message || "Failed to load settings");
    }
    setLoading(false);
  }, [instituteId]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePage = (key: string, on: boolean) => {
    setLockedPages((current) => {
      if (on) return current.includes(key) ? current : [...current, key];
      return current.filter((item) => item !== key);
    });
  };

  const addEmail = () => {
    const email = draftEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    if (emails.some((item) => item.email === email)) {
      toast.error("That email is already added");
      return;
    }
    if (emails.length >= 10) {
      toast.error("You can save up to 10 reset emails");
      return;
    }
    setEmails((current) => [...current, { email, note: "" }]);
    setDraftEmail("");
  };

  const save = async () => {
    const nextPassword = password.trim();
    const nextCurrent = currentPassword.trim();
    const willHavePassword = Boolean(saved?.hasPassword) || nextPassword.length > 0;
    if (enabled && lockedPages.length === 0) {
      toast.error("Choose at least one page to lock");
      return;
    }
    if ((enabled || willHavePassword) && emails.length === 0) {
      toast.error("Add at least one reset email");
      return;
    }
    if (enabled && !willHavePassword) {
      toast.error("Set a section password before turning the lock on");
      return;
    }
    if (nextPassword && nextPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (saved?.hasPassword && !nextCurrent) {
      toast.error("Enter the current section password to save");
      return;
    }

    setSaving(true);
    const res = await saveSectionLock(instituteId, {
      enabled,
      lockedPages,
      resetEmails: emails,
      ...(nextPassword ? { password: nextPassword } : {}),
      ...(nextCurrent ? { currentPassword: nextCurrent } : {}),
    });
    setSaving(false);

    if (!res.success || !res.lock) {
      toast.error(res.message || "Failed to save");
      return;
    }

    applyLock(res.lock);
    setPassword("");
    setCurrentPassword("");
    toast.success("Section lock saved");
    await sectionLock?.reload();
  };

  const sendReset = async () => {
    const email = resetEmail.trim().toLowerCase();
    const line = resetLine.trim();
    if (!email || !line) {
      toast.error("Enter an email and write a line");
      return;
    }
    if (!saved?.resetEmails.some((item) => item.email === email)) {
      toast.error("That email is not a saved reset email");
      return;
    }

    setSending(true);
    const res = await requestSectionPasswordReset(instituteId, email, line);
    setSending(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setResetEmail("");
    setResetLine("");
    toast.success(res.message);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!saved) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center space-y-3">
        <p className="text-sm text-muted-foreground">{loadError || "Failed to load settings"}</p>
        <Button type="button" variant="outline" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 py-4 md:space-y-8 md:py-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Password protect sections of this institute portal. One correct password
          opens every locked page until a refresh or a new tab.
        </p>
      </div>

      {!saved.canManage ? (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-3">
          <p className="text-sm text-muted-foreground">
            Only an institute admin can change the section password.
          </p>
          {saved.enabled && saved.hasPassword ? (
            <ul className="text-sm space-y-1">
              {LOCKABLE_PAGES.filter((page) => saved.lockedPages.includes(page.key)).map(
                (page) => (
                  <li key={page.key}>{page.label}</li>
                ),
              )}
            </ul>
          ) : (
            <p className="text-sm">Section lock is off.</p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-base">Password protect sections</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Turn this on, set a password, and choose the pages to lock.
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            {saved.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="current-section-password">Current section password</Label>
                <PasswordInput
                  id="current-section-password"
                  autoComplete="new-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Required to save changes"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-section-password">
                {saved.hasPassword ? "New password" : "Password"}
              </Label>
              <PasswordInput
                id="new-section-password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={saved.hasPassword ? "Leave blank to keep it" : "At least 6 characters"}
              />
            </div>

            <div className="divide-y divide-border rounded-xl border">
              {LOCKABLE_PAGES.map((page) => (
                <div key={page.key} className="flex items-center justify-between gap-4 px-4 py-3">
                  <Label htmlFor={`lock-${page.key}`} className="font-normal">
                    {page.label}
                  </Label>
                  <Switch
                    id={`lock-${page.key}`}
                    checked={lockedPages.includes(page.key)}
                    onCheckedChange={(on) => togglePage(page.key, on)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-4">
            <div>
              <h2 className="font-semibold text-base">Reset emails</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                The reset link always goes to these emails.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                value={draftEmail}
                onChange={(event) => setDraftEmail(event.target.value)}
                placeholder="email@example.com"
                className="shadow-none"
                onKeyDown={(event) => {
                  if (event.key === "Enter") addEmail();
                }}
              />
              <Button type="button" variant="outline" onClick={addEmail} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reset emails yet.</p>
            ) : (
              <ul className="space-y-2">
                {emails.map((item) => (
                  <li
                    key={item.email}
                    className="flex items-start justify-between gap-3 rounded-xl border px-3 py-2"
                  >
                    <p className="min-w-0 text-sm font-medium break-all">{item.email}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setEmails((current) => current.filter((row) => row.email !== item.email))
                      }
                      aria-label={`Remove ${item.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="button" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>

          <div className="bg-white rounded-2xl md:rounded-3xl shadow-section p-4 md:p-7 space-y-4">
            <div>
              <h2 className="font-semibold text-base">Reset password</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter one of the saved emails and write a line. The link is sent
                to every saved email. Only an institute admin can open it and set
                a new password.
              </p>
            </div>
            {saved.hasPassword && saved.resetEmails.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    placeholder="One of the saved reset emails"
                    className="shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-line">Write a line</Label>
                  <Input
                    id="reset-line"
                    value={resetLine}
                    onChange={(event) => setResetLine(event.target.value)}
                    placeholder="Why you are resetting the section password"
                    maxLength={200}
                    className="shadow-none"
                  />
                </div>
                <Button type="button" variant="outline" onClick={sendReset} disabled={sending}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Save a section password and at least one reset email first.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
