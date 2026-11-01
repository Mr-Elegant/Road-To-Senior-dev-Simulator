export type InterviewDifficulty = 'Beginner' | 'Mid-Level' | 'Senior' | 'Staff/Principal';

export interface AiInterviewConfig {
  role: string;
  technology: string;
  difficulty: InterviewDifficulty;
  durationMinutes: number;
}

export interface TurnFeedback {
  technicalCorrectness: 'Exemplary' | 'Competent' | 'Partially Flawed' | 'Deficient';
  strengths: string[];
  gapsOrMisconceptions: string[];
  scoreOutOf10: number;
}

export interface ConversationTurn {
  id: string;
  role: 'interviewer' | 'candidate' | 'hint';
  content: string;
  timestamp: string;
  feedback?: TurnFeedback;
}

export interface CompetencyScore {
  score: number; // 0-100
  comment: string;
}

export interface AiInterviewAssessment {
  overallScore: number; // 0-100
  hiringVerdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Leaning No Hire' | 'No Hire';
  targetLevelAchieved: InterviewDifficulty;
  executiveSummary: string;
  topStrengths: string[];
  criticalWeaknesses: string[];
  competencyBreakdown: {
    systemArchitecture: CompetencyScore;
    correctnessAndEdgeCases: CompetencyScore;
    productionReadiness: CompetencyScore;
    tradeoffAnalysis: CompetencyScore;
  };
  actionableRoadmap: string[];
  disclaimer: string;
}

export interface AiInterviewSession {
  id: string;
  config: AiInterviewConfig;
  status: 'active' | 'evaluating' | 'completed';
  createdAt: string;
  currentTurn: number;
  maxTurns: number;
  currentQuestion: string;
  history: ConversationTurn[];
  finalAssessment?: AiInterviewAssessment;
}

export type AiInterviewAction = 'start' | 'reply' | 'hint' | 'evaluate';

export interface AiInterviewRequest {
  action: AiInterviewAction;
  config?: AiInterviewConfig;
  sessionState?: {
    config?: AiInterviewConfig;
    currentQuestion: string;
    history: { role: 'interviewer' | 'candidate' | 'hint'; content: string }[];
    currentTurn: number;
    maxTurns: number;
  };
  candidateAnswer?: string;
}

export interface AiInterviewResponse {
  success: boolean;
  isGeminiLive: boolean;
  modelUsed?: string;
  question?: string;
  hint?: string;
  turnFeedback?: TurnFeedback;
  assessment?: AiInterviewAssessment;
  isCompleted?: boolean;
  error?: string;
  isQuotaExhausted?: boolean;
}

