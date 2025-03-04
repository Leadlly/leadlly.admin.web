"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { options, Student } from "@/types/students";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentsData from "./components/studentsData";
import Loading from "./components/loading";

export default function StudentsInfo() {
  const [filter, setFilter] = useState("all");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const batchId = params?.batchId as string;

  const fetchStudents = async (batchId: string) => {
    try {
      const response = await fetch(`/api/batches/${batchId}/students`);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      return data.students;
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!batchId) return;

    const getStudents = async () => {
      setLoading(true);
      const data = await fetchStudents(batchId);
      setStudentsData(data);
      setLoading(false);
    };

    getStudents();
  }, [batchId]);

  return (
    <div className="p-6 space-y-6 md:px-10 mt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Students Info</h1>
        <div className="flex-center gap-8">
          <div className=" px-2 py-1 rounded-xl flex-center gap-4 bg-white shadow-lg hidden md:flex">
            <div className="p-2 shadow-sm rounded-full hidden md:block">
              <svg
                width="20"
                height="26"
                viewBox="0 0 26 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M24 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V20C0 20.5304 0.210714 21.0391 0.585786 21.4142C0.960859 21.7893 1.46957 22 2 22H3.67375C3.86301 22.0001 4.0484 21.9464 4.20838 21.8453C4.36836 21.7442 4.49636 21.5997 4.5775 21.4287C5.06377 20.4021 5.83151 19.5346 6.79143 18.9271C7.75135 18.3196 8.86401 17.9971 10 17.9971C11.136 17.9971 12.2486 18.3196 13.2086 18.9271C14.1685 19.5346 14.9362 20.4021 15.4225 21.4287C15.5036 21.5997 15.6316 21.7442 15.7916 21.8453C15.9516 21.9464 16.137 22.0001 16.3263 22H24C24.5304 22 25.0391 21.7893 25.4142 21.4142C25.7893 21.0391 26 20.5304 26 20V2C26 1.46957 25.7893 0.960859 25.4142 0.585786C25.0391 0.210714 24.5304 0 24 0ZM7 13C7 12.4067 7.17595 11.8266 7.50559 11.3333C7.83524 10.8399 8.30377 10.4554 8.85195 10.2284C9.40013 10.0013 10.0033 9.94189 10.5853 10.0576C11.1672 10.1734 11.7018 10.4591 12.1213 10.8787C12.5409 11.2982 12.8266 11.8328 12.9424 12.4147C13.0581 12.9967 12.9987 13.5999 12.7716 14.1481C12.5446 14.6962 12.1601 15.1648 11.6667 15.4944C11.1734 15.8241 10.5933 16 10 16C9.20435 16 8.44129 15.6839 7.87868 15.1213C7.31607 14.5587 7 13.7956 7 13ZM24 20H16.9287C16.0936 18.5643 14.8348 17.4221 13.325 16.73C14.082 16.056 14.6162 15.1678 14.857 14.1832C15.0977 13.1986 15.0335 12.1642 14.6729 11.2169C14.3122 10.2696 13.6723 9.45434 12.8377 8.87908C12.0032 8.30383 11.0136 7.99578 10 7.99578C8.98642 7.99578 7.99678 8.30383 7.16226 8.87908C6.32774 9.45434 5.68776 10.2696 5.32715 11.2169C4.96654 12.1642 4.90234 13.1986 5.14305 14.1832C5.38376 15.1678 5.91802 16.056 6.675 16.73C5.16517 17.4221 3.9064 18.5643 3.07125 20H2V2H24V20ZM4 7V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H21C21.2652 4 21.5196 4.10536 21.7071 4.29289C21.8946 4.48043 22 4.73478 22 5V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H19C18.7348 18 18.4804 17.8946 18.2929 17.7071C18.1054 17.5196 18 17.2652 18 17C18 16.7348 18.1054 16.4804 18.2929 16.2929C18.4804 16.1054 18.7348 16 19 16H20V6H6V7C6 7.26522 5.89464 7.51957 5.70711 7.70711C5.51957 7.89464 5.26522 8 5 8C4.73478 8 4.48043 7.89464 4.29289 7.70711C4.10536 7.51957 4 7.26522 4 7Z"
                  fill="#818181"
                />
              </svg>
            </div>

            <div className="bg-purple-500 p-1 px-2 rounded-md  hidden md:block">
              <svg
                width="20"
                height="24"
                viewBox="0 0 30 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.994 24C21.994 21.5699 18.8019 19.6 14.8643 19.6C10.9268 19.6 7.73471 21.5699 7.73471 24M27.6977 19.6005C27.6977 17.7963 25.9379 16.2456 23.4199 15.5667M2.03101 19.6005C2.03101 17.7963 3.79073 16.2456 6.30878 15.5667M23.4199 9.67962C24.2951 8.87395 24.8458 7.70313 24.8458 6.4C24.8458 3.96995 22.9306 2 20.568 2C19.4724 2 18.473 2.42365 17.7162 3.12038M6.30878 9.67962C5.43362 8.87395 4.88286 7.70313 4.88286 6.4C4.88286 3.96995 6.79808 2 9.16063 2C10.2563 2 11.2557 2.42365 12.0125 3.12038M14.8643 15.2C12.5018 15.2 10.5866 13.2301 10.5866 10.8C10.5866 8.36995 12.5018 6.4 14.8643 6.4C17.2269 6.4 19.1421 8.36995 19.1421 10.8C19.1421 13.2301 17.2269 15.2 14.8643 15.2Z"
                  stroke="white"
                  strokeWidth="2.85185"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="hidden md:block">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.3584 22.2917V23.65C17.3584 25.9005 15.4831 27.7249 13.1697 27.7249C10.8564 27.7249 8.98108 25.9005 8.98108 23.65V22.2917M17.3584 22.2917H8.98108M17.3584 22.2917H22.3715C22.9056 22.2917 23.1739 22.2917 23.3902 22.2207C23.8033 22.0851 24.1265 21.7696 24.2658 21.3677C24.3391 21.1565 24.3391 20.8946 24.3391 20.3709C24.3391 20.1417 24.3388 20.0272 24.3204 19.9179C24.2856 19.7114 24.2032 19.5157 24.0778 19.3457C24.0115 19.256 23.9272 19.174 23.7612 19.0124L23.2173 18.4833C23.0418 18.3126 22.9433 18.081 22.9433 17.8396V12.7834C22.9433 7.53213 18.5675 3.27513 13.1697 3.27515C7.77198 3.27516 3.39622 7.53215 3.39622 12.7834V17.8397C3.39622 18.0811 3.29743 18.3126 3.12195 18.4833L2.57812 19.0124C2.41155 19.1744 2.32817 19.2559 2.26179 19.3458C2.13635 19.5157 2.05326 19.7114 2.01843 19.9179C2 20.0272 2 20.1418 2 20.3709C2 20.8946 2 21.1564 2.07323 21.3676C2.21257 21.7695 2.53726 22.0851 2.95035 22.2207C3.16662 22.2917 3.43394 22.2917 3.96805 22.2917H8.98108"
                stroke="#818181"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="21.1113" cy="4.27515" r="4" fill="#5900D9" />
            </svg>
          </div>
          <div className="h-10 w-10 rounded-full">
            <Image src="/user-logo.png" alt="user" width={57} height={60} />
          </div>
        </div>
      </div>

      <div className="flex gap-8 mt-6">
        <div className="flex-between w-full">
          <div className="w-full mb-6 bg-[#EFEFEFAB] rounded-lg items-center pr-4 hidden md:flex">
            <Input
              type="text"
              placeholder={"Search a student"}
              className="border-none font-normal focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 py-5"
            />
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 16.5L12.3807 12.8807M12.3807 12.8807C13.5871 11.6743 14.3333 10.0076 14.3333 8.16667C14.3333 4.48477 11.3486 1.5 7.66667 1.5C3.98477 1.5 1 4.48477 1 8.16667C1 11.8486 3.98477 14.8333 7.66667 14.8333C9.50762 14.8333 11.1743 14.0871 12.3807 12.8807Z"
                stroke="#A6A6A6"
                strokeWidth="1.55556"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4 md:mb-6">
          {options.map((option) => (
            <Button
              key={option}
              className={
                filter === option
                  ? "bg-purple-500 hover:bg-purple-700 text-white"
                  : " text-gray-600"
              }
              variant={filter === option ? "default" : "outline"}
              onClick={() => setFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
          <svg
            width="37"
            height="37"
            viewBox="0 0 43 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=" hidden md:block"
          >
            <path
              d="M19.0972 29.25H33M10.25 29.25H14.0417M14.0417 29.25V32M14.0417 29.25V26.5M31.7361 21H33M10.25 21H26.6806M26.6806 21V23.75M26.6806 21V18.25M24.1528 12.75H33M10.25 12.75H19.0972M19.0972 12.75V15.5M19.0972 12.75V10"
              stroke="black"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <Loading/>
      ) : (
       <StudentsData studentsData={studentsData} filter={filter}/>
      )}
    </div>
  );
}
