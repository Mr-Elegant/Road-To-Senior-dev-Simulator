import { Tier1Question, Tier1EvaluationResult } from '@/types/tier1';

/**
 * Normalizes text for keyword matching
 */
function cleanText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

/**
 * Evaluates a candidate's answer using heuristic benchmark matching.
 * Transparently indicates it is evaluated via the Tier 1 Conceptual Rubric.
 */
export function evaluateTier1AnswerWithRubric(
  question: Tier1Question,
  answer: string,
  submittedCode?: string
): Tier1EvaluationResult {
  const trimmed = answer.trim();
  const cleanedAnswer = cleanText(trimmed);
  const wordsCount = trimmed ? trimmed.split(/\s+/).length : 0;

  // 1. Concept Keyword Matching
  const matchedConcepts: string[] = [];
  const missingConcepts: string[] = [];
  const answerTokens = cleanedAnswer.split(/\s+/).filter(Boolean);

  for (const concept of question.expectedConcepts) {
    const conceptWords = cleanText(concept)
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'that', 'this', 'from', 'over'].includes(w));

    // Flexible stem matching (e.g. reassign/reassignment, hoist/hoisted, mutate/mutability)
    const matchFound = conceptWords.some((w) => {
      if (cleanedAnswer.includes(w)) return true;
      const root = w.length > 5 ? w.slice(0, 5) : w;
      return answerTokens.some(
        (token) => token.startsWith(root) || (token.length > 4 && root.startsWith(token.slice(0, 4)))
      );
    });

    if (matchFound) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  }

  // 2. Score Calculation
  const conceptRatio =
    question.expectedConcepts.length > 0
      ? matchedConcepts.length / question.expectedConcepts.length
      : 0.5;

  let baseScore = Math.round(conceptRatio * 60);

  if (matchedConcepts.length > 0) {
    baseScore += 10; // Competence baseline for identifying key principles
  }

  // Depth / explanation quality bonus
  if (wordsCount >= 25) {
    baseScore += 20;
  } else if (wordsCount >= 15) {
    baseScore += 15;
  } else if (wordsCount >= 8) {
    baseScore += 10;
  } else if (wordsCount >= 3) {
    baseScore += 5;
  }

  // Code exercise bonus (if applicable)
  if (question.codingExercise && submittedCode && submittedCode.trim().length > 10) {
    const codeClean = cleanText(submittedCode);
    const solutionWords = cleanText(question.codingExercise.solutionCode)
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const codeMatchCount = solutionWords.filter((w) => codeClean.includes(w)).length;
    const codeRatio = solutionWords.length > 0 ? codeMatchCount / solutionWords.length : 0.5;
    if (codeRatio >= 0.5) {
      baseScore = Math.min(100, baseScore + 10);
    }
  }

  // Clamp score between 0 and 100
  const scoreOutOf100 = Math.max(15, Math.min(100, baseScore));

  // 3. Verdict
  let verdict: 'Mastered' | 'Review Needed' | 'Needs Practice' = 'Needs Practice';
  if (scoreOutOf100 >= 75) {
    verdict = 'Mastered';
  } else if (scoreOutOf100 >= 50) {
    verdict = 'Review Needed';
  }

  // 4. Supportive Feedback Synthesis
  let conceptualUnderstanding = '';
  let technicalCorrectness = '';
  let clarityOfExplanation = '';
  let practicalApplication = '';
  let encouragement = '';
  const actionableTips: string[] = [];

  if (verdict === 'Mastered') {
    conceptualUnderstanding =
      'Great job! You clearly demonstrated a solid grasp of the core concepts and fundamental mechanics.';
    technicalCorrectness =
      'Your explanation aligns well with technical standards and avoids common misconceptions.';
    clarityOfExplanation =
      'Your answer is concise, structured, and easy to follow using clear terminology.';
    practicalApplication =
      'You connected the theoretical definition to practical usage scenarios.';
    encouragement =
      'Outstanding work! You are ready to discuss this topic in an entry-level technical interview.';
    actionableTips.push(
      'To push your understanding even further, think about the optional follow-up question below.'
    );
  } else if (verdict === 'Review Needed') {
    conceptualUnderstanding = `You have the right general idea and identified key points (${matchedConcepts.join(
      ', '
    )}), but some important details could be clarified.`;
    technicalCorrectness =
      'Your answer is mostly on track, with minor gaps in specific syntax or execution mechanics.';
    clarityOfExplanation =
      'You communicated the general direction well; adding a short code example or concrete use case would make it much stronger.';
    practicalApplication =
      'Try linking this definition to a common daily situation you would encounter in a web application.';
    encouragement =
      'Good effort! You have a solid starting foundation here—take a quick glance at the reference solution to fill in the missing pieces.';
    if (missingConcepts.length > 0) {
      actionableTips.push(`Review these key concepts: ${missingConcepts.join(' • ')}`);
    }
    actionableTips.push('Consider reviewing the practical example to see how it is used in real code.');
  } else {
    conceptualUnderstanding =
      'Your response touches on the topic, but missed several core fundamentals that interviewers look for.';
    technicalCorrectness =
      'There are some key technical distinctions that need reinforcement.';
    clarityOfExplanation =
      'Try breaking your explanation into two parts: 1) What it is, and 2) Why developers use it.';
    practicalApplication =
      'Focus on the simplest practical example first before worrying about advanced edge cases.';
    encouragement =
      'Don’t be discouraged! This is exactly why we practice. Review the reference explanation and give it another try—you can retry this question anytime.';
    if (missingConcepts.length > 0) {
      actionableTips.push(`Key areas to study: ${missingConcepts.join(' • ')}`);
    }
    actionableTips.push('Read through the short reference answer and try re-answering in your own words.');
  }

  return {
    scoreOutOf100,
    verdict,
    conceptualUnderstanding,
    technicalCorrectness,
    clarityOfExplanation,
    practicalApplication,
    encouragement,
    matchedConcepts,
    missingConcepts,
    actionableTips,
    evaluatorType: 'rubric-benchmark',
  };
}

