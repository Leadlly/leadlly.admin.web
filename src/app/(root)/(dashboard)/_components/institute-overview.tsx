import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

interface InstituteOverviewProps {
  name: string;
  establishedYear: number;
  instituteCode: string;
  address: string;
  contact: string;
  email: string;
  instituteLogo: string;
}

const InstituteOverview = ({
  name,
  establishedYear,
  instituteCode,
  address,
  contact,
  email,
  instituteLogo
}: InstituteOverviewProps) => {
  return (
    <div className="bg-purple-50 p-6 rounded-3xl mb-6 border border-customUniBorder">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-40 h-40 bg-white p-4 rounded-lg flex items-center justify-center shadow-xl">
          <Image 
            src={instituteLogo} 
            alt={name} 
            width={120} 
            height={120}
            className="rounded-md"
          />
        </div>

        <div className="flex-1">
          <p className="text-gray-600">Established in {establishedYear}</p>
          <h1 className="text-3xl font-medium mt-1">{name}</h1>
          <p className="text-gray-600 mt-1">Institute Code:&nbsp;<span className="font-medium text-black">{instituteCode}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="flex flex-col gap-4">
            <div><div className='text-customGray flex items-center gap-2'><MapPin size={16} />Address:&nbsp;</div><div className='px-6'>{address}</div></div>
            <div><div className='text-customGray flex items-center gap-2'><Mail size={16} />Email:&nbsp;</div><div className='px-6'>{email}</div></div>
          </div>
          <div className="flex flex-col gap-4">
            <div><div className='text-customGray flex items-center gap-2'><Phone size={16} />Contact:&nbsp;</div><div className='px-6'>{contact}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteOverview;