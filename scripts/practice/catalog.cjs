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
const { exerciseKey, migrateFolders } = require('./paths.cjs');
const { collectionNames, topicIndex, learningDiagram, collectionGuide, workflow } = require('./documentation.cjs');

const extensions = { javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts', jsx: 'jsx', tsx: 'tsx', sql: 'sql', python: 'py', html: 'html', css: 'css', go: 'go', rust: 'rs' };
function entry(group, source, language, starter, reference, mode) {
  const id = source.id ?? source.bugId;
  const key = exerciseKey(group, id, source.title);
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(key)) throw new Error(`Unsafe exercise key: ${key}`);
  return { key, legacyKey: `${group}/${id}`, group, id, title: source.title,
    category: source.category ?? source.topic ?? group,
    difficulty: source.difficultyLabel ?? source.difficulty ?? source.tier ?? 'Mixed',
    language, starter, reference, mode, source,
    ...(group === 'coding' && language === 'sql' ? { dialect: id === 'sql-top-n-per-category' ? 'postgresql' : 'generic-sql' } : {}),
    filename: starter !== undefined ? `solution.${extensions[language] ?? 'txt'}` : 'answer.md' };
}
const entries = [
  ...allScenarios.map(s => entry('catalog', s, (s.codeLanguage ?? '').toLowerCase(), s.nextjsPractice?.mode === 'framework-review' ? undefined : s.starterCode,
    s.referenceSolution, s.reactExercise ? 'react' : s.javascriptExercise ? 'frontend-js' : /^(javascript|typescript|js|ts)$/.test((s.codeLanguage ?? '').toLowerCase()) && s.testCases?.length && /function\s+(solution|handler|solve|execute)\s*\(/.test(s.referenceSolution.codeOrArtifact ?? '') ? 'javascript' : 'guided')),
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
  migrateFolders(destination, entries);
  const write = (relative, content, preserve = false) => {
    const file = path.join(destination, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!preserve || !fs.existsSync(file)) fs.writeFileSync(file, content, 'utf8');
  };
  // Give VS Code an isolated strict TSX project without including unfinished work in the app build.
  write('tsconfig.json', JSON.stringify({ compilerOptions: {
    target: 'ES2022', lib: ['DOM', 'DOM.Iterable', 'ES2022'], jsx: 'react-jsx', module: 'ESNext',
    moduleResolution: 'Bundler', strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true, types: ['react'],
  }, include: ['catalog/react-ts-*/*.tsx'] }, null, 2) + '\n', true);
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
    const readme = path.join(destination, e.key, 'README.md');
    fs.appendFileSync(readme, learningDiagram(e), 'utf8');
    if (s.nextjsPractice) {
      const info=s.nextjsPractice;
      fs.appendFileSync(readme, `\n## Next.js version and verification scope\n\nMode: **${info.mode}**.${info.mode === 'framework-review' ? ' Edit the proposed file under working/ and record findings in answer.md; compare reference-files/ only after attempting it.' : ''}\n\nNext.js 15: ${info.next15}\n\nNext.js 16: ${info.next16}\n\n### Acceptance evidence\n\n${bullets(info.verification)}\n\n### Official references\n\n${info.sources.map(source=>`- [${source.title}](${source.url})`).join('\n')}\n\nFramework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.\n`);
      for (const file of s.codeReviewFiles ?? []) {
        if (path.isAbsolute(file.filename) || file.filename.split(/[\\/]/).some(part=>part==='..')) throw new Error(`Unsafe review filename: ${file.filename}`);
        write(`${e.key}/working/${file.filename}`, file.newCode, true);
        write(`${e.key}/reference-files/${file.filename}`, e.reference.codeOrArtifact+'\n');
      }
    }
    write(`${e.key}/exercise.json`, JSON.stringify(details, null, 2) + '\n');
    write(`${e.key}/test-cases.json`, JSON.stringify(s.testCases ?? s.tests ?? [], null, 2) + '\n');
    write(`${e.key}/reference.md`, `# Reference: ${e.title}\n\nRead after attempting the exercise. This is authored guidance, not certification.\n\n\`\`\`json\n${JSON.stringify({ solution: e.reference, rubric: s.rubric, playbook: s.incidentPlaybook, alternatives: s.alternativeApproaches, commonMistakes: s.commonMistakes, followUps: s.followUpQuestions, expectedConcepts: s.expectedConcepts }, null, 2)}\n\`\`\`\n`);
    const referenceCode = e.reference?.code ?? e.reference?.codeOrArtifact;
    if (referenceCode) write(`${e.key}/reference.${s.nextjsPractice && e.language === 'json' ? 'json' : extensions[e.language] ?? 'txt'}`, referenceCode + '\n');
    write(`${e.key}/${e.filename}`, e.starter ?? answer, true);
    if (e.filename !== 'answer.md') write(`${e.key}/answer.md`, answer, true);
  }
  for (const ds of ALL_SQL_DATASETS) {
    write(`datasets/${ds.id}/schema.sql`, ds.schemaSql + '\n');
    write(`datasets/${ds.id}/seed.sql`, ds.seedSql + '\n');
  }
  write('manifest.json', JSON.stringify(entries.map(({ source, starter, reference, ...e }) => e), null, 2) + '\n');
  const groups = ['catalog', 'loan', 'sql', 'beginner', 'coding'];
  for (const group of groups) write(`${group}/README.md`, collectionGuide(entries, group));
  const linkFor = id => {
    const legacyKey = id.startsWith('loan-lab:') ? `loan/${id.slice(9)}` : `catalog/${id}`;
    const exercise = entries.find(item => item.legacyKey === legacyKey);
    if (!exercise) throw new Error(`Missing enterprise exercise: ${id}`);
    return `${exercise.key}/README.md`;
  };
  write('INDEX.md', '# Local practice index\n\nSearch titles and topics in VS Code, or run `npm run practice:list -- "<topic words>"`. Opaque beginner and SQL folder names now include the question title; original IDs and old command paths remain accepted.\n\n' +
    groups.map(group => `- [${collectionNames[group]}](${group}/README.md) (${entries.filter(e => e.group === group).length})`).join('\n') + '\n' + workflow + '\n' +
    groups.map(group => `## ${collectionNames[group]}\n\n` + topicIndex(entries, group)).join('\n\n') +
    '\n\n## Enterprise project sequences\n\n' + enterpriseLabs.map(project => `### ${project.title}\n\n${project.businessContext}\n\n` +
      project.exercises.map(exercise => `- [${exercise.title}](${linkFor(exercise.id)})`).join('\n')).join('\n\n') + '\n');
  return entries.length;
}
module.exports = { entries, generate };
