/**
 * DeepReadonly Utility Type and Immutable Store
 */

export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends (...args: any[]) => any
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export class ImmutableStore<T extends object> {
  private state: DeepReadonly<T>;

  constructor(initial: T) {
    this.state = Object.freeze({ ...initial }) as unknown as DeepReadonly<T>;
  }

  getState(): DeepReadonly<T> {
    return this.state;
  }
}

function solution(input) {
  interface Portfolio {
    user: { name: string; settings: { currency: string } };
    assets: { symbol: string; allocation: number }[];
  }

  const store = new ImmutableStore<Portfolio>({
    user: { name: 'Alex', settings: { currency: 'USD' } },
    assets: [{ symbol: 'BTC', allocation: 0.6 }]
  });

  return store.getState().user.settings.currency;
}