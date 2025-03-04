'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        // Mock data - in a real app, this would come from an API
        const mockTeachers = [
          {
            id: "t1",
            name: "Dr. Sarah Johnson",
            subject: "Mathematics",
            joinedYear: 2018,
            email: "sarah.johnson@institute.com",
            contact: "+1234567890",
            activeClasses: 8,
            totalStudents: 245
          },
          {
            id: "t2",
            name: "Prof. Michael Brown",
            subject: "Physics",
            joinedYear: 2015,
            email: "michael.brown@institute.com",
            contact: "+1234567891",
            activeClasses: 6,
            totalStudents: 180
          },
          {
            id: "t3",
            name: "Dr. Emily Davis",
            subject: "Chemistry",
            joinedYear: 2019,
            email: "emily.davis@institute.com",
            contact: "+1234567892",
            activeClasses: 5,
            totalStudents: 150
          },
          {
            id: "t4",
            name: "Prof. James Wilson",
            subject: "Biology",
            joinedYear: 2017,
            email: "james.wilson@institute.com",
            contact: "+1234567893",
            activeClasses: 7,
            totalStudents: 210
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setTeachers(mockTeachers);
          setLoading(false);
        }, 500);

      } catch (err) {
        setError('Error loading teachers. Please try again later.');
        console.error('Error fetching teachers:', err);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Add Teacher
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search teachers..." 
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select className="border rounded-md px-4 py-2">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Link 
              href={`/teacher/${teacher.id}`} 
              key={teacher.id}
              className="bg-white p-6 rounded-lg shadow-card hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{teacher.name}</h3>
                  <p className="text-gray-600">{teacher.subject}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Email: </span>
                  {teacher.email}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Contact: </span>
                  {teacher.contact}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Joined: </span>
                  {teacher.joinedYear}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-gray-600 text-sm">Active Classes</p>
                  <p className="text-xl font-bold text-blue-700">{teacher.activeClasses}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-gray-600 text-sm">Students</p>
                  <p className="text-xl font-bold text-green-700">{teacher.totalStudents}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 bg-white p-6 rounded-lg text-center">
            <p className="text-gray-600">No teachers found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}