import { SqlQuestion } from '@/types/sqlTrack';

export const SYSTEM_INSTRUCTION_SQL_INTERVIEWER = `You are a Principal PostgreSQL Database Architect and Staff Infrastructure Bar Raiser conducting a specialized SQL & PostgreSQL technical interview.
You value:
1. Physical Relational Execution: Understanding B-Tree pages, heap storage, MVCC xmin/xmax, visibility maps, and index scans.
2. Query Optimizer Realities: EXPLAIN ANALYZE interpretation, join strategies (Nested Loop vs Hash vs Merge), cost estimates, and buffer cache hits.
3. Production Concurrency & ACID: Lock trees, deadlocks, isolation levels (Read Committed, Repeatable Read, Serializable SSI), advisory locks, and VACUUM freeze wraparound.
4. Operational SRE Best Practices: Zero-downtime migrations (expand-and-contract, NOT VALID checks, CREATE INDEX CONCURRENTLY), replication lag, and connection pooling (PgBouncer).

Tone: Direct, deeply technical, collegiate, and constructive. Return structured JSON evaluation.`;

export function buildSqlEvaluationPrompt(
  question: SqlQuestion,
  candidateAnswer: string,
  candidateSql?: string
): string {
  return `EVALUATE CANDIDATE ANSWER FOR SQL / POSTGRESQL INTERVIEW QUESTION:

QUESTION TITLE: ${question.title}
DIFFICULTY: ${question.difficultyLabel} (${question.tier})
CATEGORY: ${question.category}

SCENARIO:
${question.realWorldScenario}

QUESTION STATEMENT:
${question.questionStatement}

EXPECTED CONCEPTS:
${question.expectedConcepts.map((c) => `- ${c}`).join('\n')}

REFERENCE ANSWER / SOLUTION:
${question.referenceAnswer}
${question.sqlSolution ? `\nSQL Solution:\n${question.sqlSolution}` : ''}

CANDIDATE SUBMITTED SQL:
${candidateSql ? candidateSql : 'None provided'}

CANDIDATE EXPLANATION / ANSWER:
${candidateAnswer}

EVALUATION RUBRIC:
- Correctness Weight: ${question.rubric.correctnessWeight}%
- Relational/Semantic Weight: ${question.rubric.semanticRelationalWeight}%
- Performance/Scale Weight: ${question.rubric.performanceWeight}%
- Edge Cases/Safety Weight: ${question.rubric.edgeCaseWeight}%
- Criteria: ${question.rubric.criteria.join(', ')}

Please evaluate the candidate's answer with technical rigor.
Respond ONLY with a valid JSON object matching this schema:
{
  "scoreOutOf100": number, // integer 0-100 based on the rubric
  "passed": boolean, // true if score >= 70
  "technicalCorrectness": "Detailed feedback on technical correctness and PostgreSQL accuracy",
  "strengths": ["string", "string"],
  "gapsOrMisconceptions": ["string", "string"],
  "followUpChallenge": "A pointed, deeper follow-up question testing an edge case or trade-off",
  "suggestedImprovement": "Concrete actionable advice for production readiness"
}`;
}

export function buildSqlIncidentDiagnosisPrompt(
  question: SqlQuestion,
  candidateAnalysis: string
): string {
  const incident = question.incidentDetails;
  return `EVALUATE CANDIDATE POST-MORTEM & INCIDENT DIAGNOSIS:

INCIDENT: ${question.title}
CATEGORY: ${question.category}

SYMPTOMS:
${incident?.symptoms.map((s) => `- ${s}`).join('\n') || 'None'}

TELEMETRY & LOGS:
- Active Connections: ${incident?.systemTelemetry.activeConnections || 'N/A'}
- Lock Waits: ${incident?.systemTelemetry.lockWaitsCount || 'N/A'}
- CPU Utilization: ${incident?.systemTelemetry.cpuUtilizationPercent || 'N/A'}%
- Log Snippet:
${incident?.systemTelemetry.logSnippet || 'None'}

CANDIDATE ROOT CAUSE ANALYSIS & MITIGATION:
${candidateAnalysis}

REFERENCE ROOT CAUSE & SAFEGUARDS:
${question.referenceAnswer}

Evaluate whether the candidate accurately identified the root cause, stopped immediate cascading failure, and proposed durable SRE architectural safeguards.
Respond ONLY with a valid JSON object:
{
  "scoreOutOf100": number,
  "passed": boolean,
  "rootCauseAccuracy": "Feedback on whether they correctly diagnosed the failure",
  "mitigationEvaluation": "Feedback on their immediate containment and long-term fix",
  "missingSafeguards": ["string"],
  "followUpIncidentScenario": "A cascading failure variation to test resilience"
}`;
}

export function getOfflineSqlEvaluation(
  question: SqlQuestion,
  candidateAnswer: string,
  candidateSql?: string
): {
  scoreOutOf100: number;
  passed: boolean;
  technicalCorrectness: string;
  strengths: string[];
  gapsOrMisconceptions: string[];
  followUpChallenge: string;
  suggestedImprovement: string;
} {
  const text = (candidateAnswer + ' ' + (candidateSql || '')).toLowerCase();

  // Deterministic keyword matching against expected concepts
  let matchedConcepts = 0;
  for (const concept of question.expectedConcepts) {
    const keywords = concept
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    const hit = keywords.some((kw) => text.includes(kw));
    if (hit) matchedConcepts++;
  }

  const matchRatio = question.expectedConcepts.length > 0
    ? matchedConcepts / question.expectedConcepts.length
    : 0.5;

  const lengthBonus = text.length > 80 ? 15 : (text.length > 40 ? 8 : 0);
  const scoreOutOf100 = Math.min(100, Math.max(25, Math.round(matchRatio * 75 + lengthBonus + 10)));
  const passed = scoreOutOf100 >= 70;

  return {
    scoreOutOf100,
    passed,
    technicalCorrectness: passed
      ? `Strong demonstration of relational mechanics. Candidate addressed ${matchedConcepts} of ${question.expectedConcepts.length} expected core architectural concepts.`
      : `Partial understanding. The response missed several key PostgreSQL internals and edge-case guarantees expected for this topic.`,
    strengths: [
      `Engaged with the core problem statement directly`,
      matchedConcepts > 0 ? `Demonstrated awareness of: ${question.expectedConcepts[0]}` : `Provided structured reasoning`
    ],
    gapsOrMisconceptions: passed
      ? [`Could further emphasize physical page layout or exact buffer cache metrics`]
      : [
          `Missing explicit reference to: ${question.expectedConcepts.slice(-2).join(', ')}`,
          `Ensure SQL queries account for NULL semantics and concurrency locks`
        ],
    followUpChallenge: question.followUp.question,
    suggestedImprovement: `Review the reference answer: ${question.referenceAnswer.substring(0, 180)}...`
  };
}
