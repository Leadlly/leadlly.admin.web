import React from 'react';
import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaBook, FaChartBar } from 'react-icons/fa';
type Props = {
  name: String;
  activity: String;
  attendance: String;
  performance: String;
  route: String;
};

function overview({ name, activity, attendance, performance, route }: Props) {
  const router = useRouter();

  return (
    <div
      className={` ${
        name === 'Teachers' ? 'bg-red-50' : 'bg-green-50'
      } p-6 rounded-xl border border-orchid-300`}
    >
      {/* Students Overview */}
      <h4 className='text-lg font-semibold mb-3'>{name} Overview</h4>
      <div className='space-y-2'>
        <p>
          <FaUserGraduate className='inline-block' />{' '}
          <strong>Total {name}:</strong> <span className='font-bold'>2284</span>
        </p>
        <p>
          <FaBook className='inline-block' />{' '}
          <strong>Active {activity}:</strong>{' '}
          <span className='font-bold'>84</span>
        </p>
        <p>
          <FaChartBar className='inline-block' /> <strong>{attendance}:</strong>{' '}
          <span className='font-bold'>98%</span>
        </p>
        <p>
          <FaChartBar className='inline-block' />{' '}
          <strong>{performance}:</strong>{' '}
          <span className='font-bold'>9.0/10</span>
        </p>
      </div>
      <button
        className='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full'
        onClick={() => router.push(`/${route}`)}
      >
        📚 View {name}
      </button>
    </div>
  );
}

export default overview;
