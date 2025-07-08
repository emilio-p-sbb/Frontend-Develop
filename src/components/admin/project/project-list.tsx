// app/admin/projects/components/project-list.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
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
import ProjectModal from "./project-modal";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";
import { useResourceByParams, useResources } from "@/hooks/private/use-resource";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";


export default function ProjectList() {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    projectId: number | null;
  }>({
    open: false,
    projectId: null,
  });

  const { data: allProjectsResponse, isLoading: isLoadingAll, error: errorAll } = useResources<Project[]>("projects");
  const deleteOne = useDeleteResource<Project>("projects");

  const {data: searchProjectsResponse, isLoading: isLoadingSearch, error: errorSearch} = useResourceByParams<Project[]>("projects",{ keyword: searchTrigger }, searchTrigger.length > 0);
  
    useEffect(() => {
      if (searchTrigger.length > 0) {
        setFilteredProjects(searchProjectsResponse?.data ?? []);
      } else {
        setFilteredProjects(allProjectsResponse?.data ?? []);
      }
    }, [searchTrigger, allProjectsResponse, searchProjectsResponse]);


    const handleSearchClick = () => {
      setSearchTrigger(searchQuery.trim());
    };
  
    const handleDeleteClick = (projectId: number) => {
      setConfirmDelete({ open: true, projectId });
    };
  
    const handleConfirmDelete = async () => {
      if (confirmDelete.projectId) {
        try {
          await deleteOne.mutateAsync(confirmDelete.projectId);
        } catch (err) {
          console.error(err);
        }
      }
      setConfirmDelete({ open: false, projectId: null });
    };
  
    const handleEditSave = async (projectId: Project) => {
      // Optional: trigger refetch or update local state
    };
  
    if (isLoadingAll || isLoadingSearch) {
      return <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>;
    }
  
    if (errorAll || errorSearch) {
      return (
        <p className="text-center py-10 text-red-500">Failed to load projects.</p>
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
          Found {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""} matching "{searchTrigger}"
        </p>
      )}

      {/* {searchQuery && (
        <p className="text-sm text-gray-600 mb-4">
          Found {filteredProjects.length} projects matching "{searchQuery}"
        </p>
      )} */}

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
                {/* <TableHead className="hidden lg:table-cell w-[100px]">Date</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{project.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[250px] md:max-w-none">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2 md:hidden">
                          {project.technologies.split(",").slice(0, 2).map((tech, i) => (
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
                        {project.technologies.split(",").map((tech, i) => (
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
                    {/* <TableCell className="hidden lg:table-cell">{project.createdAt}</TableCell> */}
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
                          onClick={() => handleDeleteClick(project.projectId)}
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
        {/* {totalPages > 1 && (
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
        )} */}


        <ConfirmationDialog
                open={confirmDelete.open}
                onOpenChange={(open) => setConfirmDelete({ open, projectId: null })}
                title="Delete project"
                description="Are you sure you want to delete this project? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                variant="destructive"
              />
      </div>
    </>
  );
}