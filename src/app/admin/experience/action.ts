// src/app/admin/experience/actions.ts
"use server"; // <-- INI HARUS DI BARIS PALING ATAS

import { Experience } from '@/types/experience';
import { revalidatePath } from 'next/cache';

// Mock data (jika Anda masih menggunakannya untuk demo)
// Dalam aplikasi nyata, Anda akan berinteraksi dengan database di sini.
const mockExperiences: Experience[] = [
  {
    id: 1,
    company: "PT. Arthamas Solusindo",
    position: "Java Software Engineer",
    startDate: "2018-05-01",
    description: "Working on enterprise software solutions",
    responsibilities: [
      "Designed, developed, and maintained backend services using Java and Spring Boot",
      "Created and integrated RESTful APIs",
      "Collaborated with front-end developers",
      "Maintained and improved existing applications",
    ],
    location: "Jakarta, Indonesia",
    current: true,
  },
  {
    id: 2,
    company: "PT. Tridaya Asira",
    position: "Web Developer",
    startDate: "2015-01-01",
    endDate: "2018-04-30",
    description: "Developing web applications for banking sector clients",
    responsibilities: [
      "Built applications using Java with Struts2 and Hibernate frameworks",
      "Deployed and managed applications using Apache Tomcat",
      "Worked with SQL Server and PostgreSQL databases",
      "Conducted testing to ensure functionality and performance",
    ],
    location: "Jakarta, Indonesia",
    current: false,
  }
];

// Fungsi untuk menyimpan pengalaman baru
export async function saveExperience(newExperienceData: Omit<Experience, 'id'>) {
    console.log("Server Action: Saving new experience", newExperienceData);

    // Simulasi penambahan ID (dalam aplikasi nyata, DB akan menghasilkan ID)
    const newId = mockExperiences.length > 0 ? Math.max(...mockExperiences.map(e => e.id)) + 1 : 1;
    const experienceToAdd = { id: newId, ...newExperienceData };
    mockExperiences.push(experienceToAdd as Experience);

    revalidatePath('/admin/experience');
    return experienceToAdd;
}

// Fungsi untuk memperbarui pengalaman
export async function updateExperience(updatedExperienceData: Experience) {
    console.log("Server Action: Updating experience", updatedExperienceData);

    const index = mockExperiences.findIndex(exp => exp.id === updatedExperienceData.id);
    if (index !== -1) {
        mockExperiences[index] = updatedExperienceData;
    }

    revalidatePath('/admin/experience');
    return updatedExperienceData;
}

// Fungsi untuk menghapus pengalaman
export async function deleteExperience(id: number) {
    console.log("Server Action: Deleting experience with ID", id);

    const initialLength = mockExperiences.length;
    const updatedExperiences = mockExperiences.filter(exp => exp.id !== id);
    mockExperiences.splice(0, mockExperiences.length, ...updatedExperiences); // Replace content of mockExperiences

    revalidatePath('/admin/experience');
    return initialLength > updatedExperiences.length;
}