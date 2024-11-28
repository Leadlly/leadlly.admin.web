'use client'
import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';
import Header from '@/app/(root)/all/_components/Header';
import Link from 'next/link';

interface Mentor {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: {
      personal: number;
      other: number | null;
    };
    address: {
      addressLine: string;
      pincode: string;
      country: string;
    };
    about: {
      dateOfBirth: string;
      gender: string;
    };
    academic: {
      schoolOrCollegeName: string;
      schoolOrCollegeAddress: string;
    };
    preference: {
      standard: string[];
      competitiveExam: string[];
    };
    status: string;
    students: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
    }[];
  }
const AllMENTOR: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMentors = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(`/api/mentor/getmentor`);
          if (response.data.success) {
            setMentors(response.data.mentors);
          } else {
            setError(response.data.error);
          }
        } catch (error) {
          setError(error as string);
        }
        setLoading(false);
      };
      useEffect(() => {
        fetchMentors();
      }, []);
    return (

        <div className="container mx-auto z-1">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <Header />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pt-2">
                <h1 className="text-3xl font-bold text-gray-800">Mentor Lists</h1>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                        <option>Filter</option>
                        <option>Public</option>
                        <option>Private</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg max-h-[900px]">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Phone.Personal</th>
                            <th className="px-4 py-3 text-left">Prefrence.Standard</th>
                            <th className="px-4 py-3 text-left">Prefrence.Exam</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mentors?.length > 0 ? (
                            mentors.map((mentor, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50 transition duration-300">
                                    <td className="px-4 py-2 text-gray-900">
                                        <Link href={`/mentor/${mentor._id}`} className="text-blue-500 hover:underline">
                                            {mentor.firstname} {mentor.lastname}
                                        </Link>

                                    </td>
                                    <td className="px-4 py-2 text-gray-700">{mentor.email}</td>
                                    <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900">Personal:</span> {mentor.phone?.personal || ' '}
                                        </div>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">
  <div>
    <span className="font-medium text-gray-900">Standard:</span> {mentor.preference?.standard?.join(", ") || 'v'}
  </div>
</td>

<td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">
  <div>
    <span className="font-medium text-gray-900">Competitive Exam:</span> {mentor.preference?.competitiveExam?.join(", ") || 'v'}
  </div>
</td>

                                        
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center px-4 py-4 text-gray-700 text-sm">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}
export default AllMENTOR;