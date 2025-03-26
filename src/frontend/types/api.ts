
/**
 * User type for authentication
 */
export interface User {
  id: string;
  email: string;
  role?: string;
}

/**
 * Member type for team members
 */
export interface Member {
  id: string;
  name: string;
  role: string;
  smogon?: string;
  image: string;
  achievements: string[];
  join_date?: string;
  position: number; // Changed from optional to required
  created_at?: string;
  updated_at?: string;
}

/**
 * Game type for best games showcase
 */
export interface Game {
  id: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  winner: string;
  replay_url: string;
  image_url: string;
  description_en: string;
  description_it: string;
  position: number;
  created_at: string;
  updated_at: string; // Changed from optional to required
}

/**
 * Game form data type
 */
export interface GameFormData {
  tournament: string;
  phase: string;
  format: string;
  players: string;
  winner: string;
  replay_url: string;
  image_url: string;
  description_en: string;
  description_it: string;
  position: number; // Changed from optional to required
}

/**
 * FAQ type for frequently asked questions
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
 * New FAQ type for creating new entries
 */
export interface NewFAQ {
  question_en: string;
  question_it: string;
  answer_en: string;
  answer_it: string;
  position: number;
  is_active?: boolean;
}

/**
 * Footer resource type for footer links and resources
 */
export interface FooterResource {
  id: string;
  title_en: string;
  title_it: string;
  url: string;
  category: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}
