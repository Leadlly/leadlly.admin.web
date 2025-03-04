import React from 'react';

interface Class {
  id: string;
  name: string;
  subject: string;
  students: number;
  schedule: string;
}

interface TeacherClassesProps {
  classes: Class[];
}

const TeacherClasses = ({ classes }: TeacherClassesProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-section mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Active Classes</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.students}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.schedule}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherClasses;