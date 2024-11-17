"use client";
import React from 'react';

const ProjectsList: React.FC = () => {
  const projects = [
    { name: 'Dating App Dev', deadline: '20 October', priority: 'HIGH' },
    { name: 'Dashboard UX', deadline: '20 October', priority: 'MEDIUM' },
    // Add more projects as needed
  ];

  return (
    <div className="bg-white p-6 mb-5 shadow rounded-lg">
      <h2 className="font-bold mb-4">Projects List</h2>
      <ul>
        {projects.map((project, idx) => (
          <li key={idx}>
            <h3>{project.name}</h3>
            <p>Deadline: {project.deadline}</p>
            <p>Priority: {project.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;