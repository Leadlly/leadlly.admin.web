"use client";
import React from 'react';

const StatsCards: React.FC = () => {
  const cards = [
    { title: 'Total Open Deal', count: '360+', percent: '+23%' },
    { title: 'Task In Progress', count: '122', percent: '+18.3%' },
    { title: 'Completed Task', count: '564', percent: '-18.3%' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-4 shadow rounded-lg">
          <h3>{card.title}</h3>
          <p>{card.count}</p>
          <span>{card.percent}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;