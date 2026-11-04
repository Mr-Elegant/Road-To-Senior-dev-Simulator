import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import { nextjsPracticeScenarios } from '@/data/nextjsPractice';
import { foundationReviews } from '@/data/nextjsPractice/foundations';
import { applicationReviews } from '@/data/nextjsPractice/application';
import { productionReviews } from '@/data/nextjsPractice/production';
import { supplementalReviews } from '@/data/nextjsPractice/supplemental';
import { allScenarios } from '@/data';

describe('Next.js 15–16 curriculum', () => {
  it('includes 110 unique, integrated challenges with the promised progression and modes', () => {
    expect(nextjsPracticeScenarios).toHaveLength(110);
    expect(new Set(allScenarios.map((scenario) => scenario.id)).size).toBe(
      allScenarios.length,
    );
    expect(
      ['Beginner', 'Mid-Level', 'Senior', 'Staff/Principal'].map(
        (level) =>
          nextjsPracticeScenarios.filter((s) => s.difficulty === level).length,
      ),
    ).toEqual([22, 35, 33, 20]);
    expect(
      ['policy', 'framework-review', 'architecture'].map(
        (mode) =>
          nextjsPracticeScenarios.filter((s) => s.nextjsPractice?.mode === mode)
            .length,
      ),
    ).toEqual([20, 70, 20]);
    expect(nextjsPracticeScenarios.map((s) => s.nextjsPractice?.order)).toEqual(
      Array.from({ length: 110 }, (_, i) => i + 1),
    );
  });
  it('provides version notes, substantive references, acceptance evidence and answered interview changes', () => {
    for (const scenario of nextjsPracticeScenarios) {
      expect(scenario.nextjsPractice?.next15.length).toBeGreaterThan(40);
      expect(scenario.nextjsPractice?.next16.length).toBeGreaterThan(40);
      expect(
        scenario.nextjsPractice?.verification.length,
      ).toBeGreaterThanOrEqual(2);
      expect(scenario.referenceSolution.explanation.length).toBeGreaterThan(
        150,
      );
      expect(scenario.referenceSolution.codeOrArtifact?.length).toBeGreaterThan(
        40,
      );
      expect(
        scenario.followUpQuestions[0].sampleStrongAnswer.length,
      ).toBeGreaterThan(100);
      expect(
        scenario.nextjsPractice?.sources.every(
          (source) => new URL(source.url).hostname === 'nextjs.org',
        ),
      ).toBe(true);
      expect(
        new Set(scenario.nextjsPractice!.sources.map((source) => source.url))
          .size,
      ).toBe(scenario.nextjsPractice!.sources.length);
      if (scenario.nextjsPractice?.mode !== 'policy')
        expect(scenario.testCases).toBeUndefined();
    }
  });
  for (const scenario of nextjsPracticeScenarios.filter(
    (s) => s.javascriptExercise,
  )) {
    it(`executes all exact reference cases without mutation: ${scenario.id}`, () => {
      const solve = new Function(
        scenario.referenceSolution.codeOrArtifact + ';return solution;',
      )() as (input: unknown) => unknown;
      let failingStarter = false;
      for (const test of scenario.testCases!) {
        const input = JSON.parse(test.inputDescription),
          before = JSON.stringify(input),
          expected = JSON.parse(test.expectedOutput);
        expect(solve(input), test.name).toEqual(expected);
        expect(JSON.stringify(input), test.name + ' input ownership').toBe(
          before,
        );
        if (expected !== null) failingStarter = true;
      }
      expect(failingStarter).toBe(true);
    });
  }
  it('parses every corrected framework file (syntax evidence, not framework integration)', () => {
    for (const review of [
      ...foundationReviews,
      ...applicationReviews,
      ...productionReviews,
      ...supplementalReviews,
    ]) {
      expect(review.fixed).not.toBe(review.broken);
      if (review.file.endsWith('.json')) {
        expect(() => JSON.parse(review.fixed)).not.toThrow();
        continue;
      }
      const result = ts.transpileModule(review.fixed, {
        fileName: review.file,
        reportDiagnostics: true,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      });
      expect(
        (result.diagnostics ?? []).filter(
          (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
        ),
        review.slug,
      ).toEqual([]);
    }
  });
});
