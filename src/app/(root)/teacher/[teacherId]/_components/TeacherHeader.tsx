import React from 'react';
import Image from 'next/image';

interface TeacherHeaderProps {
  teacherId: string;
  name: string;
  joinedYear: number;
  teacherCode: string;
  email: string;
  address: string;
  contact: string;
}

const TeacherHeader = ({
  teacherId,
  name,
  joinedYear,
  teacherCode,
  email,
  address,
  contact,
}: TeacherHeaderProps) => {
  return (
    <div className="bg-purple-50 p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-40 h-40 bg-white p-4 rounded-lg flex items-center justify-center">
          <Image 
            src="/placeholder-teacher.png" 
            alt={name} 
            width={120} 
            height={120}
            className="rounded-md"
          />
        </div>
        
        <div className="flex-1">
          <p className="text-gray-600">Joined in {joinedYear}</p>
          <h1 className="text-3xl font-bold mt-1">{name}</h1>
          <p className="text-gray-600 mt-1">Teacher Code: {teacherCode}</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">{address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-gray-700">{contact}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-gray-700">{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHeader;