/**
 * Must load before `@logtail/next` in `next.config.ts`.
 * Imports are hoisted above other statements in the same file, so aliases cannot live
 * in next.config after the logtail import — the SDK would read env too early.
 *
 * @see https://betterstack.com/docs/logs/javascript/nextjs/
 */

if (!process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN) {
  if (process.env.NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN) {
    process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN =
      process.env.NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN;
  }
}
if (!process.env.BETTER_STACK_SOURCE_TOKEN && process.env.BETTERSTACK_SOURCE_TOKEN) {
  process.env.BETTER_STACK_SOURCE_TOKEN = process.env.BETTERSTACK_SOURCE_TOKEN;
}
if (!process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL) {
  const legacyUrl = process.env.NEXT_PUBLIC_BETTERSTACK_INGEST_URL?.trim();
  const legacyHost = process.env.NEXT_PUBLIC_BETTERSTACK_INGESTING_HOST?.trim();
  if (legacyUrl) {
    process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL = legacyUrl.replace(/\/$/, "");
  } else if (legacyHost) {
    const h = legacyHost.replace(/^https?:\/\//, "");
    process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL = h.includes("/")
      ? legacyHost.startsWith("http")
        ? legacyHost.replace(/\/$/, "")
        : `https://${h}`.replace(/\/$/, "")
      : `https://${h}/logs`;
  }
}
if (!process.env.NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL && process.env.NEXT_PUBLIC_LOG_LEVEL) {
  process.env.NEXT_PUBLIC_BETTER_STACK_LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL;
}

export {};
