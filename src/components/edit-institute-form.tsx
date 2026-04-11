"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, FileImage, Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { updateInstitute } from "@/actions/institute_actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateInstituteFormSchema } from "@/helpers/schema/createInstituteSchema";
import { IInstitute } from "@/helpers/types";
import { logger } from "@/lib/logger";
import { useAppDispatch } from "@/redux/hooks";
import { instituteData } from "@/redux/slices/instituteSlice";

const standardOptions = ["6", "7", "8", "9", "10", "11", "12"];

interface EditInstituteFormProps {
  institute: IInstitute;
  onSuccess?: () => void;
}

const EditInstituteFormInner = ({
  institute,
  onSuccess,
}: {
  institute: IInstitute;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    institute.logo?.url || null
  );
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [docLogoFile, setDocLogoFile] = useState<File | null>(null);
  const [docLogoPreview, setDocLogoPreview] = useState<string | null>(
    institute.docLogo?.url || null
  );
  const docLogoInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const form = useForm<z.input<typeof CreateInstituteFormSchema>>({
    resolver: zodResolver(CreateInstituteFormSchema),
    defaultValues: {
      name: institute.name ?? "",
      standards: institute.standards ?? [],
      address1: institute.address1 ?? "",
      city: institute.city ?? "",
      contactNumber: institute.contactNumber ?? "",
      country: institute.country ?? "India",
      email: institute.email ?? "",
      pincode: institute.pincode ?? "",
      state: institute.state ?? "",
      website: institute.website ?? "",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be less than 2MB");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleDocLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Document logo must be less than 2MB");
      return;
    }
    setDocLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setDocLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveDocLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDocLogoFile(null);
    setDocLogoPreview(null);
    if (docLogoInputRef.current) docLogoInputRef.current.value = "";
  };

  const handleSubmit = async (
    data: z.input<typeof CreateInstituteFormSchema>
  ) => {
    try {
      setLoading(true);

      const res = await updateInstitute(institute._id, {
        ...data,
        standards: data.standards ?? [],
        logo: logoFile ? { name: logoFile.name, type: logoFile.type } : undefined,
        docLogo: docLogoFile
          ? { name: docLogoFile.name, type: docLogoFile.type }
          : undefined,
      });

      if (res.success) {
        const uploads: Promise<Response>[] = [];

        if (logoFile && res.logoUploadUrl) {
          uploads.push(
            fetch(res.logoUploadUrl, {
              method: "PUT",
              body: logoFile,
              headers: { "Content-Type": logoFile.type },
            })
          );
        }

        if (docLogoFile && res.docLogoUploadUrl) {
          uploads.push(
            fetch(res.docLogoUploadUrl, {
              method: "PUT",
              body: docLogoFile,
              headers: { "Content-Type": docLogoFile.type },
            })
          );
        }

        if (uploads.length > 0) await Promise.all(uploads);

        toast.success("Institute updated successfully!");
        if (res.data) dispatch(instituteData(res.data));
        onSuccess();
      } else {
        toast.error(res.error || "Failed to update institute");
      }
    } catch (error) {
      logger.error("Error updating institute", { error });
      toast.error("Failed to update institute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {/* Institute Logo */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <p className="text-sm font-medium text-foreground self-start">
            Institute Logo
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/30 hover:bg-muted/60 hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden group"
              title="Upload institute logo"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px] font-medium">Logo</span>
                </div>
              )}
            </button>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter institute name"
                  required
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="email">
                  Email{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter institute email"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="contactNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="contactNumber">
                  Phone Number{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  placeholder="Enter institute contact number"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="website"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="website">
                  Website{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter institute website"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="address1"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="address1">
                Address{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </FieldLabel>
              <Input
                {...field}
                placeholder="Enter street address"
                aria-invalid={fieldState.invalid}
                className="shadow-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="city"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="city">
                  City{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter your city"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="state"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="state">
                  State{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter state"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="pincode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="pincode">
                  Pincode{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter pincode"
                  aria-invalid={fieldState.invalid}
                  className="shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="shadow-none">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="standards"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldGroup>
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">
                  Standards/Classes{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </FieldLegend>
                <FieldGroup
                  data-slot="checkbox-group"
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full"
                >
                  {standardOptions.map((standard) => (
                    <Field
                      key={standard}
                      orientation={"horizontal"}
                      data-invalid={fieldState.invalid}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-standard-${standard}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={(field.value ?? []).includes(standard)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value ?? []), standard]
                            : (field.value ?? []).filter((s) => s !== standard);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`edit-standard-${standard}`}
                        className="cursor-pointer"
                      >
                        Grade {standard}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldGroup>
          )}
        />

        {/* Document Logo Section */}
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg mt-0.5">
              <FileImage className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Document Logo
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This logo will appear on all your documents like fee receipts, reports, etc.
                If not set, the default Leadlly logo will be used.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => docLogoInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-white hover:bg-muted/30 hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden group"
                title="Upload document logo"
              >
                {docLogoPreview ? (
                  <img
                    src={docLogoPreview}
                    alt="Document logo preview"
                    className="w-full h-full object-contain rounded-lg p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <Camera className="h-5 w-5" />
                    <span className="text-[9px] font-medium text-center leading-tight">
                      Doc Logo
                    </span>
                  </div>
                )}
              </button>
              {docLogoPreview && (
                <button
                  type="button"
                  onClick={handleRemoveDocLogo}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Recommended: PNG with transparent background</p>
              <p>Max size: 2MB</p>
            </div>
          </div>

          <input
            ref={docLogoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDocLogoChange}
          />
        </div>
      </FieldGroup>

      <div className="mt-8 flex justify-end gap-4">
        <Button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

const EditInstituteForm = ({ institute, onSuccess }: EditInstituteFormProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Institute</DialogTitle>
          <DialogDescription>
            Update your institute information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <EditInstituteFormInner
          institute={institute}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditInstituteForm;
