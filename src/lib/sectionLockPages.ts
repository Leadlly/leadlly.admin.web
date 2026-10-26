// Keys match institute portal paths. Keep in sync with leadlly.mentor.api src/utils/sectionLock.ts.
export const LOCKABLE_PAGES = [
  { key: "overview", label: "Overview" },
  { key: "batches", label: "Batches" },
  { key: "students", label: "Students" },
  { key: "teachers", label: "Teachers" },
  { key: "fees", label: "Fee Management" },
  { key: "uins", label: "Student UIDs" },
  { key: "admins", label: "Admins" },
  { key: "question-bank", label: "Question Bank" },
  { key: "syllabus", label: "Course planner" },
] as const;

export type LockablePageKey = (typeof LOCKABLE_PAGES)[number]["key"];

export function pageKeyFromPath(
  pathname: string,
  instituteId: string,
): LockablePageKey | null {
  const base = `/institute/${instituteId}`;
  if (pathname === base || pathname === `${base}/`) return "overview";
  if (!pathname.startsWith(`${base}/`)) return null;
  const segment = pathname.slice(base.length + 1).split("/")[0];
  const found = LOCKABLE_PAGES.find((page) => page.key === segment);
  return found ? found.key : null;
}

function selfCheck() {
  const id = "abc";
  const base = `/institute/${id}`;
  if (pageKeyFromPath(base, id) !== "overview") throw new Error("overview");
  if (pageKeyFromPath(`${base}/`, id) !== "overview") throw new Error("overview slash");
  if (pageKeyFromPath(`${base}/settings`, id) !== null) throw new Error("settings");
  if (pageKeyFromPath(`${base}/batches/1`, id) !== "batches") throw new Error("batches");
  if (pageKeyFromPath(`${base}/question-bank`, id) !== "question-bank") {
    throw new Error("question bank");
  }
}

selfCheck();
