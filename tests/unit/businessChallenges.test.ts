import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { allScenarios, getScenarioById } from '@/data';
import { commerceScenarios } from '@/data/scenarios/commerce';
import { saasScenarios } from '@/data/scenarios/saas';
import type { Scenario, TestCase } from '@/types/scenario';
import { runClientSideTestSuite } from '@/lib/evaluation/safeCodeRunner';

// Only trusted repository-authored snippets run here, never candidate input.
function execute(code: string, test: TestCase, freeze = false) {
  const serialized = runInNewContext(
    `"use strict"; ${code}
     const input = ${test.inputDescription};
     function freezeDeep(value) {
       if (value && typeof value === 'object') {
         Object.values(value).forEach(freezeDeep);
         Object.freeze(value);
       }
     }
     if (${freeze}) freezeDeep(input);
     JSON.stringify(solution(input));`,
    {},
    { timeout: 1000 },
  );
  return JSON.parse(serialized);
}

const scenarios: Scenario[] = [...commerceScenarios, ...saasScenarios];

describe('E-commerce and SaaS challenges', () => {
  it('registers six distinct discoverable challenges', () => {
    expect(scenarios).toHaveLength(6);
    expect(new Set(allScenarios.map(({ id }) => id)).size).toBe(allScenarios.length);
    for (const scenario of scenarios) {
      expect(getScenarioById(scenario.id)).toBe(scenario);
      expect(scenario.title).toMatch(/E-commerce|SaaS/);
      expect(scenario.testCases!.length).toBeGreaterThanOrEqual(6);
      expect(scenario.testCases!.filter(({ hidden }) => !hidden).length).toBeGreaterThanOrEqual(2);
      expect(scenario.testCases!.some(({ hidden }) => hidden)).toBe(true);
    }
  });

  for (const scenario of scenarios) {
    describe(scenario.id, () => {
      for (const test of scenario.testCases ?? []) {
        it(test.name, () => {
          expect(execute(scenario.referenceSolution.codeOrArtifact!, test, true)).toEqual(JSON.parse(test.expectedOutput));
        });
      }

      it('starts with a reproducible behavioral bug', () => {
        const failures = scenario.testCases!.filter((test) => {
          try {
            return JSON.stringify(execute(scenario.starterCode!, test)) !== test.expectedOutput;
          } catch {
            return true;
          }
        });
        expect(failures.length).toBeGreaterThan(0);
      });
    });
  }

  it('runs all reference fixtures through the existing practice evaluator', async () => {
    for (const scenario of scenarios) {
      const result = await runClientSideTestSuite(scenario.referenceSolution.codeOrArtifact!, scenario.testCases!);
      expect(result.isSupported).toBe(true);
      expect(result.passedTests, scenario.id).toBe(scenario.testCases!.length);
    }
  });
});
