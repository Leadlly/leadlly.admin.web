import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';



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
const MentorDetails: React.FC = () => {

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
<div className="overflow-x-auto max-h-96 rounded-lg mb-6 shadow-lg ml-2 mr-2">
  <table className="min-w-max w-full bg-white">
    <thead className="sticky top-0 bg-gray-100">
      <tr className="text-left text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
        <th className="px-4 sm:px-6 py-3">Mentor's Name</th>
        <th className="px-4 sm:px-10 py-3">Email</th>
        <th className="px-4 sm:px-6 py-3">Status</th>
        <th className="px-4 sm:px-6 py-3">Gender</th>
      </tr>
    </thead>
    <tbody>
      {mentors.map((mentor, idx) => (
        <tr key={idx} className="border-b hover:bg-gray-50 transition duration-300">
          <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-xs sm:text-sm">{mentor.firstname} {mentor.lastname}</td>
          <td className="px-4 sm:px-10 py-4 text-gray-700 text-xs sm:text-sm">{mentor.email || "N/A"}</td>
          <td className="px-4 sm:px-6 py-4 text-gray-700 text-xs sm:text-sm">{mentor.status}</td>
          <td className="px-4 sm:px-6 py-4 text-gray-700 text-xs sm:text-sm">{mentor.about?.gender || "N/A"}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

export default MentorDetails;