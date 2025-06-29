"use client";

import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateResource } from "@/hooks/private/use-create-resource";
import { useUpdateResource } from "@/hooks/private/use-update-resource";

interface ProjectModalProps {
  project?: Project; // untuk edit
  trigger: React.ReactNode;
  onSave?: (project: Project) => Promise<void>;
}

// Schema validasi dengan zod
const projectSchema = z.object({
  projectId: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.string().min(1, "Technologies are required"), // string comma-separated, nanti diparse
  imageUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  codeUrl: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectModal({ project, trigger, onSave }: ProjectModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      imageUrl: "/placeholder.svg",
      demoUrl: "",
      codeUrl: "",
      featured: false,
    },
  });

  // Hooks custom untuk create dan update project
  const { mutate: createProject, isPending: isCreating } = useCreateResource<Project>("projects");
  const { mutate: updateProject, isPending: isUpdating } = useUpdateResource<Project>("projects");

  // Reset form saat modal dibuka & project berubah
  useEffect(() => {
    if (open) {
      reset(
        project
          ? {
              ...project,
              technologies: project.technologies,
            }
          : {
              title: "",
              description: "",
              technologies: "",
              imageUrl: "/placeholder.svg",
              demoUrl: "",
              codeUrl: "",
              featured: false,
            }
      );
    }
  }, [open, project, reset]);

  const onSubmit = (data: ProjectFormData) => {
    // Parse technologies jadi array string
    const techArray = data.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      alert("Please fill Technologies");
      return;
    }

    const payload: Project = {
      projectId: data.projectId ?? Date.now(),
      title: data.title,
      description: data.description,
      technologies: data.technologies,
      imageUrl: data.imageUrl || "/placeholder.svg",
      demoUrl: data.demoUrl || "",
      codeUrl: data.codeUrl || "",
      featured: data.featured ?? false,
    };

    if (project) {
      updateProject(payload, {
        onSuccess: () => {
          setOpen(false);
          onSave?.(payload);
        },
        onError: (err) => {
          console.error("Update failed:", err);
          alert("Failed to update project");
        },
      });
    } else {
      createProject(payload, {
        onSuccess: () => {
          setOpen(false);
          onSave?.(payload);
        },
        onError: (err) => {
          console.error("Create failed:", err);
          alert("Failed to create project");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setOpen(true),
      })}

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            Enter the details for this project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title
            </label>
            <Input id="title" {...register("title")} placeholder="Enter project title" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your project"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="technologies" className="text-sm font-medium">
              Technologies
            </label>
            <Input
              id="technologies"
              {...register("technologies")}
              placeholder="Java, Spring Boot, PostgreSQL"
            />
            <p className="text-xs text-muted-foreground">Separate with commas</p>
            {errors.technologies && (
              <p className="text-sm text-red-500">{errors.technologies.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="e.g., /images/project-banner.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="demoUrl" className="text-sm font-medium">
                Demo URL (optional)
              </label>
              <Input id="demoUrl" {...register("demoUrl")} placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="codeUrl" className="text-sm font-medium">
                Code URL (optional)
              </label>
              <Input
                id="codeUrl"
                {...register("codeUrl")}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="rounded border-gray-300 focus:ring-portfolio-light-blue"
            />
            <label htmlFor="featured" className="text-sm">
              Mark as featured project
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
