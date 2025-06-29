"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExperienceModal from "./experience-modal";
import { Experience, ExperienceResponse } from "@/types/experience";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useResources } from "@/hooks/private/use-resource";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";

// ✅ Fungsi konversi ExperienceResponse ke Experience
const mapResponseToExperience = (response: ExperienceResponse): Experience => ({
  experienceId: response.experienceId,
  company: response.company,
  position: response.position,
  startDate: response.startDate,
  endDate: response.endDate ?? "",
  location: response.location ?? "",
  description: response.description ?? "",
  responsibilities: response.responsibilities ?? "",
  isCurrent: response.isCurrent,
});

export default function ExperienceList() {
  const { data: allExperiencesResponse, isLoading: isLoadingAll, error: errorAll } = useResources<ExperienceResponse[]>("experiences");

  const deleteOne = useDeleteResource<ExperienceResponse>("experiences");
  const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);

  useEffect(() => {
    setExperiences(allExperiencesResponse?.data ?? []);
  }, [allExperiencesResponse]);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    experienceId: number | null;
  }>({
    open: false,
    experienceId: null,
  });

  const handleDeleteClick = (experienceId: number) => {
    setConfirmDelete({ open: true, experienceId });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.experienceId) {
      try {
        await deleteOne.mutateAsync(confirmDelete.experienceId);
      } catch (err) {
        console.error(err);
      }
    }
    setConfirmDelete({ open: false, experienceId: null });
  };

  const handleEditSave = async (updatedExperience: Experience) => {
   
  };

  return (
    <>
      {/* Timeline View */}
      <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:top-2 before:bottom-0 before:left-[9px] before:w-[2px] before:bg-gray-200">
        {experiences.map((exp) => (
          <div key={exp.experienceId} className="relative">
            <div className="absolute -left-8 top-0 w-5 h-5 rounded-full bg-portfolio-light-blue"></div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-portfolio-light-blue font-medium">{exp.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {exp.startDate.split("-")[0]} -{" "}
                      {exp.isCurrent ? "Present" : exp.endDate?.split("-")[0]}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{exp.location}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <ExperienceModal
                    experience={mapResponseToExperience(exp)}
                    trigger={
                      <Button variant="outline" size="icon">
                        <Pencil size={16} />
                      </Button>
                    }
                    onSave={handleEditSave}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDeleteClick(exp.experienceId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{exp.description}</p>
              <div className="mt-3">
                <h4 className="font-medium mb-2">Responsibilities:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(typeof exp.responsibilities === "string"
                    ? exp.responsibilities.split("\n")
                    : []
                  )
                    .filter((line) => line.trim() !== "")
                    .map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table View */}
      <div className="bg-white rounded-lg shadow mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp) => (
              <TableRow key={exp.experienceId}>
                <TableCell className="font-medium">{exp.company}</TableCell>
                <TableCell>{exp.position}</TableCell>
                <TableCell>
                  {exp.startDate.split("-")[0]} -{" "}
                  {exp.isCurrent ? "Present" : exp.endDate?.split("-")[0]}
                </TableCell>
                <TableCell>{exp.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <ExperienceModal
                      experience={mapResponseToExperience(exp)}
                      trigger={
                        <Button variant="outline" size="icon">
                          <Pencil size={16} />
                        </Button>
                      }
                      onSave={handleEditSave}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDeleteClick(exp.experienceId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        open={confirmDelete.open}
        onOpenChange={(open) =>
          setConfirmDelete({ open, experienceId: null })
        }
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </>
  );
}
