export interface Skill {
  skillId?: number|undefined;
  name: string;
  proficiencyLevel: number; // 0-100
  category: string;
  yearsOfExperience: number;
  description?: string;
}

export interface SkillResponse {
  skillId: number;
  name: string;
  category: string;
  proficiencyLevel: number;
  yearsOfExperience: number;
  description: string;
}
