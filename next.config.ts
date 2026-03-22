import type { NextConfig } from "next";
import "./betterstack-env-aliases";

/** Logs ingest URL, e.g. https://s123.region.betterstackdata.com/logs */
function getBetterStackLogsUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL?.trim() ?? "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.endsWith("/logs") ? raw : `${raw.replace(/\/$/, "")}/logs`;
  }
  return `https://${raw.replace(/^https?:\/\//, "")}`;
}

function getBetterStackWebVitalsUrl(logsUrl: string): string {
  if (!logsUrl) return "";
  const origin = logsUrl.replace(/\/logs\/?$/i, "");
  return `${origin}/web-vitals`;
}

const logsIngestUrl = getBetterStackLogsUrl();
const webVitalsIngestUrl = getBetterStackWebVitalsUrl(logsIngestUrl);

const hasBetterStack =
  !!process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN?.trim() &&
  (logsIngestUrl.startsWith("https://") || logsIngestUrl.startsWith("http://"));

const nextConfig: NextConfig = {
  env: {
    ...(process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN
      ? {
          NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN:
            process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
        }
      : {}),
    ...(process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL
      ? {
          NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
            process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL,
        }
      : {}),
    ...(process.env.NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL
      ? {
          NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL:
            process.env.NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL,
        }
      : {}),
  },
  async rewrites() {
    if (
      !hasBetterStack ||
      !webVitalsIngestUrl.startsWith("http") ||
      !logsIngestUrl.startsWith("http")
    ) {
      return [];
    }
    return [
      {
        source: "/_betterstack/web-vitals",
        destination: webVitalsIngestUrl,
        basePath: false,
      },
      {
        source: "/_betterstack/logs",
        destination: logsIngestUrl,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
