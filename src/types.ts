
export enum SectionType {
  MCQ = 'MCQ',
  VSA = 'VSA',
  SA_2 = 'SA_2',
  SA_3 = 'SA_3',
  LA_4 = 'LA_4'
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export interface Question {
  id: string;
  chapter: string;
  type: SectionType;
  marks: number;
  difficulty: Difficulty;
  content: string;
  options?: string[];
  imageUrl?: string;
  solution: string;
  examYear?: string;
}

export interface PaperSection {
  name: string;
  type?: SectionType;
  description: string;
  marksPerQuestion: number;
  requiredCount: number;
  totalPoolCount: number;
  questions: Question[];
  isSubQuestionGroup?: boolean;
}

export interface GeneratedPaper {
  id: string;
  title: string;
  subject: string;
  date: string;
  totalMarks: number;
  sections: PaperSection[];
  timeAllowed: string;
}

export interface BlueprintRule {
  id: string;
  name: string; // e.g. "Section A - MCQ"
  type: SectionType;
  requiredCount: number;
  marksPerQuestion: number;
  chapterFilter?: string; // "All" or specific chapter
}

export interface GenerationConfig {
  mode: 'generator' | 'past_year' | 'manual';
  class: string;
  selectedYear?: string;
  selectedMonth?: string;
  selectedChapters: string[];
  totalMarks: number;
  difficultyFocus: 'Standard' | 'Easy' | 'Challenging';
  headerTitle: string;
  subHeader: string;
  testDate: string;
  printTimestamp: string;
  watermark: string;
  watermarkImage?: string;
  watermarkRotation: number;
  watermarkOpacity: number;
  watermarkSize?: number;
  watermarkOffsetX?: number;
  watermarkOffsetY?: number;
  subject: string;
  timeAllowed: string;
  organizationName: string;
  showExamYear: boolean;
  fontSize: number;
  blueprint: BlueprintRule[];
}
