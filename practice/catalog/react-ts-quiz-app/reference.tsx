import type * as React from 'react';
export interface AppProps {
    questions?: ({
        "id": string;
        "text": string;
        "options": (string)[];
        "correct": number;
    })[];
}
import { useState } from 'react';
export default function App({ questions = [{ id: 'q', text: '2+2', options: ['3', '4'], correct: 1 }] }: AppProps = {}): React.JSX.Element { const [index, setIndex] = useState(0), [answers, setAnswers] = useState<Record<string, number>>({}), [done, setDone] = useState(false), q = questions[index]; return <section>{!done ? <><h2>{q.text}</h2>{q.options.map((value, i) => <button key={i} data-option={i} aria-pressed={answers[q.id] === i} onClick={() => setAnswers(old => ({ ...old, [q.id]: i }))}>{value}</button>)}<button data-action="next" disabled={answers[q.id] === undefined} onClick={() => { if (index === questions.length - 1)
    setDone(true);
else
    setIndex(i => i + 1); }}>Next</button></> : <output data-testid="score">{questions.filter(item => answers[item.id] === item.correct).length + '/' + questions.length}</output>}<button data-action="restart" onClick={() => { setIndex(0); setAnswers({}); setDone(false); }}>Restart</button></section>; }

