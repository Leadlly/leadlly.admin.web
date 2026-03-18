"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { IndianRupee, Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";

const FALLBACK_STANDARDS = ["9", "10", "11", "12"];

const createBatchSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter a batch name"),
    standard: z.string().min(1, "Please select a standard"),
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
  const queryClient = useQueryClient();
  const instituteData = useAppSelector((state) => state.institute.institute);

  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: "",
      standard: standard || "",
      description: "",
      about: "",
      payment: {
        subscriptionType: "Free",
        amount: "",
        currency: "INR",
      },
    },
  });

  const isPaid = form.watch("payment.subscriptionType") === "Paid";
  const standards = instituteData?.standards?.length
    ? instituteData.standards
    : FALLBACK_STANDARDS;

  const onSubmit = async (values: z.infer<typeof createBatchSchema>) => {
    try {
      const response = await createBatch({
        name: values.name,
        standard: values.standard,
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
      });

      if (response?.success) {
        toast.success("Batch created successfully!");
        setOpen(false);
        form.reset();

        // Invalidate the query to trigger a refetch
        queryClient.invalidateQueries({
          queryKey: ["institute_batches", instituteId],
        });
      } else {
        toast.error(response?.message || "Failed to create batch");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error("Failed to create batch. Please try again.");
    }
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      form.reset();
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
                    value={field.value || ""} // textarea can't handle undefined value
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

            <div className="rounded-xl border border-border p-4 grid gap-4 mt-2">
              <Controller
                control={form.control}
                name="payment.subscriptionType"
                render={({ field }) => (
                  <div className="flex flex-row items-center justify-between space-y-0 rounded-lg">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Paid Batch</p>
                      <p className="text-xs text-muted-foreground">
                        Toggle to charge students for this batch
                      </p>
                    </div>
                    <Switch
                      checked={field.value === "Paid"}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? "Paid" : "Free");
                      }}
                    />
                  </div>
                )}
              />

              {isPaid ? (
                <Controller
                  control={form.control}
                  name="payment.amount"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1.5"
                    >
                      <FieldLabel htmlFor="batch-price">Price (INR)</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <IndianRupee className="h-4 w-4" />
                        </span>
                        <Input
                          id="batch-price"
                          type="number"
                          min={0}
                          placeholder="0"
                          className="pl-9 shadow-none"
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Currency is always stored in INR
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : (
                <p className="text-sm text-green-600 font-medium">
                  ✓ This batch is free for all students
                </p>
              )}
            </div>
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
