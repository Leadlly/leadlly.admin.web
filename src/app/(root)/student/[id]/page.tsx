"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/apiClient/apiClient";

interface Student {
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    personal?: string;
    other?: string;
  };
  gender: string;
  dob: string;
  parent: {
    name?: string;
    phone?: string;
  };
  address: {
    country?: string;
    addressLine?: string;
    pincode?: string;
  };
  academic: {
    standard?: string;
    competitiveExam?: string;    
    coachingMode?:string;
    schoolOrCollegeAddress?:string;
    coachingAddress?:string;

  };
  about: {
    dateOfBirth?: string;
    gender?: string;
  };
}

const StudentDetail: React.FC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStudentDetails = async () => {
        try {
          const response = await apiClient.get(`/api/student/getstudent/${id}`);
          if (response.data.success) {
            setStudent(response.data.student); // Set the student details
          } else {
            setError("Student not found");
          }
        } catch (err) {
          setError("Error fetching student data");
        }
        setLoading(false);
      };

      fetchStudentDetails();
    }
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!student) return <div>No student found with ID {id}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Basic Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">First Name:</label>
          <input
            type="text"
            value={student.firstname || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name:</label>
          <input
            type="text"
            value={student.lastname || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Class:</label>
          <input
            type="text"
            value={student.academic?.standard || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Gender:</label>
          <input
            type="text"
            value={student.about?.gender || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone No.:</label>
          <input
            type="text"
            value={student.phone?.personal || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={student.email || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="text"
            value={student.about?.dateOfBirth || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-purple-700 mt-10 mb-6">Other Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Parent Name:</label>
          <input
            type="text"
            value={student.parent?.name || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Parent's Phone No.:</label>
          <input
            type="text"
            value={student.parent?.phone || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            value={student.address?.addressLine || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">PIN Code:</label>
          <input
            type="text"
            value={student.address?.pincode || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Country:</label>
          <input
            type="text"
            value={student.address?.country || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-purple-600 mt-10 mb-6">Academic Information</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div>
    <label className="block text-gray-700 mb-2">Competitive Exam:</label>
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={student.academic?.competitiveExam || ""}
        readOnly
        className="text-gray-800 border p-2 rounded w-full"
      />
    </div>
  </div>

  <div>
    <label className="block text-gray-700 mb-2">Other:</label>
    <input
      type="text"
      placeholder="Message about Competitive Exam"
      className="text-gray-800 border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-gray-700 mb-2">School/College Name:</label>
    <input
      type="text"
      placeholder="Enter School/College Name"
      className="text-gray-800 border p-2 rounded w-full"
      value={student.academic?.schoolOrCollegeAddress || ' '}
    />
  </div>

  <div>
  <label className="block text-gray-700 mb-2">Coaching Mode:</label>
  <div className="flex items-center space-x-4">
  <input
    type="text"
    value={student.academic?.coachingMode || ' '}
    readOnly
    className="text-gray-800 border p-2 rounded w-full"
  />
</div>

</div>


  <div>
    <label className="block text-gray-700 mb-2">Coaching Address:</label>
    <input
      type="text"
      placeholder="Enter Coaching Address"
      value={student.academic?.coachingAddress || ' '}
      className="text-gray-800 border p-2 rounded w-full"
    />
  </div>
</div>


    </div>
  );
};

export default StudentDetail;
