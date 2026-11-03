import rawTopics from './topics.json';
import type { FrontendPracticeTopic } from '@/types/frontendPractice';

/** Original teaching content. Source links identify the researched topic, not copied statements. */
export const frontendPracticeTopics = (rawTopics as FrontendPracticeTopic[]).map(topic => ({ ...topic, scenarioId: topic.scenarioId ?? `frontend-${topic.slug}` }));
const topicMap = new Map(frontendPracticeTopics.map(topic => [topic.slug, topic]));

export function getFrontendPracticeTopic(slug: string): FrontendPracticeTopic | undefined {
  return topicMap.get(slug);
}

export const frontendPracticeGroups = (['React.js', 'JavaScript'] as const).flatMap(language =>
  (['Easy', 'Medium', 'Hard'] as const).map(difficulty => ({
    id: `${language === 'React.js' ? 'react' : 'javascript'}-${difficulty.toLowerCase()}`,
    language,
    difficulty,
    count: frontendPracticeTopics.filter(topic => topic.language === language && topic.difficulty === difficulty).length,
  })),
);
