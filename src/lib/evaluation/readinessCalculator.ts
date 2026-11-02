import { Scenario, Topic } from '@/types/scenario';
import { UserProgressData, InterviewReadinessReport } from '@/types/userProgress';

export function calculateReadinessReport(
  allScenarios: Scenario[],
  progress: UserProgressData
): InterviewReadinessReport {
  const attempts = progress.attempts || [];
  const completedMap = new Map<string, number>(); // scenarioId -> best score
  const scenarioIds = new Set(allScenarios.map((scenario) => scenario.id));

  for (const att of attempts) {
    if (!scenarioIds.has(att.scenarioId)) continue;
    const existing = completedMap.get(att.scenarioId) ?? 0;
    if (att.totalScorePercentage > existing) {
      completedMap.set(att.scenarioId, att.totalScorePercentage);
    }
  }

  // Topic metrics
  const topicStats: Record<string, { totalPossible: number; attemptedCount: number; sumScores: number }> = {};

  for (const s of allScenarios) {
    if (!topicStats[s.topic]) {
      topicStats[s.topic] = { totalPossible: 0, attemptedCount: 0, sumScores: 0 };
    }
    topicStats[s.topic].totalPossible += 1;
    if (completedMap.has(s.id)) {
      topicStats[s.topic].attemptedCount += 1;
      topicStats[s.topic].sumScores += completedMap.get(s.id)!;
    }
  }

  const topicBreakdown: Record<string, { accuracy: number; totalAttempts: number }> = {};
  const weakestCandidates: { topic: string; score: number }[] = [];
  const strongestCandidates: { topic: string; score: number }[] = [];

  for (const [topic, stats] of Object.entries(topicStats)) {
    const accuracy = stats.attemptedCount > 0 ? Math.round(stats.sumScores / stats.attemptedCount) : 0;
    topicBreakdown[topic] = {
      accuracy,
      totalAttempts: stats.attemptedCount,
    };

    if (stats.attemptedCount > 0) {
      if (accuracy < 70) {
        weakestCandidates.push({ topic, score: accuracy });
      } else if (accuracy >= 80) {
        strongestCandidates.push({ topic, score: accuracy });
      }
    } else {
      // Unattempted topics are potential gaps
      weakestCandidates.push({ topic, score: 0 });
    }
  }

  weakestCandidates.sort((a, b) => a.score - b.score);
  strongestCandidates.sort((a, b) => b.score - a.score);

  const weakestAreas = weakestCandidates.slice(0, 3).map((w) => w.topic);
  const strongestAreas = strongestCandidates.slice(0, 3).map((s) => s.topic);

  // Overall readiness estimate calculation
  // Factors:
  // 1. Completion breadth (up to 40%)
  // 2. Average score on completed challenges (up to 45%)
  // 3. Consistency / streak (up to 15%)
  const completionRatio = Math.min(1, completedMap.size / Math.max(1, allScenarios.length));
  let avgScore = 0;
  if (completedMap.size > 0) {
    let total = 0;
    for (const val of completedMap.values()) total += val;
    avgScore = total / completedMap.size;
  }
  const streakBonus = Math.min(15, (progress.streakDays || 0) * 3);

  const rawScore = Math.round(
    completionRatio * 40 + (avgScore / 100) * 45 + streakBonus
  );
  const overallReadinessScore = Math.min(100, Math.max(0, rawScore));

  let readinessTier: 'Foundational' | 'Intermediate' | 'Interview Ready' | 'Senior Benchmark' = 'Foundational';
  if (overallReadinessScore >= 85 && completedMap.size >= 12) {
    readinessTier = 'Senior Benchmark';
  } else if (overallReadinessScore >= 70 && completedMap.size >= 8) {
    readinessTier = 'Interview Ready';
  } else if (overallReadinessScore >= 45 || completedMap.size >= 3) {
    readinessTier = 'Intermediate';
  }

  // Recommended next challenges:
  // Prioritize uncompleted scenarios in the weakest topic, then senior/staff level
  const uncompleted = allScenarios.filter((s) => !completedMap.has(s.id) || (completedMap.get(s.id)! < 70));
  const recommendedInWeakTopics = uncompleted.filter((s) => weakestAreas.includes(s.topic));
  const recommended = (recommendedInWeakTopics.length > 0 ? recommendedInWeakTopics : uncompleted).slice(0, 4);

  return {
    overallReadinessScore,
    readinessTier,
    topicBreakdown,
    weakestAreas,
    strongestAreas,
    recommendedScenarioIds: recommended.map((s) => s.id),
    streakDays: progress.streakDays || 0,
    completedCount: completedMap.size,
    totalCount: allScenarios.length,
    disclaimer:
      'Practice performance provides structured skill benchmarking and interview readiness estimation. It is not an absolute or legally binding guarantee of interview performance, as live interviews encompass company-specific dynamics, communication nuance, and varying hiring bar rubrics.',
  };
}

