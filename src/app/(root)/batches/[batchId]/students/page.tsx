import React from 'react';
import { Search, Bell, Sliders, Image as ImageIcon } from 'lucide-react';
import image from "../../../../../../public/images/image copy.png";
import image2 from "../../../../../../public/images/image copy 2.png";
import Image from 'next/image';

export default function StudentsInfoPage() {
  const students = [
    { id: 1, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 2, name: 'Abhinav Mishra', class: 11, level: 'average', color: 'orange' },
    { id: 3, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 4, name: 'Abhinav Mishra', class: 11, level: 'average', color: 'orange' },
    { id: 5, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 6, name: 'Abhinav Mishra', class: 11, level: 'poor', color: 'red' },
    { id: 7, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 8, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 9, name: 'Abhinav Mishra', class: 11, level: 'poor', color: 'red' },
    { id: 10, name: 'Abhinav Mishra', class: 11, level: 'excellent', color: 'green' },
    { id: 11, name: 'Abhinav Mishra', class: 11, level: 'average', color: 'orange' },
    { id: 12, name: 'Abhinav Mishra', class: 11, level: 'average', color: 'orange' }
  ];

  const getCardBgColor = (level) => {
    switch(level) {
      case 'excellent': return 'bg-green-100';
      case 'average': return 'bg-amber-100';
      case 'poor': return 'bg-red-100';
      default: return 'bg-white';
    }
  };

  const getProgressBarColor = (level) => {
    switch(level) {
      case 'excellent': return 'bg-green-500';
      case 'average': return 'bg-orange-400';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressWidth = (level) => {
    switch(level) {
      case 'excellent': return 'w-3/4';
      case 'average': return 'w-1/2';
      case 'poor': return 'w-1/4';
      default: return 'w-1/2';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Students Info</h1>
        <div className="flex items-center gap-3">
          <div className='flex gap-4 border p-1 rounded-lg'>
            <button className="bg-white p-2 rounded-lg border">
              <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </button>
            <button className="bg-purple-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>
          </div>
          
          <button className="text-gray-500 p-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src={image2} className="w-full h-full object-cover" alt="Student"/>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search a teacher"
            className="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 whitespace-nowrap">
          <button className="bg-purple-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm">All</button>
          <button className="bg-white text-gray-500 px-3 sm:px-4 py-2 rounded-lg text-sm">Excellent</button>
          <button className="bg-white text-gray-500 px-3 sm:px-4 py-2 rounded-lg text-sm">Optimal</button>
          <button className="bg-white text-gray-500 px-3 sm:px-4 py-2 rounded-lg text-sm">Inefficient</button>
          <button className="bg-white p-2 rounded-lg flex-shrink-0">
            <Sliders className="h-5 w-5 text-gray-500 rotate-90" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className={`p-3 sm:p-4 rounded-lg ${getCardBgColor(student.level)}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white">
                <Image src={image} className="w-full h-full object-cover" alt="Student" />
                <div className="absolute top-5 sm:top-6 left-6 sm:left-8 text-sm sm:text-base">😃</div>
              </div>
              <div className='w-full'>
                <h3 className="font-medium text-sm sm:text-base">{student.name}</h3>
                <div className="flex items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Class:</span>
                  <span className="ml-2">{student.class}</span>
                </div>

                <div className='flex gap-2 items-center'>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Level:</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1">
                  <div 
                    className={`${getProgressBarColor(student.level)} h-1.5 sm:h-2 rounded-full ${getProgressWidth(student.level)}`}
                  ></div>
                </div>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}