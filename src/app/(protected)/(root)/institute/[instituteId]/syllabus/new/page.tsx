import { redirect } from "next/navigation";

export default async function NewChapterPlanRedirect({
  params,
}: {
  params: Promise<{ instituteId: string }>;
}) {
  const { instituteId } = await params;
  redirect(`/institute/${instituteId}/syllabus`);
}
