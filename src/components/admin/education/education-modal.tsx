// components/admin/education/education-modal.tsx
'use client';

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { EducationRequest, EducationResponse } from "@/types/education";
import { useCreateResource } from "@/hooks/private/use-create-resource";
import { useUpdateResource } from "@/hooks/private/use-update-resource";
import React, { useEffect } from "react";

const educationSchema = z.object({
  educationId: z.number().optional(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().optional(),
  gpa: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface Props {
  education?: EducationResponse;
  trigger: React.ReactNode;
  onSave?: (edu: EducationResponse) => Promise<void>;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function EducationModal({
  education,
  trigger,
  onSave,
  open,
  setOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      location: "",
      gpa: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const { mutate: createEducation, isPending: isCreating } = useCreateResource<EducationRequest>("educations");
  const { mutate: updateEducation, isPending: isUpdating } = useUpdateResource<EducationRequest>("educations");

  const current = watch("current");

  useEffect(() => {
    if (open) {
      reset(
        education
          ? {
              educationId: education.educationId,
              degree: education.degree ?? "",
              institution: education.institution ?? "",
              location: education.location ?? "",
              gpa: education.gpa ?? "",
              startDate: education.startDate,
              endDate: education.endDate ?? "",
              description: education.description ?? "",
              current: education.current,
            }
          : {
              degree: "",
              institution: "",
              location: "",
              gpa: "",
              startDate: "",
              endDate: "",
              description: "",
              current: false,
            }
      );
    }
  }, [open, education, reset]);

  const onSubmit = (data: EducationFormData) => {
    if (!data.current && !data.endDate) {
      alert("Please fill End Date or check 'Current'");
      return;
    }

    const payload: EducationRequest = {
      educationId: data.educationId ?? null,
      degree: data.degree,
      institution: data.institution,
      location: data.location ?? "",
      gpa: data.gpa ?? "",
      startDate: data.startDate,
      endDate: data.current ? null : data.endDate ?? null,
      description: data.description ?? "",
      current: data.current,
    };

    const onSuccess = () => {
      setOpen(false);
      onSave?.(payload as EducationResponse);
    };

    if (education) {
      updateEducation(payload, { onSuccess });
    } else {
      createEducation(payload, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setOpen(true),
      })}

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{education ? "Edit Education" : "Add New Education"}</DialogTitle>
          <DialogDescription>Enter your education details and save.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input id="degree" {...register("degree")} />
              {errors.degree && <p className="text-sm text-red-500">{errors.degree.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input id="institution" {...register("institution")} />
              {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input type="date" id="startDate" {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate">End Date</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="current" checked={current} onCheckedChange={(val) => reset({ ...watch(), current: val })} />
                  <span>Current</span>
                </div>
              </div>
              <Input type="date" id="endDate" {...register("endDate")} disabled={current} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input id="gpa" {...register("gpa")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : "Save Education"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
