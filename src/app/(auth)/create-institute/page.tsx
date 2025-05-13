"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createInstitute } from "@/actions/institute_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from "@/redux/hooks";
import { instituteData } from "@/redux/slices/instituteSlice";

export default function CreateInstitutePage() {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [standards, setStandards] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();


  const defaultSubjects = ["Physics", "Chemistry", "Mathematics"];
  const standardOptions = ["9", "10", "11", "12", "13"];

  const handleAddSubject = () => {
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    // Prevent removing default subjects
    if (defaultSubjects.includes(subject)) {
      toast.error(`${subject} is a default subject and cannot be removed`);
      return;
    }
    setSubjects(subjects.filter(s => s !== subject));
  };

  const handleStandardChange = (standard: string) => {
    if (standards.includes(standard)) {
      setStandards(standards.filter(s => s !== standard));
    } else {
      setStandards([...standards, standard]);
    }
  };

  const handleSelectSubject = (value: string) => {
    if (!subjects.includes(value)) {
      setSubjects([...subjects, value]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo image must be less than 2MB");
        return;
      }
      
      setLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Institute name is required");
      return;
    }
    
    if (standards.length === 0) {
      toast.error("Please select at least one standard/class");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create FormData if there's a logo
      let formData = null;
      if (logo) {
        formData = new FormData();
        formData.append('logo', logo);
      }
      
      const data = await createInstitute({ 
        name,
        subjects,
        standards,
        logo: formData
      });

      if(data.success) {
        toast.success("Institute created successfully!");
        // dispatch(instituteData(data.institute));
        router.push("/select-institute");
        
      } else {
        console.log(data)
        toast.error(data.error || "Errorr occured")
      }
      
     
    } catch (error) {
      console.error("Error creating institute:", error);
      toast.error("Failed to create institute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Institute</CardTitle>
          <CardDescription>
            Fill in the details to create your new institute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Institute Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter institute name"
                  required
                />
              </div>
              
              <div className="space-y-2">
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
              </div>
              
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Select onValueChange={handleSelectSubject}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultSubjects.map((subject) => (
                          <SelectItem 
                            key={subject} 
                            value={subject}
                            disabled={subjects.includes(subject)}
                          >
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      placeholder="Add a custom subject"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubject();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddSubject}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject, index) => (
                    <div 
                      key={index} 
                      className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                        defaultSubjects.includes(subject) 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span>{subject}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubject(subject)}
                        className={`hover:text-primary ${
                          defaultSubjects.includes(subject) 
                            ? "text-blue-500/70" 
                            : "text-primary/70"
                        }`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Standards/Classes</Label>
                <div className="grid grid-cols-2 gap-4">
                  {standardOptions.map((standard) => (
                    <div key={standard} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`standard-${standard}`} 
                        checked={standards.includes(standard)}
                        onCheckedChange={() => handleStandardChange(standard)}
                      />
                      <Label 
                        htmlFor={`standard-${standard}`}
                        className="cursor-pointer"
                      >
                        Grade {standard}
                      </Label>
                    </div>
                  ))}
                </div>
                {standards.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {standards.map(s => `Grade ${s}`).join(', ')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/select-institute")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
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
        </CardContent>
      </Card>
    </div>
  );
}