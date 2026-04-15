export interface User {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Task {
  id?: number;
  title: string;
  quadrant: 'UI' | 'UNI' | 'NUI' | 'NUNI';
  is_done: boolean;
  created_at?: string;
}

export interface Film {
  
  id?: number;
  title: string;
  director: string | null;
  genre: 'comedy' | 'drama' | 'thriller' | 'documentary' | 'scifi';
  status: 'want_to_watch' | 'watching' | 'watched';
  rating: number | null;
  added_at?: string;
}

export interface Book {
  id?: number;
  title: string;
  author: string;
  year: number | null;
  mood_tag: 'light' | 'deep' | 'educational' | 'fiction';
  status: 'want_to_read' | 'reading' | 'finished';
  added_at?: string;
}

export interface CheckIn {
  id?: number;
  sleep_hours: number;
  mood: number;
  food_quality: number;
  energy_level: number;
  notes: string;
  score?: number;
  date?: string;
}

export interface Recommendation {
  capacity_tier: 'High' | 'Medium' | 'Low';
  score: number;
  tasks: Task[];
  suggested_film: Film | null;
  suggested_book: Book | null;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  completion_rate_percent: number;
  tasks_per_quadrant: {
    UI: number;
    UNI: number;
    NUI: number;
    NUNI: number;
  };
}
