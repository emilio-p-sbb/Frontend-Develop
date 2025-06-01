// src/app/admin/experience/components/experience-list.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import ExperienceModal from './experience-modal';
import { deleteExperience, updateExperience } from "@/app/admin/experience/action";
import { Experience } from "@/types/experience";

// Import Server Actions dari file actions.ts

interface ExperienceListProps {
  experiences: Experience[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {

  const handleDeleteClick = async (id: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteExperience(id);
        alert("Experience deleted successfully!");
      } catch (error) {
        console.error("Failed to delete experience:", error);
        alert("Failed to delete experience. Please try again.");
      }
    }
  };

  const handleEditSave = async (updatedExperience: Experience) => {
    try {
      await updateExperience(updatedExperience);
      alert("Experience updated successfully!");
    } catch (error) {
      console.error("Failed to update experience:", error);
      alert("Failed to update experience. Please try again.");
    }
  };

  return (
    <>
      {/* Experience Timeline */}
      <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:top-2 before:bottom-0 before:left-[9px] before:w-[2px] before:bg-gray-200">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="absolute -left-8 top-0 w-5 h-5 rounded-full bg-portfolio-light-blue"></div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-portfolio-light-blue font-medium">{exp.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {exp.startDate.split('-')[0]} - {exp.current ? "Present" : exp.endDate?.split('-')[0]}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{exp.location}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <ExperienceModal
                    experience={exp}
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
                    onClick={() => handleDeleteClick(exp.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{exp.description}</p>
              <div className="mt-3">
                <h4 className="font-medium mb-2">Responsibilities:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experiences Table */}
      <div className="bg-white rounded-lg shadow">
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
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.company}</TableCell>
                <TableCell>{exp.position}</TableCell>
                <TableCell>
                  {exp.startDate.split('-')[0]} - {exp.current ? "Present" : exp.endDate?.split('-')[0]}
                </TableCell>
                <TableCell>{exp.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <ExperienceModal
                      experience={exp}
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
                      onClick={() => handleDeleteClick(exp.id)}
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
    </>
  );
}