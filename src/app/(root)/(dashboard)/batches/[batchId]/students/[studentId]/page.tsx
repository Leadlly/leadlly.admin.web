'use client';
import { useState } from 'react';

const students = [
  { name: 'Abhinav Mishra', class: 11, level: 'excellent' },
  { name: 'Abhinav Mishra', class: 11, level: 'optimal' },
  { name: 'Abhinav Mishra', class: 11, level: 'inefficient' },
  { name: 'Abhinav Mishra', class: 11, level: 'excellent' },
  { name: 'Abhinav Mishra', class: 11, level: 'optimal' },
  { name: 'Abhinav Mishra', class: 11, level: 'inefficient' },
  { name: 'Abhinav Mishra', class: 11, level: 'excellent' },
  { name: 'Abhinav Mishra', class: 11, level: 'optimal' },
  { name: 'Abhinav Mishra', class: 11, level: 'inefficient' },
];

const levelColors = {
  excellent: 'bg-green-200 border-green-400',
  optimal: 'bg-yellow-200 border-yellow-400',
  inefficient: 'bg-red-200 border-red-400',
};

const progressColors = {
  excellent: 'bg-green-500 w-3/4',
  optimal: 'bg-yellow-500 w-2/4',
  inefficient: 'bg-red-500 w-1/4',
};

export default function StudentsInfo() {
  const [filter, setFilter] = useState('all');

  const filteredStudents =
    filter === 'all' ? students : students.filter((s) => s.level === filter);

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Students Info</h1>
      <input
        type='text'
        placeholder='Search a teacher'
        className='w-full p-2 border rounded-md mb-4'
      />

      <div className='flex space-x-3 mb-4'>
        {['all', 'excellent', 'optimal', 'inefficient'].map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-md ${
              filter === level ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilter(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-3 gap-4'>
        {filteredStudents.map((student, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border  ${levelColors[student.level]}`}
          >
            <span
              style={{ backgroundColor: 'lightgreen' }}
              className='inline flex-1 p-2  rounded-full'
            >
              😎
            </span>
            <div className=''>
              <h2 className='font-bold'>{student.name}</h2>
              <p>Class: {student.class}</p>
              <p>Level:</p>
              <div className='w-full bg-gray-300 h-2 rounded-full mt-1'>
                <div
                  className={`h-full rounded-full ${
                    progressColors[student.level]
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
