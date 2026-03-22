import "../../betterstack-env-aliases";

type LogLevel = "error" | "warn" | "info" | "debug";

const LOG_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const configuredLevel = (
  process.env.NEXT_PUBLIC_LOG_LEVEL ||
  process.env.NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL ||
  "info"
)
  .toLowerCase() as LogLevel;
const minLevel = LOG_PRIORITY[configuredLevel] ?? LOG_PRIORITY.info;

const shouldLog = (level: LogLevel) => LOG_PRIORITY[level] <= minLevel;

/** Must be non-empty on every remote log line (Better Stack + search). */
function resolveLogEmail(): string {
  const pub = process.env.NEXT_PUBLIC_LOG_DEFAULT_EMAIL?.trim();
  const serverOnly =
    typeof window === "undefined" ? process.env.LOG_DEFAULT_EMAIL?.trim() : "";
  const out = (pub || serverOnly || "system@admin-web").trim();
  return out || "system@admin-web";
}

function getSourceToken(): string | undefined {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN?.trim();
  }
  return (
    process.env.BETTER_STACK_SOURCE_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN?.trim()
  );
}

/** Same rules as `next.config.ts` — server posts directly to ingest. */
function resolveServerLogsIngestUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL?.trim() ?? "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.endsWith("/logs") ? raw : `${raw.replace(/\/$/, "")}/logs`;
  }
  return `https://${raw.replace(/^https?:\/\//, "")}/logs`;
}

function normalizeMeta(meta?: unknown): Record<string, unknown> {
  if (meta != null && typeof meta === "object" && !Array.isArray(meta)) {
    return meta as Record<string, unknown>;
  }
  if (meta === undefined) return {};
  return { detail: meta };
}

/**
 * Better Stack HTTP ingest expects a clear top-level `message` and string `level`
 * (see https://betterstack.com/docs/logs/ingesting-data/http/logs/ ).
 * `@logtail/next` batches with a different shape, which often leaves Message/Level empty in the UI.
 */
async function sendToBetterStack(
  level: LogLevel,
  message: string,
  meta?: unknown,
): Promise<void> {
  const token = getSourceToken();
  if (!token) return;

  const isBrowser = typeof window !== "undefined";
  const url = isBrowser ? "/_betterstack/logs" : resolveServerLogsIngestUrl();
  if (!url || (!isBrowser && !url.startsWith("http"))) return;

  const email = resolveLogEmail();
  const extra = normalizeMeta(meta);
  delete extra.email;

  const payload: Record<string, unknown> = {
    message: String(message),
    level,
    dt: new Date().toISOString(),
    email,
    source: "leadlly.admin.web",
    service: "leadlly.admin.web",
    fields: { email, ...extra },
  };

  if (isBrowser && typeof window !== "undefined" && window.location?.href) {
    payload.page_url = window.location.href;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok && process.env.NODE_ENV === "development") {
      const body = await res.text().catch(() => "");
      console.warn("[logger] Better Stack ingest failed", res.status, body);
    }
  } catch {
    // Avoid logging loops
  }
}

const baseLog = (level: LogLevel, message: string, meta?: unknown) => {
  if (!shouldLog(level)) return;

  if (level === "error") console.error(message, meta);
  else if (level === "warn") console.warn(message, meta);
  else console.log(message, meta);

  void sendToBetterStack(level, message, meta);
};

export const logger = {
  error: (message: string, meta?: unknown) => baseLog("error", message, meta),
  warn: (message: string, meta?: unknown) => baseLog("warn", message, meta),
  info: (message: string, meta?: unknown) => baseLog("info", message, meta),
  debug: (message: string, meta?: unknown) => baseLog("debug", message, meta),
};
