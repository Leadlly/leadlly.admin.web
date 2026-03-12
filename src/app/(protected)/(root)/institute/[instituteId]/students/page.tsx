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
        <p className="text-muted-foreground">Invalid institute. Please select an institute.</p>
      </div>
    );
  }

  const res = await getInstituteStudents(instituteId);
  const students = res.success ? res.students : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Students Info</h1>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-section mb-6">
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student: any, index: number) => {
              const bgColors = [
                "bg-green-100",
                "bg-yellow-100",
                "bg-blue-100",
                "bg-red-100",
              ];
              const bg = bgColors[index % bgColors.length];
              const firstname = student?.firstname ?? "Student";
              const lastname = student?.lastname ?? "";
              const fullName = `${firstname} ${lastname}`.trim();
              const standard = student?.academic?.standard ?? "-";
              const level = student?.details?.level?.number ?? 0;

              return (
                <div
                  key={student._id ?? index}
                  className={`${bg} rounded-2xl p-4 shadow-md flex flex-col gap-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{fullName}</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        Class: <span className="font-medium">{standard}</span>
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-semibold text-gray-700">
                        Level{" "}
                        <span className="text-blue-600 font-bold">{level}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

