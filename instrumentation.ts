/**
 * Runs once when the Node server starts so `process.env` has official Better Stack keys
 * even if `.env.local` only uses legacy `NEXT_PUBLIC_BETTERSTACK_*` names.
 */
export async function register() {
  await import("./betterstack-env-aliases");
}
