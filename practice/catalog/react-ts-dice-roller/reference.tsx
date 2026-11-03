import type * as React from 'react';
export interface AppProps {
    draws?: (number)[];
    sides?: number;
}
import { useState, useRef } from 'react';
export default function App({ draws = [0], sides = 6 }: AppProps = {}): React.JSX.Element { const [index, setIndex] = useState(0), [value, setValue] = useState<number | null>(null); return <section><button onClick={() => { setValue(Math.floor((draws[index] ?? 0) * sides) + 1); setIndex(i => i + 1); }}>Roll</button><output data-testid="roll">{value === null ? '-' : value}</output></section>; }

