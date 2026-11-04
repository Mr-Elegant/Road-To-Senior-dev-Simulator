const collectionNames = {
  catalog: 'Application Challenges', loan: 'Loan Dashboard Debugging', sql: 'SQL and PostgreSQL',
  beginner: 'Beginner Foundations', coding: 'Standalone Coding Problems',
};

const workflow = `
## Practice workflow

Choose a question, read its README and visible cases, and edit its solution or answer file.

\`\`\`mermaid
flowchart TD
  A[Choose a question by topic] --> B[Read task and contracts]
  B --> C{Automated exercise?}
  C -->|Yes| D[Edit solution file]
  D --> E[Run practice test or watch]
  E --> F{All cases pass?}
  F -->|No| D
  F -->|Yes| G[Explain trade-offs in answer.md]
  C -->|Guided| G
  G --> H[Compare with reference after attempting]
\`\`\`

Mermaid renders in supported Markdown viewers. In VS Code use a Mermaid-capable Markdown preview; all instructions also remain available as text.
`;

function topicIndex(entries, group, fromCollection = false) {
  const topics = [...new Set(entries.filter(entry => entry.group === group).map(entry => entry.category))].sort();
  return topics.map(topic => `### ${topic}\n\n` + entries.filter(entry => entry.group === group && entry.category === topic)
    .map(entry => `- [${entry.title}](${fromCollection ? entry.key.split('/')[1] : entry.key}/README.md) - \`${entry.id}\` | ${entry.difficulty} | ${entry.mode}`).join('\n')).join('\n\n');
}

function learningDiagram(entry) {
  if (entry.id === 't1-hc-01') return `
## Visual model: semantic page structure

Semantic elements describe the purpose of content. The nesting below is an example, not a required layout for every page.

\`\`\`mermaid
flowchart TD
  Body[body] --> Header[header: site introduction]
  Body --> Nav[nav: main navigation]
  Body --> Main[main: primary content]
  Main --> Article[article: self-contained content]
  Article --> Section[section: named topic]
  Body --> Footer[footer: related site information]
\`\`\`
`;
  if (entry.id === 'sql-t1-01') return `
## Visual model: requested query result

Select the requested columns, order products by name, then return the first five rows. This describes the result contract, not the database engine's physical execution plan.

\`\`\`mermaid
flowchart LR
  A[products table] --> B[Select name, category, price]
  B --> C[Order by name ascending]
  C --> D[Limit to 5 rows]
\`\`\`
`;
  return '';
}

function collectionGuide(entries, group) {
  const intro = `# ${collectionNames[group]}\n\n[All collections](../INDEX.md) | [Local practice guide](../README.md)\n\nSearch this file for a topic, or run \`npm run practice:list -- "<topic words>"\` from the repository root. Old IDs and old collection/ID commands still work.\n\n`;
  const model = group === 'catalog' ? `
## React exercise model

React JSX and React + TypeScript copies have separate solution files. TSX adds strict checking before the same DOM behavior tests.

\`\`\`mermaid
flowchart LR
  A[Edit solution.jsx] --> C[Compile and mount in local Chromium]
  B[Edit solution.tsx] --> T[Strict TypeScript checks]
  T --> C
  C --> D[Run authored DOM interactions]
  D --> E[Compare behavior with expected results]
\`\`\`
` : '';
  return intro + topicIndex(entries, group, true) + '\n' + model + workflow;
}

module.exports = { collectionNames, topicIndex, learningDiagram, collectionGuide, workflow };
