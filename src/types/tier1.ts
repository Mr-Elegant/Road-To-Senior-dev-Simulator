export type Tier1Category =
  | 'JavaScript Fundamentals'
  | 'HTML and CSS'
  | 'React Fundamentals'
  | 'Redux Toolkit Fundamentals'
  | 'TypeScript Fundamentals'
  | 'Node.js and API Fundamentals';

export type TierLevel = 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';

export interface TierInfo {
  id: TierLevel;
  name: string;
  badge: string;
  targetRole: string;
  experienceLevel: string;
  description: string;
  available: boolean;
  questionCountLabel: string;
}

export interface Tier1CodingExercise {
  instruction: string;
  starterCode: string;
  solutionCode: string;
  language: 'javascript' | 'typescript' | 'html' | 'css';
  sampleInput?: string;
  expectedOutput?: string;
  hints?: string[];
}

export interface Tier1Question {
  id: string;
  title: string;
  category: Tier1Category;
  difficulty: 'Beginner';
  tier: 'tier-1';
  order: number;
  expectedConcepts: string[];
  shortReferenceAnswer: string;
  practicalExample?: string;
  optionalFollowUp?: {
    question: string;
    expectedAnswer: string;
  };
  codingExercise?: Tier1CodingExercise;
  hints: string[];
}

export interface Tier1EvaluationResult {
  scoreOutOf100: number; // 0-100
  verdict: 'Mastered' | 'Review Needed' | 'Needs Practice';
  conceptualUnderstanding: string;
  technicalCorrectness: string;
  clarityOfExplanation: string;
  practicalApplication: string;
  encouragement: string;
  matchedConcepts: string[];
  missingConcepts: string[];
  actionableTips: string[];
  evaluatorType: 'gemini' | 'rubric-benchmark';
}

export interface Tier1Attempt {
  id: string;
  questionId: string;
  timestamp: string; // ISO string
  candidateAnswer: string;
  submittedCode?: string;
  evaluation: Tier1EvaluationResult;
  mode: 'practice' | 'mock';
  timeSpentSeconds: number;
}

export interface Tier1CategoryProgress {
  category: Tier1Category;
  totalQuestions: number;
  attempted: number;
  mastered: number; // score >= 70
  averageScore: number;
}

export interface Tier1ProgressData {
  attempts: Tier1Attempt[];
  bookmarkedQuestionIds: string[];
  lastActiveDate: string;
  totalScore: number;
}

export interface Tier1MockSummary {
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  readinessVerdict: 'Ready for Junior Roles' | 'Solid Foundations' | 'More Practice Needed';
  categoryBreakdown: {
    category: Tier1Category;
    attempted: number;
    avgScore: number;
  }[];
  topStrengths: string[];
  areasToRevisit: string[];
}

