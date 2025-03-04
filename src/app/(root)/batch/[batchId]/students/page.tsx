import React from 'react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';


interface Student {
  id: string;
  name: string;
  level: number;
  image: string;
  class: string;
  emoji: string;
}


const getStudentsData = (batchId: string) => {
  // This would typically come from an API or database
  return {
    batchInfo: {
      id: batchId,
      name: batchId.includes('omega') ? 'Omega' : 'Sigma',
      standard: batchId.startsWith('11') ? '11th Class' : '12th Class',
      subjects: batchId.includes('omega') ? ['Physics', 'Chemistry'] : ['Mathematics'],
      teacher: "Dr. Sarah Wilson"
    },
      "students": [
        {
          "id": "1",
          "name": "Benjamin Clark",
          "class": "11",
          "level": 65,  // Low attendance
          "image": "/images/students/image.jpg",
          "emoji": "😕",
          "rollNumber": "R2023009",
          "performance": 6.2,
          "email": "benjamin.c@student.edu",
          "contact": "+1234567898"
        },
        {
          "id": "2", 
          "name": "Charlotte Lewis",
          "class": "11",
          "level": 98,  // Very high attendance
          "image": "/images/students/image.jpg",
          "emoji": "👏",
          "rollNumber": "R2023010",
          "performance": 9.2,
          "email": "charlotte.l@student.edu",
          "contact": "+1234567899"
        },
        {
          "id": "3",
          "name": "Ethan Rodriguez",
          "class": "10",
          "level": 72,  // Below average attendance
          "image": "/images/students/image.jpg",
          "emoji": "🤔",
          "rollNumber": "R2023011",
          "performance": 6.8,
          "email": "ethan.r@student.edu",
          "contact": "+1234567900"
        },
        {
          "id": "4",
          "name": "Olivia Chen",
          "class": "12",
          "level": 95,  // High attendance
          "image": "/images/students/image.jpg",
          "emoji": "🌟",
          "rollNumber": "R2023012",
          "performance": 9.5,
          "email": "olivia.c@student.edu",
          "contact": "+1234567901"
        },
        {
          "id": "5",
          "name": "Lucas Thompson",
          "class": "11",
          "level": 55,  // Very low attendance
          "image": "/images/students/image.jpg",
          "emoji": "😞",
          "rollNumber": "R2023013",
          "performance": 5.5,
          "email": "lucas.t@student.edu",
          "contact": "+1234567902"
        },
        {
          "id": "6",
          "name": "Emma Watson",
          "class": "10",
          "level": 88,  // Good attendance
          "image": "/images/students/image.jpg",
          "emoji": "💪",
          "rollNumber": "R2023014",
          "performance": 8.1,
          "email": "emma.w@student.edu",
          "contact": "+1234567903"
        },
        {
          "id": "7",
          "name": "Noah Parker",
          "class": "12",
          "level": 92,  // High attendance
          "image": "/images/students/image.jpg",
          "emoji": "🏆",
          "rollNumber": "R2023015",
          "performance": 9.0,
          "email": "noah.p@student.edu",
          "contact": "+1234567904"
        },
        {
          "id": "8",
          "name": "Isabella Martinez",
          "class": "11",
          "level": 60,  // Low attendance
          "image": "/images/students/image.jpg",
          "emoji": "😓",
          "rollNumber": "R2023016",
          "performance": 6.5,
          "email": "isabella.m@student.edu",
          "contact": "+1234567905"
        },
        {
          "id": "9",
          "name": "Alexander Kim",
          "class": "10",
          "level": 82,  // Above average attendance
          "image": "/images/students/image.jpg",
          "emoji": "👍",
          "rollNumber": "R2023017",
          "performance": 7.9,
          "email": "alexander.k@student.edu",
          "contact": "+1234567906"
        },
        {
          "id": "10",
          "name": "Sophia Brown",
          "class": "12",
          "level": 96,  // Very high attendance
          "image": "/images/students/image.jpg",
          "emoji": "✨",
          "rollNumber": "R2023018",
          "performance": 9.6,
          "email": "sophia.b@student.edu",
          "contact": "+1234567907"
        },
        {
          "id": "11",
          "name": "Jackson Lee",
          "class": "11",
          "level": 75,  // Moderate attendance
          "image": "/images/students/image.jpg",
          "emoji": "🤨",
          "rollNumber": "R2023019",
          "performance": 7.2,
          "email": "jackson.l@student.edu",
          "contact": "+1234567908"
        },
        {
          "id": "12",
          "name": "Ava Garcia",
          "class": "10",
          "level": 90,  // High attendance
          "image": "/images/students/image.jpg",
          "emoji": "🌈",
          "rollNumber": "R2023020",
          "performance": 8.5,
          "email": "ava.g@student.edu",
          "contact": "+1234567909"
        }
      ]
  };
};

const getCardBackground = (level: number) => {
  if (level < 50) return "bg-red-50";
  if (level < 75) return "bg-orange-50";
  return "bg-green-900/5";
};

const getProgressColor = (level: number) => {
  if (level < 50) return "bg-red-500";
  if (level < 75) return "bg-orange-500";
  return "bg-green-500";
};

export default async function BatchStudentsPage({ params }: { params: { batchId: string } }) {

  const batchId = (await params).batchId;
  const { batchInfo, students } = getStudentsData(batchId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/batches" className="text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Batches
          </Link>
          <h1 className="text-2xl font-bold">{batchInfo.name} - {batchInfo.standard}</h1>
          <p className="text-gray-600">Subjects: {batchInfo.subjects.join(", ")} | Teacher: {batchInfo.teacher}</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
          Add Student
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-section mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Students List</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="border rounded-md px-4 py-2">
              <option>Sort by Name</option>
              <option>Sort by Roll Number</option>
              <option>Sort by Attendance</option>
              <option>Sort by Performance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {students.map((student:Student) => (
          <div 
            key={student.id} 
            className={`${getCardBackground(student.level)} rounded-lg p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image 
                  src={student.image}
                  alt={student.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0">{student.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{student.name}</h3>
                <p className="text-gray-600">Class: {student.class}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600">Level:</span>
                <div className="flex-1">
                  <Progress 
                    value={student.level} 
                    barColor={getProgressColor(student.level)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{students.length}</span> of <span className="font-medium">{students.length}</span> students
          </div>
        </div>
      </div>
    </div>
  );
}