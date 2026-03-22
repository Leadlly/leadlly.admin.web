"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { addStudentsToInstitute } from "@/actions/student_action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { logger } from "@/lib/logger";

const AddStudentsFormSchema = z.object({
  emails: z.string().min(1, { error: "Enter valid email addresses" }),
});

const AddStudentsDialog = ({ instituteId }: { instituteId: string }) => {
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);

  const form = useForm<z.infer<typeof AddStudentsFormSchema>>({
    resolver: zodResolver(AddStudentsFormSchema),
    defaultValues: {
      emails: "",
    },
  });

  const handleAddStudents = async (
    data: z.infer<typeof AddStudentsFormSchema>
  ) => {
    try {
      logger.debug("Add students form submitted", { data });

      const emails = data.emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      //   const result = await addStudentsToInstitute(instituteId, emails);
      //   if (result.success) {
      //     toast.success(result.message);
      //   } else {
      //     toast.error(result.message);
      //   }
      //     form.reset();
      //   setIsAddStudentsOpen(false);
    } catch (error) {
      logger.error("Error adding students", { error });
      toast.error("Failed to add students. Please try again.");
    }
  };

  return (
    <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          Add Students
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Students</DialogTitle>
          <DialogDescription>
            Add new students to your institute
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleAddStudents)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="emails"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="student-emails">
                    Enter student email addresses (separated by comma)
                  </FieldLabel>
                  <Textarea
                    id="student-emails"
                    placeholder={`student1@example.com,student2@example.com`}
                    rows={6}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Students
            </Button>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentsDialog;
