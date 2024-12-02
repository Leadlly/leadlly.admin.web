'use client'
import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';
import Header from '@/app/(root)/all/_components/Header';
import Link from 'next/link';

interface Student {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    category: string;
    phone: {
        personal: string;
        other: string | null;
    };
    academic: {
        standard: string;
        competitiveExam: string;
    };
    about: {
        dateOfBirth: string;
        gender: string;
    };
    freeTrial: {
        availed: boolean;
        active: boolean;
        dateOfActivation: string;
        dateOfDeactivation: string | null;
    };
}
const All: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/student/getstudents`);
            if (response.data.success) {
                setStudents(response.data.students);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            setError(error as string);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

   

    return (

        <div className=" h-full">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 mt-4">
                    <h1 className="text-3xl font-bold text-gray-800">User Lists</h1>
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
                    <table className="w-full bg-white">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Mentor</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">standard</th>
                                <th className="px-4 py-3 text-left">Exam</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students?.length > 0 ? (
                                students.map((student, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b hover:bg-gray-50 transition duration-300"
                                    >
                                        <td className="px-4 py-2 text-gray-900">
                                            <Link
                                                href={`/student/${student._id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {student.firstname} {student.lastname}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 flex items-center justify-between">

                                            <button
                                                className="px-3 py-1 text-white bg-green-500 hover:bg-green-600 rounded"
                                            >
                                                Allocate
                                            </button>
                                        </td>


                                        <td className="px-4 py-2 text-gray-700">
                                            {student.email}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {student.category}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    Personal:
                                                </span>{" "}
                                                {student.phone?.personal || "N/A"}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    Other:
                                                </span>{" "}
                                                {student.phone?.other || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {student.academic?.standard || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {student.academic?.competitiveExam || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center px-4 py-4 text-gray-700 text-sm"
                                    >
                                        No data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    )
}
export default All;