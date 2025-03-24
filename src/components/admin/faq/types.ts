
export interface FAQ {
  id: string;
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
}

export interface NewFAQ {
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
}
