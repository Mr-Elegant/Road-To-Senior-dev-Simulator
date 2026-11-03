import type * as React from 'react';
export interface AppProps {
    initial?: number;
    readOnly?: boolean;
}
import { useState } from 'react';
export default function App({ initial = 0, readOnly = false }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(initial); return <section><div role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map(n => <button key={n} data-rating={n} role="radio" aria-label={n + ' stars'} aria-checked={value === n} onClick={() => { if (!readOnly)
    setValue(n); }} onKeyDown={e => { if (!readOnly && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    setValue(v => Math.max(1, Math.min(5, v + (e.key === 'ArrowRight' ? 1 : -1))));
} }}>★</button>)}</div><output data-testid="rating">{value}</output></section>; }

