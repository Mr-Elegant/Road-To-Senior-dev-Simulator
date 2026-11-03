import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [index, setIndex] = useState(0), [paused, setPaused] = useState(false); return <section><output data-testid="light">{['red', 'green', 'amber'][index]}</output><button data-action="advance" onClick={() => { if (!paused)
    setIndex(i => (i + 1) % 3); }}>Advance</button><button data-action="pause" aria-pressed={paused} onClick={() => setPaused(v => !v)}>Pause</button></section>; }

