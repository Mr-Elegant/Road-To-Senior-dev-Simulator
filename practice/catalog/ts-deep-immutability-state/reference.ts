export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends ReadonlyArray<infer R>
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlySet<infer M>
  ? ReadonlySet<DeepReadonly<M>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
