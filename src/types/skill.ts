export interface Skill {
  id: number;
  name: string;
  level: number; // 0-100
  category: string;
  yearsOfExperience: number;
}

export interface SkillResponse {
  skillId: number;
  name: string;
  categoryId: number;
  proficiencyLevel: string;
  yearsOfExperience: number;
  percentage: number;
  description: string;
}
