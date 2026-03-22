type LogLevel = "error" | "warn" | "info" | "debug";

const LOG_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const configuredLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || "info").toLowerCase() as LogLevel;
const minLevel = LOG_PRIORITY[configuredLevel] ?? LOG_PRIORITY.info;

const ingestingHost = process.env.NEXT_PUBLIC_BETTERSTACK_INGESTING_HOST?.trim();

/** Same destination as `next.config.ts` rewrite `/_betterstack/logs`. */
const DEFAULT_INGEST_PATH = "https://in.logs.betterstack.com/logs";

function getSourceToken(): string | undefined {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN?.trim();
  }
  return (
    process.env.BETTERSTACK_SOURCE_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN?.trim()
  );
}

function resolveServerIngestUrl(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_BETTERSTACK_INGEST_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (!ingestingHost) return DEFAULT_INGEST_PATH;
  const h = ingestingHost.replace(/^https?:\/\//, "");
  if (h.includes("/")) return `https://${h}`;
  return `https://${h}/logs`;
}

const shouldLog = (level: LogLevel) => LOG_PRIORITY[level] <= minLevel;

const defaultLogEmail =
  process.env.NEXT_PUBLIC_LOG_DEFAULT_EMAIL?.trim() || "system@admin-web";

const sendToBetterStack = async (level: LogLevel, message: string, meta?: unknown) => {
  const token = getSourceToken();
  if (!token) return;

  const isBrowser = typeof window !== "undefined";
  const url = isBrowser ? "/_betterstack/logs" : resolveServerIngestUrl();
  if (!url) return;

  const payload = {
    message: `[${level}] ${message}`,
    level,
    dt: new Date().toISOString(),
    environment: isBrowser ? "client" : "server",
    meta: {
      email: defaultLogEmail,
      ...(meta != null && typeof meta === "object" && !Array.isArray(meta)
        ? (meta as Record<string, unknown>)
        : { detail: meta }),
    },
  };

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
      console.warn("[logger] Better Stack ingest failed", res.status, await res.text().catch(() => ""));
    }
  } catch {
    // Ignore network errors to avoid logging loops.
  }
};

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
