// app/admin/profile/page.tsx
// Ini adalah Server Component secara default.

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/stores/adminStore"; // Import useAdminStore
import { getUserProfile } from "./action";
import ProfileForm from "@/components/admin/profile/profile-form";

// Ini akan dipanggil di sisi server
export default async function AdminProfilePage() {
  const profileData = await getUserProfile();

  // Karena page.tsx adalah Server Component, kita tidak bisa langsung menggunakan useAdminStore di sini.
  // Kita akan menanganinya di Client Component (ProfileForm) atau di layout.
  // Namun, jika Anda ingin mengatur judul halaman di sini, Anda bisa melakukannya secara dinamis.
  // document.title = "Profile | Portfolio Admin" tidak bekerja di Server Components.

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
          </div>
          {/* Tombol "Edit Profile" dan "Save/Cancel" akan berada di Client Component */}
        </div>

        {/* Meneruskan data profil awal ke Client Component */}
        <ProfileForm initialProfileData={profileData} />
      </div>
  );
}