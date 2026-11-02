import type { LoanLabKind } from '@/types/loanLab';

/** Self-contained: serialized into a disposable worker, never run on candidate code in the app window. */
// The dynamic function boundary intentionally accepts heterogeneous exercise contracts.
export function executeLoanLabCase(candidate: (...args: any[]) => any, kind: LoanLabKind, input: any): unknown {
  function freeze(value: unknown): void {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
  }
  freeze(input);
  if (kind === 'reducer') {
    let state = input.initial;
    for (const action of input.actions) {
      freeze(state);
      state = candidate(state, action);
      if (!state || typeof state !== 'object' || typeof state.then === 'function') throw new Error('Return the next state synchronously. Do not mutate frozen input.');
    }
    return state;
  }
  if (kind === 'fetch-gate') return candidate(input.active, input.next);
  if (kind === 'sort') {
    const result = candidate(input.items, input.sorting);
    if (!Array.isArray(result)) throw new Error('Return a sorted array of loan objects.');
    return result.map((item) => item.id);
  }
  if (kind === 'selector') {
    const select = candidate();
    if (typeof select !== 'function') throw new Error('Return a selector function from createLoanSelector().');
    let state = { items: input.items, filters: input.filters, ui: {} };
    freeze(state);
    let previous = select(state);
    if (!Array.isArray(previous)) throw new Error('The selector must return an array of loans.');
    const observations = [{ ids: previous.map((item: { id: string }) => item.id), sameAsPrevious: null as boolean | null }];
    for (const step of input.steps) {
      state = { ...state, ...step, filters: { ...state.filters, ...step.filters } };
      freeze(state);
      const current = select(state);
      if (!Array.isArray(current)) throw new Error('The selector must return an array of loans.');
      observations.push({ ids: current.map((item: { id: string }) => item.id), sameAsPrevious: current === previous });
      previous = current;
    }
    return observations;
  }
  if (kind === 'refresh') {
    let state = input.initial;
    const requests: unknown[] = [];
    const refresh = candidate(() => state, (params: unknown) => { requests.push(params); });
    if (typeof refresh !== 'function') throw new Error('Return a refresh callback from createRefresh().');
    for (const event of input.events) {
      if (event.state) state = event.state;
      if (event.call) refresh();
    }
    return requests;
  }
  throw new Error('Unknown exercise contract.');
}

export function sameLoanLabOutput(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;
  if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return false;
  const keys = Object.keys(actual);
  const otherKeys = Object.keys(expected);
  return keys.length === otherKeys.length && keys.every((key) => Object.hasOwn(expected, key) && sameLoanLabOutput((actual as Record<string, unknown>)[key], (expected as Record<string, unknown>)[key]));
}
