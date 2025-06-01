// lib/types.ts (tambahan di bagian bawah atau buat file baru jika diperlukan)

// ... (existing types like Experience, Project, Skill, Message, AnalyticsData, UserProfile)

// --- Tipe data baru untuk Settings ---
export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  theme: "light" | "dark" | "system";
  language: "en" | "id" | "es" | "fr";
  privacyLevel: "public" | "private";
  twoFactorEnabled: boolean;
}