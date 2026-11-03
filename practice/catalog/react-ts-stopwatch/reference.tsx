import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [seconds, setSeconds] = useState(0), [running, setRunning] = useState(false); return <section><output data-testid="seconds">{seconds}</output><button data-action="start" onClick={() => setRunning(true)}>Start</button><button data-action="pause" onClick={() => setRunning(false)}>Pause</button><button data-action="tick" onClick={() => { if (running)
    setSeconds(n => n + 1); }}>Tick</button><button data-action="reset" onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button></section>; }

