import { Skill } from './skill.model';
import { Allocation } from './allocation.model';

export interface Developer {
  id?: number;
  name: string;
  email: string;
  role: string;
  skills?: Skill[];
  allocations?: Allocation[];
  skill_ids?: number[];
}

export interface DeveloperWorkload {
  developer_id: number;
  name: string;
  total_allocation: number;
}
