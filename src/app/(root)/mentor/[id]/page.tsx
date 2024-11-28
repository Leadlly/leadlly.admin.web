"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/apiClient/apiClient";

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
  mentors: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  }[];
}

const MentorDetail: React.FC = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMentorDetails = async () => {
        try {
          const response = await apiClient.get(`/api/mentor/getmentor/${id}`);
          if (response.data.success) {
            setMentor(response.data.mentor); 
          } else {
            setError("Mentor not found.");
          }
        } catch (err) {
          console.error("Error fetching mentor data:", err); 
          setError("Error fetching mentor data");
        }
        setLoading(false);
      };
  
      fetchMentorDetails();
    }
  }, [id]);
  

  if (error) return <div>{error}</div>;
  if (!mentor) return <div>No mentor found with ID {id}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Basic Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">First Name:</label>
          <input
            type="text"
            value={mentor.firstname || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name:</label>
          <input
            type="text"
            value={mentor.lastname || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Gender:</label>
          <input
            type="text"
            value={mentor.about?.gender || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone No.:</label>
          <input
            type="text"
            value={mentor.phone?.personal || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={mentor.email || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="text"
            value={mentor.about?.dateOfBirth || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-purple-700 mt-10 mb-6">Other Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            value={mentor.address?.addressLine || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">PIN Code:</label>
          <input
            type="text"
            value={mentor.address?.pincode || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Country:</label>
          <input
            type="text"
            value={mentor.address?.country || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-purple-600 mt-10 mb-6">Academic Information</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

  <div>
  <label className="block text-gray-700 mb-2">Prefrence.Standard:</label>
  <div className="flex items-center space-x-4">
  <input
    type="text"
    value={mentor.preference?.standard || ' '}
    readOnly
    className="text-gray-800 border p-2 rounded w-full"
  />
</div>

</div>


  <div>
    <label className="block text-gray-700 mb-2">Prefrence.competitiveExam</label>
    <input
      type="text"
      placeholder="Enter Coaching Address"
      value={mentor.preference?.competitiveExam || ' '}
      className="text-gray-800 border p-2 rounded w-full"
    />
  </div>
</div>


    </div>
  );
};

export default MentorDetail;
