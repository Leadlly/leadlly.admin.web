"use client";

import apiClient from "@/apiClient/apiClient";
import { Student } from "@/types/student";
import { useState, useEffect } from "react";

const useFetchStudentsOfBatch = (id: string) => {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/batches/${id}`);
        console.log("response", response.data);
        setData(response.data);

        return response.data;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};

export default useFetchStudentsOfBatch;
