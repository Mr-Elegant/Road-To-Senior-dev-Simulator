import { RubricCriteria } from '@/types/scenario';
import { RubricScoreItem } from '@/types/userProgress';

export interface EvaluationSummary {
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
  categoryScores: Record<string, { earned: number; max: number; percentage: number }>;
  feedbackSummary: string[];
}

export function computeRubricScore(
  rubric: RubricCriteria[],
  scores: RubricScoreItem[]
): EvaluationSummary {
  const scoreMap = new Map<string, number>();
  for (const s of scores) {
    scoreMap.set(s.criteriaId, s.score);
  }

  let earnedPoints = 0;
  let maxPoints = 0;
  const categoryScores: Record<string, { earned: number; max: number; percentage: number }> = {};
  const feedbackSummary: string[] = [];

  for (const criteria of rubric) {
    const rawScore = scoreMap.get(criteria.id) ?? 0;
    const category = criteria.category;
    const weight = criteria.weight || 1;
    const criteriaMax = 3 * weight;
    const criteriaEarned = rawScore * weight;

    earnedPoints += criteriaEarned;
    maxPoints += criteriaMax;

    if (!categoryScores[category]) {
      categoryScores[category] = { earned: 0, max: 0, percentage: 0 };
    }
    categoryScores[category].earned += criteriaEarned;
    categoryScores[category].max += criteriaMax;

    // Detailed feedback
    const levelMatch = criteria.levels.find((l) => l.score === rawScore);
    if (levelMatch) {
      if (rawScore < 2) {
        feedbackSummary.push(
          `Area for Growth in [${criteria.label}]: ${levelMatch.description}`
        );
      }
    }
  }

  for (const cat in categoryScores) {
    const item = categoryScores[cat];
    item.percentage = item.max > 0 ? Math.round((item.earned / item.max) * 100) : 0;
  }

  const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  return {
    earnedPoints,
    maxPoints,
    percentage,
    categoryScores,
    feedbackSummary,
  };
}

