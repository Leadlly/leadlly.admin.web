import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CreateInstituteForm from "./_components/create-institute-form";

export default function CreateInstitutePage() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-2xl flex items-center justify-center w-full">
      <Card className="sm:max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Institute</CardTitle>
          <CardDescription>
            Fill in the details to create your new institute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateInstituteForm />
        </CardContent>
      </Card>
    </div>
  );
}
