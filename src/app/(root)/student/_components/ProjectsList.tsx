"use client";
import React from 'react';

const ProjectsList: React.FC = () => {
  const projects = [
    { name: 'Dating App Dev', deadline: '20 October', priority: 'HIGH' },
    { name: 'Dashboard UX', deadline: '20 October', priority: 'MEDIUM' },
    // Add more projects as needed
  ];

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Projects List</h2>
      <ul className="space-y-4">
        {projects.map((project, idx) => (
          <li key={idx}  className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-700">{project.name}</h3>
            <p>Deadline: {project.deadline}</p>
            <p>Priority: {project.priority}</p>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default ProjectsList;