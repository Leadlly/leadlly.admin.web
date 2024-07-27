import  { useState, useEffect } from 'react';
import apiClient from '../../apiClient/apiClient';
import Loader from '../root/Loader';
import { useParams } from 'react-router-dom';

interface Mentor {
    firstname: string;
    lastname: string;
    email: string;
    students: Student[];
  }
interface Student {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
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
            Mentor:  {mentor.firstname} {mentor.lastname}
            </h2>
            <h3 className="text-lg font-bold text-gray-900">Allocated Students</h3>
            <ul className="divide-y divide-gray-200">
  {mentor && mentor.students.map((student: Student, index) => (
    <li key={index} className="py-4">
      <div className="flex flex-col">
        <p className="text-gray-900 font-bold">{student.firstname} {student.lastname}</p>
        <p className="text-gray-600">{student.email}</p>
      </div>
    </li>
  ))}
</ul>
          </div>
        )
      )}
    </div>
  );
};
export default Student;