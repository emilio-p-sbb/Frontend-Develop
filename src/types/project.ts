export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  codeUrl?: string;
  featured: boolean;
  createdAt: string;
}