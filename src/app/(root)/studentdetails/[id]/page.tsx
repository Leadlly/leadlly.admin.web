'use client'

import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';

interface Mentor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  students: Student[];
}

interface Academic {
  standard: number;
  competitiveExam: string;
  schedule: string;
  coachingMode: string;
}

interface Student {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  academic?: Academic;
  mentor?: Mentor | null;
}

const StudentDetailsId: React.FC = () => {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      console.error('ID is missing or undefined');
      return; // Avoid making the request if the ID is not available
    }

    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/mentor/getstudent/${id}`);
        if (response.data.success) {
          setMentor(response.data.mentor);
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  const handleDeallocateStudent = async (studentId: string) => {
    const confirmDeallocate = window.confirm('Are you sure you want to deallocate this student?');
    if (!confirmDeallocate) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/api/student/deallocate-student', { studentIds: [studentId] });
      if (response.data.success) {
        toast.success('Student deallocated successfully!');
        setMentor(prevMentor => {
          if (!prevMentor) return null;

          return {
            ...prevMentor,
            students: prevMentor.students.filter(student => student._id !== studentId),
          };
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deallocating student:', error);
      toast.error('Failed to deallocate student.');
    } finally {
      setLoading(false);
    }
  };

  const allocatedStudents = mentor?.students.filter(student => student.mentor?._id === mentor._id) || [];

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        mentor && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
              Mentor: {mentor.firstname} {mentor.lastname}
            </h2>
            <button
              className="bg-gray-600 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded"
              onClick={() => router.push('/allMentor')}
            >
              Go Back
            </button>

            <h3 className="text-lg font-bold text-gray-900 mt-4">Allocated Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allocatedStudents.length > 0 ? (
                allocatedStudents.map((student: Student) => (
                  <div key={student._id} className="bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {student.firstname} {student.lastname}
                    </h4>
                    {student.academic ? (
                      <>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Standard:</span> {student.academic.standard || 'N/A'}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Competitive Exam:</span> {student.academic.competitiveExam || 'N/A'}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Schedule:</span> {student.academic.schedule || 'N/A'}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Coaching Mode:</span> {student.academic.coachingMode || 'N/A'}
                        </p>
                      </>
                    ) : (
                      <p className="text-red-600 font-medium">Academic information is not available</p>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeallocateStudent(student._id);
                        }}
                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
                      >
                        Deallocate
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No students are allocated to this mentor.</p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StudentDetailsId;
