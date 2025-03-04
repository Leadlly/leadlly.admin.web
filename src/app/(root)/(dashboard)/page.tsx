import InstituteOverview from "./_components/instituteOverview";
import StudentsOverview from "./_components/studentsOverview";
import TeachersOverview from "./_components/teacherOverview";
import Header from "./_components/header";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:mt-10">
      {/* Header Section */}
      <Header />

      {/* Institute Overview */}
      <InstituteOverview />

      {/* Student & Teacher Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <StudentsOverview />
        <TeachersOverview />
      </div>
    </div>
  );
}
