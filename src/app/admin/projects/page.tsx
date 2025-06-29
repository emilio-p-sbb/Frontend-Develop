// app/admin/projects/page.tsx
// Ini adalah Server Component secara default.

import ProjectModal from "@/components/admin/project/project-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectList from "@/components/admin/project/project-list";

// Import mock data dari Server Actions untuk digunakan di sini
// Atau Anda bisa memindahkan mock data ke file terpisah yang bisa diimpor di sini dan di actions.ts

export default async function AdminProjectsPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          {/* Search query akan ditangani oleh ProjectList */}
        </div>
        {/* Tombol "Add New Project" yang memicu modal */}
        <ProjectModal
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus size={16} className="mr-2" />
              Add New Project
            </Button>
          }
          // Tidak ada prop onSave di sini karena mutasi langsung dari modal/list
        />
      </div>

      {/* Menampilkan daftar proyek menggunakan Client Component */}
      <ProjectList />
    </div>
  );
}