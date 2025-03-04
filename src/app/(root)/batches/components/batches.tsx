import { BatchesData } from "@/types/batches";
import Link from "next/link";
import React from "react";

interface BatchesProps {
    batchesData: BatchesData;
}

const Batches: React.FC<BatchesProps> = ({ batchesData }) => {
  return (
    <div>
      {batchesData.standards.map((standard, index) => (
        <div
          key={index}
          className="bg-[#FEFEFEF5] p-6 rounded-2xl mb-6 shadow-lg border-[1px] border-[#C9C9C9]"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">{standard.name}</h2>
            <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add batch
            </button>
          </div>

          {!standard?.batches || standard.batches.length === 0 ? (
            // Loading spinner when data is unavailable
            <div className="flex justify-center items-center w-full h-40">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0l4 4-4 4V6a6 6 0 00-6 6H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standard.batches.map((batch) => (
                <div
                  key={batch.id}
                  className="border-[1px] rounded-lg p-6 border-[#0000000A] shadow-sm hover:border-[#00000024] duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-8 h-8 md:w-12 md:h-12 ${
                        batch.name == "Omega"
                          ? "bg-[#1472FF]"
                          : batch.name == "Sigma"
                          ? "bg-[#7514FF]"
                          : "bg-[#27CEB2]"
                      } rounded-full flex items-center justify-center text-white`}
                    >
                      {batch.name === "Omega" ? (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="21.7381"
                            height="21.7381"
                            transform="translate(0.880859 0.880859)"
                            fill="#1472FF"
                          />
                          <circle
                            cx="11.7506"
                            cy="11.7498"
                            r="2.83254"
                            stroke="white"
                            strokeWidth="1.58095"
                          />
                          <path
                            d="M9.93772 13.5613L7.22046 16.2786"
                            stroke="white"
                            strokeWidth="1.58095"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.3913 10.3913L6.31543 6.31537"
                            stroke="white"
                            strokeWidth="1.58095"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="16.5257"
                            cy="17.5138"
                            r="1.02103"
                            stroke="white"
                            strokeWidth="1.58095"
                          />
                          <path
                            d="M13.562 13.5613L17.185 18.0901"
                            stroke="white"
                            strokeWidth="1.58095"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="18.0896"
                            cy="5.40955"
                            r="1.92679"
                            stroke="white"
                            strokeWidth="1.58095"
                          />
                          <path
                            d="M16.2793 7.22122L13.562 9.93848"
                            stroke="white"
                            strokeWidth="1.58095"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="5.86253"
                            cy="5.8625"
                            r="1.47391"
                            fill="#33363F"
                            stroke="white"
                            strokeWidth="1.58095"
                          />
                          <circle
                            cx="5.86313"
                            cy="17.6373"
                            r="2.37966"
                            stroke="white"
                            strokeWidth="1.58095"
                          />
                          <circle
                            cx="5.82135"
                            cy="5.82135"
                            r="0.988095"
                            fill="white"
                          />
                        </svg>
                      ) : batch.name === "Sigma" ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.02632 17.2105H15.1842C16.3033 17.2105 17.2105 16.3033 17.2105 15.1842V3.02632C17.2105 1.90721 16.3033 1 15.1842 1H3.02632C1.90721 1 1 1.90721 1 3.02632V15.1842C1 16.3033 1.90721 17.2105 3.02632 17.2105Z"
                            fill="#7514FF"
                          />
                          <path
                            d="M4.03947 5.55921H7.58553M10.8783 11.1316H14.4243M10.8783 13.6645H14.4243M3.78618 12.398H7.83882M5.8125 14.4243V10.3717M11.233 4.03947L14.0986 6.90512M11.233 6.90531L14.0986 4.03966M3.02632 1H15.1842C16.3033 1 17.2105 1.90721 17.2105 3.02632V15.1842C17.2105 16.3033 16.3033 17.2105 15.1842 17.2105H3.02632C1.90721 17.2105 1 16.3033 1 15.1842V3.02632C1 1.90721 1.90721 1 3.02632 1Z"
                            stroke="white"
                            strokeWidth="1.53099"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="11.4986"
                            cy="11.5002"
                            r="0.71875"
                            fill="#222222"
                            stroke="white"
                            strokeWidth="0.479167"
                          />
                          <path
                            d="M15.5743 11.5002C15.5743 14.0591 15.0542 16.3403 14.2467 17.9552C13.4178 19.613 12.4057 20.3648 11.5014 20.3648C10.5971 20.3648 9.58495 19.613 8.75603 17.9552C7.94861 16.3403 7.42847 14.0591 7.42847 11.5002C7.42847 8.9412 7.94861 6.66001 8.75603 5.04517C9.58495 3.38733 10.5971 2.63559 11.5014 2.63559C12.4057 2.63559 13.4178 3.38733 14.2467 5.04517C15.0542 6.66001 15.5743 8.9412 15.5743 11.5002Z"
                            stroke="white"
                            strokeWidth="1.4375"
                          />
                          <path
                            d="M13.5382 15.0269C11.322 16.3064 9.08638 16.9965 7.28418 17.1047C5.43399 17.2157 4.27688 16.715 3.82474 15.9319C3.37261 15.1488 3.51756 13.8964 4.53883 12.3496C5.53361 10.8429 7.2491 9.25187 9.46524 7.97238C11.6814 6.69289 13.917 6.00276 15.7192 5.89458C17.5694 5.78353 18.7265 6.28421 19.1787 7.06734C19.6308 7.85046 19.4858 9.10289 18.4646 10.6497C17.4698 12.1563 15.7543 13.7474 13.5382 15.0269Z"
                            stroke="white"
                            strokeWidth="1.4375"
                          />
                          <path
                            d="M13.5382 7.97288C11.322 6.69339 9.08638 6.00326 7.28418 5.89508C5.43399 5.78403 4.27688 6.28471 3.82474 7.06784C3.37261 7.85096 3.51756 9.10339 4.53883 10.6502C5.53361 12.1568 7.2491 13.7479 9.46524 15.0274C11.6814 16.3069 13.917 16.997 15.7192 17.1052C17.5694 17.2162 18.7265 16.7155 19.1787 15.9324C19.6308 15.1493 19.4858 13.8969 18.4646 12.3501C17.4698 10.8434 15.7543 9.25237 13.5382 7.97288Z"
                            stroke="white"
                            strokeWidth="1.4375"
                          />
                          <circle
                            cx="11.4986"
                            cy="11.5002"
                            r="0.958333"
                            fill="white"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-md md:text-lg">
                        {batch.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{batch.standard}</p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-[#2CEB1A26] text-[#10AE1C] text-xs rounded-xl">
                      Active
                    </span>
                  </div>

                  <div className="">
                    <p className="mb-1">
                      <span className="font-medium text-[#00000087] mr-1">
                        Subject:{" "}
                      </span>
                      {batch.subjects.join(", ")}
                    </p>
                    <p className="">
                      <span className="font-medium text-[#00000087] mr-1">
                        Total Students:{" "}
                      </span>
                      {batch.totalStudents}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-right text-xs mb-2">
                      {batch.totalStudents}/{batch.maxStudents}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (batch.totalStudents / batch.maxStudents) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex-between mt-4">
                    <div className="">
                      <p className="text-sm">-By {batch.teacher}</p>
                    </div>

                    <Link
                      href={`/batches/${batch.id}/students`}
                      className="text-center bg-[#9654F4] hover:bg-[#8544e0] text-white rounded-md py-1 md:py-2 px-3 md:px-6"
                    >
                      View More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Batches;
