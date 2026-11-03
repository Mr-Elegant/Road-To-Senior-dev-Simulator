import { describe, expect, it } from 'vitest';
import vm from 'node:vm';
import { javascriptExercises } from '@/data/frontendPractice/javascript';

describe('frontend JavaScript coding contracts', () => {
  for (const [slug, exercise] of Object.entries(javascriptExercises)) {
    it(`${slug}: complete reference passes each independently authored case`, async () => {
      expect(exercise.tests.length).toBeGreaterThanOrEqual(3);
      for (const fixture of exercise.tests) {
        const timers = new Set<ReturnType<typeof setTimeout>>();
        let actual: unknown, failure: unknown;
        try {
          const result = vm.runInNewContext(`${exercise.reference}\nsolution(input)`, {
            input: structuredClone(fixture.input), structuredClone,
            setTimeout: (callback: (...args: unknown[]) => void, delay: number) => { const id=setTimeout(callback,delay);timers.add(id);return id; }, clearTimeout,
          }, { timeout: 1500 });
          actual = await result;
        } catch (error) { failure = error; }
        finally { for (const timer of timers) clearTimeout(timer); }
        if (fixture.expectedError) expect((failure as Error)?.message, slug).toBe(fixture.expectedError);
        else {
          expect(failure, `${slug}: ${JSON.stringify(fixture.input)}`).toBeUndefined();
          expect(actual === undefined ? undefined : JSON.parse(JSON.stringify(actual)), slug).toEqual(fixture.expected);
        }
      }
    });
  }
});
