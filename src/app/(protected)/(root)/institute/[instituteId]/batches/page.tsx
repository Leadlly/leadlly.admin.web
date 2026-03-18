"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ChevronDown, IndianRupee, Plus } from "lucide-react";
import { toast } from "sonner";

import { createBatch, getInstituteBatch } from "@/actions/batch_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ApiBatch {
  _id: string;
  name: string;
  standard: string;
  status: "Active" | "Inactive" | "Completed";
  payment?: {
    subscriptionType: "Free" | "Paid";
    amount: number;
    currency: string;
  };
  createdAt?: string;
}

const FALLBACK_STANDARDS = ["9", "10", "11", "12"];

export default function BatchesPage() {
  const params = useParams<{ instituteId: string }>();
  const instituteId = params?.instituteId ?? "";
  console.log(params, "here are the params");
  const [batches, setBatches] = useState<ApiBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    standard: "",
  });

  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [newBatch, setNewBatch] = useState({
    name: "",
    standard: "",
    description: "",
    about: "",
    payment: {
      subscriptionType: "Free" as "Free" | "Paid",
      amount: 0,
      currency: "INR" as const,
    },
  });

  const instituteData = useAppSelector((state) => state.institute.institute);
  const [filterLabels, setFilterLabels] = useState({
    standard: "All Standards",
  });
  const fetchBatches = async () => {
    if (!instituteId) {
      setLoading(false);
      setError("Invalid institute. Please go back and select an institute.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getInstituteBatch(instituteId);
      const items: ApiBatch[] = data?.data ?? [];
      setBatches(items);
    } catch (err) {
      setError("Error loading batches. Please try again later.");
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBatches();
  }, [instituteId, filters]);

  const handleFilterChange = (value: string, label: string) => {
    setFilters({ standard: value });
    setFilterLabels({ standard: label });
  };

  const resetForm = () => {
    setNewBatch({
      name: "",
      standard: "",
      description: "",
      about: "",
      payment: { subscriptionType: "Free", amount: 0, currency: "INR" },
    });
  };

  const handleCreateBatch = async () => {
    if (!newBatch.name.trim()) {
      toast.error("Please enter a batch name");
      return;
    }
    if (!newBatch.standard) {
      toast.error("Please select a standard");
      return;
    }
    if (
      newBatch.payment.subscriptionType === "Paid" &&
      newBatch.payment.amount <= 0
    ) {
      toast.error("Please enter a valid price for paid batch");
      return;
    }

    try {
      setCreateLoading(true);
      const response = await createBatch({
        name: newBatch.name.trim(),
        standard: newBatch.standard,
        description: newBatch.description || undefined,
        about: newBatch.about || undefined,
        institute: instituteId,
        payment: newBatch.payment,
      });

      if (response?.success) {
        toast.success("Batch created successfully!");
        resetForm();
        setOpen(false);
        fetchBatches();
      } else {
        toast.error(response?.message || "Failed to create batch");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error("Failed to create batch. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const getBatchLogoBg = (batchName: string) => {
    switch (batchName) {
      case "Omega":
        return "bg-blue-500";
      case "Sigma":
        return "bg-green-500";
      case "Alpha":
        return "bg-red-500";
      case "Beta":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          Student Batches of Institute
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          Student Batches of Institute
        </h1>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Student Batches of Institute</h1>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 gap-1.5">
              <Plus className="h-4 w-4" />
              Create New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Batch</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5 py-2">
              {/* Batch Name */}
              <div className="grid gap-1.5">
                <Label htmlFor="batch-name">
                  Batch Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="batch-name"
                  value={newBatch.name}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, name: e.target.value })
                  }
                  placeholder="e.g. Alpha Batch 2025"
                  className="shadow-none"
                />
              </div>

              {/* Standard */}
              <div className="grid gap-1.5">
                <Label>
                  Standard <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newBatch.standard}
                  onValueChange={(val) =>
                    setNewBatch({ ...newBatch, standard: val })
                  }
                >
                  <SelectTrigger className="shadow-none">
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    {(instituteData?.standards?.length
                      ? instituteData.standards
                      : FALLBACK_STANDARDS
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        Grade {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="grid gap-1.5">
                <Label htmlFor="batch-description">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="batch-description"
                  value={newBatch.description}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, description: e.target.value })
                  }
                  placeholder="Brief description of this batch..."
                  className="shadow-none resize-none min-h-[72px]"
                />
              </div>

              {/* About / Details — whitespace preserved */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="batch-about">
                    About / Details{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </Label>
                </div>
                <textarea
                  id="batch-about"
                  value={newBatch.about}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, about: e.target.value })
                  }
                  placeholder={`Write detailed info about this batch...\n\nYou can use:\n- Bullet points\n- Multiple lines\n- Any spacing you need`}
                  rows={6}
                  spellCheck={false}
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
              </div>

              {/* Pricing */}
              <div className="rounded-xl border border-border p-4 grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Paid Batch</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Toggle to charge students for this batch
                    </p>
                  </div>
                  <Switch
                    checked={newBatch.payment.subscriptionType === "Paid"}
                    onCheckedChange={(checked) =>
                      setNewBatch((prev) => ({
                        ...prev,
                        payment: {
                          ...prev.payment,
                          subscriptionType: checked ? "Paid" : "Free",
                          amount: checked ? prev.payment.amount : 0,
                        },
                      }))
                    }
                  />
                </div>

                {newBatch.payment.subscriptionType === "Paid" && (
                  <div className="grid gap-1.5">
                    <Label htmlFor="batch-price">Price (INR)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <IndianRupee className="h-4 w-4" />
                      </span>
                      <Input
                        id="batch-price"
                        type="number"
                        min={1}
                        value={newBatch.payment.amount || ""}
                        onChange={(e) =>
                          setNewBatch((prev) => ({
                            ...prev,
                            payment: {
                              ...prev.payment,
                              amount: Number(e.target.value),
                            },
                          }))
                        }
                        placeholder="0"
                        className="pl-9 shadow-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currency is always stored in INR
                    </p>
                  </div>
                )}

                {newBatch.payment.subscriptionType === "Free" && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ This batch is free for all students
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBatch}
                className="bg-purple-600 text-white hover:bg-purple-700 min-w-[110px]"
                disabled={createLoading}
              >
                {createLoading ? "Creating..." : "Create Batch"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-8  mb-8 border-2 shadow-inner rounded-3xl">
        <div className="flex items-center gap-4">
          <span className="font-medium">Filter by :</span>
          <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
            {/* Standard Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-between w-full border rounded-md px-4 py-2 text-left">
                <span>{filterLabels.standard}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => handleFilterChange("", "All Standards")}
                >
                  All Standards
                </DropdownMenuItem>
                {Array.from(new Set(batches.map((b) => b.standard))).map(
                  (standard) => (
                    <DropdownMenuItem
                      key={standard}
                      onClick={() =>
                        handleFilterChange(standard, `${standard} Standard`)
                      }
                    >
                      {standard} Standard
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Subject/Teacher filters removed for now */}
          </div>
        </div>
      </div>

      {batches.length > 0 ? (
        <div className="bg-white p-10 rounded-3xl mb-6 border-2 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches
              .filter((batch) =>
                filters.standard ? batch.standard === filters.standard : true
              )
              .map((batch) => (
                <div
                  key={batch._id}
                  className="border rounded-xl shadow-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 ${getBatchLogoBg(
                        batch.name
                      )} rounded-full flex items-center justify-center text-white`}
                    >
                      {batch.name.toLowerCase().includes("omega") ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{batch.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Class: {batch.standard}
                      </p>
                    </div>
                    <span className="ml-auto px-3 py-3 font-semibold bg-green-100 text-green-800 text-xs rounded-full">
                      {batch.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Pricing: </span>
                      {batch.payment?.subscriptionType === "Paid"
                        ? `₹${batch.payment.amount} ${batch.payment.currency || "INR"}`
                        : "Free"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500">
                      Created{" "}
                      {batch.createdAt
                        ? new Date(batch.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <Link
                      href={`/institute/${instituteId}/students`}
                      className="block text-center bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 transition"
                    >
                      View Students
                    </Link>
                    <Button variant="outline" className="text-xs" disabled>
                      View Teachers
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-gray-600">
            No batches found. Try adjusting your filters.
          </p>
        </div>
      )}
    </>
  );
}
