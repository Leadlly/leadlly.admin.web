'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function BatchesPage() {
  const [batchesData, setBatchesData] = useState<BatchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    standard: '',
    subject: '',
    teacher: ''
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.standard) queryParams.append('standard', filters.standard);
        if (filters.subject) queryParams.append('subject', filters.subject);
        if (filters.teacher) queryParams.append('teacher', filters.teacher);
        
        const response = await fetch(`/api/batches?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch batches');
        }
        
        const data = await response.json();
        setBatchesData(data);
      } catch (err) {
        setError('Error loading batches. Please try again later.');
        console.error('Error fetching batches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Student Batches of Institute</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Student Batches of Institute</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Student Batches of Institute</h1>
      
      <div className="bg-white p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4">
          <span className="font-medium">Filter by :</span>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <select 
              name="standard" 
              value={filters.standard} 
              onChange={handleFilterChange}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Standards</option>
              <option value="11th">11th Standard</option>
              <option value="12th">12th Standard</option>
            </select>
            <select 
              name="subject" 
              value={filters.subject} 
              onChange={handleFilterChange}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Mathematics">Mathematics</option>
            </select>
            <select 
              name="teacher" 
              value={filters.teacher} 
              onChange={handleFilterChange}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Teachers</option>
              <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
            </select>
          </div>
        </div>
      </div>
      
      {batchesData && batchesData.standards.length > 0 ? (
        batchesData.standards.map((standard, index) => (
          <div key={index} className="bg-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{standard.name}</h2>
              <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add batch
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standard.batches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {batch.name === "Omega" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{batch.name}</h3>
                      <p className="text-gray-600 text-sm">{batch.standard}</p>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
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
                        style={{ width: `${(batch.totalStudents / batch.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500">{batch.totalStudents}/{batch.maxStudents}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">-By {batch.teacher}</p>
                  </div>
                  
                  <Link 
                    href={`/batches/${batch.id}/students`} 
                    className="block w-full text-center bg-purple-100 text-purple-700 py-2 rounded-md hover:bg-purple-200 transition"
                  >
                    View More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-gray-600">No batches found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}