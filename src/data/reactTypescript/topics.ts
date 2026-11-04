import { frontendPracticeTopics } from '@/data/frontendPractice';

// Landing pages and topic redirects do not need the TSX answer bank or exercise builders.
export const reactTypescriptTopics = frontendPracticeTopics.filter(topic => topic.language === 'React.js')
  .map(topic => ({ ...topic, scenarioId: `react-ts-${topic.slug}` }));
