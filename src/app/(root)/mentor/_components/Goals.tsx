"use client";
import React from 'react';

const Goals: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2>Subscribe Goal</h2>
      <ul>
        <li>LinkedIn: 53%</li>
        <li>Facebook: 53%</li>
        <li>Instagram: 53%</li>
        <li>Twitter: 65%</li>
      </ul>
      <div>
        <h3>Weekly Progress: 82.3%</h3>
      </div>
    </div>
  );
};

export default Goals;