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
import { Experience } from "@/types/experience";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateResource } from "@/hooks/private/use-create-resource";
import { useUpdateResource } from "@/hooks/private/use-update-resource";

interface ExperienceModalProps {
  experience?: Experience; // untuk edit
  trigger: React.ReactNode;
  onSave?: (experience: Experience) => Promise<void>;
}

// Schema sesuai tipe Experience (responsibilities sebagai string)
const experienceSchema = z.object({
  experienceId: z.number().optional(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  isCurrent: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ExperienceModal({ experience, trigger, onSave }: ExperienceModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      responsibilities: "",
      isCurrent: false,
    },
  });

  // Hooks untuk create dan update (misal kamu punya hook custom)
  const { mutate: createExperience, isPending: isCreating } = useCreateResource<Experience>("experiences");
  const { mutate: updateExperience, isPending: isUpdating } = useUpdateResource<Experience>("experiences");

  // Reset form saat modal dibuka dan experience berubah
  useEffect(() => {
    if (open) {
      reset(
        experience ?? {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          responsibilities: "",
          isCurrent: false,
        }
      );
    }
  }, [open, experience, reset]);

  // Untuk disable endDate jika current true
  const current = watch("isCurrent");

  const onSubmit = (data: ExperienceFormData) => {
    if (!data.isCurrent && !data.endDate) {
      alert("Please fill End Date or check Current Position");
      return;
    }

    const payload: Experience = {
      experienceId: data.experienceId ?? Date.now(),
      company: data.company,
      position: data.position,
      startDate: data.startDate,
      isCurrent: data.isCurrent,
      endDate: data.endDate,
      location: data.location ?? "",
      description: data.description ?? "",        // <-- pastikan string, default ""
      responsibilities: data.responsibilities ?? "",  // <-- pastikan string, default ""
    };

    if (experience) {
      updateExperience(payload, {
        onSuccess: () => {
          setOpen(false);
          onSave?.(payload);
        },
      });
    } else {
      createExperience(payload, {
        onSuccess: () => {
          setOpen(false);
          onSave?.(payload);
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
          <DialogTitle>{experience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
          <DialogDescription>
            Enter details about your work experience. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company Name
              </label>
              <Input id="company" {...register("company")} placeholder="e.g., Google Inc." />
              {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">
                Position/Title
              </label>
              <Input id="position" {...register("position")} placeholder="e.g., Software Engineer" />
              {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    {...register("isCurrent")}
                    className="rounded border-gray-300 focus:ring-portfolio-light-blue mr-2"
                  />
                  <label htmlFor="isCurrent" className="text-sm">
                    Current Position
                  </label>
                </div>
              </div>
              <Input id="endDate" type="date" {...register("endDate")} disabled={current} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input id="location" {...register("location")} placeholder="e.g., San Francisco, CA" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea id="description" {...register("description")} placeholder="Briefly describe your role" rows={3} />
          </div>

          <div className="space-y-2">
            <label htmlFor="responsibilities" className="text-sm font-medium">
              Responsibilities
            </label>
            <Textarea
              id="responsibilities"
              {...register("responsibilities")}
              placeholder="Enter responsibilities (one per line)"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? "Saving..." : "Save Experience"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
