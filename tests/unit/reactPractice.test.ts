import { describe, expect, it } from 'vitest';
import { allScenarios } from '@/data';
import { reactFrameDocument, REACT_FRAME_SANDBOX } from '@/lib/reactPractice/runner';

describe('React component coding exercises', () => {
  const exercises = allScenarios.filter(s => s.id.startsWith('react-ui-'));
  it('exposes the first eight original component exercises in the existing catalog', () => {
    expect(exercises.map(s => s.id)).toEqual([
      'react-ui-password-feedback', 'react-ui-web-address', 'react-ui-tag-editor',
      'react-ui-project-progress', 'react-ui-loan-estimator', 'react-ui-help-panels',
      'react-ui-theme-switch', 'react-ui-recipe-browser',
    ]);
  });
  it('uses opaque-frame compatible bootstrap with no network or form access', () => {
    const document = reactFrameDocument();
    expect(document).toContain("connect-src 'none'");
    expect(document).toContain("form-action 'none'");
    expect(document).toContain('event.source !== parent');
    expect(document).not.toContain('https://');
    expect(REACT_FRAME_SANDBOX).toBe('allow-scripts allow-forms');
    expect(REACT_FRAME_SANDBOX).not.toContain('allow-same-origin');
  });
  it('supplies real interaction journeys and separate JSX starters and references', () => {
    for (const s of exercises) {
      expect(s.difficulty).toBe('Beginner');
      expect(s.codeLanguage).toBe('jsx');
      expect(s.starterCode).toContain('export default function App');
      expect(s.referenceSolution.codeOrArtifact).toContain('export default function App');
      expect(s.referenceSolution.codeOrArtifact).not.toBe(s.starterCode);
      expect(s.testCases!.length).toBeGreaterThanOrEqual(4);
      for (const c of s.testCases!) {
        const journey = JSON.parse(c.inputDescription);
        expect(journey.assertions.length).toBeGreaterThan(0);
        expect(c.expectedOutput).toBe('All DOM assertions passed');
      }
    }
  });
});
