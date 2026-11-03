const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createReactTypeChecker } = require('../../src/lib/reactTypescript/check.ts');
let checker;
function checkTypescript(code) {
  if (!checker) {
    const libraries = {};
    const directory = path.dirname(ts.getDefaultLibFilePath({}));
    for (const file of fs.readdirSync(directory).filter(file => /^lib.*\.d\.ts$/.test(file))) libraries[`/${file}`] = fs.readFileSync(path.join(directory, file), 'utf8');
    for (const file of ['index.d.ts', 'global.d.ts', 'jsx-runtime.d.ts']) libraries[`/node_modules/@types/react/${file}`] = fs.readFileSync(path.join(__dirname, '../../node_modules/@types/react', file), 'utf8');
    libraries['/node_modules/csstype/index.d.ts'] = fs.readFileSync(path.join(__dirname, '../../node_modules/csstype/index.d.ts'), 'utf8');
    checker = createReactTypeChecker(ts, libraries);
  }
  return checker(code);
}
module.exports = { checkTypescript };
