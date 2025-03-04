import React from "react";
import Image from "next/image";

const InstituteOverview = () => {
  return (
    <div className="bg-[#9654F412] border-[1px] border-[#9654F4A1] hover:border-[#4f2090a1] duration-500 p-6 rounded-3xl mb-6 py-10 px-8">
      <div className="flex-center flex-col md:flex-row  gap-2">
        <div className="">
          <Image
            src="/university-logo.png"
            alt="Institute Logo"
            width={120}
            height={120}
            className="w-36 h-40 rounded-lg object-fill"
          />
        </div>

        <div className="flex-1">
          <p className="md:text-lg">Established in 2001</p>
          <h1 className="text-3xl font-semibold md:mt-1">
            Chaitanya Bharathi Institute
          </h1>
          <p className="md:mt-1 md:text-lg">
            Institute Code:{" "}
            <span className="font-semibold text-black">21XYZ1234</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="">
              <h5 className="opacity-[48%] md:text-xl font-semibold">Address: </h5>
              <span className="text-gray-700 text-lg md:text-xl">
                123, Main Street, City, Country
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <div className="">
              <h5 className="opacity-[48%] md:text-xl font-semibold">Contact: </h5>
              <span className="text-gray-700 text-lg md:text-xl">+1234567890</span>
            </div>
          </div>

          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div className="">
              <h5 className="opacity-[48%] md:text-xl font-semibold">Email: </h5>
              <span className="text-gray-700 text-lg md:text-xl">info@institute.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteOverview;
