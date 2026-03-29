import { getInstituteStudents } from "@/actions/student_action";
import StudentsList from "./_components/students-list";

export default async function InstituteStudentsPage({
  params,
}: {
  params: Promise<{ instituteId: string }>;
}) {
  const { instituteId } = await params;

  if (!instituteId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">
          Invalid institute. Please select an institute.
        </p>
      </div>
    );
  }

  const res = await getInstituteStudents(instituteId);
  const students = res.success ? res.students : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-section">
        <StudentsList students={students} instituteId={instituteId} />
      </div>
    </div>
  );
}
