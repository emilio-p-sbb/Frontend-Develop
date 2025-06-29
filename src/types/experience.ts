// lib/types.ts
export interface Experience {
  experienceId: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  responsibilities: string;
  location: string;
  isCurrent: boolean;
}

export interface ExperienceResponse {
  experienceId: number;
  company: string;
  position: string;
  location?: string;
  description?: string;
  responsibilities?: string; // disesuaikan dengan Java, meskipun idealnya ini bisa jadi string[]
  startDate: string;       // ISO date format: "YYYY-MM-DD"
  endDate: string;         // bisa nullable, jadi kamu bisa pakai `string | null` jika perlu
  isCurrent: boolean;
  createdAt: string;       // ISO datetime format: "YYYY-MM-DDTHH:mm:ss"
  updatedAt: string;
}
