"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createInstitute } from "@/actions/institute_actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
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
import { useAppDispatch } from "@/redux/hooks";
import { instituteData } from "@/redux/slices/instituteSlice";

const defaultSubjects = ["physics", "chemistry", "mathematics"];
const standardOptions = ["9", "10", "11", "12", "13"];

const CreateInstituteForm = ({
  setDialogOpen,
}: {
  setDialogOpen?: (dialogOpen: boolean) => void;
}) => {
  const [customSubject, setCustomSubject] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [logo, setLogo] = useState<File | null>(null);
  //   const [logoPreview, setLogoPreview] = useState<string | null>(null);
  //   const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const anchor = useComboboxAnchor();

  const form = useForm<z.infer<typeof CreateInstituteFormSchema>>({
    resolver: zodResolver(CreateInstituteFormSchema),
    defaultValues: {
      name: "",
      subjects: [],
      standards: [],
      address1: "",
      address2: "",
      city: "",
      contactNumber: "",
      country: "India",
      email: "",
      pincode: "",
      state: "",
      website: "",
    },
  });

  //   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       // Check file type
  //       if (!file.type.startsWith("image/")) {
  //         toast.error("Please upload an image file");
  //         return;
  //       }

  //       // Check file size (max 2MB)
  //       if (file.size > 2 * 1024 * 1024) {
  //         toast.error("Logo image must be less than 2MB");
  //         return;
  //       }

  //       setLogo(file);

  //       // Create preview
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         setLogoPreview(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleRemoveLogo = () => {
  //     setLogo(null);
  //     setLogoPreview(null);
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //   };

  const handleSubmit = async (
    data: z.infer<typeof CreateInstituteFormSchema>
  ) => {
    try {
      setLoading(true);

      // Create FormData if there's a logo
      //   let formData = null;
      //   if (logo) {
      //     formData = new FormData();
      //     formData.append("logo", logo);
      //   }

      const res = await createInstitute({
        name: data.name,
        subjects: data.subjects,
        standards: data.standards,
        // logo: formData,
        email: data.email,
        website: data.website,
        contactNumber: data.contactNumber,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
      });

      if (res.success) {
        toast.success("Institute created successfully!");
        dispatch(instituteData(res.data));
        router.replace(`/institute/${res.data?._id}`);
        setDialogOpen?.(false);
      } else {
        console.log(res);
        toast.error(res.error || "Error occurred");
      }
    } catch (error) {
      console.error("Error creating institute:", error);
      toast.error("Failed to create institute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
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
                <FieldLabel htmlFor="name">Email</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter institute email"
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="contactNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">Phone Number</FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  placeholder="Enter institute contact number"
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
              <FieldLabel htmlFor="name">Address 1</FieldLabel>
              <Input
                {...field}
                placeholder="Enter street address"
                required
                aria-invalid={fieldState.invalid}
                className="shadow-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="address2"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="name">
                Address 2{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </FieldLabel>
              <Input
                {...field}
                placeholder="Enter locality"
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
                <FieldLabel htmlFor="name">City</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter your city"
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
            name="state"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">State</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter state"
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="pincode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">Pincode</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter pincode"
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
            name="country"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">Country</FieldLabel>
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

        {/* <div className="space-y-2">
          <Label>Institute Logo (Optional)</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                PNG, JPG or GIF (max. 2MB)
              </span>
            </div>

            {logoPreview && (
              <div className="relative w-24 h-24 mt-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain border rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div> */}

        <Controller
          control={form.control}
          name="subjects"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel>Subjects</FieldLabel>

              <Combobox
                multiple
                autoHighlight
                items={[...new Set([...defaultSubjects, ...field.value])]}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setCustomSubject("");
                }}
                onInputValueChange={setCustomSubject}
              >
                <ComboboxChips ref={anchor}>
                  <ComboboxValue>
                    {(values) => (
                      <React.Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value} className="capitalize">
                            {value}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="Select subjects" />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>

                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No subjects found.</ComboboxEmpty>
                  <ComboboxList>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem
                          key={item}
                          value={item}
                          className="capitalize"
                        >
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>

                    {customSubject &&
                      !defaultSubjects.some(
                        (s) => s.toLowerCase() === customSubject.toLowerCase()
                      ) &&
                      !field.value.some(
                        (s: string) =>
                          s.toLowerCase() === customSubject.toLowerCase()
                      ) && (
                        <Button
                          type="button"
                          variant={"ghost"}
                          className="w-full justify-start text-primary font-medium px-1.5 h-9"
                          onClick={(e) => {
                            e.preventDefault();
                            field.onChange([...field.value, customSubject]);
                            setCustomSubject("");
                          }}
                        >
                          <Plus className="mr-2size-4" />
                          <span>Add &quot;{customSubject}&quot;</span>
                        </Button>
                      )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="standards"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldGroup>
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Standards/Classes</FieldLegend>
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
                        id={`standard-${standard}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(standard)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, standard]
                            : field.value.filter((s) => s !== standard);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`standard-${standard}`}
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
      </FieldGroup>

      <div className="mt-8 flex justify-end gap-4">
        <Button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Institute"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateInstituteForm;
