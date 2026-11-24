export type ExerciseType = 'multiple-choice' | 'word-bank' | 'matching-pairs';

export interface MatchingPair {
  id: string;
  sq: string;
  de: string;
}

export interface WhyExplanation {
  title: string;
  ruleSummary: string;
  details: string;
  germanComparison?: string;
  exampleSq: string;
  exampleDe: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  sourceText?: string;
  sourceLanguage?: 'de' | 'sq';
  audioText?: string;
  // Multiple Choice
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  // Word Bank (Sentence Builder)
  targetSentence?: string;
  wordBankTiles?: string[];
  correctTileOrder?: string[];
  // Matching Pairs
  matchingPairs?: MatchingPair[];
  // Educational Explanation ("Warum?")
  whyExplanation: WhyExplanation;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  lessons: Lesson[];
}

export interface ReviewCard {
  id: string;
  sq: string;
  de: string;
  pronunciation?: string;
  grammarNote?: string;
  exampleSq?: string;
  exampleDe?: string;
  timesWrong: number;
  learned: boolean;
  addedAt: number;
  lastReviewedAt?: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  hearts: number;
  maxHearts: number;
  lastHeartLostTimestamp: number | null;
  completedLessonIds: string[];
  reviewCards: ReviewCard[];
  soundEnabled: boolean;
  dailyGoalXp: number;
  todayXp: number;
}

export interface TutorScenario {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  role: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  initialMessage: {
    content: string;
    translationDe: string;
  };
  suggestedPrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translationDe?: string;
  grammarFeedback?: string;
  timestamp: number;
}
