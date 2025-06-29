// app/admin/education/page.tsx
'use client';

import EducationList from "@/components/admin/education/education-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import EducationModal from "@/components/admin/education/education-modal";

export default function AdminEducationPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Education Management</h1>
          <p className="text-gray-500 mt-1">Manage your educational background and achievements</p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Education
        </Button>
      </div>

      <EducationList />

      {/* Modal untuk menambah education */}
      <EducationModal
        trigger={<></>} // tidak pakai trigger tombol
        education={undefined}
        onSave={async () => setOpen(false)}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
