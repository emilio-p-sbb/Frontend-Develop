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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateResource } from "@/hooks/private/use-create-resource";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateResource } from "@/hooks/private/use-update-resource";

// Import Server Actions

interface SkillModalProps {
  skill?: Skill; // Opsional: untuk mode edit
  trigger: React.ReactNode; // Button atau elemen lain yang memicu modal
  onSave?: (skill: Skill) => Promise<void>; // Callback saat data disimpan (dari Client Component parent)
}

const skillSchema = z.object({
  skillId: z.number().optional(),
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  proficiencyLevel: z.number().min(0).max(100),
  yearsOfExperience: z.number().min(0),
  description: z.string().optional(),
})

type SkillFormData = z.infer<typeof skillSchema>

export default function SkillModal({ skill, trigger, onSave }: SkillModalProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiencyLevel: 50,
      yearsOfExperience: 0,
      description: "",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const { mutate: createSkill, isPending: isCreating } = useCreateResource<Skill>("skills")
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateResource<Skill>("skills")



  const [formData, setFormData] = useState<Skill>(
    skill || {
      skillId: 0, // ID sementara untuk skill baru
      name: "",
      proficiencyLevel: 50, // Default level
      category: "",
      yearsOfExperience: 0,
      description: "",
    }
  );

  useEffect(() => {
    if (open) {
      reset(
        skill ?? {
          name: "",
          category: "",
          proficiencyLevel: 50,
          yearsOfExperience: 0,
          description: "",
        }
      )
    }
  }, [open, skill, reset])

  const onSubmit = (data: SkillFormData) => {
    if (skill) {
      updateSkill({ ...data, skillId: skill.skillId }, {
        onSuccess: () => {
          setOpen(false)
          onSave?.({ ...data, skillId: skill.skillId })
        },
      })
    } else {
      createSkill(data, {
        onSuccess: () => {
          setOpen(false)
          onSave?.({ ...data, skillId: Date.now() }) // ID dummy
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setOpen(true),
      })}

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          <DialogDescription>
            Enter the details for this skill. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Java" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register("category")} placeholder="e.g., Programming Languages" />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Proficiency Level (0-100)</Label>
            <Input type="number" id="level" {...register("proficiencyLevel", { valueAsNumber: true })} />
            {errors.proficiencyLevel && <p className="text-sm text-red-500">{errors.proficiencyLevel.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input type="number" id="yearsOfExperience" {...register("yearsOfExperience", { valueAsNumber: true })} />
            {errors.yearsOfExperience && <p className="text-sm text-red-500">{errors.yearsOfExperience.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Optional description about the skill"
              className="min-h-[100px] resize-y"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Saving..." : "Save Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}