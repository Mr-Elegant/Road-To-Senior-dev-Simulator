import { describe, expect, it } from 'vitest';
import { parseLoanLabDraft } from '@/lib/loanLab/draft';
import { loanLabExercises } from '@/data/loanLabExercises';

const exercise = loanLabExercises[0];
const valid = { version: 1, code: 'function reduceSearch() {}', elapsedSeconds: 12, hintsRevealed: 1, referenceRevealed: false };
describe('loan lab draft validation', () => {
  it('restores code, timing and assistance without accepting cached grades', () => {
    expect(parseLoanLabDraft(JSON.stringify({ ...valid, score: 100 }), exercise)).toEqual(valid);
  });
  it('preserves an empty editor so syntax-error work is not replaced silently', () => {
    expect(parseLoanLabDraft(JSON.stringify({ ...valid, code: '' }), exercise)?.code).toBe('');
  });
  it('rejects invalid, stale, oversized and malformed drafts', () => {
    for (const raw of [null, 'broken json', '{}', 'null', JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, code: 'a'.repeat(100001) }), JSON.stringify({ ...valid, hintsRevealed: 999 }), JSON.stringify({ ...valid, elapsedSeconds: -1 }), JSON.stringify({ ...valid, referenceRevealed: 'false' })]) expect(parseLoanLabDraft(raw, exercise)).toBeNull();
  });
});
