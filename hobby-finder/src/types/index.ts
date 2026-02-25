export type Locale = 'en' | 'ru' | 'fr';

export type LocalizedText = Record<Locale, string>;

export type OceanTrait = 'O' | 'C' | 'E' | 'A' | 'N';
export type RiasecTrait = 'R' | 'I' | 'Art' | 'S' | 'Ent' | 'Con';
export type AllTraits = OceanTrait | RiasecTrait;

export interface TraitImpacts {
  [key: string]: number;
}

export interface LikertQuestion {
  id: string;
  text: LocalizedText;
  image: string;
  impacts: Record<string, TraitImpacts>;
}

export interface VisualOption {
  id: string;
  image: string;
  impacts: TraitImpacts;
}

export interface VisualQuestion {
  id: string;
  prompt: LocalizedText;
  options: VisualOption[];
}

export interface ContextOption {
  id: string;
  text: LocalizedText;
  value: string;
}

export interface ContextQuestion {
  id: string;
  text: LocalizedText;
  image: string;
  options: ContextOption[];
}

export interface Hobby {
  id: string;
  name: LocalizedText;
  riasec: Record<RiasecTrait, number>;
  oceanBoost: Partial<Record<OceanTrait, number>>;
  time: string[];
  budget: string[];
  activity: string;
  description: LocalizedText;
}

export interface UserScores {
  ocean: Record<OceanTrait, number>;
  riasec: Record<RiasecTrait, number>;
}

export interface UserContext {
  time: string;
  budget: string;
  activity: string;
}

export interface Answer {
  questionId: string;
  value: string;
  timestamp: number;
}

export interface TestResult {
  id: string;
  scores: UserScores;
  context: UserContext;
  answers: Answer[];
  recommendedHobbies: string[];
  createdAt: string;
}

export type QuestionType = 'ocean' | 'riasec' | 'visual' | 'context';

export interface CurrentQuestion {
  type: QuestionType;
  index: number;
  total: number;
}
