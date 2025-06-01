import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar } from "lucide-react";

interface Education {
  id: string;
  period: string;
  institution: string;
  degree: string;
  details?: string;
}

const educationData: Education[] = [
  {
    id: "university",
    period: "2011 – 2014",
    institution: "UNIVERSITY OF NORTH SUMATERA",
    degree: "Bachelor Degree, Computer Science",
    details: "IPK : 3.30 from Scale 4.00",
  },
  {
    id: "diploma3",
    period: "2009 – 2011",
    institution: "AMIK STIEKOM OF NORTH SUMATERA",
    degree: "Bachelor Diploma - III, Informatics Management",
    details: "IPK : 3.16 from Scale 4.00",
  },
  {
    id: "diploma1",
    period: "2005 – 2006",
    institution: "AMIK TRIGUNA DHARMA OF MEDAN",
    degree: "Bachelor Diploma - I, Informatics Management",
  },
  {
    id: "highschool",
    period: "2001 - 2004",
    institution: "SMA NEGERI 1 SIBORONGBORONG",
    degree: "Senior High School",
  },
];

export function EducationSection() {
  return (
    <section id="education" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Education</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {educationData.map((edu) => (
          <Card key={edu.id} className="border-0 shadow-md overflow-hidden card-hover">
            <div className="flex flex-col md:flex-row h-full">
              <div className="bg-portfolio-blue text-white p-4 md:w-1/4 flex items-center justify-center">
                <Book className="w-10 h-10" />
              </div>
              <CardContent className="p-5 md:w-3/4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-portfolio-navy">{edu.degree}</h3>
                  <p className="text-portfolio-light-blue mt-1">{edu.institution}</p>
                </div>
                <div className="mt-3 flex items-center text-gray-500 text-sm">
                  <Calendar size={14} className="mr-2" />
                  <span>{edu.period}</span>
                </div>
                {edu.details && (
                  <p className="mt-2 text-gray-700 text-sm">{edu.details}</p>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
