import * as React from "react";

import CreateInstituteForm from "@/components/create-institute-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
