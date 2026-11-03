import { describe, expect, it } from 'vitest';
import { frontendPracticeTopics, frontendPracticeGroups, getFrontendPracticeTopic } from '@/data/frontendPractice';
import { getFrontendExercise } from '@/data/frontendPractice/exercises';
import { getScenarioById } from '@/data';
import research from '../../docs/research/namastedev-challenge-index.json';

describe('complete frontend practice bank', () => {
  it('covers every researched topic exactly once in all six track/difficulty groups', () => {
    expect(frontendPracticeTopics).toHaveLength(203);
    expect(new Set(frontendPracticeTopics.map(topic => topic.slug)).size).toBe(203);
    expect(frontendPracticeGroups.map(group => group.count)).toEqual([39, 60, 14, 36, 37, 17]);
    expect(frontendPracticeTopics.map(topic => [topic.sourceUrl, topic.title, topic.language, topic.difficulty]).sort()).toEqual(
      research.challenges.map(topic => [topic.url, topic.title, topic.language, topic.difficulty]).sort(),
    );
  });
  it('links all 203 topics to runnable complete scenarios, reusing the original eight React IDs', () => {
    for (const topic of frontendPracticeTopics) {
      const exercise = getFrontendExercise(topic.slug)!;
      expect(exercise, topic.slug).toBeDefined();
      expect(exercise.tests.length).toBeGreaterThanOrEqual(3);
      expect(exercise.reference.length).toBeGreaterThan(40);
      const scenario = getScenarioById(topic.scenarioId)!;
      expect(scenario, topic.slug).toBeDefined();
      expect(scenario.testCases).toHaveLength(exercise.tests.length);
      expect(Boolean(scenario.reactExercise || scenario.javascriptExercise)).toBe(true);
    }
    expect(frontendPracticeTopics.filter(topic => topic.scenarioId.startsWith('react-ui-'))).toHaveLength(8);
    expect(new Set(frontendPracticeTopics.map(topic=>topic.scenarioId)).size).toBe(203);
  });
  it('provides original questions, answers, concrete boundary checks and source attribution', () => {
    for (const topic of frontendPracticeTopics) {
      expect(topic.question.length).toBeGreaterThan(50);
      expect(topic.answer.length).toBeGreaterThan(200);
      expect(topic.checks.length).toBeGreaterThanOrEqual(4);
      expect(topic.followUp.length).toBeGreaterThan(50);
      expect(topic.sourceUrl).toBe(`https://namastedev.com/practice/${topic.slug}`);
      expect(getFrontendPracticeTopic(topic.slug)).toBe(topic);
    }
    expect(getFrontendPracticeTopic('__proto__')).toBeUndefined();
    expect(getFrontendPracticeTopic('not-a-topic')).toBeUndefined();
  });
});
