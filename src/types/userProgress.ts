import { ChallengeType, Topic } from './scenario';
import { Tier1ProgressData } from './tier1';
import { SqlTrackProgressData } from './sqlTrack';

export interface RubricScoreItem {
  criteriaId: string;
  score: number; // 0 - 3
  notes?: string;
}

export interface AttemptSubmission {
  id: string;
  scenarioId: string;
  timestamp: string; // ISO string
  timeSpentSeconds: number;
  hintsUsedCount: number;
  
  // Specific user submission outputs
  submittedCode?: string;
  rootCauseAnalysis?: string;
  immediateMitigation?: string;
  permanentFix?: string;
  testingStrategy?: string;
  monitoringPlan?: string;
  reviewComments?: { line?: number; comment: string; category: string }[];
  systemDesignNotes?: {
    apiEndpoints?: string;
    dataSchema?: string;
    scalingStrategy?: string;
    tradeoffs?: string;
    nodesConfig?: string;
    failureScenarios?: string;
  };
  interviewAnswers?: Record<string, string>; // questionId -> answer

  // Evaluation outcome
  rubricScores: RubricScoreItem[];
  totalScorePercentage: number; // 0-100
  passedTestsCount: number;
  totalTestsCount: number;
  failedTestCases?: string[];
  selfAssessmentCompleted: boolean;
}

export interface TopicPerformance {
  topic: Topic;
  totalAvailable: number;
  attempted: number;
  passed: number; // >= 70%
  averageScore: number;
}

export interface UserProgressData {
  attempts: AttemptSubmission[];
  bookmarkedScenarioIds: string[];
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  customNotes?: Record<string, string>; // scenarioId -> candidate personal notes
  tier1Progress?: Tier1ProgressData;
  sqlProgress?: SqlTrackProgressData;
}

export interface InterviewReadinessReport {
  overallReadinessScore: number; // 0 - 100
  readinessTier: 'Foundational' | 'Intermediate' | 'Interview Ready' | 'Senior Benchmark';
  topicBreakdown: Record<string, { accuracy: number; totalAttempts: number }>;
  weakestAreas: string[];
  strongestAreas: string[];
  recommendedScenarioIds: string[];
  streakDays: number;
  completedCount: number;
  totalCount: number;
  disclaimer: string;
}
