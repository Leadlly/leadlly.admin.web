"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createBatch } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import { logger } from "@/lib/logger";

const FALLBACK_STANDARDS = ["9", "10", "11", "12"];

const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Maths"] as const;

const createBatchSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter a batch name"),
    standard: z.string().min(1, "Please select a standard"),
    subjects: z.array(z.string()).optional(),
    description: z.string().optional(),
    about: z.string().optional(),
    payment: z.object({
      subscriptionType: z.enum(["Free", "Paid"]),
      amount: z
        .string()
        .min(0, "Amount must be greater than or equal to 0")
        .optional(),
      currency: z.literal("INR"),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.payment.subscriptionType === "Paid") {
      if (Number(data.payment.amount) <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["payment", "amount"],
          message: "Please enter a valid price for paid batch",
        });
      }
    }
  });

type CreateBatchFormValues = z.infer<typeof createBatchSchema>;

export default function CreateBatch({ 
  instituteId, 
  standard, 
  trigger 
}: { 
  instituteId: string; 
  standard?: string; 
  trigger?: React.ReactNode; 
}) {
  const [open, setOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const instituteData = useAppSelector((state) => state.institute.institute);

  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: "",
      standard: standard || "",
      subjects: [],
      description: "",
      about: "",
      payment: {
        subscriptionType: "Free",
        amount: "",
        currency: "INR",
      },
    },
  });

  const standards = instituteData?.standards?.length
    ? instituteData.standards
    : FALLBACK_STANDARDS;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be less than 5MB");
      return;
    }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = async (values: z.infer<typeof createBatchSchema>) => {
    try {
      const subjectsArray = values.subjects && values.subjects.length > 0 ? values.subjects : undefined;

      const response = await createBatch({
        name: values.name,
        standard: values.standard,
        subjects: subjectsArray,
        description: values.description || undefined,
        about: values.about || undefined,
        institute: instituteId,
        payment: {
          subscriptionType: values.payment.subscriptionType,
          amount:
            values.payment.subscriptionType === "Paid"
              ? Number(values.payment.amount)
              : 0,
          currency: "INR",
        },
        coverImage: coverFile
          ? { name: coverFile.name, type: coverFile.type }
          : undefined,
      });

      if (response?.success) {
        // Upload cover image to S3 if a presigned URL was returned
        if (coverFile && response.coverImageUploadUrl) {
          await fetch(response.coverImageUploadUrl, {
            method: "PUT",
            body: coverFile,
            headers: { "Content-Type": coverFile.type },
          });
        }

        toast.success("Batch created successfully!");
        setOpen(false);
        form.reset();
        setCoverFile(null);
        setCoverPreview(null);

        queryClient.invalidateQueries({
          queryKey: ["institute_batches", instituteId],
        });
      } else {
        toast.error(response?.message || "Failed to create batch");
      }
    } catch (error) {
      logger.error("Error creating batch", { error });
      toast.error("Failed to create batch. Please try again.");
    }
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      form.reset();
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Batch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Batch</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-5 py-2"
        >
          <FieldGroup>
            {/* Cover image upload */}
            <Field className="gap-1.5">
              <FieldLabel>
                Cover Image{" "}
                <span className="text-muted-foreground font-normal">(Optional)</span>
              </FieldLabel>
              <div
                className="relative w-full h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">Click to upload cover image</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </Field>

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel htmlFor="batch-name">
                    Batch Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="batch-name"
                    placeholder="e.g. Alpha Batch 2025"
                    className="shadow-none"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="standard"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel>
                    Standard <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger
                      className="shadow-none"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select standard" />
                    </SelectTrigger>
                    <SelectContent>
                      {standards.map((s) => (
                        <SelectItem key={s} value={s}>
                          Grade {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="subjects"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel>
                    Subjects{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </FieldLabel>
                  <div className="flex gap-3 flex-wrap">
                    {SUBJECT_OPTIONS.map((subject) => {
                      const checked = (field.value ?? []).includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange(current.filter((s) => s !== subject));
                            } else {
                              field.onChange([...current, subject]);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            checked
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel htmlFor="batch-description">
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id="batch-description"
                    placeholder="Brief description of this batch..."
                    className="shadow-none resize-none min-h-[72px]"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="about"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="batch-about">
                      About / Details{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                  </div>
                  <textarea
                    id="batch-about"
                    {...field}
                    value={field.value || ""}
                    placeholder={`Write detailed info about this batch...\n\nYou can use:\n- Bullet points\n- Multiple lines\n- Any spacing you need`}
                    rows={6}
                    spellCheck={false}
                    aria-invalid={fieldState.invalid}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono whitespace-pre resize-y min-h-[120px]"
                    style={{
                      whiteSpace: "pre",
                      overflowWrap: "normal",
                      overflowX: "auto",
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Every space, indent, and line break is stored exactly as
                    typed.
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 text-white hover:bg-purple-700 min-w-[110px]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

