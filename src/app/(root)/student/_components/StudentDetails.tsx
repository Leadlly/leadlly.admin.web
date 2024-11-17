import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';



interface Student {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  academic: {
standard: string
  };
  about: {
    dateOfBirth: string;
    gender: string;
  };
  freeTrial: {
    availed: boolean;
    active: boolean;
    dateOfActivation: string; // You can change this to Date if needed
    dateOfDeactivation: string | null; // Can be null if the trial isn't deactivated
  };
}
const StudentDetails: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/student/getstudents`);
      if (response.data.success) {
        setStudents(response.data.students);  // Corrected this line to set 'students' from response
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
    <div className="overflow-x-auto rounded-lg shadow-lg mb-6">
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full bg-white">
        <thead className="sticky top-0 bg-gray-100">
          <tr className="text-left text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
            <th className="px-4 py-3 w-1/4">Mentor's Name</th>
            <th className="px-4 py-3 w-1/4">Email</th>
            <th className="px-4 py-3 w-1/4">Standard</th>
            <th className="px-4 py-3 w-1/4">Gender</th>
            <th className="px-12 py-3 w-1/4">Free Trial</th>
          </tr>
        </thead>
        <tbody>
          {students?.length > 0 ? (
            students.map((student, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition duration-300">
                <td className="px-4 py-2 font-medium text-gray-900 text-xs sm:text-sm">
                  {student.firstname} {student.lastname}
                </td>
                <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">{student.email || "N/A"}</td>
                <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">{student.academic?.standard || "N/A"}</td>
                <td className="px-4 py-2 text-gray-700 text-xs sm:text-sm">{student.about?.gender || "N/A"}</td>
                <td className="px-12 py-2 text-gray-700 text-xs sm:text-sm">
                  {student.freeTrial.active ? "Active" : "Inactive"}
                  <br />
                  {student.freeTrial.dateOfActivation
                    ? `Activated on: ${new Date(student.freeTrial.dateOfActivation).toLocaleDateString()}`
                    : "Not Activated"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center px-4 py-4 text-gray-700 text-xs sm:text-sm">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>



  );
};

export default StudentDetails;