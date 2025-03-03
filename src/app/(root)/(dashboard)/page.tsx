import { Button } from "@/components/ui/button";
import StudentsOverview from "./_components/StudentsOverview";
import TeachersOverview from "./_components/TeachersOverview";
import { Pencil } from "lucide-react";
import InstituteCard from "./_components/InstituteCard";

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="md:text-3xl py-4 text-lg font-semibold">
          Institute Overview & Management
        </h1>
        <Button className="bg-purple-500 text-white flex items-center px-6 hover:bg-purple-700">
          <Pencil /> Edit
        </Button>
      </div>
      <InstituteCard
        logo="/images/UniImg.png"
        established="2001"
        name="Chaitanya Bharathi Institute"
        code="21XYZ1234"
        address="123, Main Street, City, Country"
        contact="+1234567890"
        email="info@institute.com"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <StudentsOverview
          activeCourses={84}
          averageAttendance={"98%"}
          performanceIndex={"9.0/10"}
          totalStudents={2284}
        />
        <TeachersOverview
          activeClasses={98}
          departments={14}
          satisfactionRate="9.0/10"
          totalTeachers={24}
        />
      </div>
    </div>
  );
}
