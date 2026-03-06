"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBatch } from "@/actions/batch_actions";
import { useAppSelector } from "@/redux/hooks";

interface Batch {
  id: string;
  name: string;
  standard: string;
  subjects: string[];
  totalStudents: number;
  maxStudents: number;
  teacher: string;
}

interface Standard {
  name: string;
  batches: Batch[];
}

interface BatchesData {
  standards: Standard[];
}

interface Teacher {
  id: string;
  name: string;
}



export default function BatchesPage({
  params,
}: {
  params: { instituteId: string };
}) {
  const [batchesData, setBatchesData] = useState<BatchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    standard: "",
    subject: "",
    teacher: "",
  });

  // New state for modal form
  const [open, setOpen] = useState(false);
  // Update newBatch state to include subjects array
  const [newBatch, setNewBatch] = useState({
    name: "",
    standard: "",
    subjects: [] as string[], // Add subjects array
    teacherIds: [] as string[],
  });
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: "1", name: "Dr. Sarah Wilson" },
    { id: "2", name: "Dr. John Doe" },
    // Add more teachers as needed
  ]);

   // Get institute data from Redux store
  const instituteData = useAppSelector((state) => state.institute.institute);
  console.log(instituteData, "here is ")
  // Labels for displaying current filter values
  const [filterLabels, setFilterLabels] = useState({
    standard: "All Standards",
    subject: "All Subjects",
    teacher: "All Teachers",
  });
  const fetchBatches = async () => {
    try {
      setLoading(true);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.standard) queryParams.append("standard", filters.standard);
      if (filters.subject) queryParams.append("subject", filters.subject);
      if (filters.teacher) queryParams.append("teacher", filters.teacher);

      const response = await fetch(`/api/batches?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch batches");
      }

      const data = await response.json();
      setBatchesData(data);
    } catch (err) {
      setError("Error loading batches. Please try again later.");
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBatches();
  }, [filters]);

  const handleFilterChange = (name: string, value: string, label: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFilterLabels((prev) => ({
      ...prev,
      [name]: label,
    }));
  };


const handleCreateBatch = async () => {
  try {
    // Validate mandatory fields
    if (!newBatch.name.trim()) {
      alert("Please enter a batch name");
      return;
    }
    if (!newBatch.standard) {
      alert("Please select a standard");
      return;
    }

    // Call the createBatch action with instituteId
    const response = await createBatch({
      ...newBatch,
      institute: params?.instituteId
    });
    
    if (response) {
      // Reset form and close modal
      setNewBatch({ 
        name: "", 
        standard: "", 
        subjects: [], 
        teacherIds: [] 
      });
      setOpen(false);
      
      // Refresh the batches list
      fetchBatches();
    }
  } catch (error) {
    console.error("Error creating batch:", error);
    alert("Failed to create batch. Please try again.");
  }
};


const getBatchLogoBg = (batchName: string) => {
    switch (batchName) {
      case "Omega":
        return "bg-blue-500";
      case "Sigma":
        return "bg-green-500";
      case "Alpha":
        return "bg-red-500";
      case "Beta":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          Student Batches of Institute
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          Student Batches of Institute
        </h1>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#fefbff]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Student Batches of Institute</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Create New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  placeholder="Enter batch name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="standard">Standard</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {newBatch.standard || "Select standard"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {instituteData?.standards?.map((standard: string) => (
                      <DropdownMenuItem 
                        key={standard}
                        onClick={() => setNewBatch({ ...newBatch, standard })}
                      >
                        {standard}
                      </DropdownMenuItem>
                    )) || (
                      <>
                        <DropdownMenuItem onClick={() => setNewBatch({ ...newBatch, standard: "11" })}>
                          11
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNewBatch({ ...newBatch, standard: "12" })}>
                          12
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Multi-select Subject field */}
              <div className="grid gap-2">
                <Label htmlFor="subjects">Subjects</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {newBatch.subjects.length > 0
                        ? `${newBatch.subjects.length} subjects selected`
                        : "Select subjects"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search subjects..." />
                      <CommandEmpty>No subject found.</CommandEmpty>
                      <CommandGroup>
                        {(instituteData?.subjects).map((subject: string) => (
                          <CommandItem
                            key={subject}
                            value={subject}
                            onSelect={() => {
                              setNewBatch((prev) => {
                                const isSelected = prev.subjects.includes(subject);
                                return {
                                  ...prev,
                                  subjects: isSelected
                                    ? prev.subjects.filter((s) => s !== subject)
                                    : [...prev.subjects, subject]
                                };
                              });
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                newBatch.subjects.includes(subject)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50"
                              )}>
                                {newBatch.subjects.includes(subject) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              {subject}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {newBatch.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newBatch.subjects.map((subject) => (
                      <div
                        key={subject}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        {subject}
                        <button
                          onClick={() => setNewBatch((prev) => ({
                            ...prev,
                            subjects: prev.subjects.filter((s) => s !== subject)
                          }))}
                          className="hover:text-purple-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="teacher">Teachers</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {newBatch.teacherIds.length > 0
                        ? `${newBatch.teacherIds.length} teachers selected`
                        : "Select teachers"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search teachers..." />
                      <CommandEmpty>No teacher found.</CommandEmpty>
                      <CommandGroup>
                        {teachers.map((teacher) => (
                          <CommandItem
                            key={teacher.id}
                            value={teacher.name}
                            onSelect={() => {
                              setNewBatch((prev) => {
                                const isSelected = prev.teacherIds.includes(teacher.id);
                                return {
                                  ...prev,
                                  teacherIds: isSelected
                                    ? prev.teacherIds.filter((id) => id !== teacher.id)
                                    : [...prev.teacherIds, teacher.id]
                                };
                              });
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                newBatch.teacherIds.includes(teacher.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50"
                              )}>
                                {newBatch.teacherIds.includes(teacher.id) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              {teacher.name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {newBatch.teacherIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newBatch.teacherIds.map((teacherId) => (
                      <div
                        key={teacherId}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        {teachers.find((t) => t.id === teacherId)?.name}
                        <button
                          onClick={() => setNewBatch((prev) => ({
                            ...prev,
                            teacherIds: prev.teacherIds.filter((id) => id !== teacherId)
                          }))}
                          className="hover:text-purple-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBatch} className="bg-purple-600 text-white hover:bg-purple-700">
                Create Batch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-8  mb-8 border-2 shadow-inner rounded-3xl">
        <div className="flex items-center gap-4">
          <span className="font-medium">Filter by :</span>
          <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
            {/* Standard Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-between w-full border rounded-md px-4 py-2 text-left">
                <span>{filterLabels.standard}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("standard", "", "All Standards")
                  }
                >
                  All Standards
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("standard", "11th", "11th Standard")
                  }
                >
                  11th Standard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("standard", "12th", "12th Standard")
                  }
                >
                  12th Standard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subject Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-between w-full border rounded-md px-4 py-2 text-left">
                <span>{filterLabels.subject}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("subject", "", "All Subjects")
                  }
                >
                  All Subjects
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("subject", "Physics", "Physics")
                  }
                >
                  Physics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("subject", "Chemistry", "Chemistry")
                  }
                >
                  Chemistry
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("subject", "Biology", "Biology")
                  }
                >
                  Biology
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("subject", "Mathematics", "Mathematics")
                  }
                >
                  Mathematics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Teacher Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-between w-full border rounded-md px-4 py-2 text-left">
                <span>{filterLabels.teacher}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange("teacher", "", "All Teachers")
                  }
                >
                  All Teachers
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterChange(
                      "teacher",
                      "Dr. Sarah Wilson",
                      "Dr. Sarah Wilson"
                    )
                  }
                >
                  Dr. Sarah Wilson
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {batchesData && batchesData.standards.length > 0 ? (
        batchesData.standards.map((standard, index) => (
          <div key={index} className="bg-white p-10 rounded-3xl mb-6 border-2 ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{standard.name}</h2>
              <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standard.batches.map((batch) => (
                <div key={batch.id} className="border rounded-xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 ${getBatchLogoBg(
                        batch.name
                      )} rounded-full flex items-center justify-center text-white`}
                    >
                      {batch.name === "Omega" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{batch.name}</h3>
                      <p className="text-gray-600 text-sm">{batch.standard}</p>
                    </div>
                    <span className="ml-auto px-3 py-3 font-semibold bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Subject: </span>
                      {batch.subjects.join(", ")}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Total Students: </span>
                      {batch.totalStudents}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (batch.totalStudents / batch.maxStudents) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500">
                      {batch.totalStudents}/{batch.maxStudents}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-700 text-md font-semibold">
                      -By {batch.teacher}
                    </p>
                    <Link
                      href={`/batches/${batch.id}/students`}
                      className="block text-center bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 transition"
                    >
                      View More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-gray-600">
            No batches found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}