/**
 * Evaluates via Gemini API if available, or falls back to the rubric benchmark evaluator.
 */
export async function evaluateTier1Answer(
  question: Tier1Question,
  answer: string,
  submittedCode?: string
): Promise<Tier1EvaluationResult> {
  const { storage } = await import('@/lib/persistence/localStorageAdapter');
  if (!storage.getAccountId()) return evaluateTier1AnswerWithRubric(question, answer, submittedCode);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/ai-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        action: 'reply',
        candidateAnswer: `${answer}${submittedCode ? `\n\nCode:\n${submittedCode}` : ''}`,
        sessionState: {
          config: {
            role: 'Junior Full-Stack Engineer',
            technology: question.category,
            difficulty: 'Beginner',
            durationMinutes: 15,
          },
          currentQuestion: question.title,
          history: [],
          currentTurn: 1,
          maxTurns: 1,
        },
      }),
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.turnFeedback) {
        const tf = data.turnFeedback;
        const scoreOutOf100 = Math.min(100, Math.max(10, Math.round(tf.scoreOutOf10 * 10)));
        let verdict: 'Mastered' | 'Review Needed' | 'Needs Practice' = 'Needs Practice';
        if (scoreOutOf100 >= 75) verdict = 'Mastered';
        else if (scoreOutOf100 >= 50) verdict = 'Review Needed';

        return {
          scoreOutOf100,
          verdict,
          conceptualUnderstanding:
            tf.strengths && tf.strengths.length > 0
              ? tf.strengths.join(' ')
              : 'Demonstrates understanding of core principles.',
          technicalCorrectness: `Assessed as ${tf.technicalCorrectness || 'Competent'}.`,
          clarityOfExplanation: 'Evaluated dynamically by Gemini AI Interviewer.',
          practicalApplication: 'Feedback tailored to your specific response.',
          encouragement:
            scoreOutOf100 >= 70
              ? 'Great technical communication!'
              : 'Keep practicing—you are making steady progress.',
          matchedConcepts: question.expectedConcepts.filter((c) =>
            cleanText(answer).includes(cleanText(c).split(' ')[0])
          ),
          missingConcepts: tf.gapsOrMisconceptions || [],
          actionableTips: tf.gapsOrMisconceptions || ['Review the reference answer and try again.'],
          evaluatorType: 'gemini',
        };
      }
    }
  } catch (err) {
    console.warn('Gemini live evaluation unavailable, falling back to Tier 1 rubric benchmark:', err);
  }

  // Fallback to offline rubric benchmark
  return evaluateTier1AnswerWithRubric(question, answer, submittedCode);
}
