const fs = require('node:fs');
const path = require('node:path');

function exerciseKey(group, id, title) {
  // Descriptive application IDs already make good folder names.
  if (!/^(t1-[a-z]+-\d+|sql-(?:t|tier)\d+-\d+)$/.test(id)) return `${group}/${id}`;
  const slug = title.toLowerCase().replace(/^(what (?:is|are) |how (?:do|does) |explain )/, '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 76).replace(/-$/g, '');
  return `${group}/${slug || 'exercise'}--${id}`;
}

function resolveInside(destination, key) {
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(key)) throw new Error(`Unsafe exercise path: ${key}`);
  const base = path.resolve(destination);
  const result = path.resolve(base, key);
  if (!result.startsWith(base + path.sep)) throw new Error(`Exercise escapes practice directory: ${key}`);
  for (const candidate of [base, path.dirname(result), result]) {
    if (fs.existsSync(candidate) && fs.lstatSync(candidate).isSymbolicLink()) throw new Error(`Refusing linked practice directory: ${candidate}`);
  }
  return result;
}

function migrateFolders(destination, entries) {
  let previous = [];
  const manifest = path.join(destination, 'manifest.json');
  if (fs.existsSync(manifest)) previous = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  const moves = [];
  for (const entry of entries) {
    const target = resolveInside(destination, entry.key);
    const old = previous.find(item => item.group === entry.group && item.id === entry.id);
    const candidates = [...new Set([old?.key, entry.legacyKey].filter(key => key && key !== entry.key))]
      .map(key => resolveInside(destination, key)).filter(file => fs.existsSync(file));
    if (candidates.length > 1 || (candidates.length && fs.existsSync(target))) {
      throw new Error(`Both old and renamed folders exist for ${entry.id}. No folders were moved; reconcile them before generating.`);
    }
    if (candidates.length) moves.push({ from: candidates[0], to: target });
  }
  // Preflight the complete migration before moving anything. Whole-directory moves preserve notes and custom files.
  for (const move of moves) {
    fs.mkdirSync(path.dirname(move.to), { recursive: true });
    fs.renameSync(move.from, move.to);
  }
  return moves;
}

function selectEntries(entries, query) {
  if (!query || query === 'all') return entries;
  const exact = entries.filter(entry => [entry.key, entry.legacyKey, entry.id].includes(query));
  if (exact.length) return exact;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    const haystack = `${entry.key} ${entry.legacyKey} ${entry.title} ${entry.category} ${entry.language} ${entry.difficulty}`.toLowerCase();
    return terms.every(term => haystack.includes(term));
  });
}

module.exports = { exerciseKey, migrateFolders, selectEntries };
