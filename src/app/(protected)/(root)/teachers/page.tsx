"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  joinedYear: number;
  email: string;
  contact: string;
  activeClasses: number;
  totalStudents: number;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("All Subjects");

  useEffect(() => {
    // Mock API call
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const mockTeachers = [
          {
            id: "t1",
            name: "Dr. Sarah Johnson",
            subject: "Mathematics",
            joinedYear: 2018,
            email: "sarah.johnson@institute.com",
            contact: "+1234567890",
            activeClasses: 8,
            totalStudents: 245,
          },
          {
            id: "t2",
            name: "Prof. Michael Brown",
            subject: "Physics",
            joinedYear: 2015,
            email: "michael.brown@institute.com",
            contact: "+1234567891",
            activeClasses: 6,
            totalStudents: 180,
          },
          {
            id: "t3",
            name: "Dr. Emily Davis",
            subject: "Chemistry",
            joinedYear: 2019,
            email: "emily.davis@institute.com",
            contact: "+1234567892",
            activeClasses: 5,
            totalStudents: 150,
          },
          {
            id: "t4",
            name: "Prof. James Wilson",
            subject: "Biology",
            joinedYear: 2017,
            email: "james.wilson@institute.com",
            contact: "+1234567893",
            activeClasses: 7,
            totalStudents: 210,
          },
        ];

        setTimeout(() => {
          setTeachers(mockTeachers);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Error loading teachers. Please try again later.");
        console.error("Error fetching teachers:", err);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filtering logic
  const filteredTeachers = teachers.filter(
    (teacher) =>
      (selectedSubject === "All Subjects" ||
        teacher.subject === selectedSubject) &&
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Teachers</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl">
          Add Teacher
        </Button>
      </div>

      {/* Search & Subject Filter */}
      <div className="bg-white p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Subject Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={selectedSubject === "All Subjects" ? "default" : "outline"}
            className={
              selectedSubject === "All Subjects"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("All Subjects")}
          >
            All
          </Button>
          <Button
            variant={selectedSubject === "Mathematics" ? "default" : "outline"}
            className={
              selectedSubject === "Mathematics"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("Mathematics")}
          >
            Mathematics
          </Button>
          <Button
            variant={selectedSubject === "Physics" ? "default" : "outline"}
            className={
              selectedSubject === "Physics"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("Physics")}
          >
            Physics
          </Button>
          <Button
            variant={selectedSubject === "Chemistry" ? "default" : "outline"}
            className={
              selectedSubject === "Chemistry"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("Chemistry")}
          >
            Chemistry
          </Button>
          <Button
            variant={selectedSubject === "Biology" ? "default" : "outline"}
            className={
              selectedSubject === "Biology"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : ""
            }
            onClick={() => setSelectedSubject("Biology")}
          >
            Biology
          </Button>
        </div>
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Link
              href={`/teacher/${teacher.id}`}
              key={teacher.id}
              className="group"
            >
              <Card className="shadow-xl transition rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{teacher.name}</h3>
                      <p className="text-gray-600">{teacher.subject}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mt-4 ">
                    <div className="bg-blue-50 p-3 rounded-md flex-1 mr-2 flex justify-center items-center">
                      <p className="text-gray-600 text-xs">Active Classes:</p>
                      <p className="text-sm font-bold text-blue-700 ml-1">
                        {teacher.activeClasses}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md flex-1 ml-2 flex justify-center items-center ">
                      <p className="text-gray-600 text-xs">Students:</p>
                      <p className="text-sm font-bold text-green-700 ml-1">
                        {teacher.totalStudents}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-gray-600">
            No teachers found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  );
}
