"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import NavBar from "../../_components/NavBar";
import SearchBar from "../../_components/SearchBar";
import BackButton from "@/components/ui/backbutton";
interface Student {
  id: number;
  name: string;
  class: number;
  level: number;
  levelColor: string;
  imgUrl: string;
}

const StudentsPage: React.FC = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Simulate API call
        const data: Student[] = [
          {
            id: 1,
            name: "Abhinav Mishra",
            class: 11,
            level: 90,
            levelColor: "bg-green-500",
            imgUrl: "/student1.png",
          },
          {
            id: 2,
            name: "Abhinav Mishra",
            class: 11,
            level: 60,
            levelColor: "bg-yellow-500",
            imgUrl: "/student1.png",
          },
          {
            id: 3,
            name: "Abhinav Mishra",
            class: 11,
            level: 30,
            levelColor: "bg-red-500",
            imgUrl: "/student1.png",
          },
          {
            id: 4,
            name: "Abhinav Mishra",
            class: 11,
            level: 90,
            levelColor: "bg-green-500",
            imgUrl: "/student1.png",
          },
          {
            id: 5,
            name: "Abhinav Mishra",
            class: 11,
            level: 60,
            levelColor: "bg-yellow-500",
            imgUrl: "/student1.png",
          },
          {
            id: 6,
            name: "Abhinav Mishra",
            class: 11,
            level: 30,
            levelColor: "bg-red-500",
            imgUrl: "/student1.png",
          },
        ];
        setStudents(data);
      } catch (err) {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredStudents =
    filter === "All"
      ? students
      : students.filter((student) => {
          if (filter === "Excellent") return student.level >= 80;
          if (filter === "Optimal")
            return student.level >= 50 && student.level < 80;
          if (filter === "Inefficient") return student.level < 50;
        });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton router={router}/>
          <h1 className="text-3xl font-bold">Students Info</h1>
        </div>
        <NavBar />
      </div>
      <div className="flex justify-between items-center mb-6">
        <SearchBar />
        <Tabs defaultValue="All" onValueChange={(value) => setFilter(value)}>
          <TabsList className="space-x-2">
            <TabsTrigger
              value="All"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Excellent"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Excellent
            </TabsTrigger>
            <TabsTrigger
              value="Optimal"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Optimal
            </TabsTrigger>
            <TabsTrigger
              value="Inefficient"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Inefficient
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <SlidersHorizontal className="text-gray-600 cursor-pointer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className={`rounded-lg shadow-md p-4 ${student.levelColor} bg-opacity-20`}
          >
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={student.imgUrl}
                  alt="Student"
                  className="w-12 h-12 rounded-full"
                  width={50}
                  height={50}
                />
                <div>
                  <h3 className="text-lg font-bold">{student.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Class: {student.class}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">Level:</p>
              <Progress
                value={student.level}
                className="h-2"
                color={student.levelColor}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentsPage;
