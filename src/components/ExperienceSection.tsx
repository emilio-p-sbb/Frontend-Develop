import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { useResources } from "@/hooks/public/use-resource";
import { ExperienceResponse } from "@/types/experience";

export function ExperienceSection() {

  const { data: experiences, isLoading: isLoadingAll, error: errorAll } = useResources<ExperienceResponse[]>("experiences/public");

  return (

    <section id="experience" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Work Experience</h2>
      
      <div className="relative mt-8">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>
        
        <div className="space-y-8">
          {experiences?.data.map((experience, index) => (
            <div key={experience.experienceId} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-2 top-6 w-4 h-4 bg-portfolio-light-blue rounded-full border-4 border-white shadow-md hidden md:block"></div>
              
              <Card className="border-0 shadow-md md:ml-12 card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-portfolio-navy">
                        {experience.position}
                      </h3>
                      <p className="text-lg font-medium text-portfolio-light-blue">
                        {experience.company}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>
                           {experience.startDate.split("-")[0]} -{" "}
                           {experience.isCurrent ? "Present" : experience.endDate?.split("-")[0]}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{experience.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Key Responsibilities:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">

                      {(typeof experience?.responsibilities === "string"
                          ? experience.responsibilities.split("\n")
                          : []
                        )
                          .filter((line) => line.trim() !== "")
                          .map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
}
