'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

const skillsData: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Java", level: 95 },
      { name: "JavaScript", level: 80 },
      { name: "TypeScript", level: 75 }
    ]
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Spring Boot", level: 90 },
      { name: "Struts2", level: 85 },
      { name: "React", level: 70 },
      { name: "Next.js", level: 65 }
    ]
  },
  {
    category: "Web Technologies",
    skills: [
      { name: "RESTful APIs", level: 95 },
      { name: "JSON", level: 90 },
      { name: "HTML", level: 85 },
      { name: "CSS", level: 75 }
    ]
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "MySQL", level: 85 }
    ]
  },
  {
    category: "Other Technologies",
    skills: [
      { name: "Kafka", level: 80 },
      { name: "Redis", level: 75 },
      { name: "Git", level: 90 },
      { name: "Maven", level: 85 }
    ]
  }
];

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {skillsData.map((category, index) => (
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
