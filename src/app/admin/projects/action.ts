// app/admin/projects/actions.ts
"use server"; // HARUS DI BARIS PALING ATAS

import { Project } from '@/types/project';
import { revalidatePath } from 'next/cache';

// Mock data untuk Proyek (dalam aplikasi nyata, ini akan berinteraksi dengan database)
const mockProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Backend",
    description: "RESTful API for an e-commerce platform built with Spring Boot",
    technologies: ["Java", "Spring Boot", "PostgreSQL"],
    imageUrl: "/placeholder.svg",
    demoUrl: "https://example.com",
    codeUrl: "https://github.com",
    featured: true,
    createdAt: "2023-05-10",
  },
  {
    id: 2,
    title: "Banking System",
    description: "Secure banking system with transaction management",
    technologies: ["Java", "Struts2", "PostgreSQL"],
    imageUrl: "/placeholder.svg",
    featured: false,
    createdAt: "2022-11-15",
  },
  {
    id: 3,
    title: "HR Management System",
    description: "Employee management application with attendance tracking",
    technologies: ["Java", "Spring Boot", "React", "PostgreSQL"],
    imageUrl: "/placeholder.svg",
    demoUrl: "https://example.com",
    featured: true,
    createdAt: "2023-02-21",
  },
  {
    id: 4,
    title: "Inventory Management",
    description: "Real-time inventory tracking system",
    technologies: ["Java", "Spring Boot", "Redis"],
    imageUrl: "/placeholder.svg",
    codeUrl: "https://github.com",
    featured: false,
    createdAt: "2022-08-05",
  },
];

// Fungsi untuk menyimpan proyek baru
export async function saveProject(newProjectData: Omit<Project, 'id' | 'createdAt'>) {
    console.log("Server Action: Saving new project", newProjectData);

    const newId = mockProjects.length > 0 ? Math.max(...mockProjects.map(p => p.id)) + 1 : 1;
    const projectToAdd = { id: newId, createdAt: new Date().toISOString().split('T')[0], ...newProjectData };
    mockProjects.push(projectToAdd as Project);

    revalidatePath('/admin/projects'); // Revalidate halaman setelah data berubah
    return projectToAdd;
}

// Fungsi untuk memperbarui proyek
export async function updateProject(updatedProjectData: Project) {
    console.log("Server Action: Updating project", updatedProjectData);

    const index = mockProjects.findIndex(p => p.id === updatedProjectData.id);
    if (index !== -1) {
        mockProjects[index] = updatedProjectData;
    }

    revalidatePath('/admin/projects'); // Revalidate halaman setelah data berubah
    return updatedProjectData;
}

// Fungsi untuk menghapus proyek
export async function deleteProject(id: number) {
    console.log("Server Action: Deleting project with ID", id);

    const initialLength = mockProjects.length;
    const updatedProjects = mockProjects.filter(p => p.id !== id);
    mockProjects.splice(0, mockProjects.length, ...updatedProjects);

    revalidatePath('/admin/projects'); // Revalidate halaman setelah data berubah
    return initialLength > updatedProjects.length;
}

// Fungsi untuk mendapatkan semua proyek (jika diperlukan untuk pengujian di luar page.tsx)
export async function getProjects(): Promise<Project[]> {
    console.log("Server Action: Getting all projects");
    return mockProjects;
}