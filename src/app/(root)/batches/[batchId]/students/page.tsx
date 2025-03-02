import React from 'react';
import Link from 'next/link';

// Mock data for students in a batch
const getStudentsData = (batchId: string) => {
  // This would typically come from an API or database
  return {
    batchInfo: {
      id: batchId,
      name: batchId.includes('omega') ? 'Omega' : 'Sigma',
      standard: batchId.startsWith('11') ? '11th Class' : '12th Class',
      subjects: batchId.includes('omega') ? ['Physics', 'Chemistry'] : ['Mathematics'],
      teacher: "Dr. Sarah Wilson"
    },
    students: [
      {
        id: "s1",
        name: "Alex Johnson",
        rollNumber: "R2023001",
        attendance: 92,
        performance: 8.7,
        email: "alex.j@student.edu",
        contact: "+1234567890"
      },
      {
        id: "s2",
        name: "Emma Williams",
        rollNumber: "R2023002",
        attendance: 98,
        performance: 9.5,
        email: "emma.w@student.edu",
        contact: "+1234567891"
      },
      {
        id: "s3",
        name: "Michael Brown",
        rollNumber: "R2023003",
        attendance: 85,
        performance: 7.8,
        email: "michael.b@student.edu",
        contact: "+1234567892"
      },
      {
        id: "s4",
        name: "Sophia Davis",
        rollNumber: "R2023004",
        attendance: 94,
        performance: 8.9,
        email: "sophia.d@student.edu",
        contact: "+1234567893"
      },
      {
        id: "s5",
        name: "James Miller",
        rollNumber: "R2023005",
        attendance: 90,
        performance: 8.2,
        email: "james.m@student.edu",
        contact: "+1234567894"
      },
      {
        id: "s6",
        name: "Olivia Wilson",
        rollNumber: "R2023006",
        attendance: 96,
        performance: 9.1,
        email: "olivia.w@student.edu",
        contact: "+1234567895"
      },
      {
        id: "s7",
        name: "William Taylor",
        rollNumber: "R2023007",
        attendance: 88,
        performance: 7.9,
        email: "william.t@student.edu",
        contact: "+1234567896"
      },
      {
        id: "s8",
        name: "Ava Anderson",
        rollNumber: "R2023008",
        attendance: 93,
        performance: 8.6,
        email: "ava.a@student.edu",
        contact: "+1234567897"
      }
    ]
  };
};

export default function BatchStudentsPage({ params }: { params: { batchId: string } }) {
  const { batchInfo, students } = getStudentsData(params.batchId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/batches" className="text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Batches
          </Link>
          <h1 className="text-2xl font-bold">{batchInfo.name} - {batchInfo.standard}</h1>
          <p className="text-gray-600">Subjects: {batchInfo.subjects.join(", ")} | Teacher: {batchInfo.teacher}</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
          Add Student
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-section mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Students List</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="border rounded-md px-4 py-2">
              <option>Sort by Name</option>
              <option>Sort by Roll Number</option>
              <option>Sort by Attendance</option>
              <option>Sort by Performance</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2 text-sm text-gray-900">{student.attendance}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2 text-sm text-gray-900">{student.performance}/10</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${student.performance >= 8.5 ? 'bg-green-500' : student.performance >= 7 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${student.performance * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{students.length}</span> of <span className="font-medium">{students.length}</span> students
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-purple-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}