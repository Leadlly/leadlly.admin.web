import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-3">
          <p className="text-gray-600 text-sm">Fetching students...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
  )
}

export default Loading
