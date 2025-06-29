// app/admin/skills/page.tsx
// Ini adalah Server Component secara default.

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getSkills } from "./action";
import SkillModal from "@/components/admin/skill/skill-modal";
import SkillList from "@/components/admin/skill/skill-list";

// Import Server Action untuk mendapatkan data

export default async function AdminSkillsPage() {
  // Mengambil data skill menggunakan Server Action
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Skills</h1>
          {/* Search query akan ditangani oleh SkillList */}
        </div>
        {/* Tombol "Add New Skill" yang memicu modal */}
        <SkillModal
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus size={16} className="mr-2" />
              Add New Skill
            </Button>
          }
        />
      </div>

      {/* Menampilkan daftar skill menggunakan Client Component */}
      <SkillList/>
    </div>
  );
}