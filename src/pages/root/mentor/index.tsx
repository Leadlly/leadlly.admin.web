import { useState, useEffect, useRef } from "react";
import apiClient from "../../../apiClient/apiClient";
import Loader from "../Loader";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

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

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/mentor/getmentor`);
      if (response.data.success) {
        setMentors(response.data.mentors);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError(error as string);
    }
    setLoading(false);
  };

  const fetchUnallocatedStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/student/getmentorstudent`);
      if (response.data.success) {
        setStudents(response.data.students);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError(error as string);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const response = await apiClient.get("/api/auth/admin/logout");
      if (response.data.success) {
        toast.success("Logged out successfully!");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMentorClick = (mentor: Mentor) => {
    navigate(`/studentdetails/${mentor._id}`);
  };

  const handleVerification = async (id: string, status: string) => {
    try {
      const confirmationMessage = `Are you sure you want to ${
        status === "Verified" ? "verify" : "not verify"
      } this mentor?`;
      if (window.confirm(confirmationMessage)) {
        const response = await apiClient.put(`/api/mentor/verify/${id}`, {
          status,
        });
        if (response.data.success) {
          toast.success(
            `Mentor ${
              status === "Verified" ? "verified" : "denied access"
            } successfully!`
          );
          setMentors((prevMentors) =>
            prevMentors.map((mentor) =>
              mentor._id === id
                ? {
                    ...mentor,
                    status: status === "Verified" ? "Verified" : "Not Verified",
                  }
                : mentor
            )
          );
        } else {
          toast.error(response.data.error);
        }
      } else {
        toast.error("Verification cancelled!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllocateStudent = async (studentId: string, mentorId: string) => {
    try {
      const response = await apiClient.post(
        `/api/student/allocate-student/${studentId}`,
        { mentorId }
      );
      if (response.data.success) {
        toast.success("Student allocated successfully!");
        fetchMentors();
        // Redirect to student details page
        navigate(`/studentdetails/${mentorId}`);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Failed to allocate student.");
    }
  };
  
  const handleAllocation = async (studentId: string, mentorId: string) => {
    const confirmAllocation = window.confirm(`Are you sure you want to allocate this student to this Mentor?`);
    if (!confirmAllocation) return;
  
    setLoading(true);
    try {
      await handleAllocateStudent(studentId, mentorId);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error("Error allocating student:", error);
    } finally {
      setLoading(false);
      setSelectedMentor(null);
      setDropdownVisible(null);
    }
  };
  useEffect(() => {
    fetchMentors();
    fetchUnallocatedStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                onClick={() => handleMentorClick(mentor)}
                key={mentor._id}
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
              >
                <h2 className="text-xl font-bold text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {mentor.firstname} {mentor.lastname}
                </h2>
                <p className="text-gray-900 font-bold truncate">
                  Email: {mentor.email || "N/A"}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (mentor.status === "Not Verified") {
                        handleVerification(mentor._id, "Verified");
                      } else if (mentor.status === "Verified") {
                        handleVerification(mentor._id, "Not Verified");
                      } else if (mentor.status === "Denied") {
                        handleVerification(mentor._id, "Verified");
                      }
                    }}
                    disabled={loading}
                    className={`${
                      mentor.status === "Not Verified"
                        ? "bg-green-500 hover:bg-green-700"
                        : mentor.status === "Verified"
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-green-500 hover:bg-green-700"
                    } text-white font-bold py-2 px-4 rounded`}
                  >
                    {mentor.status === "Not Verified"
                      ? "Verify"
                      : mentor.status === "Verified"
                      ? "Revoke Access"
                      : "Verify"}
                  </button>
                  <div className="relative ml-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMentor(mentor);
                        setDropdownVisible(
                          mentor._id === dropdownVisible ? null : mentor._id
                        );
                      }}
                    >
                      Allocate Student
                    </Button>
                    {dropdownVisible && selectedMentor?._id === mentor._id && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-20 overflow-auto max-h-64">
                        <ul className="divide-y divide-gray-200">
                          {students.length > 0 ? (
                            students.map((student) => (
                              <li
                                key={student._id}
                                className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer"
                              >
                                <div>
                                  <p className="font-medium">
                                    {student.firstname} {student.lastname}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Standard:{" "}
                                    {student.academic?.standard || "N/A"},
                                    Competitive Exam:{" "}
                                    {student.academic?.competitiveExam || "N/A"}
                                    , Schedule:{" "}
                                    {student.academic?.schedule || "N/A"},
                                    Coaching Mode:{" "}
                                    {student.academic?.coachingMode || "N/A"}
                                  </p>
                                </div>
                                <Button
                                  className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAllocation(student._id, mentor._id);
                                    setSelectedMentor(null);
                                    setDropdownVisible(null);
                                  }}
                                >
                                  Allocate
                                </Button>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-center text-gray-600">
                              No records found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No mentors found.</p>
        )}
      </div>
    </>
  );
};

export default Mentors;
