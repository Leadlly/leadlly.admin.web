import { useState, useEffect } from 'react';
import apiClient from '../../../apiClient/apiClient';

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
}
const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await apiClient.get('/api/auth/admin/mentor');
        setMentors(response.data.mentors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMentors();
  }, []);

  const handleMentorClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleClose = () => {
    setSelectedMentor(null);
  };

  return (
    <>
      <h2 className='text-2xl font-bold text-gray-900'>Mentor Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {mentors.map((mentor) => (
    <div key={mentor._id} className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-md md:max-w-lg lg:max-w-xl" onClick={() => handleMentorClick(mentor)}>
      <h2 className="text-lg font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
        {mentor.firstname} {mentor.lastname}
      </h2>
      <p className="text-gray-600 font-bold truncate">Email: {mentor.email}</p>
    </div>
  ))}
  {selectedMentor && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative">
        <button className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={handleClose}>
          X
        </button>
        <MentorInfo mentor={selectedMentor} />
      </div>
    </div>
  )}
</div>
  </>
  );
};

const MentorInfo = ({ mentor }: { mentor: Mentor }) => {
  return (
      
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {mentor.firstname} {mentor.lastname}
      </h2>
      <div className="space-y-2">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
          <p className="text-gray-700"><strong>Email:</strong> {mentor.email}</p>
          <p className="text-gray-700">
            <strong>Phone:</strong>
            {mentor.phone.personal && ` Personal: ${mentor.phone.personal}`}
            {mentor.phone.other && ` | Other: ${mentor.phone.other}`}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Address</h3>
          <p className="text-gray-700">
            {mentor.address.addressLine}, {mentor.address.pincode}, {mentor.address.country}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">About</h3>
          <p className="text-gray-700">
            <strong>Date of Birth:</strong> {mentor.about.dateOfBirth}
          </p>
          <p className="text-gray-700"><strong>Gender:</strong> {mentor.about.gender}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Academic Information</h3>
          <p className="text-gray-700"><strong>School/College:</strong> {mentor.academic.schoolOrCollegeName}</p>
          <p className="text-gray-700"><strong>Address:</strong> {mentor.academic.schoolOrCollegeAddress}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Preferences</h3>
          <p className="text-gray-700"><strong>Standard:</strong> {mentor.preference.standard.join(', ')}</p>
          <p className="text-gray-700"><strong>Competitive Exam:</strong> {mentor.preference.competitiveExam.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
