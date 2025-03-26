
// Tipi condivisi tra frontend e backend

export interface Member {
  id: string;
  name: string;
  image: string;
  role: string;
  join_date?: string;
  achievements: string[];
  position: number;
  smogon?: string;
}

export interface Game {
  id: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  description_it: string;
  description_en: string;
  image_url: string;
  replay_url: string;
  position: number | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewFAQ {
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
}
