// app/admin/settings/actions.ts
"use server"; // HARUS DI BARIS PALING ATAS

import { UserSettings } from '@/types/user-setting';
import { revalidatePath } from 'next/cache';

// Simulasi database pengaturan pengguna
const mockUserSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  theme: "light",
  language: "en",
  privacyLevel: "public",
  twoFactorEnabled: true, // Contoh: dimulai dengan aktif
};

/**
 * Mengambil data pengaturan pengguna dari "database" (mock data).
 * @returns {Promise<UserSettings>} Data pengaturan pengguna.
 */
export async function getUserSettings(): Promise<UserSettings> {
  console.log("Server Action: Mengambil data pengaturan pengguna");
  // Simulasikan penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserSettings;
}

/**
 * Memperbarui data pengaturan pengguna di "database" (mock data).
 * @param {Partial<UserSettings>} dataUpdate Data yang akan diperbarui.
 * @returns {Promise<UserSettings>} Data pengaturan pengguna yang diperbarui.
 */
export async function updateSettings(dataUpdate: Partial<UserSettings>): Promise<UserSettings> {
  console.log("Server Action: Memperbarui pengaturan", dataUpdate);
  // Simulasikan penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Dalam aplikasi nyata, Anda akan:
  // 1. Memvalidasi dataUpdate
  // 2. Memperbarui record di database
  // 3. Menangani kesalahan

  // Untuk mock, kita hanya menggabungkan data
  Object.assign(mockUserSettings, dataUpdate);

  // Revalidate path untuk memastikan data terbaru ditampilkan
  revalidatePath('/admin/settings');

  return mockUserSettings;
}