const { root } = require('./load-source.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { allScenarios } = require('../../src/data/index.ts');
const { loanLabExercises } = require('../../src/data/loanLabExercises.ts');
const { loanBugScenarios } = require('../../src/data/loanBugScenarios.ts');
const { ALL_SQL_QUESTIONS } = require('../../src/data/sql/index.ts');
const { ALL_SQL_DATASETS } = require('../../src/data/sql/datasets/index.ts');
const { allTier1Questions } = require('../../src/data/tier1/index.ts');
const { practiceProblems } = require('../../src/data/practiceProblems.ts');
const { enterpriseLabs } = require('../../src/data/enterpriseLabs.ts');

const extensions = { javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts', jsx: 'jsx', tsx: 'tsx', sql: 'sql', python: 'py', html: 'html', css: 'css', go: 'go', rust: 'rs' };
function entry(group, source, language, starter, reference, mode) {
  const id = source.id ?? source.bugId;
  const key = `${group}/${id}`;
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(key)) throw new Error(`Unsafe exercise key: ${key}`);
  return { key, group, id, title: source.title, language, starter, reference, mode, source,
    ...(group === 'coding' && language === 'sql' ? { dialect: id === 'sql-top-n-per-category' ? 'postgresql' : 'generic-sql' } : {}),
    filename: starter !== undefined ? `solution.${extensions[language] ?? 'txt'}` : 'answer.md' };
}
const entries = [
  ...allScenarios.map(s => entry('catalog', s, (s.codeLanguage ?? '').toLowerCase(), s.starterCode,
    s.referenceSolution, s.reactExercise ? 'react' : /^(javascript|typescript|js|ts)$/.test((s.codeLanguage ?? '').toLowerCase()) && s.testCases?.length && /function\s+(solution|handler|solve|execute)\s*\(/.test(s.referenceSolution.codeOrArtifact ?? '') ? 'javascript' : 'guided')),
  ...loanLabExercises.map(s => {
    const bug = loanBugScenarios.find(b => b.id === s.bugId);
    return entry('loan', { ...s, businessContext: bug?.description, productionSymptom: bug?.productionSymptom, dashboardBuggyCode: bug?.buggyCodeSnippet }, 'javascript', s.starterCode,
      { code: s.referenceCode, rootCause: bug?.rootCause, explanation: bug?.solutionExplanation, dashboardFix: bug?.fixedCodeSnippet }, 'loan');
  }),
  ...ALL_SQL_QUESTIONS.map(s => entry('sql', s, 'sql', s.starterCode ?? (s.questionType === 'executable' ? '-- Write your query here.\n' : undefined),
    { answer: s.referenceAnswer, code: s.sqlSolution, followUp: s.followUp }, s.questionType === 'executable' && s.testCases?.length ? 'sql' : 'guided')),
  ...allTier1Questions.map(s => entry('beginner', s, s.codingExercise?.language, s.codingExercise?.starterCode,
    { answer: s.shortReferenceAnswer, example: s.practicalExample, code: s.codingExercise?.solutionCode, followUp: s.optionalFollowUp }, 'guided')),
  ...practiceProblems.map(s => entry('coding', s, s.language, s.starterCode, s.referenceSolution,
    s.language === 'sql' ? 'practice-sql' : s.language === 'python' ? 'python' : 'javascript')),
];

const answer = '# My answer\n\n## Diagnosis / approach\n\n## Proposed implementation or design\n\n## Evidence and tests\n\n## Failure modes and trade-offs\n\n## Follow-up answers\n';
function generate(destination = path.join(root, 'practice')) {
  fs.mkdirSync(destination, { recursive: true });
  const write = (relative, content, preserve = false) => {
    const file = path.join(destination, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!preserve || !fs.existsSync(file)) fs.writeFileSync(file, content, 'utf8');
  };
  for (const e of entries) {
    const s = e.source;
    const brief = s.problemStatement ?? s.questionStatement ?? s.contract ?? s.description ?? s.title;
    const context = s.businessContext ?? s.realWorldScenario;
    const bullets = values => (values ?? []).map(v => `- ${v}`).join('\n');
    const executable = e.mode !== 'guided';
    const details = { ...s };
    for (const field of ['referenceSolution', 'referenceCode', 'referenceAnswer', 'sqlSolution', 'shortReferenceAnswer', 'practicalExample', 'followUp', 'followUpQuestions', 'optionalFollowUp', 'incidentPlaybook', 'rubric']) delete details[field];
    if (details.codingExercise) {
      details.codingExercise = { ...details.codingExercise };
      delete details.codingExercise.solutionCode;
    }
    const followUps = s.followUpQuestions?.map(q => q.question) ?? (s.followUp ? [s.followUp.question] : s.optionalFollowUp ? [s.optionalFollowUp.question] : []);
    write(`${e.key}/README.md`, `# ${e.title}\n\nCollection: ${e.group} · ID: \`${e.id}\` · Mode: **${e.mode}**${e.dialect ? ` · Dialect: **${e.dialect}**` : ''}\n\n${context ? `## Business context\n\n${context}\n\n` : ''}## Task\n\n${brief}\n\n${s.codingExercise ? `${s.codingExercise.instruction}\n\n` : ''}${s.candidateTasks?.length ? `## Candidate tasks\n\n${bullets(s.candidateTasks)}\n\n` : ''}${s.constraints?.length ? `## Constraints\n\n${bullets(s.constraints)}\n\n` : ''}${followUps.length ? `## Follow-up questions\n\n${bullets(followUps)}\n\n` : ''}## Work locally\n\nEdit [${e.filename}](${e.filename})${e.filename !== 'answer.md' ? ' and record your reasoning in [answer.md](answer.md)' : ''}. Keep the original function names and input/output contracts.\n\n${executable ? `Run from the repository root:\n\n\`\`\`sh\nnpm run practice:test -- ${e.key}\nnpm run practice:watch -- ${e.key}\n\`\`\`\n\nCases are visible in [test-cases.json](test-cases.json).` : 'This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.'}\n\nFull authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).\n\nAfter your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.\n`);
    write(`${e.key}/exercise.json`, JSON.stringify(details, null, 2) + '\n');
    write(`${e.key}/test-cases.json`, JSON.stringify(s.testCases ?? s.tests ?? [], null, 2) + '\n');
    write(`${e.key}/reference.md`, `# Reference: ${e.title}\n\nRead after attempting the exercise. This is authored guidance, not certification.\n\n\`\`\`json\n${JSON.stringify({ solution: e.reference, rubric: s.rubric, playbook: s.incidentPlaybook, alternatives: s.alternativeApproaches, commonMistakes: s.commonMistakes, followUps: s.followUpQuestions, expectedConcepts: s.expectedConcepts }, null, 2)}\n\`\`\`\n`);
    const referenceCode = e.reference?.code ?? e.reference?.codeOrArtifact;
    if (referenceCode) write(`${e.key}/reference.${extensions[e.language] ?? 'txt'}`, referenceCode + '\n');
    write(`${e.key}/${e.filename}`, e.starter ?? answer, true);
    if (e.filename !== 'answer.md') write(`${e.key}/answer.md`, answer, true);
  }
  for (const ds of ALL_SQL_DATASETS) {
    write(`datasets/${ds.id}/schema.sql`, ds.schemaSql + '\n');
    write(`datasets/${ds.id}/seed.sql`, ds.seedSql + '\n');
  }
  write('manifest.json', JSON.stringify(entries.map(({ source, starter, reference, ...e }) => e), null, 2) + '\n');
  write('INDEX.md', '# Local practice index\n\nGenerated from the application collections. Search this file in VS Code, or use `npm run practice:list -- <search>`.\n\n' +
    ['catalog', 'loan', 'sql', 'beginner', 'coding'].map(group => `## ${group} (${entries.filter(e => e.group === group).length})\n\n` + entries.filter(e => e.group === group).map(e => `- [${e.title}](${e.key}/README.md) — \`${e.key}\` · ${e.mode}`).join('\n')).join('\n\n') + '\n\n## Enterprise project sequences\n\n' + enterpriseLabs.map(p => `### ${p.title}\n\n${p.businessContext}\n\n` + p.exercises.map(e => `- [${e.title}](${e.id.startsWith('loan-lab:') ? `loan/${e.id.slice(9)}` : `catalog/${e.id}`}/README.md)`).join('\n')).join('\n\n') + '\n');
  return entries.length;
}
module.exports = { entries, generate };
