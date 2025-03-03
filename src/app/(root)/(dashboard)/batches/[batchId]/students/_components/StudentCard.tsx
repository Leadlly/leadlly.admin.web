import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Student } from "@/types/student";

interface StudentCardProps {
  student: Student;
}

const statusColors = {
  excellent: "bg-green-100 border-green-500",
  optimal: "bg-yellow-100 border-yellow-500",
  inefficient: "bg-red-100 border-red-500",
};

const progressColors = {
  excellent: "bg-[#00FF13]",
  optimal: "bg-[#FF9900]",
  inefficient: "bg-[#FF3530]",
};

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className={`p-4 pb-0 border-l-4 ${statusColors[student.status]}`}>
      <CardContent className="flex items-center gap-4">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="text-sm absolute bottom-[-8px] right-[-4px]">
            😊
          </span>
        </div>
        <div className="flex-grow">
          <h2 className="font-semibold">{student.name}</h2>
          <p className="text-sm text-gray-600">Class: {student.class}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">Level:</span>
            <Progress
              indicatorColor={progressColors[student.status]}
              value={student.level}
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
