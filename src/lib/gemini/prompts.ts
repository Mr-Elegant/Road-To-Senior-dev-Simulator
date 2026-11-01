import { AiInterviewConfig, ConversationTurn, InterviewDifficulty } from '@/types/aiInterview';

export const SYSTEM_INSTRUCTION_INTERVIEWER = `You are a Principal Software Architect and Staff Hiring Committee Bar Raiser conducting a realistic technical interview.
Your role is to evaluate senior, staff, and lead engineering candidates with technical rigor, empathy, and clarity.
You value:
1. Production reality over textbook theory (failure modes, edge cases, distributed race conditions, operational maintainability).
2. Clean architectural trade-offs (latency vs consistency, simplicity vs flexibility, build vs buy).
3. Concrete engineering specifics (exact algorithms, SQL isolation levels, concurrency primitives, HTTP/2/3 semantics) rather than hand-waving buzzwords.

Tone: Professional, direct, collegiate, and rigorous. Keep responses concise and focused to save token bandwidth.`;

export function buildQuestionPrompt(config: AiInterviewConfig): string {
  if (config.difficulty === 'Beginner') {
    return `Generate an original, beginner-friendly technical interview question for a candidate interviewing for the role of "${config.role}" focusing on "${config.technology}".
The interview session duration is ${config.durationMinutes} minutes.

Requirements for the question:
1. Focus on core foundational concepts, essential syntax, or basic problem-solving (e.g. variables, functions, state vs props, semantic HTML, basic REST methods, or basic array manipulation).
2. Avoid complex enterprise architecture, distributed systems, or high-scale system design.
3. State the question clearly in simple, approachable language.
4. End with a practical prompt asking them to explain the concept in their own words and give a short example or use case.

Output format: Return ONLY the question text formatted cleanly in Markdown. Do not include answers or rubrics.`;
  }

  return `Generate an original, realistic ${config.difficulty}-level technical interview question for a candidate interviewing for the role of "${config.role}" specializing in "${config.technology}".
The interview session duration is ${config.durationMinutes} minutes.

Requirements for the question:
1. Frame it within a real-world enterprise business scenario (e.g. high-volume e-commerce, real-time messaging, financial ledger, SaaS subscriptions, or streaming telemetry).
2. It must test both deep technical knowledge and architectural decision-making.
3. Clearly state the business context, the concrete problem, and 2-3 specific technical constraints (e.g. zero-downtime, sub-50ms latency, exactly-once processing).
4. End with 1-2 focused questions asking how they would design or implement the solution and justify their trade-offs.

Output format: Return ONLY the question text formatted cleanly in Markdown. Do not include answers or rubrics.`;
}

export function buildEvaluationAndFollowUpPrompt(
  config: AiInterviewConfig,
  currentQuestion: string,
  history: { role: string; content: string }[],
  candidateAnswer: string,
  turnNumber: number,
  maxTurns: number
): string {
  const isLastTurn = turnNumber >= maxTurns;

  const historyContext = history
    .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
    .slice(-6)
    .join('\n\n');

  const isBeginner = config.difficulty === 'Beginner';

  return `Candidate is interviewing for: ${config.role} (${config.technology}, Level: ${config.difficulty}).
Current Turn: ${turnNumber} of ${maxTurns}.

CURRENT QUESTION:
${currentQuestion}

CONVERSATION CONTEXT:
${historyContext}

CANDIDATE'S LATEST ANSWER:
${candidateAnswer}

TASK:
1. Objectively evaluate the candidate's answer for ${
    isBeginner
      ? 'conceptual understanding, technical correctness, clarity of simple explanation, and practical application.'
      : 'technical correctness, understanding of edge cases, production trade-offs, and communication clarity.'
  }
2. Formulate 1-2 strengths and 1-2 constructive learning areas or missed points (use supportive, encouraging language suitable for beginners).
${
  isLastTurn
    ? `3. Since this is the final turn (${turnNumber}/${maxTurns}), provide a concluding remark thanking them for the discussion and noting that the interview is ready for final assessment.`
    : isBeginner
    ? `3. Formulate a friendly, practical follow-up question that builds on their answer (e.g. ask for a simple practical example, what happens in a specific common scenario, or when they would choose this approach).`
    : `3. Formulate a challenging, contextual follow-up question that directly references what the candidate said. Drill into a specific technical detail they glossed over, introduce a new real-world failure mode (e.g., "What happens if node X crashes?", "How would your solution handle a 10x traffic spike?", "What is the blast radius?"), or ask them to defend their choice over an alternative.`
}

You MUST reply with ONLY a valid JSON object strictly matching this schema:
{
  "technicalCorrectness": "Exemplary" | "Competent" | "Partially Flawed" | "Deficient",
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "gapsOrMisconceptions": ["Specific gap or unaddressed failure mode"],
  "scoreOutOf10": number (1 to 10),
  "followUpQuestion": "${isLastTurn ? 'Thank you for your responses. Let us proceed to the comprehensive evaluation.' : 'Your contextual follow-up question here'}"
}`;
}

export function buildHintPrompt(currentQuestion: string, history: { role: string; content: string }[]): string {
  return `The candidate has requested a hint on the following technical interview question:
"${currentQuestion}"

Provide a progressive guidance hint.
Rules:
1. Do NOT give away the answer or write the solution.
2. Ask a guiding question or highlight a key constraint (e.g., "Consider how the database isolation level affects concurrent updates" or "Think about what happens to in-flight requests during graceful shutdown").
3. Keep the hint under 3 sentences.`;
}

export function buildFinalAssessmentPrompt(
  config: AiInterviewConfig,
  history: { role: string; content: string }[]
): string {
  const fullTranscript = history
    .map((h) => `${h.role.toUpperCase()}:\n${h.content}`)
    .join('\n\n');

  return `You are the Hiring Committee Bar Raiser reviewing the full interview transcript for a candidate who completed a ${config.difficulty} interview for "${config.role}" specializing in "${config.technology}".

FULL TRANSCRIPT:
${fullTranscript}

Produce an authoritative, balanced Hiring Committee Scorecard.
Evaluate across:
- System Architecture & Design
- Technical Correctness & Edge Cases
- Production Readiness & Reliability
- Trade-off Analysis & Communication

You MUST reply with ONLY a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "hiringVerdict": "Strong Hire" | "Hire" | "Leaning Hire" | "Leaning No Hire" | "No Hire",
  "targetLevelAchieved": "Mid-Level" | "Senior" | "Staff/Principal",
  "executiveSummary": "2-3 sentences summarizing performance against the hiring bar.",
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalWeaknesses": ["Weakness or gap 1", "Weakness or gap 2"],
  "competencyBreakdown": {
    "systemArchitecture": { "score": number (0-100), "comment": "..." },
    "correctnessAndEdgeCases": { "score": number (0-100), "comment": "..." },
    "productionReadiness": { "score": number (0-100), "comment": "..." },
    "tradeoffAnalysis": { "score": number (0-100), "comment": "..." }
  },
  "actionableRoadmap": ["Concrete recommendation 1", "Concrete recommendation 2", "Concrete recommendation 3"],
  "disclaimer": "AI-generated assessment powered by Google Gemini Developer API. Performance scores represent simulated interview benchmarks and do not constitute an actual employment guarantee."
}`;
}

