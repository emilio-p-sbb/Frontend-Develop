'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useResources } from "@/hooks/public/use-resource";

interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

export function SkillsSection() {

  const { data: skillsData, isLoading: isLoadingAll, error: errorAll } = useResources<SkillCategory[]>("skills/public");

  if (isLoadingAll) {
    return <div className="text-center py-10">Loading skills...</div>;
  }

  if (errorAll) {
    return <div className="text-center py-10 text-red-500">Failed to load skills.</div>;
  }

  if (!skillsData || skillsData.data.length === 0) {
    return <div className="text-center py-10 text-gray-500">No skills found.</div>;
  }

  return (
    <section id="skills" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {skillsData.data.map((category, index) => (
          <Card key={index} className="border-0 shadow-md overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-portfolio-navy to-portfolio-blue text-white p-4">
              <h3 className="text-lg font-semibold">{category.category}</h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {category.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-portfolio-navy">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}%</span>
                    </div>
                    <Progress
                      value={skill.level}
                      className="h-2"
                      style={{
                        '--progress-background': 'linear-gradient(to right, #2C74B3, #144272)',
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
