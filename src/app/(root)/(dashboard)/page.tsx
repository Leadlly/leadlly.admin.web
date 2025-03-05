'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserGraduate,
  FaBook,
  FaChartBar,
  FaUniversity,
  FaPhoneAlt,
  FaEnvelope,
  FaPen,
} from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import Overview from './_components/overview';

const InstituteDashboard = () => {
  const router = useRouter();

  return (
    <div className='w-full bg-white p-6 rounded-lg shadow-md'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>
          Institute Overview & Management
        </h2>
        <button className='bg-purple-500 text-white px-4 py-1 rounded-lg flex items-center gap-2 w-30'>
          <FaPencil className='inline-block' /> Edit
        </button>
      </div>

      {/* Institute Details */}
      <div className='bg-purple-100 p-6 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-6 border border-purple-300'>
        <img
          src='/icon.svg'
          alt='Institute Logo'
          className='w-20 h-20 rounded-lg'
        />
        <div className='flex-1'>
          <p className='text-sm text-gray-600'>Established in 2001</p>
          <h3 className='text-xl font-semibold'>
            Chaitanya Bharathi Institute
          </h3>
          <p className='text-sm text-gray-700'>
            Institute Code: <span className='font-semibold'>21XYZ1234</span>
          </p>
        </div>

        <div className='text-sm text-gray-700 space-y-1 flex-1'>
          <p>
            <div className='block'>
              <FaUniversity className='inline-block' />{' '}
              <strong>Address:</strong>
            </div>
            123, Main Street, City, Country
          </p>
          <p>
            <div className='block'>
              <FaPhoneAlt className='inline-block' /> <strong>Contact:</strong>{' '}
            </div>
            +1234567890
          </p>
          <p>
            <div className='block'>
              <FaEnvelope className='inline-block' /> <strong>Email:</strong>{' '}
            </div>
            info@institute.com
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        {/* Students Overview */}
        <Overview
          name='Students'
          activity='Studying'
          attendance='average attendance'
          performance='performance'
          route='batches'
        />

        {/* Teachers Overview */}
        <Overview
          name='Teachers'
          activity='Teaching'
          attendance='Average attendance'
          performance='Performance'
          route='teachers'
        />
      </div>
    </div>
  );
};

export default InstituteDashboard;
