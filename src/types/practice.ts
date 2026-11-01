export type SupportedLanguage = 'javascript' | 'typescript' | 'sql' | 'python' | 'go' | 'rust';

export interface SqlDatabaseSetup {
  tableName: string;
  schemaSql: string;
  seedDataSql: string;
}

export interface PracticeTestCase {
  id: string;
  name: string;
  inputDescription: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  language: SupportedLanguage;
  difficulty: 'Mid-Level' | 'Senior' | 'Staff/Principal';
  category: string;
  estimatedMinutes: number;
  description: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  testCases: PracticeTestCase[];
  sqlSetup?: SqlDatabaseSetup[];
  hints: string[];
  referenceSolution: {
    code: string;
    explanation: string;
    timeComplexity?: string;
    spaceComplexity?: string;
  };
}

export interface ExecutionResultItem {
  testId: string;
  name: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  logs: string[];
  durationMs: number;
  errorMessage?: string;
  tableData?: Record<string, any>[]; // For SQL query results
}

export interface CodeExecutionSuiteResult {
  isConfigured: boolean;
  language: SupportedLanguage;
  statusMessage?: string;
  passedTests: number;
  totalTests: number;
  results: ExecutionResultItem[];
  overallDurationMs: number;
  hasErrors: boolean;
}

