import { describe, it, expect } from 'vitest';
import { runInNewContext } from 'node:vm';
import { collaborationScenarios } from '@/data/scenarios/collaboration';
import { getScenarioById } from '@/data';

function execute(code: string, input: string) {
  return JSON.parse(runInNewContext(`"use strict"; ${code}
    const input = ${input};
    function freeze(x) { if (x && typeof x === 'object') { Object.values(x).forEach(freeze); Object.freeze(x); } }
    freeze(input); JSON.stringify(solution(input));`, {}, { timeout: 1000 }));
}

describe('Real-Time Collaboration contracts', () => {
  it('registers eight distinct exercises with sample and edge cases', () => {
    expect(collaborationScenarios).toHaveLength(8);
    for (const s of collaborationScenarios) {
      expect(getScenarioById(s.id)).toBe(s);
      expect(s.testCases!.length).toBeGreaterThanOrEqual(7);
      expect(s.testCases!.some(t => t.hidden)).toBe(true);
      expect(s.referenceSolution.explanation.length).toBeGreaterThan(100);
    }
  });
  // Freeze all inputs and compare full structures; references cannot mutate fixtures.
  for (const s of collaborationScenarios) {
    for (const t of s.testCases!) it(`${s.id}: ${t.name}`, () => {
      expect(execute(s.referenceSolution.codeOrArtifact!, t.inputDescription)).toEqual(JSON.parse(t.expectedOutput));
    });
    it(`${s.id}: starter reproduces a failure`, () => {
      expect(s.testCases!.some(t => {
        try { return JSON.stringify(execute(s.starterCode!, t.inputDescription)) !== t.expectedOutput; }
        catch { return true; }
      })).toBe(true);
    });
  }
});
