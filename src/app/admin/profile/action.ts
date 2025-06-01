// app/admin/profile/actions.ts
"use server"; // HARUS DI BARIS PALING ATAS

import { UserProfile } from '@/types/user-profile';
import { revalidatePath } from 'next/cache';

// Simulasi database pengguna
const mockUserProfile: UserProfile = {
  id: "admin-123",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder-avatar.jpg", // Ganti dengan path avatar yang relevan
  role: "Administrator",
  bio: "Experienced full-stack developer with a passion for building scalable web applications. Always eager to learn new technologies.",
  phone: "+62 812-345-6789",
  location: "Jakarta, Indonesia",
  website: "https://johndoe.dev",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  githubUrl: "https://github.com/johndoe",
  twitterUrl: "https://twitter.com/johndoe",
  skills: ["React", "Next.js", "Node.js", "TypeScript", "Database Management"],
  languages: ["English", "Indonesian"],
  timezone: "Asia/Jakarta",
};

/**
 * Mengambil data profil pengguna dari "database" (mock data).
 * @returns {Promise<UserProfile>} Data profil pengguna.
 */
export async function getUserProfile(): Promise<UserProfile> {
  console.log("Server Action: Mengambil data profil pengguna");
  // Simulasikan penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserProfile;
}

/**
 * Memperbarui data profil pengguna di "database" (mock data).
 * @param {Partial<UserProfile>} dataUpdate Data yang akan diperbarui.
 * @returns {Promise<UserProfile>} Data profil pengguna yang diperbarui.
 */
export async function updateProfile(dataUpdate: Partial<UserProfile>): Promise<UserProfile> {
  console.log("Server Action: Memperbarui profil", dataUpdate);
  // Simulasikan penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Dalam aplikasi nyata, Anda akan:
  // 1. Memvalidasi dataUpdate
  // 2. Memperbarui record di database
  // 3. Menangani kesalahan (misalnya, email sudah ada)

  // Untuk mock, kita hanya menggabungkan data
  Object.assign(mockUserProfile, dataUpdate);

  // Revalidate path untuk memastikan data terbaru ditampilkan
  revalidatePath('/admin/profile');

  return mockUserProfile;
}