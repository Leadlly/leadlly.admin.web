import { BatchFilters } from '@/types/batches'
import React from 'react'

type FilterBatchesProps = {
    filters: BatchFilters;
    handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };

const FilterBatches = ({ filters, handleFilterChange }: FilterBatchesProps) => {
  return (
    <div className="bg-white p-6 rounded-xl mb-6 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <div className="flex items-center gap-2 md:gap-6">
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden md:block"
        >
          <path
            d="M8 15H19M1 15H4M4 15V17M4 15V13M18 9H19M1 9H14M14 9V11M14 9V7M12 3H19M1 3H8M8 3V5M8 3V1"
            stroke="#6E6E6E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-medium text-sm md:text-base">
          Filter by :
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-4 md:gap-6 max-w-2xl w-full">
        <select
          name="standard"
          value={filters.standard}
          onChange={handleFilterChange}
          className="border rounded-md px-4 py-2 w-full md:w-auto"
        >
          <option value="">All Standards</option>
          <option value="11th">11th Standard</option>
          <option value="12th">12th Standard</option>
        </select>

        <select
          name="subject"
          value={filters.subject}
          onChange={handleFilterChange}
          className="border rounded-md px-4 py-2 w-full md:w-auto"
        >
          <option value="">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Mathematics">Mathematics</option>
        </select>

        <select
          name="teacher"
          value={filters.teacher}
          onChange={handleFilterChange}
          className="border rounded-md px-4 py-2 w-full md:w-auto"
        >
          <option value="">All Teachers</option>
          <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
        </select>
      </div>
    </div>
  </div>
  )
}

export default FilterBatches
