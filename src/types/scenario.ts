import type { IncidentPlaybook, IncidentSimulation } from './incident';

export type ChallengeType = 
  | 'debugging' 
  | 'incident' 
  | 'coding' 
  | 'code_review' 
  | 'system_design' 
  | 'senior_interview';

export type Difficulty = 'Beginner' | 'Mid-Level' | 'Senior' | 'Staff/Principal';

export type Topic = 
  | 'JavaScript'
  | 'TypeScript'
  | 'React'
  | 'Next.js'
  | 'Node.js'
  | 'Databases'
  | 'Integrations'
  | 'Engineering Operations'
  | 'System Design'
  | 'Security';

export interface TestCase {
  id: string;
  name: string;
  inputDescription: string;
  expectedOutput: string;
  hidden?: boolean;
  explanation?: string;
  expectedError?: string;
}

export interface RubricCriteria {
  id: string;
  category: 'root_cause' | 'correctness' | 'code_quality' | 'security' | 'reliability' | 'testing' | 'tradeoffs';
  label: string;
  description: string;
  weight: number; // 1-5
  levels: {
    score: number; // 0, 1, 2, 3
    description: string;
  }[];
}

export interface IncidentTelemetry {
  logs: {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    service: string;
    message: string;
    metadata?: Record<string, any>;
  }[];
  metrics: {
    metricName: string;
    baseline: string;
    incidentPeak: string;
    unit: string;
    status: 'critical' | 'warning' | 'normal';
    trend: string;
  }[];
  customerReports: {
    id: string;
    reporter: string;
    impact: string;
    quote: string;
  }[];
  recentDeployments: {
    commitHash: string;
    author: string;
    message: string;
    timeAgo: string;
    diffSnippet?: string;
  }[];
}

export interface CodeReviewFile {
  filename: string;
  oldCode?: string;
  newCode: string;
  language: string;
  reviewPointsCount?: number;
  highlightLines?: number[];
}

export interface SystemDesignRequirement {
  scale: string;
  functional: string[];
  nonFunctional: string[];
  assumptions: string[];
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  expectedConcepts: string[];
  sampleStrongAnswer: string;
}

export interface Scenario {
  id: string;
  title: string;
  type: ChallengeType;
  topic: Topic;
  subtopic: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  businessContext: string;
  problemStatement: string;
  constraints: string[];
  candidateTasks: string[];
  
  // Specific data for challenge types
  starterCode?: string;
  codeLanguage?: string;
  /** JSX component exercises use DOM journeys rather than function-return tests. */
  reactExercise?: true;
  /** TSX components require semantic TypeScript checking before DOM execution. */
  reactTypescriptExercise?: true;
  /** Exact JSON/exception assertions in an opaque-origin per-case Worker. */
  javascriptExercise?: true;
  testCases?: TestCase[];
  incidentTelemetry?: IncidentTelemetry;
  incidentSimulation?: IncidentSimulation;
  incidentPlaybook?: IncidentPlaybook;
  codeReviewFiles?: CodeReviewFile[];
  systemDesignReqs?: SystemDesignRequirement;

  // Pedagogical & Evaluation assets
  hints: string[];
  rubric: RubricCriteria[];
  referenceSolution: {
    explanation: string;
    codeOrArtifact?: string;
    architectureNotes?: string;
  };
  alternativeApproaches: string[];
  commonMistakes: string[];
  followUpQuestions: FollowUpQuestion[];
}

