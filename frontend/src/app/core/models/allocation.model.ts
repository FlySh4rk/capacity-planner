export interface Allocation {
  id?: number;
  developer_id: number;
  project_id: number;
  start_date: string | Date;
  end_date: string | Date;
  allocation_percentage: number;
  developer_name?: string;
  project_name?: string;
}

export interface EndingAllocation {
  allocation_id: number;
  developer_id: number;
  developer_name: string;
  project_id: number;
  project_name: string;
  end_date: string | Date;
  days_remaining: number;
  allocation_percentage: number;
}

export interface DeveloperAvailability {
  developer_id: number;
  name: string;
  allocated_percentage: number;
  available_percentage: number;
}
