"use server";

import { getCookie } from "./cookie_actions";
import { logger } from "@/lib/logger";

export type SectionResetEmail = {
  email: string;
  note: string;
};

export type SectionLock = {
  enabled: boolean;
  hasPassword: boolean;
  lockedPages: string[];
  resetEmails: SectionResetEmail[];
  canManage: boolean;
};

async function api(path: string, init?: RequestInit) {
  const token = await getCookie();
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function getSectionLock(instituteId: string) {
  try {
    const { ok, data } = await api(`/api/institute/${instituteId}/section-lock`);
    if (!ok) {
      return {
        success: false as const,
        lock: null,
        message: data.message || "Failed to load section lock",
      };
    }
    return { success: true as const, lock: data.lock as SectionLock };
  } catch (error) {
    logger.error("getSectionLock error", { error });
    return { success: false as const, lock: null, message: "Failed to load section lock" };
  }
}

export async function saveSectionLock(
  instituteId: string,
  body: {
    enabled: boolean;
    lockedPages: string[];
    resetEmails: SectionResetEmail[];
    password?: string;
    currentPassword?: string;
  },
) {
  try {
    const { ok, data } = await api(`/api/institute/${instituteId}/section-lock`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!ok) {
      return {
        success: false as const,
        lock: null,
        message: data.message || "Failed to save section lock",
      };
    }
    return { success: true as const, lock: data.lock as SectionLock };
  } catch (error) {
    logger.error("saveSectionLock error", { error });
    return { success: false as const, lock: null, message: "Failed to save section lock" };
  }
}

export async function verifySectionPassword(instituteId: string, password: string) {
  try {
    const { ok, data } = await api(`/api/institute/${instituteId}/section-lock/verify`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (!ok) {
      return { success: false as const, message: data.message || "Incorrect password" };
    }
    return { success: true as const };
  } catch (error) {
    logger.error("verifySectionPassword error", { error });
    return { success: false as const, message: "Could not check the password" };
  }
}

export async function requestSectionPasswordReset(
  instituteId: string,
  email: string,
  line: string,
) {
  try {
    const { ok, data } = await api(
      `/api/institute/${instituteId}/section-lock/request-reset`,
      {
        method: "POST",
        body: JSON.stringify({ email, line }),
      },
    );
    if (!ok) {
      return {
        success: false as const,
        message: data.message || "Failed to send the reset link",
      };
    }
    return {
      success: true as const,
      message: (data.message as string) || "Reset link sent to the saved emails",
    };
  } catch (error) {
    logger.error("requestSectionPasswordReset error", { error });
    return { success: false as const, message: "Failed to send the reset link" };
  }
}

export async function resetSectionPassword(token: string, password: string) {
  try {
    const { ok, data } = await api(`/api/institute/section-lock/reset/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (!ok) {
      return {
        success: false as const,
        message: data.message || "This reset link is invalid or expired",
      };
    }
    return {
      success: true as const,
      message: (data.message as string) || "Section password updated",
    };
  } catch (error) {
    logger.error("resetSectionPassword error", { error });
    return { success: false as const, message: "Failed to reset the password" };
  }
}
