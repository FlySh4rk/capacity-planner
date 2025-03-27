export interface Skill {
  id?: number;
  name: string;
  category: string;
}

export interface TechnologyUsage {
  skill_id: number;
  name: string;
  category: string;
  developer_count: number;
}
