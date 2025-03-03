import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBatches } from "@/providers/BatchesProvider";

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBatchModal({ isOpen, onClose }: AddBatchModalProps) {
  const { addBatch } = useBatches();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    subjects: [] as string[],
    maxStudents: "",
    teacher: "",
    icon: "📚", // Default icon
    iconBg: "bg-purple-500", // Default background
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addBatch({
        ...formData,
        maxStudents: parseInt(formData.maxStudents),
        totalStudents: 0,
        status: "active",
      });
      onClose();
      setFormData({
        name: "",
        class: "",
        subjects: [],
        maxStudents: "",
        teacher: "",
        icon: "📚",
        iconBg: "bg-purple-500",
      });
    } catch (error) {
      console.error("Failed to add batch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (value: string) => {
    const subject = value.toLowerCase();
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>
            Create a new batch for students. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                Class
              </Label>
              <Select
                value={formData.class}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, class: value }))
                }
              >
                <SelectTrigger id="class" className="col-span-3">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">11th Class</SelectItem>
                  <SelectItem value="12">12th Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subjects</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {["Physics", "Chemistry", "Mathematics", "Biology"].map(
                  (subject) => (
                    <Button
                      key={subject}
                      type="button"
                      variant={
                        formData.subjects.includes(subject.toLowerCase())
                          ? "default"
                          : "outline"
                      }
                      className="text-sm"
                      onClick={() => handleSubjectChange(subject)}
                    >
                      {subject}
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxStudents" className="text-right">
                Max Students
              </Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxStudents: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teacher" className="text-right">
                Teacher
              </Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teacher: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Batch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
