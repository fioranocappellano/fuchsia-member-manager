
/**
 * Common type definitions used across the application
 */

/**
 * Member data type
 */
export interface Member {
  id: string;
  name: string;
  image: string;
  role: string;
  achievements?: string[];
  join_date: string;
  smogon?: string;
  position: number;
  created_at?: string;
}

/**
 * Game data type
 */
export interface Game {
  id: string;
  tournament: string;
  phase: string;
  format: string;
  players: string[];
  replay_url: string;
  image_url?: string;
  winner: string;
  stats?: string;
  description_en: string;
  description_it: string;
  position: number;
  created_at?: string;
}

/**
 * FAQ data type
 */
export interface FAQ {
  id: string;
  question_en: string;
  question_it: string;
  answer_en: string;
  answer_it: string;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Footer resource data type
 */
export interface FooterResource {
  id: string;
  title_en: string;
  title_it: string;
  url: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at?: string;
}

/**
 * User data type
 */
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Auth response data type
 */
export interface AuthResponse {
  user: User | null;
  session?: any;
  error?: string;
}
