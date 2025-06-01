// app/admin/skills/actions.ts
"use server"; // HARUS DI BARIS PALING ATAS

import { Skill } from '@/types/skill';
import { revalidatePath } from 'next/cache';

// Mock data untuk Skills (dalam aplikasi nyata, ini akan berinteraksi dengan database)
const mockSkills: Skill[] = [
  {
    id: 1,
    name: "Java",
    level: 90,
    category: "Programming Languages",
    yearsOfExperience: 10,
  },
  {
    id: 2,
    name: "Spring Boot",
    level: 85,
    category: "Frameworks",
    yearsOfExperience: 8,
  },
  {
    id: 3,
    name: "PostgreSQL",
    level: 80,
    category: "Databases",
    yearsOfExperience: 9,
  },
  {
    id: 4,
    name: "Kafka",
    level: 70,
    category: "Message Brokers",
    yearsOfExperience: 5,
  },
  {
    id: 5,
    name: "Docker",
    level: 75,
    category: "DevOps",
    yearsOfExperience: 6,
  },
  {
    id: 6,
    name: "React",
    level: 65,
    category: "Frontend",
    yearsOfExperience: 4,
  },
];

// Fungsi untuk menyimpan skill baru
export async function saveSkill(newSkillData: Omit<Skill, 'id'>) {
    console.log("Server Action: Saving new skill", newSkillData);

    const newId = mockSkills.length > 0 ? Math.max(...mockSkills.map(s => s.id)) + 1 : 1;
    const skillToAdd = { id: newId, ...newSkillData };
    mockSkills.push(skillToAdd as Skill);

    revalidatePath('/admin/skills'); // Revalidate halaman setelah data berubah
    return skillToAdd;
}

// Fungsi untuk memperbarui skill
export async function updateSkill(updatedSkillData: Skill) {
    console.log("Server Action: Updating skill", updatedSkillData);

    const index = mockSkills.findIndex(s => s.id === updatedSkillData.id);
    if (index !== -1) {
        mockSkills[index] = updatedSkillData;
    }

    revalidatePath('/admin/skills'); // Revalidate halaman setelah data berubah
    return updatedSkillData;
}

// Fungsi untuk menghapus skill
export async function deleteSkill(id: number) {
    console.log("Server Action: Deleting skill with ID", id);

    const initialLength = mockSkills.length;
    const updatedSkills = mockSkills.filter(s => s.id !== id);
    mockSkills.splice(0, mockSkills.length, ...updatedSkills); // Replace content of mockSkills

    revalidatePath('/admin/skills'); // Revalidate halaman setelah data berubah
    return initialLength > updatedSkills.length;
}

// Fungsi untuk mendapatkan semua skill (dipanggil oleh page.tsx)
export async function getSkills(): Promise<Skill[]> {
    console.log("Server Action: Getting all skills");
    return mockSkills;
}