export interface Project {
  projectId: number;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
  demoUrl?: string;
  codeUrl?: string;
  featured: boolean;
}

export interface ProjectResponse {
  projectId: number;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
  demoUrl?: string;
  codeUrl?: string;
  featured: boolean;
  createdAt: string;
}