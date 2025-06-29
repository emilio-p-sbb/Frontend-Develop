export interface EducationResponse {
  educationId: number;
  degree: string | null;
  institution: string | null;
  location: string;
  startDate: string; // ISO date string (e.g., "2023-06-21")
  endDate: string;   // ISO date string
  description: string | null;
  gpa: string | null;
  current: boolean;
  createdAt: string;       // ISO datetime format: "YYYY-MM-DDTHH:mm:ss"
  updatedAt: string;
}


export interface EducationRequest {
  educationId: number | null;
  degree: string | null;
  institution: string | null;
  location: string | null;
  startDate: string | null; // ISO date string "yyyy-MM-dd"
  endDate: string | null;   // ISO date string "yyyy-MM-dd"
  description: string | null;
  gpa: string | null;
  current: boolean;
  
}
