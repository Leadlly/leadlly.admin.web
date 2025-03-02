import React from 'react';
import Link from 'next/link';

interface TeachersOverviewProps {
  totalTeachers: number;
  departments: number;
  activeClasses: number;
  satisfactionRate: number;
}

const TeachersOverview = ({
  totalTeachers,
  departments,
  activeClasses,
  satisfactionRate,
}: TeachersOverviewProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-section">
      <h2 className="text-xl font-bold mb-6">Teachers Overview</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-gray-600 mb-2">Total Teachers</h3>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-3xl font-bold">{totalTeachers}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-600 mb-2">Departments</h3>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-3xl font-bold">{departments}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-600 mb-2">Active Classes</h3>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-3xl font-bold">{activeClasses}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-600 mb-2">Satisfaction Rate</h3>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-3xl font-bold">{satisfactionRate}/10</span>
          </div>
        </div>
      </div>
      
      {/* Update the href from "/teacher" to "/teachers" */}
      <Link href="/teachers" className="bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center gap-2 py-3 rounded-md transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Teachers
      </Link>
    </div>
  );
};

export default TeachersOverview;