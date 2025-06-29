'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText, Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useResources } from "@/hooks/public/use-resource";

interface Project {
  projectId: string;
  title: string;
  description: string;
  technologies: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
}

// const projectsData: Project[] = [
//   {
//     projectId: "project1",
//     title: "Banking System API",
//     description: "A comprehensive RESTful API for a banking system with transaction management and user authentication.",
//     technologies: ["Java", "Spring Boot", "PostgreSQL", "JWT"],
//     imageUrl: "placeholder.svg",
//     githubUrl: "#",
//     codeUrl: "/documents/banking-system-api.pdf",
//   },
//   {
//     projectId: "project2",
//     title: "Payment Gateway Integration",
//     description: "Microservice for handling payment gateway integrations with multiple providers.",
//     technologies: ["Java", "Spring Boot", "Kafka", "Redis"],
//     imageUrl: "placeholder.svg",
//     githubUrl: "#",
//     demoUrl: "#",
//     codeUrl: "/documents/payment-gateway.pdf",
//   },
//   {
//     projectId: "project3",
//     title: "User Management System",
//     description: "Centralized user management system with role-based access control.",
//     technologies: ["Java", "Spring Security", "PostgreSQL"],
//     imageUrl: "placeholder.svg",
//     githubUrl: "#",
//   },
// ];

function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="w-full max-w-4xl">
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + pdfUrl)}&embedded=true`}
        className="w-full h-[80vh]"
        frameBorder="0"
      ></iframe>
    </div>
  );
}

export function ProjectsSection() {

  const { data: projects, isLoading: isLoadingAll, error: errorAll } = useResources<Project[]>("projects/public");

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const handleOpenPdf = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
  };

  if (isLoadingAll) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  if (errorAll) {
    return <div className="text-center py-10 text-red-500">Failed to load projects.</div>;
  }

  if (!projects || projects.data.length === 0) {
    return <div className="text-center py-10 text-gray-500">No projects found.</div>;
  }

  return (
    <section id="projects" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Projects</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.data.map((project) => (
          <div key={project.projectId} className="project-card card-hover">
            <Card className="h-full border-0 shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-16 h-16 opacity-50"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-portfolio-navy">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.split(",").slice(0, 2).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-portfolio-blue text-xs rounded-full">
                      {tech}
                    </span>
                    ))}
                  
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={14} className="mr-1" />
                        Code
                      </a>
                    </Button>
                  )}

                  {project.codeUrl && (
                    <Button
                      size="sm"
                      className="bg-portfolio-navy hover:bg-portfolio-blue flex items-center text-xs"
                      asChild
                    >
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} className="mr-1" />
                        Live Demo
                      </a>
                    </Button>
                  )}

                  {project.codeUrl && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-portfolio-light-blue text-white hover:bg-portfolio-navy border-none flex items-center text-xs"
                        >
                          <FileText size={14} className="mr-1" />
                          Documentation
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="center">
                        <div className="flex flex-col space-y-2">
                          <h4 className="font-semibold text-sm">Project Documentation</h4>
                          <p className="text-xs text-gray-500">
                            View the documentation for this project.
                          </p>
                          <div className="flex justify-between mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex items-center"
                              asChild
                            >
                              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                                <FileText size={14} className="mr-1" />
                                Download PDF
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs bg-portfolio-navy hover:bg-portfolio-blue flex items-center"
                              onClick={() => handleOpenPdf(project.codeUrl!)}
                            >
                              <Eye size={14} className="mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 italic">More projects will be added soon.</p>
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Document Preview</h3>
              <Button variant="ghost" size="sm" onClick={handleClosePdf}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <PDFViewer pdfUrl={selectedPdf} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
