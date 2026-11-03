import type ts from 'typescript';

/** Semantic checking only: candidate code is parsed, never evaluated here. */
export function createReactTypeChecker(compiler: typeof ts, libraries: Record<string, string>) {
  const filename = '/solution.tsx';
  let source = '', version = 0;
  const options: ts.CompilerOptions = {
    strict: true, noEmit: true, skipLibCheck: true,
    target: compiler.ScriptTarget.ES2022, module: compiler.ModuleKind.ESNext,
    moduleResolution: compiler.ModuleResolutionKind.Bundler, jsx: compiler.JsxEmit.ReactJSX,
    esModuleInterop: true, types: ['react'], typeRoots: ['/node_modules/@types'],
  };
  const read = (file: string) => file === filename ? source : libraries[file];
  const service = compiler.createLanguageService({
    getScriptFileNames: () => [filename],
    getScriptVersion: file => file === filename ? String(version) : '0',
    getScriptSnapshot: file => { const text = read(file); return text === undefined ? undefined : compiler.ScriptSnapshot.fromString(text); },
    getCurrentDirectory: () => '/', getCompilationSettings: () => options,
    getDefaultLibFileName: () => '/lib.es2022.full.d.ts',
    fileExists: file => read(file) !== undefined, readFile: read,
    resolveModuleNames: (names, containingFile) => names.map(name => {
      const resolvedFileName = name === 'react' || (name === './' && containingFile.includes('/@types/react/')) ? '/node_modules/@types/react/index.d.ts'
        : name === 'react/jsx-runtime' ? '/node_modules/@types/react/jsx-runtime.d.ts'
        : name === 'csstype' ? '/node_modules/csstype/index.d.ts' : undefined;
      return resolvedFileName ? { resolvedFileName, extension: compiler.Extension.Dts } : undefined;
    }),
    directoryExists: directory => Object.keys(libraries).some(file => file.startsWith(`${directory}/`)),
  });
  return (code: string): string[] => {
    source = code; version++;
    if (code.length > 100000) return ['Code exceeds the 100,000 character limit.'];
    const file = compiler.createSourceFile(filename, code, compiler.ScriptTarget.ES2022, true, compiler.ScriptKind.TSX);
    const errors: string[] = [];
    const visit = (node: ts.Node) => {
      if (node.kind === compiler.SyntaxKind.AnyKeyword) errors.push('Explicit any is not allowed. Model the value or narrow unknown.');
      compiler.forEachChild(node, visit);
    };
    visit(file);
    const scanner = compiler.createScanner(compiler.ScriptTarget.ES2022, false, compiler.LanguageVariant.JSX, code);
    for (let token = scanner.scan(); token !== compiler.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
      if ((token === compiler.SyntaxKind.SingleLineCommentTrivia || token === compiler.SyntaxKind.MultiLineCommentTrivia)
        && /@ts-(?:ignore|expect-error|nocheck)\b/.test(scanner.getTokenText())) errors.push('TypeScript suppression directives are not allowed in this track.');
    }
    if (errors.length) return [...new Set(errors)];
    for (const diagnostic of [...service.getSyntacticDiagnostics(filename), ...service.getSemanticDiagnostics(filename)]) {
      const location = diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : undefined;
      errors.push(`${location ? `Line ${location.line + 1}:${location.character + 1} ` : ''}TS${diagnostic.code}: ${compiler.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
      if (errors.length >= 30) break;
    }
    return errors;
  };
}
