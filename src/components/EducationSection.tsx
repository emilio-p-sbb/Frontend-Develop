import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar } from "lucide-react";
import { EducationResponse } from "@/types/education";
import { useResources } from "@/hooks/public/use-resource";
import { format } from "date-fns";


export function EducationSection() {

  const { data: educationData, isLoading: isLoadingAll, error: errorAll } = useResources<EducationResponse[]>("educations/public");

  const formatPeriod = (startDate: string, endDate: string, current: boolean) => {
    const startYear = format(new Date(startDate), "yyyy");
    const end = current ? "Present" : format(new Date(endDate), "yyyy");
    return `${startYear} – ${end}`;
  };


  return (
    <section id="education" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Education</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {educationData?.data.map((edu) => (
          <Card key={edu.educationId} className="border-0 shadow-md overflow-hidden card-hover">
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
                  <span>{formatPeriod(edu.startDate, edu.endDate, edu.current)}</span>
                </div>
                {edu.gpa && (
                  <p className="mt-2 text-gray-700 text-sm">{edu.gpa} {` from Scale 4.0`}</p>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
