import type * as React from 'react';
export interface AppProps {
    opponent?: string;
}
import { useState } from 'react';
export default function App({ opponent = 'rock' }: AppProps = {}): React.JSX.Element { const [result, setResult] = useState(''), [wins, setWins] = useState(0), beats: Record<string, string> = { rock: 'scissors', paper: 'rock', scissors: 'paper' }; return <section>{['rock', 'paper', 'scissors'].map(choice => <button key={choice} data-choice={choice} onClick={() => { const value = choice === opponent ? 'draw' : beats[choice] === opponent ? 'win' : 'loss'; setResult(value); if (value === 'win')
    setWins(n => n + 1); }}>{choice}</button>)}<button data-action="reset" onClick={() => { setResult(''); setWins(0); }}>Reset</button><output data-testid="result">{result}</output><output data-testid="wins">{wins}</output></section>; }

