import Link from 'next/link';
import { Filter, Plus } from 'lucide-react';
import { SiElectron } from "react-icons/si";
import { SlCalculator } from "react-icons/sl";
import { GiSettingsKnobs } from "react-icons/gi";

export default function BatchesPage() {
  const batches = [
    {
      standard: '11th',
      batches: [
        { name: 'Omega', subject: 'Chemistry, Physics, Biology', totalStudents: 120, teacher: 'Dr. Sarah Wilson' },
        { name: 'Sigma', subject: 'Mathematics, Chemistry, Physics', totalStudents: 120, teacher: 'Dr. Sarah Wilson' },
        { name: 'Omega', subject: 'Physics', totalStudents: 120, teacher: 'Dr. Sarah Wilson' }
      ]
    },
    {
      standard: '12th',
      batches: [
        { name: 'Omega', subject: 'Chemistry', totalStudents: 120, teacher: 'Dr. Sarah Wilson' },
        { name: 'Sigma', subject: 'Mathematics', totalStudents: 120, teacher: 'Dr. Sarah Wilson' },
        { name: 'Omega', subject: 'Physics', totalStudents: 120, teacher: 'Dr. Sarah Wilson' }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-3 sm:p-6 bg-purple-50">
      <div className="ml-0 sm:ml-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Batches of Institute</h1>
        <div className="flex flex-col sm:flex-row bg-white px-3 sm:px-4 py-2 rounded-lg my-2 overflow-x-auto">
          <div className="flex items-center gap-2 py-2 flex-wrap">
            <GiSettingsKnobs className='rotate-90 h-5 w-5 flex-shrink-0'/>
            <span className="text-sm text-gray-500 whitespace-nowrap">Filter by :</span>
            
            <div className="flex gap-2 flex-wrap">
              {['All', 'All', 'All'].map((filter, index) => (
                <div key={index} className="relative mb-2 sm:mb-0">
                  <select className="bg-gray-50 border rounded px-2 sm:px-3 py-1 pr-8 text-sm appearance-none focus:outline-none min-w-24 sm:min-w-28">
                    <option>{filter}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {batches.map((standardGroup) => (
        <div key={standardGroup.standard} className="mb-8 border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{standardGroup.standard} standard</h2>
            <button className="text-purple-500 px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-purple-600 transition duration-200">
              + Add batch
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {standardGroup.batches.map((batch, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {batch.name === 'Omega' ? (
                      <div className='bg-blue-500 p-2 sm:p-3 rounded-full flex-shrink-0'>
                        <SiElectron className='h-4 w-4 sm:h-5 sm:w-5 text-white'/>
                      </div>
                    ) : (
                      <div className='bg-purple-600 p-2 sm:p-3 rounded-full flex-shrink-0'>
                        <SlCalculator className='h-4 w-4 sm:h-5 sm:w-5 text-white'/>
                      </div>
                    )}
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">{batch.name}</h3>
                      <span className="text-xs text-gray-500 ml-1">{standardGroup.standard} Class</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    Active
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-2">Subject: <span className='text-black'>{batch.subject}</span></p>
                <p className="text-gray-600 text-xs sm:text-sm mb-2">Total Students: <span className='text-black'>{batch.totalStudents}</span></p>
                <div className='flex justify-end text-xs'>120/180</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(batch.totalStudents / 180) * 100}%` }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <p className="text-black text-xs sm:text-sm justify-center items-center">-By {batch.teacher}</p>
                  <Link href={`/batches/${batch.name.toLowerCase()}/students`}>
                    <button className="bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-600 transition duration-200 w-full sm:w-auto">
                      View More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}