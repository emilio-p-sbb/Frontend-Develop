import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: "arthamas",
    company: "PT. Arthamas Solusindo",
    position: "Java Software Engineer",
    period: "2018 – Present",
    description: [
      "Designed, developed, and maintained backend services using Java and Spring Boot, following microservices architecture.",
      "Created and integrated RESTful APIs to support cross-service communication and frontend-backend interaction.",
      "Collaborated with front-end developers and other backend teams to deliver reliable and scalable solutions.",
      "Maintained and improved existing applications to align with changing user and business requirements.",
      "Identified and resolved bugs and performance issues to ensure system stability.",
      "Utilized Git for version control and collaborative development in an agile environment.",
    ],
  },
  {
    id: "tridaya",
    company: "PT. Tridaya Asira",
    position: "Web Developer",
    period: "2015 – 2018",
    description: [
      "Involved in developing web applications for banking sector clients (ForBanking project) under a consulting company.",
      "Built applications using Java with Struts2 and Hibernate frameworks.",
      "Deployed and managed applications using Apache Tomcat.",
      "Worked with SQL Server and PostgreSQL databases.",
      "Conducted testing to ensure functionality and performance.",
      "Responsible for application maintenance and issue resolution post-deployment.",
      "Gained 3 years of experience throughout the full development lifecycle.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Work Experience</h2>

      <div className="mt-8 grid grid-cols-1 gap-6">
        {experiences.map((exp) => (
          <Card key={exp.id} className="border-0 shadow-md overflow-hidden card-hover">
            <div className="flex flex-col md:flex-row">
              <div className="bg-portfolio-navy text-white p-6 md:w-1/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <p className="text-portfolio-bright-blue mt-1">{exp.company}</p>
                </div>
                <div className="mt-4 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{exp.period}</span>
                </div>
              </div>

              <div className="p-6 md:w-2/3 bg-white">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="py-2 text-portfolio-navy hover:no-underline font-medium">
                      Key Responsibilities
                    </AccordionTrigger>

                    <AccordionContent className="text-gray-700">
                      <ul className="list-disc pl-5 space-y-2">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
