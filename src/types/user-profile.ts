// lib/types.ts (tambahan di bagian bawah atau buat file baru jika diperlukan)

// ... (existing types like Experience, Project, Skill, Message, AnalyticsData)

// --- Tipe data baru untuk Profile ---
export interface UserProfile {
  userId: number;
  fullname: string;
  gender: string;
  email: string;
  profileAvatar: string;
  // avatar?: string | File;
  role: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  // skills: string[];
  // languages: string[];
  timezone: string;
}