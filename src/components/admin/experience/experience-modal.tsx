// src/app/admin/experience/components/experience-modal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/experience";
import { saveExperience, updateExperience } from "@/app/admin/experience/action";

// Import Server Actions dari file actions.ts

interface ExperienceModalProps {
  experience?: Experience;
  trigger: React.ReactNode;
  onSave?: (experience: Experience) => Promise<void>;
}

export default function ExperienceModal({ experience, trigger, onSave }: ExperienceModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Experience>(
    experience || {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      responsibilities: [],
      location: "",
      current: false,
    }
  );

  React.useEffect(() => {
    if (open && !experience) {
      setFormData({
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
        location: "",
        current: false,
      });
    } else if (open && experience) {
        setFormData(experience);
    }
  }, [open, experience]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      if (id === "current" && checked) {
        setFormData((prev) => ({ ...prev, endDate: "" }));
      }
    } else if (id === "responsibilities") {
      setFormData((prev) => ({ ...prev, [id]: value.split('\n') }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.company || !formData.position || !formData.startDate || (!formData.current && !formData.endDate)) {
        alert("Please fill in all required fields (Company, Position, Start Date, and End Date if not current).");
        return;
    }

    try {
      if (experience) { // Mode edit
        if (onSave) {
          await onSave(formData);
        } else {
          await updateExperience(formData); // Fallback: panggil langsung Server Action
          alert("Experience updated successfully!");
        }
      } else { // Mode tambah baru
        const { id, ...dataToSave } = formData;
        await saveExperience(dataToSave); // Langsung panggil Server Action
        alert("New experience added successfully!");
        if (onSave) { // Jika ada callback onSave untuk menambah (misalnya dari page.tsx, meski sudah dihapus)
            onSave(formData);
        }
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to save experience:", error);
      alert("Failed to save experience. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger as React.ReactElement, { onClick: () => setOpen(true) })}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add New Experience"}
          </DialogTitle>
          <DialogDescription>
            Enter details about your work experience. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Company Name</label>
              <Input
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Google Inc."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">Position/Title</label>
              <Input
                id="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 focus:ring-portfolio-light-blue mr-2"
                  />
                  <label htmlFor="current" className="text-sm">Current Position</label>
                </div>
              </div>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                disabled={formData.current}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe your role"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="responsibilities" className="text-sm font-medium">Responsibilities</label>
            <Textarea
              id="responsibilities"
              value={formData.responsibilities.join("\n")}
              onChange={handleInputChange}
              placeholder="Enter responsibilities (one per line)"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Experience</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}