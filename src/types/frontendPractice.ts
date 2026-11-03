export interface FrontendPracticeTopic {
  slug: string;
  title: string;
  language: 'React.js' | 'JavaScript';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
  checks: string[];
  followUp: string;
  sourceUrl: string;
  scenarioId?: string;
}
