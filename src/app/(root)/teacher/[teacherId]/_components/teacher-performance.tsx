import React from 'react';

interface TeacherPerformanceProps {
  performanceData: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

const TeacherPerformance = ({ performanceData }: TeacherPerformanceProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-section">
      <h2 className="text-xl font-bold mb-6">Performance Metrics</h2>

      <div className="space-y-6">
        {performanceData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-gray-700">{item.category}</span>
              <span className="text-gray-700 font-medium">{item.score}/{item.maxScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${(item.score / item.maxScore) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherPerformance;
