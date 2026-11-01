/**
 * Client-Side TypeScript Syntax Stripper
 * Enables execution of TypeScript coding challenges in the client-side sandbox
 * without requiring arbitrary code execution on the application server.
 */
export function stripTypeScriptTypes(tsCode: string): string {
  let js = tsCode;

  // 1. Remove interfaces
  js = js.replace(/interface\s+[A-Za-z0-9_<>,\s\n\r]+?\{[\s\S]*?\}/g, '');

  // 2. Remove type aliases: type X = ...;
  js = js.replace(/type\s+[A-Za-z0-9_<>,\s]+=\s*[\s\S]*?;/g, '');

  // 3. Remove "as" type assertions: "as string", "as any", "as const"
  js = js.replace(/\s+as\s+[A-Za-z0-9_<>[\]|,.\s]+/g, '');

  // 4. Remove generic type arguments on calls: fn<Type>(arg) -> fn(arg)
  js = js.replace(/<[A-Za-z0-9_,\s|&<>[\]]+>(?=\s*\()/g, '');

  // 5. Remove return type annotations: ): Promise<void> => or ): void {
  js = js.replace(/\):\s*[A-Za-z0-9_<>[\]|,.\s]+(?=\s*(=>|\{))/g, ') ');

  // 6. Remove parameter type annotations: (a: number, b: string) -> (a, b)
  js = js.replace(/(\w+)\s*:\s*[A-Za-z0-9_<>[\]|&,.\s]+(?=[,\)])/g, '$1');

  // 7. Remove variable type annotations: const x: number = 5 -> const x = 5
  js = js.replace(/(const|let|var)\s+(\w+)\s*:\s*[A-Za-z0-9_<>[\]|&,.\s]+(?=\s*=)/g, '$1 $2 ');

  // 8. Remove non-null assertion operators: x!.prop -> x.prop
  js = js.replace(/(\w+)!(\.|\()/g, '$1$2');

  return js;
}
