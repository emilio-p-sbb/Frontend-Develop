// lib/types.ts
export interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  responsibilities: string[];
  location: string;
  current: boolean;
}