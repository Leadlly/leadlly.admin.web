import { useState, useEffect } from 'react';
import apiClient from '../../../apiClient/apiClient';
import Loader from '../Loader';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import Modal from "../../../components/ui/Modal"

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
    lastname:string;
    email:string
  }[];
}

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

const fetchMentors = async () => {
  setLoading(true);
  try {
    const response = await apiClient.get(`/api/mentor/getmentor`);
    if (response.data.success) {
      setMentors(response.data.mentors);
      setLoading(false);
    } else {
      setError(response.data.error);
      setLoading(false);
    }
  } catch (error) {
    setError(error as string);
    setLoading(false);
  }
};

const handleAllocateStudents = async (mentor: Mentor) => {
  setSelectedMentor(mentor);
  setShowModal(true);
  try {
    const response = await apiClient.get(`/api/mentor/getstudent/${mentor._id}`);
    if (response.data.success) {
      setSelectedMentor(response.data.mentor);
      setShowModal(true);
    } else {
      toast.error(response.data.error);
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleVerification = async (id: string, status: string) => {
    try {
      const confirmationMessage = `Are you sure you want to ${status === 'Verified' ? 'verify' : 'not verified'} this mentor?`;
      if (window.confirm(confirmationMessage)) {
        const response = await apiClient.put(`/api/mentor/verify/${id}`, { status });
        if (response.data.success) {
          toast.success(`Mentor ${status === 'Verified' ? 'verified' : 'denied access'} successfully!`);
          setMentors((prevMentors) =>
            prevMentors.map((mentor) =>
              mentor._id === id ? { ...mentor, status: status === 'Verified' ? 'Verified' : 'Not Verified' } : mentor
            )
          );
        } else {
          toast.error(response.data.error);
        }
      } else {
        toast.error('Verification cancelled!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await apiClient.get('/api/auth/admin/logout');
      if (response.data.success) {
        toast.success('Logged out successfully!');
        // Clear local storage or cookies here
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Mentor Data</h2>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <div>
  {loading ? (
    <Loader />
  ) : (
    mentors.length > 0 ? (
      <div>
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-gray-400 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-md md:max-w-lg lg:max-w-xl mt-4"
          >
            <h2 className="text-lg font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
              {mentor.firstname} {mentor.lastname}
            </h2>
            <p className="text-gray-900 font-bold truncate">Email: {mentor.email || 'N/A'}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (mentor.status === 'Not Verified') {
                    handleVerification(mentor._id, 'Verified')
                  } else if (mentor.status === 'Verified') {
                    handleVerification(mentor._id, 'Not Verified');
                  } else if (mentor.status === 'Denied') {
                    handleVerification(mentor._id, 'Verified');
                  }
                }}
                disabled={loading}
                className={`text-white font-bold py-2 px-4 rounded border border-solid border-gray-200`}
              >
                {mentor.status === 'Not Verified' ? 'Verify' : mentor.status === 'Verified' ? 'Not Verify' : 'Verify'}
              </button>
              <button
                onClick={() => handleAllocateStudents(mentor)}
                className="ml-2 text-white font-bold py-2 px-4 rounded border border-solid border-gray-200"
              >
                Allocate Students
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No mentors found.</p>
    )
  )}
</div>
    
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  header={<h3 className="text-lg font-bold">Allocated Students</h3>}
  body={
    selectedMentor && selectedMentor.students.length > 0? (
      <ul className="divide-y divide-gray-200">
        {selectedMentor.students.map((student) => (
          <li key={student.id} className="py-4">
            <div className="flex flex-col">
              <p className="text-gray-900 font-bold">{student.firstname} {student.lastname}</p>
              <p className="text-gray-600">{student.email}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">No students allocated to this mentor.</p>
    )
  }
  footer={
    <Button onClick={() => setShowModal(false)} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
      Close
    </Button>
  }
/>
      </>
    );
}
    
    export default Mentors;