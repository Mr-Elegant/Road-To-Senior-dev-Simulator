import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

async function fileStates(files) {
  return Promise.all([...new Set(files)].sort().map(async file => {
    try { const info = await stat(file); return { file, size: info.size, modified: info.mtimeMs }; }
    catch { return { file, missing: true }; }
  }));
}

/** Check file metadata before reading or bundling any large compiler/runtime files. */
export async function inspectAssetCache(manifestPath, inputs, outputs) {
  let previous;
  try { previous = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* First preparation. */ }
  const dependencies = previous?.dependencies ?? [];
  const [inputStates, outputStates] = await Promise.all([fileStates([...inputs, ...dependencies]), fileStates(outputs)]);
  const current = previous?.version === 1 && !outputStates.some(file => file.missing)
    && JSON.stringify(previous.inputs) === JSON.stringify(inputStates)
    && JSON.stringify(previous.outputs) === JSON.stringify(outputStates);
  return {
    current,
    async save(nextDependencies = dependencies) {
      const [updatedInputs, updatedOutputs] = await Promise.all([fileStates([...inputs, ...nextDependencies]), fileStates(outputs)]);
      await mkdir(path.dirname(manifestPath), { recursive: true });
      await writeFile(manifestPath, JSON.stringify({ version: 1, dependencies: nextDependencies, inputs: updatedInputs, outputs: updatedOutputs }));
    },
  };
}
