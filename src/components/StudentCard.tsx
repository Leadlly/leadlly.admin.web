import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Student } from "@/lib/types"

interface StudentCardProps {
  student: Student
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Class: {student.class}</p>
        <p>Level: {student.level}</p>
      </CardContent>
    </Card>
  )
}