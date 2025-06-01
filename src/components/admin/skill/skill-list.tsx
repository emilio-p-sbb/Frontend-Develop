// app/admin/skills/components/skill-list.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Untuk search input
import { Skill, SkillResponse } from "@/types/skill";
import { deleteSkill, updateSkill } from "@/app/admin/skills/action";
import SkillModal from "./skill-modal";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useResourceList, useResources } from "@/hooks/use-resource";

// Import Server Actions

interface SkillListProps {
  skills: Skill[]; // Data skill dari Server Component
}

export default function SkillList({ skills }: SkillListProps) {

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const { data, isLoading } = useResources<SkillResponse>('skills');
    console.log('data skill json = '+JSON.stringify(data))

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;

    return skills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [skills, searchQuery]);

  const categories = useMemo(() => {
    return Array.from(new Set(filteredSkills.map(skill => skill.category)));
  }, [filteredSkills]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id); // Panggil Server Action
        alert("Skill deleted successfully!");
        // Revalidate dilakukan di Server Action, jadi halaman akan otomatis refresh
      } catch (error) {
        console.error("Failed to delete skill:", error);
        alert("Failed to delete skill. Please try again.");
      }
    }
  };

  const handleEditSave = async (updatedSkill: Skill) => {
    try {
      await updateSkill(updatedSkill); // Panggil Server Action
      alert("Skill updated successfully!");
      // Revalidate dilakukan di Server Action
    } catch (error) {
      console.error("Failed to update skill:", error);
      alert("Failed to update skill. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Input
          type="text"
          placeholder="Search skills by name or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {searchQuery && (
        <p className="text-sm text-gray-600 mb-4">
          Found {filteredSkills.length} skills matching "{searchQuery}"
        </p>
      )}

      {/* Categories Section */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">{category}</h2>
              <div className="space-y-3">
                {filteredSkills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress
                        value={skill.level}
                        style={{
                          "--progress-background": `linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)))`
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No skills available to display.</p>
        </div>
      )}

      {/* Skills Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="hidden lg:table-cell">Years Experience</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{skill.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">{skill.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{skill.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={skill.level}
                          className="w-20 sm:w-32"
                          style={{
                            "--progress-background": `linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)))`
                          } as React.CSSProperties}
                        />
                        <span className="text-sm">{skill.level}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{skill.yearsOfExperience} years</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <SkillModal
                          skill={skill}
                          trigger={
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil size={14} />
                            </Button>
                          }
                          onSave={handleEditSave} // Prop onSave diatur di Client Component
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 h-8 w-8"
                          onClick={() => handleDeleteClick(skill.id)}
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

        {/* Pagination - Dihapus karena paginasi tidak relevan untuk kategori, dan tabel sudah menampilkan semua filteredSkills */}
        {/* Jika Anda ingin paginasi, Anda perlu mengimplementasikan logika currentItems seperti di ProjectList */}
      </div>
    </>
  );
}