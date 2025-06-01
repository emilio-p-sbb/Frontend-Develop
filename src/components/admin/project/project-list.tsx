// app/admin/projects/components/project-list.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input"; // Untuk search input
import { Project } from "@/types/project";
import { deleteProject, updateProject } from "@/app/admin/projects/action";
import ProjectModal from "./project-modal";

// Import Server Actions

interface ProjectListProps {
  projects: Project[]; // Data proyek dari Server Component
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Atur jumlah item per halaman

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    return projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  // Logika paginasi
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat pencarian
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id); // Panggil Server Action
        alert("Project deleted successfully!");
        // Revalidate dilakukan di Server Action, jadi halaman akan otomatis refresh
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleEditSave = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject); // Panggil Server Action
      alert("Project updated successfully!");
      // Revalidate dilakukan di Server Action
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {searchQuery && (
        <p className="text-sm text-gray-600 mb-4">
          Found {filteredProjects.length} projects matching "{searchQuery}"
        </p>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-1">
                    <span>Project</span>
                    <ArrowUpDown size={14} /> {/* Tambahkan fungsi sorting jika diperlukan */}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Technologies</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="hidden lg:table-cell w-[100px]">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{project.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[250px] md:max-w-none">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2 md:hidden">
                          {project.technologies.slice(0, 2).map((tech, i) => (
                            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{project.technologies.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {project.featured ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          Regular
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{project.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <ProjectModal
                          project={project}
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
                          onClick={() => handleDeleteClick(project.id)}
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
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}