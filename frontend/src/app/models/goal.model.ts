export interface Goal {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Progress {
  id: string;
  goal_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
}

export interface UpdateProgressRequest {
  completed: boolean;
  notes?: string;
}
