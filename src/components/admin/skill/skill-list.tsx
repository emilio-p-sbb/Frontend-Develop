"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import SkillModal from "./skill-modal";
import { useResources, useResourceByParams } from "@/hooks/private/use-resource";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";
import { Skill } from "@/types/skill";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function SkillList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    skillId: number | null;
  }>({
    open: false,
    skillId: null,
  });

  const { data: allSkillsResponse, isLoading: isLoadingAll, error: errorAll } = useResources<Skill[]>("skills");
  const deleteOne = useDeleteResource<Skill>("skills");

  const {
    data: searchSkillsResponse,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useResourceByParams<Skill[]>(
    "skills",
    { keyword: searchTrigger },
    searchTrigger.length > 0
  );

  useEffect(() => {
    if (searchTrigger.length > 0) {
      setFilteredSkills(searchSkillsResponse?.data ?? []);
    } else {
      setFilteredSkills(allSkillsResponse?.data ?? []);
    }
  }, [searchTrigger, allSkillsResponse, searchSkillsResponse]);

  const categories = Array.from(
    new Set(filteredSkills.map((skill) => skill.category))
  );

  const handleSearchClick = () => {
    setSearchTrigger(searchQuery.trim());
  };

  const handleDeleteClick = (skillId: number) => {
    setConfirmDelete({ open: true, skillId });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.skillId) {
      try {
        await deleteOne.mutateAsync(confirmDelete.skillId);
      } catch (err) {
        console.error(err);
      }
    }
    setConfirmDelete({ open: false, skillId: null });
  };

  const handleEditSave = async (skill: Skill) => {
    // Optional: trigger refetch or update local state
  };

  if (isLoadingAll || isLoadingSearch) {
    return <p className="text-center py-10 text-gray-500">Loading skills...</p>;
  }

  if (errorAll || errorSearch) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load skills.</p>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4 gap-2">
        <Input
          placeholder="Search skills by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearchClick}>Search</Button>
      </div>

      {searchTrigger && (
        <p className="text-sm text-gray-600 mb-4">
          Found {filteredSkills.length} skill
          {filteredSkills.length !== 1 ? "s" : ""} matching "{searchTrigger}"
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">{category}</h2>
            <div className="space-y-3">
              {filteredSkills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <div key={skill.skillId} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiencyLevel}%
                      </span>
                    </div>
                    <Progress
                      value={skill.proficiencyLevel}
                      style={
                        {
                          "--progress-background": `linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)))`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Years Experience
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.skillId}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{skill.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {skill.category}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {skill.category}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={skill.proficiencyLevel}
                          className="w-20 sm:w-32"
                          style={
                            {
                              "--progress-background": `linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)))`,
                            } as React.CSSProperties
                          }
                        />
                        <span className="text-sm">
                          {skill.proficiencyLevel}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {skill.yearsOfExperience} years
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <SkillModal
                          skill={skill}
                          trigger={
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Pencil size={14} />
                            </Button>
                          }
                          onSave={handleEditSave}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8"
                          onClick={() => handleDeleteClick(skill?.skillId as number)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No skills found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ open, skillId: null })}
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </>
  );
}
