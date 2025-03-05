import React from 'react';

import { useRouter } from 'next/navigation';

type Props = {
  batch: String;
  index: number;
};

function batchCard({ batch, index }: Props) {
  const router = useRouter();

  return (
    <div className='bg-gray-100 p-4 rounded-lg shadow'>
      <div className='flex items-center gap-2'>
        <div className='bg-blue-500 text-white p-2 rounded-full'>
          <span className='text-sm font-bold p-2'>{batch.charAt(0)}</span>
        </div>
        <h3 className='text-lg font-bold'>{batch}</h3>
        <span
          style={{
            backgroundColor: 'lightgreen',
          }}
          className='ml-auto text-green-500 rounded px-2 font-medium'
        >
          Active
        </span>
      </div>
      <p className='text-sm mt-2'>
        <span className='font-bold text-gray-500'>Subject:</span> Mathematics,
        Chemistry, Physics
      </p>
      <p className='text-sm'>
        <span className='font-bold text-gray-500'>Total Students:</span> 120/180
      </p>
      <div className='mt-2 bg-gray-300 h-2 rounded'>
        <div
          className='bg-purple-500 h-2 rounded'
          style={{ width: '66%' }}
        ></div>
      </div>
      <p className='text-xs mt-2'>- By Dr. Sarah Wilson</p>
      <button
        // onClick={() =>
        //   router.push('/[batchId]/students/[studentId]/page.tsx')
        // }
        onClick={() => router.push(`/batches/${batch}/students/${index + 1}`)}
        className='mt-2 bg-purple-500 text-white px-4 py-1 rounded-md'
      >
        View More
      </button>
    </div>
  );
}

export default batchCard;
