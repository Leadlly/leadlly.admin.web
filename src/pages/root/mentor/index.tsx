import { useState, useEffect } from 'react';
import apiClient from '../../../apiClient/apiClient';
import Loader from '../Loader';
import { toast } from 'sonner';

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
  status: string; // added status property
}

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);
 //typescript-eslint
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/auth/admin/mentor');
      setMentors(response.data.mentors);
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleVerification = async (id: string, status: string) => {
    try {
      const response = await apiClient.put(`/api/auth/admin/verify/${id}`, { status });
      if (response.data.success) {
        toast.success(`Mentor ${status === 'Verified' ? 'verified' : 'denied access'} successfully!`);
        setMentors((prevMentors) =>
          prevMentors.map((mentor) =>
            mentor._id === id ? { ...mentor, status: status === 'Verified' ? 'Verified' : 'Denied' } : mentor
          )
        );
      } else {
        toast.error(response.data.error);
      } if (error) {
        return <div>Error: {error}</div>;
      }
    } catch (error) {
      console.error(error); // or do something with the error
    }
  };

  const handleClose = () => {
    setSelectedMentor(null);
  };
  return (
    <>
      <h2 className='text-2xl font-bold text-gray-900'>Mentor Data</h2>
      <div>
      {loading ? (
        <Loader />
      ) : (
        mentors.length > 0 ? (
          <div>
           {mentors.map((mentor) => (
  <div
    key={mentor._id}
    className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-md md:max-w-lg lg:max-w-xl"
    onClick={() => setSelectedMentor(mentor)} // Add this line
  >
    <h2 className="text-lg font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
      {mentor.firstname} {mentor.lastname}
    </h2>
    <p className="text-gray-700 font-bold truncate">Email: {mentor.email || 'N/A'}</p>
    <div className="flex justify-center mt-4">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Add this line
          if (mentor.status === 'Not Verified') {
            handleVerification(mentor._id, 'Verified');
          } else if (mentor.status === 'Verified') {
            handleVerification(mentor._id, 'Denied');
          } else if (mentor.status === 'Denied') {
            handleVerification(mentor._id, 'Verified');
          }
        }}
        disabled={loading}
        className={`bg-${mentor.status === 'Not Verified'? 'green' : mentor.status === 'Verified'? 'red' : 'green'}-500 hover:bg-${mentor.status === 'Not Verified'? 'green' : mentor.status === 'Verified'? 'red' : 'green'}-700 text-white font-bold py-2 px-4 rounded`}
      >
        {mentor.status === 'Not Verified'? 'Verify' : mentor.status === 'Verified'? 'Not Verified' : 'Verify'}
      </button>
    </div>
  </div>
))}
          </div>
        ) : (
          <p>No mentors found.</p>
        )
      )}

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
          <p className="text-gray-700"><strong>Email:</strong> {mentor.email || 'N/A'}</p>
          <p className="text-gray-700">
            <strong>Phone:</strong>
            {mentor.phone.personal ? ` Personal: ${mentor.phone.personal}` : 'N/A'}
            {mentor.phone.other ? ` | Other: ${mentor.phone.other}` : ''}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Address</h3>
          <p className="text-gray-700">
            {mentor.address.addressLine || 'N/A'}, {mentor.address.pincode || 'N/A'}, {mentor.address.country || 'N/A'}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">About</h3>
          <p className="text-gray-700">
            <strong>Date of Birth:</strong> {mentor.about.dateOfBirth || 'N/A'}
          </p>
          <p className="text-gray-700"><strong>Gender:</strong> {mentor.about.gender || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Academic Information</h3>
          <p className="text-gray-700"><strong>School/College:</strong> {mentor.academic.schoolOrCollegeName || 'N/A'}</p>
          <p className="text-gray-700"><strong>Address:</strong> {mentor.academic.schoolOrCollegeAddress || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Preferences</h3>
          <p className="text-gray-700"><strong>Standard:</strong> {mentor.preference.standard.join(', ') || 'N/A'}</p>
          <p className="text-gray-700"><strong>Competitive Exam:</strong> {mentor.preference.competitiveExam.join(', ') || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
