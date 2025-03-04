import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-40">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
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
  )
}

export default Loading
