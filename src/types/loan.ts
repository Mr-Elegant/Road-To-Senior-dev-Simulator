export type LoanStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type LoanType = 'Personal' | 'Business' | 'Mortgage' | 'Vehicle' | 'Education';

export type RiskRating = 'LOW' | 'MEDIUM' | 'HIGH';

export type EmploymentStatus = 'Full-time' | 'Self-employed' | 'Contract' | 'Business Owner';

export interface LoanTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  note?: string;
  statusFrom?: LoanStatus;
  statusTo?: LoanStatus;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanAmount: number;
  currency: string;
  applicationDate: string; // ISO string
  loanType: LoanType;
  status: LoanStatus;
  creditScore: number;
  annualIncome: number;
  employmentStatus: EmploymentStatus;
  debtToIncomeRatio: number; // percentage (e.g., 28.5)
  riskRating: RiskRating;
  purpose: string;
  assignedOfficer: string;
  notes: string[];
  timeline: LoanTimelineEvent[];
  lastModified?: string;
}

export interface LoanFilters {
  search: string;
  status: LoanStatus | 'ALL';
  loanType: LoanType | 'ALL';
  riskRating: RiskRating | 'ALL';
  minAmount?: number;
  maxAmount?: number;
}

export type SortField = 'applicationDate' | 'loanAmount' | 'applicantName' | 'creditScore' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  requestId?: string;
  timestamp?: number;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
  approvedLoanAmount: number;
  pendingLoanAmount: number;
  approvalRate: number; // percentage
  avgCreditScore: number;
}

export interface SimulationConfig {
  latencyMs: number; // 0, 300, 800, 2000
  failureRate: number; // 0.0 to 1.0 (e.g. 0.25 = 25% failure)
  simulateRaceCondition: boolean;
  simulateNetworkDrop: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  autoDismissMs?: number;
}

export interface BugScenario {
  id: string;
  number: number;
  title: string;
  category: 'Concurrency' | 'Performance' | 'State Management' | 'Error Recovery' | 'UX/Pagination';
  description: string;
  productionSymptom: string;
  rootCause: string;
  solutionExplanation: string;
  buggyCodeSnippet: string;
  fixedCodeSnippet: string;
}

export interface InterviewRubricEvaluation {
  reduxArchitectureScore: number; // out of 20
  apiIntegrationScore: number; // out of 20
  reactComponentDesignScore: number; // out of 15
  raceConditionsAndErrorHandlingScore: number; // out of 15
  performanceOptimizationScore: number; // out of 10
  automatedTestingScore: number; // out of 10
  codeQualityScore: number; // out of 10
  totalScore: number; // out of 100
  strengths: string[];
  areasForGrowth: string[];
  overallVerdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Lean No Hire';
  detailedCritique: string;
}

