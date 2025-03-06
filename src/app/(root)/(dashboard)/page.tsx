import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MapPin, Phone, Mail, Users, Award } from 'lucide-react';
import { PiNotebookBold } from "react-icons/pi";
import { BsFillFileEarmarkCheckFill, BsBuildings } from "react-icons/bs";
import Logo from '../../../../public/images/image.png';
import { GoGraph } from "react-icons/go";
import { SiBookstack } from "react-icons/si";
import { FaGraduationCap } from "react-icons/fa6";
import { LuPencilLine } from "react-icons/lu";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
        <h1 className="text-xl font-bold">Institute Overview & Management</h1>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <LuPencilLine className='h-4 w-4'/>
          Edit
        </button>
      </div>
      
      <div className="border border-purple-300 bg-purple-100 rounded-lg p-4 sm:p-6 mb-6 relative">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex justify-center md:justify-start">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded border flex items-center justify-center">
              <Image
                src={Logo}
                alt="Institute Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row w-full justify-between items-start lg:items-center gap-4">
            <div className="text-center md:text-left">
              <div className="text-sm text-gray-600">Established in 2001</div>
              <h2 className="text-xl font-bold">Chaitanya Bharathi Institute</h2>
              <div className="text-sm text-gray-600">Institute Code: <span className='font-semibold text-black'>21XYZ1234</span></div>
            </div>
            
            <div className='w-full lg:w-2/3'>
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-y-2 gap-x-4 lg:gap-x-8">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0"/>
                  <span className="text-gray-600">Address: <br /> <span className='text-black'>123, Main Street, City, Country</span> 
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500 transform scale-x-[-1] flex-shrink-0" />
                  <span className="text-gray-600">Contact: <br /> <span className='text-black'>+1234567890</span> </span>
                </div>
                
                <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                  <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600">Email: <br /> <span className='text-black'>info@institute.com</span> 
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-green-400 rounded-lg overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-lg">Students Overview</h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Students</div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xl font-bold">2284</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Active Courses</div>
                <div className="flex items-center gap-2">
                  <PiNotebookBold className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xl font-bold">84</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Average Attendance</div>
                <div className="flex items-center gap-2">
                  <BsFillFileEarmarkCheckFill className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xl font-bold">98%</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Performance Index</div>
                <div className="flex items-center gap-2">
                  <GoGraph className="h-5 w-5 text-green-600 flex-shrink-0"/>
                  <span className="text-xl font-bold">9.0/10</span>
                </div>
              </div>
            </div>
            <Link href="/batches" className="col-span-2">
              <button className="w-full py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-md mt-6 flex items-center justify-center gap-2">
                <SiBookstack className='h-4 w-4'/>
                View Students
              </button>
            </Link>
          </div>
        </div>
        
        <div className="border border-blue-400 rounded-lg overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-lg">Teachers Overview</h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Teachers</div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-xl font-bold">24</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Departments</div>
                <div className="flex items-center gap-2">
                  <PiNotebookBold className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-xl font-bold">14</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Active Classes</div>
                <div className="flex items-center gap-2">
                  <BsFillFileEarmarkCheckFill className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-xl font-bold">98</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Satisfaction Rate</div>
                <div className="flex items-center gap-2">
                  <GoGraph className="h-5 w-5 text-blue-600 flex-shrink-0"/>
                  <span className="text-xl font-bold">9.0/10</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md mt-6 flex items-center justify-center gap-2">
              <FaGraduationCap className='h-4 w-4'/>
              View Teachers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
