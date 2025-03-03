"use client";

import { useState } from "react";
import SearchBar from "./_components/SearchBar";
import FilterButtons from "./_components/FilterButtons";
import StudentCard from "./_components/StudentCard";
import Header from "./_components/Header";
import useFetchStudentsOfBatch from "@/hooks/useFetchStudentsOfBatch";
import Loader from "@/components/shared/Loader";

export default function StudentsInfo() {
  const [filter, setFilter] = useState("all");
  const { data: students, error, loading } = useFetchStudentsOfBatch("2");

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  const filteredStudents =
    filter === "all"
      ? students
      : students.filter((student) => student.status === filter);

  return (
    <div className="p-6 space-y-6">
      <Header />

      <div className="flex gap-8 mt-6">
        <div className="flex-1">
          <SearchBar />
        </div>

        <FilterButtons
          filter={filter}
          setFilter={setFilter}
          options={["all", "excellent", "optimal", "inefficient"]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <StudentCard key={index} student={student} />
        ))}
      </div>
    </div>
  );
}
