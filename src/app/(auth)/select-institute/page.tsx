"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUserInstitutes } from "@/actions/institute_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { instituteData } from "@/redux/slices/instituteSlice";

interface Institute {
  _id: string;
  name: string;
  logo?: string;
  createdAt: string;
}

export default function SelectInstitutePage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        const data = await getAllUserInstitutes();
        setInstitutes(data.institutes || []);
      } catch (err) {
        setError("Failed to load institutes. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  const handleSelectInstitute = async (institute: Institute) => {
    try {
      setLoading(true);
      // Dispatch institute data to Redux store
      dispatch(instituteData(institute));
      // Navigate to institute page
      router.push(`/institute/${institute._id}`);
    } catch (err) {
      setError("Failed to select institute. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Select an Institute</h1>
      
      {institutes.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mb-6">You don't have any institutes yet.</p>
          <Link href="/create-institute">
            <Button className="bg-primary hover:bg-primary/90">Create Your First Institute</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((institute) => (
            <Card key={institute._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{institute.name}</CardTitle>
                <CardDescription>
                  Created on {new Date(institute.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {institute.logo ? (
                  <div className="w-16 h-16 mx-auto mb-4">
                    <img 
                      src={institute.logo} 
                      alt={`${institute.name} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 flex items-center justify-center rounded-full">
                    <span className="text-2xl font-bold text-primary">
                      {institute.name.charAt(0)}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleSelectInstitute(institute)}
                >
                  Select Institute
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Create New Institute</CardTitle>
              <CardDescription>
                Add another institute to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full">
                <span className="text-3xl font-bold text-primary">+</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/create-institute" className="w-full">
                <Button variant="outline" className="w-full">
                  Create New Institute
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}