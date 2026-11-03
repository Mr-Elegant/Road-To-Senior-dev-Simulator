import type * as React from 'react';
export interface AppProps {
    initial?: number;
}
import { useState, useRef, useEffect } from 'react';
function usePrevious<T>(value: T): T | undefined { const ref = useRef<T | undefined>(undefined); useEffect(() => { ref.current = value; }, [value]); return ref.current; }
export default function App({ initial = 0 }: AppProps = {}): React.JSX.Element { const [n, setN] = useState(initial), previous = usePrevious(n); return <section><output data-testid="current">{n}</output><output data-testid="previous">{previous === undefined ? 'none' : previous}</output><button onClick={() => setN(v => v + 1)}>Increment</button></section>; }

