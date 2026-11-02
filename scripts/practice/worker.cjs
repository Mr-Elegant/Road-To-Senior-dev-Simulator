const fs = require('node:fs');
const { run } = require('./execute.cjs');
const { entry, code } = JSON.parse(fs.readFileSync(0, 'utf8'));
run(entry, code).then(result => {
  process.stdout.write(JSON.stringify(result), () => process.exit(0));
}).catch(error => { process.stderr.write(error.stack, () => process.exit(1)); });
