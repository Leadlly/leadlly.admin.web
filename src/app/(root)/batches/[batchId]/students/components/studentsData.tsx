import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Student } from '@/types/students';
import Image from 'next/image';
import React from 'react'

const StudentsData = ({studentsData, filter} : {studentsData:Student[], filter: string}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {studentsData
            .filter((student) => filter === "all" || student.status === filter)
            .map((student, index) => {
              const statusColors: Record<string, string> = {
                excellent: "bg-[#00FF132E]",
                optimal: "bg-[#FFF2D5]",
                inefficient: "bg-[#FFDBDA]",
              };

              const progressColors: Record<string, string> = {
                excellent: "bg-green-500",
                optimal: "bg-orange-500",
                inefficient: "bg-red-500",
              };

              return (
                <Card
                  key={index}
                  className={`p-3 md:p-4 pb-0 ${
                    statusColors[student.status] || "bg-gray-100"
                  }`}
                >
                  <CardContent className="flex items-center gap-6">
                    <div className="relative">
                      <Image
                        src="/student-ppf.png"
                        alt="profile"
                        className="w-16 h-16 rounded-full"
                        width={48}
                        height={48}
                      />
                      <span className="text-lg absolute bottom-[-8px] right-[-4px]">
                        😜
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-semibold">{student.name}</h2>
                      <p className="text-sm text-gray-600">
                        Class: <span className="ml-1">{student.class}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">Level:</span>
                        <Progress
                          value={student.level}
                          className="w-40"
                          indicatorColor={
                            progressColors[student.status] || "bg-gray-300"
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
  )
}

export default StudentsData
