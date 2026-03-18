import Link from "next/link";
import { getInstituteStudents } from "@/actions/student_action";

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

  const bgColors = [
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-blue-50 border-blue-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-orange-50 border-orange-200",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-section mb-6">
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student: any, index: number) => {
              const bg = bgColors[index % bgColors.length];
              const firstname = student?.firstname ?? "Student";
              const lastname = student?.lastname ?? "";
              const fullName = `${firstname} ${lastname}`.trim();
              const standard = student?.academic?.standard ?? "-";
              const level = student?.details?.level?.number ?? 0;
              const email = student?.email ?? "";

              return (
                <Link
                  key={student._id ?? index}
                  href={`/institute/${instituteId}/students/${student._id}`}
                  className={`${bg} border rounded-2xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{fullName}</h3>
                      {email && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {email}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Class:{" "}
                        <span className="font-medium">{standard}</span>
                      </p>
                    </div>
                    <div className="text-right text-xs ml-2 shrink-0">
                      <p className="font-semibold text-gray-600">
                        Level{" "}
                        <span className="text-blue-600 font-bold text-sm">{level}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-primary font-medium mt-1">
                    View details →
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
