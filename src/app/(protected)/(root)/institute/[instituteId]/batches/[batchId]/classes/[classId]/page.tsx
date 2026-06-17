import { redirect } from "next/navigation";

export default async function ClassIndexPage({
  params,
}: {
  params: Promise<{ instituteId: string; batchId: string; classId: string }>;
}) {
  const { instituteId, batchId, classId } = await params;
  redirect(
    `/institute/${instituteId}/batches/${batchId}/classes/${classId}/report`
  );
}
