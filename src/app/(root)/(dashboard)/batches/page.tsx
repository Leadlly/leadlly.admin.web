'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BatchCard from './_components/batchCard';

export default function StudentBatches() {
  const router = useRouter();

  return (
    <div className=' text-white min-h-screen p-8'>
      <div className='max-w-6xl mx-auto bg-white text-black p-6'>
        <h1 className='text-2xl font-bold'>Student Batches of Institute</h1>
        <div className='flex gap-4 my-4'>
          <select className='p-2 border rounded-md w-32'>
            <option>All</option>
          </select>
          <select className='p-2 border rounded-md w-32'>
            <option>All</option>
          </select>
          <select className='p-2 border rounded-md w-32'>
            <option>All</option>
          </select>
        </div>

        {['11th standard', '12th standard'].map((standard, index) => (
          <div
            key={standard}
            className='my-6 b-1 border p-10 rounded-lg border-blue'
          >
            <h2 className='text-xl font-semibold'>{standard}</h2>
            <div className='grid md:grid-cols-3 gap-4 mt-4'>
              {['Omega', 'Sigma', 'Omega'].map((batch, index) => (
                <BatchCard batch={batch} index={index} key={index} />
              ))}
            </div>
            <button className='mt-4 text-purple-500 '>+ Add batch</button>
          </div>
        ))}
      </div>
    </div>
  );
}
