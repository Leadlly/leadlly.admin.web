'use client'
import React, { useEffect, useState } from 'react';
import apiClient from '@/apiClient/apiClient';
import { useRouter } from 'next/navigation';
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
  status: string;
  students: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  }[];
}

interface Student {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  academic: {
    standard: number;
    competitiveExam: string;
    schedule: string;
    coachingMode: string;
  };
}
const AllMENTOR: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchMentors = async () => {
    try {
      const response = await apiClient.get(`/api/mentor/getmentor`);
      if (response.data.success) {
        setMentors(response.data.mentors);
      } else {
        toast.error(response.data.error);
      }
    } catch {
      toast.error('Failed to fetch mentors.');
    }
  };

  const fetchUnallocatedStudents = async (mentorId: string) => {
    setLoadingStudents(true);
    try {
      const response = await apiClient.get(`/api/student/getmentorstudent`, {
        params: { mentorId },
      });
      if (response.data.success) {
        setStudents(response.data.students);
      } else {
        toast.error(response.data.message || 'No unallocated students found.');
        setStudents([]);
      }
    } catch (error: any) {
      console.error('Error fetching unallocated students:', error.message);
      toast.error('Failed to fetch unallocated students.');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleDropdown = (mentorId: string) => {
    if (dropdownVisible === mentorId) {
      setDropdownVisible(null);
    } else {
      setDropdownVisible(mentorId);
      fetchUnallocatedStudents(mentorId);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleAllocateStudent = async (
    studentIds: string[],
    mentorId: string | null
  ) => {
    try {
      const response = await apiClient.post(
        `/api/student/allocate-student/${mentorId}`,
        {
          studentIds,
          mentorId,
        }
      );
      if (response.data.success) {
        toast.success(
          mentorId
            ? "Students allocated successfully!"
            : "Students deallocated successfully!"
        );
        fetchMentors();
        if (mentorId) {
          router.push(`/studentdetails/${mentorId}`);
        }
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(
        mentorId
          ? "Failed to allocate students."
          : "Failed to deallocate students."
      );
    }
  };

  const handleAllocations = async (
    studentId: string,
    mentorId: string | null
  ) => {
    const confirmMessage = mentorId
      ? `Are you sure you want to allocate these students to this Mentor?`
      : `Are you sure you want to deallocate these students from the Mentor?`;
    const confirmAllocation = window.confirm(confirmMessage);
    if (!confirmAllocation) return;

    setLoading(true);
    try {
      await handleAllocateStudent([studentId], mentorId);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
      router.push(`/studentdetails/${mentorId}`);
    } catch (error) {
      console.error("Error allocating/deallocating students:", error);
    } finally {
      setLoading(false);
      setSelectedMentor(null);
      setDropdownVisible(null);
    }
  };
  const handleMentorClick = (mentor: Mentor) => {
    router.push(`/studentdetails/${mentor._id}`);
  };
  return (
    <div className="container mx-auto px-4">
  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pt-2">
    <h1 className="text-3xl font-bold text-gray-800">Mentor Lists</h1>
  </div>

  <div className="overflow-x-auto rounded-lg shadow-lg max-h-[900px]">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
        <tr>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Mentor's Name</th>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Unallocated Students</th>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Email</th>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Phone.Personal</th>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Preference.Standard</th>
          <th className="px-2 py-1 sm:px-4 sm:py-3 text-left">Preference.Exam</th>
        </tr>
      </thead>

      <tbody>
        {mentors?.length > 0 ? (
          mentors.map((mentor) => (
            <tr
              key={mentor._id}
              className="border-b hover:bg-gray-50 transition duration-300"
            >
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-900 text-sm sm:text-base">
                {mentor.firstname} {mentor.lastname}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-700 relative flex flex-col items-start space-y-2">
              <button
  className="bg-green-500 hover:bg-green-700 text-xs sm:text-sm text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded w-full"
  onClick={() => toggleDropdown(mentor._id)}
>
  Show Unallocated Students
</button>
<button
  className="bg-blue-500 hover:bg-blue-700 text-xs sm:text-sm text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded w-full"
  onClick={() => handleMentorClick(mentor)}
  key={mentor._id}
>
  Allocated Students
</button>


                {dropdownVisible === mentor._id && (
                  <div
                    className="absolute bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 w-72 sm:w-90 max-h-60 overflow-y-auto"
                    style={{
                      top: "50%",
                      left: 0,
                      position: "absolute", // Ensure absolute positioning relative to the parent container
                    }}
                  >
                    {loadingStudents ? (
                      <p className="text-gray-500 px-4 py-2">Loading...</p>
                    ) : students.length > 0 ? (
                      students.map((student) => (
                        <div
                          key={student._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        >
                          <span className="text-sm sm:text-base">
                            {student.firstname} {student.lastname} ({student.email})
                          </span>
                          <button
                            className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAllocations(student._id, mentor._id);
                              setSelectedMentor(null);
                              setDropdownVisible(null);
                            }}
                          >
                            Allocate
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 px-4 py-2">No students available.</p>
                    )}
                  </div>
                )}
              </td>

              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-700 text-sm sm:text-base">
                {mentor.email}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-700 text-sm sm:text-base">
                {mentor.phone?.personal}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-700 text-sm sm:text-base">
                {mentor.preference?.standard?.join(', ')}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-700 text-sm sm:text-base">
                {mentor.preference?.competitiveExam?.join(', ')}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={6}
              className="text-center px-4 py-4 text-gray-700 text-sm sm:text-base"
            >
              No data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AllMENTOR;
