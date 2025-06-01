// src/app/admin/experience/page.tsx
// Ini adalah Next.js Server Component secara default.

import ExperienceList from "@/components/admin/experience/experience-list";
import ExperienceModal from "@/components/admin/experience/experience-modal";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/experience";
import { Plus } from "lucide-react";

// Import Server Actions dari file terpisah
// Anda hanya perlu mengimpornya untuk memastikan TypeScript mengenalinya jika Anda
// memanggilnya secara tidak langsung dari sini (misalnya di onSave di Client Component)
// Namun, di page.tsx, Anda tidak perlu mengimpornya karena tidak memanggilnya secara langsung.
// import { saveExperience, updateExperience, deleteExperience } from './actions'; // TIDAK PERLU DIIMPORT DI SINI


// Mock data (tetap di page.tsx karena ini adalah data yang akan diambil oleh Server Component)
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

export default async function AdminExperiencePage() {
  const experiences = mockExperiences; // Menggunakan mock data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Work Experience</h1>
        <ExperienceModal
          trigger={
            <Button>
              <Plus size={16} className="mr-2" />
              Add New Experience
            </Button>
          }
          // Tidak ada prop onSave di sini lagi
        />
      </div>

      <ExperienceList experiences={experiences} />
    </div>
  );
}