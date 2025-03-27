export interface Project {
  id?: number;
  name: string;
  description: string;
  start_date: string | Date;
  end_date?: string | Date;
  is_active: boolean;
}
