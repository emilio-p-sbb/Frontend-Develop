// app/admin/skills/components/skill-modal.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label"; // Biasanya digunakan bersama Input
import { Skill } from "@/types/skill";
import { saveSkill, updateSkill } from "@/app/admin/skills/action";

// Import Server Actions

interface SkillModalProps {
  skill?: Skill; // Opsional: untuk mode edit
  trigger: React.ReactNode; // Button atau elemen lain yang memicu modal
  onSave?: (skill: Skill) => Promise<void>; // Callback saat data disimpan (dari Client Component parent)
}

export default function SkillModal({ skill, trigger, onSave }: SkillModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Skill>(
    skill || {
      id: Date.now(), // ID sementara untuk skill baru
      name: "",
      level: 50, // Default level
      category: "",
      yearsOfExperience: 0,
    }
  );

  useEffect(() => {
    if (open) { // Reset form saat modal dibuka jika mode tambah baru
      setFormData(
        skill || {
          id: Date.now(),
          name: "",
          level: 50,
          category: "",
          yearsOfExperience: 0,
        }
      );
    }
  }, [open, skill]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSave = async () => {
    // Validasi sederhana
    if (!formData.name || !formData.category || formData.level === undefined || formData.yearsOfExperience === undefined) {
      alert("Please fill in all required fields: Skill Name, Category, Proficiency Level, and Years of Experience.");
      return;
    }
    if (formData.level < 0 || formData.level > 100) {
      alert("Proficiency Level must be between 0 and 100.");
      return;
    }
    if (formData.yearsOfExperience < 0) {
      alert("Years of Experience cannot be negative.");
      return;
    }

    try {
      if (skill) { // Mode edit
        if (onSave) {
          await onSave(formData); // Panggil onSave prop dari parent (SkillList)
        } else {
          // Fallback jika onSave tidak diberikan (tidak seharusnya terjadi untuk edit)
          await updateSkill(formData);
          alert("Skill updated successfully!");
        }
      } else { // Mode tambah baru
        const { id, ...dataToSave } = formData; // Hapus ID sementara
        await saveSkill(dataToSave as Omit<Skill, 'id'>);
        alert("New skill added successfully!");
        if (onSave) { // Jika ada onSave prop untuk Add New (misalnya dari page.tsx, meski sudah dihapus)
            onSave(formData);
        }
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to save skill:", error);
      alert("Failed to save skill. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Kloning trigger untuk menambahkan event handler onClick */}
      {React.cloneElement(trigger as React.ReactElement, { onClick: () => setOpen(true) })}

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {skill ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
          <DialogDescription>
            Enter the details for this skill. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Java"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Programming Languages"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Proficiency Level (0-100)</Label>
            <Input
              id="level"
              type="number"
              min="0"
              max="100"
              value={formData.level}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Skill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}