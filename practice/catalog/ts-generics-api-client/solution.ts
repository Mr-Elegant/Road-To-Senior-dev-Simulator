/**
 * Path Parameter Inference Utility Type
 */

// TODO: Define recursive template literal type ExtractRouteParams<T>
// Example: ExtractRouteParams<"/users/:id/posts/:slug"> => { id: string; slug: string }
export type ExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
  : T extends `${string}:${infer Param}`
  ? { [K in Param]: string }
  : Record<string, never>;

export class TypedApiClient {
  async get<TPath extends string>(
    path: TPath,
    params: ExtractRouteParams<TPath>
  ): Promise<string> {
    let resolvedPath: string = path;
    for (const [key, value] of Object.entries(params)) {
      resolvedPath = resolvedPath.replace(`:${key}`, encodeURIComponent(String(value)));
    }
    return resolvedPath;
  }
}

function solution(input) {
  const client = new TypedApiClient();
  return client.get('/tenants/:tenantId/invoices/:invoiceId', {
    tenantId: 't-100',
    invoiceId: 'inv-55'
  });
}