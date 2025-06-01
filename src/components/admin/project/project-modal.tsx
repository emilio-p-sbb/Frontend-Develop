// app/admin/projects/components/project-modal.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { saveProject, updateProject } from "@/app/admin/projects/action";

// Import Server Actions

interface ProjectModalProps {
  project?: Project; // Opsional: untuk mode edit
  trigger: React.ReactNode; // Button atau elemen lain yang memicu modal
  onSave?: (project: Project) => Promise<void>; // Callback saat data disimpan (dari Client Component parent)
}

export default function ProjectModal({ project, trigger, onSave }: ProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Project>(
    project || {
      id: Date.now(), // ID sementara untuk proyek baru (akan diganti oleh DB)
      title: "",
      description: "",
      technologies: [],
      imageUrl: "/placeholder.svg", // Default image
      demoUrl: "",
      codeUrl: "",
      featured: false,
      createdAt: new Date().toISOString().split('T')[0], // Tanggal saat ini
    }
  );

  useEffect(() => {
    if (open) {
      setFormData(
        project || {
          id: Date.now(),
          title: "",
          description: "",
          technologies: [],
          imageUrl: "/placeholder.svg",
          demoUrl: "",
          codeUrl: "",
          featured: false,
          createdAt: new Date().toISOString().split('T')[0],
        }
      );
    }
  }, [open, project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (id === "technologies") {
      setFormData((prev) => ({ ...prev, [id]: value.split(',').map(tech => tech.trim()).filter(Boolean) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = async () => {
    // Validasi sederhana
    if (!formData.title || !formData.description || formData.technologies.length === 0) {
        alert("Please fill in required fields: Title, Description, and Technologies.");
        return;
    }

    try {
      if (project) { // Mode edit
        if (onSave) {
          await onSave(formData); // Panggil onSave prop dari parent (ProjectList)
        } else {
          // Fallback jika onSave tidak diberikan (tidak seharusnya terjadi untuk edit)
          await updateProject(formData);
          alert("Project updated successfully!");
        }
      } else { // Mode tambah baru
        // Kita memanggil Server Action `saveProject` secara langsung dari sini.
        const { id, ...dataToSave } = formData; // Hapus ID sementara jika diperlukan
        await saveProject(dataToSave as Omit<Project, 'id' | 'createdAt'>);
        alert("New project added successfully!");
        if (onSave) { // Jika ada onSave prop untuk Add New (misalnya dari page.tsx, meski sudah dihapus)
            onSave(formData);
        }
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Kloning trigger untuk menambahkan event handler onClick */}
      {React.cloneElement(trigger as React.ReactElement, { onClick: () => setOpen(true) })}

      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            Enter the details for this project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Project Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="technologies" className="text-sm font-medium">Technologies</label>
            <Input
              id="technologies"
              value={formData.technologies.join(", ")}
              onChange={handleInputChange}
              placeholder="Java, Spring Boot, PostgreSQL"
            />
            <p className="text-xs text-muted-foreground">Separate with commas</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="e.g., /images/project-banner.png"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="demoUrl" className="text-sm font-medium">Demo URL (optional)</label>
              <Input
                id="demoUrl"
                value={formData.demoUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="codeUrl" className="text-sm font-medium">Code URL (optional)</label>
              <Input
                id="codeUrl"
                value={formData.codeUrl || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="rounded border-gray-300 focus:ring-portfolio-light-blue"
            />
            <label htmlFor="featured" className="text-sm">Mark as featured project</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}