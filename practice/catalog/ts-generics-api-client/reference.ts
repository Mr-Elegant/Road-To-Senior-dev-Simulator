export type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

export type RouteArgs<T extends string> = keyof ExtractRouteParams<T> extends never
  ? [path: T]
  : [path: T, params: { [K in keyof ExtractRouteParams<T>]: string }];

export class TypedApiClient {
  async get<TPath extends string>(...args: RouteArgs<TPath>): Promise<string> {
    const [path, params] = args;
    if (!params) return path;

    let resolved = path;
    for (const [k, v] of Object.entries(params)) {
      resolved = resolved.replace(`:${k}`, encodeURIComponent(String(v)));
    }
    return resolved;
  }
}
