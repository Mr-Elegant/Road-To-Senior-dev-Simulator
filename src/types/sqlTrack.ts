export type SqlTierLevel = 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';

export type SqlTierName =
  | 'Tier 1: Beginner SQL'
  | 'Tier 2: Intermediate SQL'
  | 'Tier 3: Advanced PostgreSQL'
  | 'Tier 4: Senior PostgreSQL & Production Engineering';

export type SqlCategory =
  | 'SQL Fundamentals'
  | 'Filtering, Sorting, and Aggregation'
  | 'Joins and Relationships'
  | 'Subqueries and CTEs'
  | 'Window Functions'
  | 'Database Design and Normalization'
  | 'PostgreSQL Data Types'
  | 'Indexes and Query Planning'
  | 'Transactions and ACID'
  | 'Isolation Levels and MVCC'
  | 'Locks and Deadlocks'
  | 'Query Optimization'
  | 'JSONB and PostgreSQL-specific features'
  | 'Partitioning and Large Tables'
  | 'Migrations and Schema Evolution'
  | 'Backup, Recovery, and Replication'
  | 'Production Debugging'
  | 'Database Security and Permissions';

export type SqlDatasetId = 'ecommerce' | 'loan_management' | 'saas_analytics';

export interface SqlTableColumn {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description?: string;
}

export interface SqlTableSchema {
  name: string;
  description: string;
  columns: SqlTableColumn[];
  sampleRowCount: number;
}

export interface SqlDataset {
  id: SqlDatasetId;
  name: string;
  tagline: string;
  description: string;
  schemaSql: string;
  seedSql: string;
  tables: SqlTableSchema[];
}

export interface SqlTestCase {
  id: string;
  description: string;
  setupSql?: string;
  expectedOutputSql?: string; // Query to produce ground truth
  expectedRows?: Record<string, any>[]; // Explicit ground truth rows
  orderMatters?: boolean;
}

export interface SqlEvaluationRubric {
  correctnessWeight: number; // e.g. 40
  semanticRelationalWeight: number; // e.g. 25
  performanceWeight: number; // e.g. 20
  edgeCaseWeight: number; // e.g. 15
  criteria: string[];
}

export interface SqlFollowUp {
  question: string;
  expectedAnswer: string;
  sqlSolution?: string;
}

export interface SqlIncidentDetails {
  symptoms: string[];
  systemTelemetry: {
    activeConnections?: number;
    lockWaitsCount?: number;
    cpuUtilizationPercent?: number;
    replicationLagBytes?: number;
    bufferCacheHitRatio?: number;
    logSnippet?: string;
  };
  queryPlan?: string;
  candidateTasks: string[];
}

export type SqlQuestionType = 'executable' | 'conceptual' | 'incident' | 'design';

export interface SqlQuestion {
  id: string;
  tier: SqlTierLevel;
  difficultyLabel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior/Staff';
  order: number;
  title: string;
  category: SqlCategory;
  questionType: SqlQuestionType;
  executionDialect?: 'generic-sql' | 'postgresql';
  datasetId?: SqlDatasetId;
  realWorldScenario: string;
  questionStatement: string;
  starterCode?: string;
  sqlSolution?: string;
  referenceAnswer: string;
  expectedConcepts: string[];
  hints: string[];
  followUp: SqlFollowUp;
  rubric: SqlEvaluationRubric;
  testCases?: SqlTestCase[];
  incidentDetails?: SqlIncidentDetails;
}

export interface SqlExecutionOutcome {
  passed: boolean;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  durationMs: number;
  engineUsed?: 'alasql' | 'pglite';
  error?: string;
  expectedRows?: Record<string, any>[];
  diffMessage?: string;
}

export interface IntrospectedColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey?: boolean;
}

export interface IntrospectedTable {
  name: string;
  rowCount: number;
  columns: IntrospectedColumn[];
}

export interface SqlAttempt {
  id: string;
  questionId: string;
  tier: SqlTierLevel;
  timestamp: string;
  mode: 'practice' | 'mock' | 'coding' | 'incident';
  candidateSql?: string;
  candidateAnswer?: string;
  scoreOutOf100: number;
  passed: boolean;
  feedback?: {
    technicalCorrectness: string;
    relationalSemantics?: string;
    performanceNotes?: string;
    strengths: string[];
    improvements: string[];
  };
  timeSpentSeconds: number;
}

export interface SqlTierProgress {
  attempts: SqlAttempt[];
  completedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  averageScore: number;
}

export interface SqlTrackProgressData {
  tier1: SqlTierProgress;
  tier2: SqlTierProgress;
  tier3: SqlTierProgress;
  tier4: SqlTierProgress;
  lastActiveDate: string;
  totalQuestionsCompleted: number;
}

