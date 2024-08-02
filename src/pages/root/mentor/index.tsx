import { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "../../../apiClient/apiClient";
import Loader from "../Loader";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
// import { TrendingUp } from "lucide-react";

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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingStudents, setLoadingStudents] = useState(false); 

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

  const fetchUnallocatedStudents = async (query = "") => {
    
    setLoadingStudents(true);
    
    try {
      const response = await apiClient.get(`/api/student/getmentorstudent`, {
        params: { query },
      });
      if (response.data.success) {
        setStudents(response.data.students);
      } else {
        setError(response.data.error);
        setStudents([]);
      }
    } catch (error) {
      setError("An error occurred while fetching students.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
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
          navigate(`/studentdetails/${mentorId}`);
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

  const handleAllocation = async (
    studentIds: string[],
    mentorId: string | null
  ) => {
    const confirmMessage = mentorId
      ? `Are you sure you want to allocate these students to this Mentor?`
      : `Are you sure you want to deallocate these students from the Mentor?`;
    const confirmAllocation = window.confirm(confirmMessage);
    if (!confirmAllocation) return;

    setLoading(true);
    try {
      await handleAllocateStudent(studentIds, mentorId);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => !studentIds.includes(student._id))
      );
      navigate(`/studentdetails/${mentorId}`);
    } catch (error) {
      console.error("Error allocating/deallocating students:", error);
    } finally {
      setLoading(false);
      setSelectedMentor(null);
      setDropdownVisible(null);
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
      navigate(`/studentdetails/${mentorId}`);
    } catch (error) {
      console.error("Error allocating/deallocating students:", error);
    } finally {
      setLoading(false);
      setSelectedMentor(null);
      setDropdownVisible(null);
    }
  };
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };
  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student._id));
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        setLoadingStudents(true);
        try {
          const response = await apiClient.get(
            `/api/student/getmentorstudent`,
            {
              params: { query },
            }
          );
          if (response.data.success) {
            setStudents(response.data.students);
          } else {
            setError(response.data.error);
            setStudents([]); 
          }
        } catch (error) {
          setError("An error occurred while searching students.");
          setStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      } else {
        fetchUnallocatedStudents();
      }
    }, 500),
    []
  );
  
  

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setSearchQuery(value);

    if (value.trim() === "") {
      setDebouncedSearchQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDebouncedSearchQuery(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    fetchUnallocatedStudents();
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
          <Loader size={40} color="blue" loaderClassName="custom-loading" />
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                      <>
                        <div
                          className="absolute right-0 mt-2 w-96 bg-white p-5 border border-gray-300 rounded-md shadow-lg z-20 overflow-auto max-h-128"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-4">
                          <input
  type="text"
  placeholder="Search students..."
  value={searchQuery}
  onChange={handleInputChange}
  onKeyDown={handleKeyPress}
  className="p-2 border border-gray-300 rounded-md w-64"
/>
                            <Button
                              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                              onClick={clearSearch}
                            >
                              Clear
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <input
                                type="checkbox"
                                id="selectAll"
                                className="mr-2"
                                onClick={(e) => e.stopPropagation()}
                                onChange={handleSelectAllStudents}
                              />
                            </div>
                            <Button
                              className={`bg-blue-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded w-[14] ${
                                (selectedStudents.length === 0 || loading) &&
                                "pointer-events-none"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAllocation(selectedStudents, mentor._id);
                                setSelectedMentor(null);
                              }}
                              disabled={
                                !(selectedStudents.length > 0) || loading
                              }
                            >
                              Allocate All
                            </Button>
                          </div>

                          <div className="relative">
                            {loading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                                <Loader
                                  size={28}
                                  color="blue"
                                  loaderClassName="custom-loading"
                                />
                              </div>
                            )}
                        <ul className="divide-y divide-gray-200 relative">
                            {loadingStudents ? (
                              <li className="p-2 text-center text-gray-600">
                                <Loader
                                  size={28}
                                  color="blue"
                                  loaderClassName="custom-loading"
                                />
                              </li>
                            ) : students.length === 0 ? (
                              <li className="p-2 text-center text-gray-600">
                                No students found
                              </li>
                            ) : (
    students.map((student) => (
      <li
        key={student._id}
        className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer"
      >
        <input
          type="checkbox"
          className="mr-2"
          checked={selectedStudents.includes(student._id)}
          onChange={() => toggleStudentSelection(student._id)}
          onClick={(e) => e.stopPropagation()}
        />
        <div onClick={(e) => e.stopPropagation()}>
          <p className="font-medium">
            {student.firstname} {student.lastname}
          </p>
          <p className="text-sm text-gray-600">
            email: {student.email}
          </p>
          <p className="text-sm text-gray-600">
            Standard: {student.academic?.standard || "N/A"},
            Competitive Exam: {student.academic?.competitiveExam || "N/A"},
            Schedule: {student.academic?.schedule || "N/A"},
            Coaching Mode: {student.academic?.coachingMode || "N/A"}
          </p>
        </div>
        <Button
          className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleAllocations(student._id, mentor._id);
            setSelectedMentor(null);
            setDropdownVisible(null);
          }}
        >
          Allocate
        </Button>
      </li>
    ))
  )}
</ul>

                          </div>
                        </div>
                      </>
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
