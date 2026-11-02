// CLI-only TypeScript loader. Never imported by the Next.js application.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, parent, ...rest) {
  return resolve.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : id, parent, ...rest);
};
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, file);
module.exports = { root, ts };
