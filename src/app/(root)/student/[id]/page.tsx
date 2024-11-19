'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';  // Import useParams from next/navigation
import apiClient from '@/apiClient/apiClient';  // Assuming apiClient is already set up

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

const StudentDetail: React.FC = () => {
  const { id } = useParams(); // Use useParams to get the dynamic 'id' from the URL
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the student details when the id is available
      const fetchStudentDetails = async () => {
        try {
          const response = await apiClient.get(`/api/student/${id}`);
          if (response.data.success) {
            setStudent(response.data.student); // Set the student details
          } else {
            setError('Student not found');
          }
        } catch (err) {
          setError('Error fetching student data');
        }
        setLoading(false);
      };

      fetchStudentDetails();
    }
  }, [id]); // Run the effect whenever the id changes

  // If loading, show loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error occurs or no student data, show error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no student is found, display a message
  if (!student) {
    return <div>No student found with ID {id}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">
        {student.firstname} {student.lastname}
      </h1>
      <div className="mt-4">
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Category:</strong> {student.category}</p>
        <p><strong>Phone (Personal):</strong> {student.phone.personal}</p>
        <p><strong>Phone (Other):</strong> {student.phone.other || 'N/A'}</p>
        <p><strong>Standard:</strong> {student.academic.standard}</p>
        <p><strong>Competitive Exam:</strong> {student.academic.competitiveExam}</p>
        <p><strong>Date of Birth:</strong> {student.about.dateOfBirth}</p>
        <p><strong>Gender:</strong> {student.about.gender}</p>
        <p><strong>Free Trial Availment:</strong> {student.freeTrial.availed ? 'Yes' : 'No'}</p>
        <p><strong>Free Trial Activation Date:</strong> {student.freeTrial.dateOfActivation}</p>
        <p><strong>Free Trial Deactivation Date:</strong> {student.freeTrial.dateOfDeactivation || 'N/A'}</p>
      </div>
    </div>
  );
};

export default StudentDetail;
