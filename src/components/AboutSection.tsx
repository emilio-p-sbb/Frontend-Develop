'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CodeIcon, ServerIcon } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">About Me</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="col-span-1 md:col-span-2">
          <Card className="border-0 shadow-md h-full card-hover">
            <CardContent className="p-6 md:p-8 text-gray-700 leading-relaxed">
              <p className="mb-4">
                Experienced Java Backend Developer with nearly 10 years of expertise in designing, developing, and maintaining high-performance backend systems. Proficient in building RESTful APIs using Spring and Spring Boot frameworks, with a solid foundation in Java programming and object-oriented design principles.
              </p>
              <p className="mb-4">
                Skilled in integrating and optimizing relational databases, particularly PostgreSQL, and experienced with various backend technologies, including Struts2, where I developed large monolithic web applications rather than just backend systems.
              </p>
              <p>
                Passionate about continuous learning and staying up-to-date with the latest trends in backend development, microservices architecture, and distributed systems.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <div className="grid grid-rows-2 gap-4 h-full">
            <Card className="border-0 shadow-md p-6 flex items-center bg-gradient-to-br from-portfolio-navy/90 to-portfolio-navy text-white card-hover">
              <div className="mr-4 bg-white/20 p-3 rounded-lg">
                <CodeIcon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Backend</h3>
                <p className="text-sm text-gray-200">Java Development Expert</p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-md p-6 flex items-center bg-gradient-to-br from-portfolio-light-blue/90 to-portfolio-light-blue text-white card-hover">
              <div className="mr-4 bg-white/20 p-3 rounded-lg">
                <ServerIcon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Microservices</h3>
                <p className="text-sm text-gray-100">Architecture Specialist</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
