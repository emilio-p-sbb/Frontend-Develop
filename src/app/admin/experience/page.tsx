// src/app/admin/experience/page.tsx
// Ini adalah Next.js Server Component secara default.

import ExperienceList from "@/components/admin/experience/experience-list";
import ExperienceModal from "@/components/admin/experience/experience-modal";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/experience";
import { Plus } from "lucide-react";


export default async function AdminExperiencePage() {

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
      <ExperienceList />
    </div>
  );
}