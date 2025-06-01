// app/admin/settings/page.tsx
// Ini adalah Server Component secara default.

import AdminLayout from "@/components/admin/AdminLayout";
import { getUserSettings } from "./action";
import SettingsForm from "@/components/setting/setting-form";

// Ini akan dipanggil di sisi server
export default async function AdminSettingsPage() {
  const settingsData = await getUserSettings();

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account preferences and security settings</p>
          </div>
          {/* Tombol "Save Changes" akan berada di Client Component */}
        </div>

        {/* Meneruskan data pengaturan awal ke Client Component */}
        <SettingsForm initialSettingsData={settingsData} />
      </div>
  );
}