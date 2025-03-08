"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Dropdown from "./_components/DropDown";
import Image from "next/image";
import BackButton from "@/components/ui/backbutton";

const BatchesPage: React.FC = () => {
  const router = useRouter();
  const dummyBatches = [
    {
      standard: "11th standard",
      classes: [
        {
          id: 1,
          name: "Omega",
          subject: "Chemistry, Physics, Biology",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/omega.png",
        },
        {
          id: 2,
          name: "Sigma",
          subject: "Mathematics, Chemistry, Physics",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/sigma.png",
        },
        {
          id: 3,
          name: "Omega",
          subject: "Physics",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/omega.png",
        },
      ],
    },
    {
      standard: "12th standard",
      classes: [
        {
          id: 4,
          name: "Omega",
          subject: "Chemistry",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/omega.png",
        },
        {
          id: 5,
          name: "Sigma",
          subject: "Mathematics",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/sigma.png",
        },
        {
          id: 6,
          name: "Omega",
          subject: "Physics",
          totalStudents: 120,
          capacity: 180,
          teacher: "Dr. Sarah Wilson",
          imgUrl: "/omega.png",
        },
      ],
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <BackButton router={router} />
        <h1 className="text-3xl font-bold">
          Student Batches of Institute
        </h1>
      </div>
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-gray-600" />
          <span className="text-gray-700 font-medium">Filter by :</span>
          <Dropdown
            options={["All", "11th standard", "12th standard"]}
            onSelect={() => {}}
          />
        </div>
        <Button
          onClick={() => router.push("/batches/add")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          + Add batch
        </Button>
      </div>
      {dummyBatches.map((batch, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{batch.standard}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batch.classes.map((classItem, idx) => (
              <Card key={idx} className="bg-white rounded-lg shadow-md p-5">
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={classItem.imgUrl}
                      alt="Class Logo"
                      className="w-10 h-10"
                      width={50}
                      height={50}
                    />
                    <div>
                      <h3 className="text-xl font-bold">{classItem.name}</h3>
                      <p className="text-gray-600 text-sm">{batch.standard}</p>
                    </div>
                    <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm ml-auto">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Subject:{" "}
                    <span className="font-medium">{classItem.subject}</span>
                  </p>
                  <p className="text-gray-600">
                    Total Students:{" "}
                    <span className="font-medium">
                      {classItem.totalStudents}
                    </span>
                  </p>
                  <Progress
                    value={(classItem.totalStudents / classItem.capacity) * 100}
                    className="mt-2"
                    color="bg-purple-600"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">
                      By {classItem.teacher}
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/batches/${classItem.id}/students`)
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      View More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatchesPage;
