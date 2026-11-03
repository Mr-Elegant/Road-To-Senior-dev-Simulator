import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { createReactTypeChecker } from '@/lib/reactTypescript/check';
import { reactTypescriptTopics, reactTypescriptScenarios, reactTypescriptReferences } from '@/data/reactTypescript';
import { frontendPracticeTopics } from '@/data/frontendPractice';
import { frontendExercises } from '@/data/frontendPractice/exercises';

const libDir = path.dirname(ts.getDefaultLibFilePath({}));
const files: Record<string, string> = {};
for (const file of readdirSync(libDir).filter(file => /^lib.*\.d\.ts$/.test(file))) files[`/${file}`] = readFileSync(path.join(libDir, file), 'utf8');
for (const file of ['index.d.ts', 'global.d.ts', 'jsx-runtime.d.ts']) files[`/node_modules/@types/react/${file}`] = readFileSync(`node_modules/@types/react/${file}`, 'utf8');
files['/node_modules/csstype/index.d.ts'] = readFileSync('node_modules/csstype/index.d.ts', 'utf8');

describe('React + TypeScript compiler', () => {
  const check = () => createReactTypeChecker(ts, files);
  it('accepts a genuinely typed React component and returns useful type diagnostics', () => {
    const checker = check();
    expect(checker('import {useState} from "react"; export default function App(){const [n,setN]=useState<number>(0);return <button onClick={()=>setN(n+1)}>{n}</button>}')).toEqual([]);
    expect(checker('export default function App(){const n:number="wrong";return <p>{n}</p>}').join('\n')).toContain('not assignable');
    expect(checker('export default function App(){return <p>{"@ts-ignore is displayed text"}</p>}')).toEqual([]);
  });
  it('rejects implicit/explicit any, suppression directives and unsupported imports', () => {
    const checker = check();
    for (const code of ['export default function App(props){return <p>{props.title}</p>}', 'export default function App(props:any){return <p>{props.title}</p>}', '// @ts-nocheck\nexport default function App(){return <p/>}', 'import x from "not-installed"; export default function App(){return <p>{x}</p>}']) expect(checker(code).length).toBeGreaterThan(0);
  });
});

describe('complete React + TypeScript bank', () => {
  const checker = createReactTypeChecker(ts, files);
  it('copies all 113 React topics with independent IDs and the same 379 DOM cases', () => {
    expect(reactTypescriptTopics.map(topic => topic.slug).sort()).toEqual(frontendPracticeTopics.filter(topic => topic.language === 'React.js').map(topic => topic.slug).sort());
    expect(reactTypescriptScenarios).toHaveLength(113);
    expect(new Set(reactTypescriptScenarios.map(scenario => scenario.id)).size).toBe(113);
    expect(reactTypescriptScenarios.reduce((n, scenario) => n + scenario.testCases!.length, 0)).toBe(379);
    for (const topic of reactTypescriptTopics) {
      const scenario = reactTypescriptScenarios.find(item => item.id === topic.scenarioId)!;
      expect(scenario.reactTypescriptExercise).toBe(true);
      expect(scenario.codeLanguage).toBe('tsx');
      expect(scenario.testCases!.map(test => JSON.parse(test.inputDescription))).toEqual(frontendExercises[topic.slug].tests.map(test => 'journey' in test ? test.journey : undefined));
    }
  });
  for (const topic of reactTypescriptTopics) it(`${topic.slug}: typed reference, starter and fixture props type-check`, () => {
    const reference = reactTypescriptReferences[topic.slug];
    const exercise = frontendExercises[topic.slug];
    const props = exercise.tests.map(test => 'journey' in test ? test.journey.props ?? {} : {});
    expect(checker(reference.code + `\nconst fixtures: AppProps[] = ${JSON.stringify(props)};`), topic.slug).toEqual([]);
    expect(checker(reference.starter), topic.slug).toEqual([]);
    if (topic.slug === 'generate-password') expect(checker(reference.code + '\nconst secureModeProps: AppProps = {};')).toEqual([]);
  });
});
