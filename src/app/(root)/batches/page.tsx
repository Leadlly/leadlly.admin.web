"use client";

import React, { useState, useEffect } from "react";
import FilterBatches from "./components/filter";
import Loading from "./components/loading";
import Batches from "./components/batches";
import { BatchesData, BatchFilters } from "@/types/batches";

export default function BatchesPage() {
  const [batchesData, setBatchesData] = useState<BatchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BatchFilters>({
    standard: "",
    subject: "",
    teacher: "",
  });
  
  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return queryParams.toString();
  };

  // Fetch batches data
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/batches?${buildQueryParams()}`);

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatchesData(data);
      setError(null);
    } catch (err) {
      setError("Error loading batches. Please try again later.");
      console.error("Error fetching batches:", err);
    } finally {
        setTimeout(() => setLoading(false), 200);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mx-auto py-16 bg-[#FEFBFF] px-8 md:px-16">
      <h1 className="text-4xl font-bold mb-4">Student Batches of Institute</h1>
      <FilterBatches filters={filters} handleFilterChange={handleFilterChange} />

      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      {batchesData && !loading &&  batchesData.standards.length > 0 ? (
        <Batches batchesData={batchesData} />
      ) : (
        !loading &&
        !error && (
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-gray-600">No batches found. Try adjusting your filters.</p>
          </div>
        )
      )}
    </div>
  );
}
