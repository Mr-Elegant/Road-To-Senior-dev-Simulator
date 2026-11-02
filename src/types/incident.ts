import type { IncidentTelemetry } from './scenario';

export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3';
export type IncidentOutcome = 'effective' | 'partial' | 'harmful' | 'timeout';

export interface IncidentConsequence {
  consequence: string;
  severity: IncidentSeverity;
  customerImpact: string;
  telemetry: IncidentTelemetry;
}

export interface IncidentOption extends IncidentConsequence {
  id: string;
  label: string;
  outcome: Exclude<IncidentOutcome, 'timeout'>;
}

export interface IncidentStage {
  id: string;
  atSeconds: number;
  title: string;
  briefing: string;
  branches: Partial<Record<IncidentOutcome, string>>;
  telemetry: IncidentTelemetry;
  options: IncidentOption[];
  timeout: IncidentConsequence;
  review: { recommendedOptionId: string; reasoning: string };
}

export interface IncidentSimulation {
  version: 1;
  initialSeverity: IncidentSeverity;
  stages: IncidentStage[];
  endSeconds: number;
}

export interface IncidentDecision {
  stageId: string;
  optionId: string | null;
  outcome: IncidentOutcome;
  atSeconds: number;
  rationale: string;
}

export interface IncidentRun {
  version: 1;
  elapsedSeconds: number;
  decisions: IncidentDecision[];
}

export interface IncidentPlaybook {
  diagnosis: string;
  evidence: string[];
  containment: string[];
  permanentFix: string[];
  verification: string[];
  regressionTests: string[];
  rollback: string[];
  communication: string[];
  sources: { title: string; url: string }[];
}
