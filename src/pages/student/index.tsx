import { useState, useEffect } from 'react';
import apiClient from '../../apiClient/apiClient';
import Loader from '../root/Loader';
import { useParams } from 'react-router-dom';

interface Mentor {
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
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  academic?: Academic; // Made optional to handle undefined case
}

const Student = () => {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/mentor/getstudent/${id}`);
        if (response.data.success) {
          setMentor(response.data.mentor);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        mentor && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
              Mentor: {mentor.firstname} {mentor.lastname}
            </h2>
            <p className="text-gray-600">Email: {mentor.email}</p>

            <h3 className="text-lg font-bold text-gray-900 mt-4">Allocated Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentor.students.map((student: Student, index) => (
  <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-200">
    <h4 className="text-xl font-semibold text-gray-800 mb-2">
      {student.firstname} {student.lastname}
    </h4>
    <p className="text-gray-700 mb-1">
      <span className="font-medium">Email:</span> {student.email}
    </p>
    {student.academic ? (
      <>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Standard:</span> {student.academic.standard || "N/A"}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Competitive Exam:</span> {student.academic.competitiveExam || "N/A"}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Schedule:</span> {student.academic.schedule || "N/A"}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Coaching Mode:</span> {student.academic.coachingMode || "N/A"}
        </p>
      </>
    ) : (
      <p className="text-red-600 font-medium">
        Academic information is not available
      </p>
    )}
  </div>
))}

            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Student;
