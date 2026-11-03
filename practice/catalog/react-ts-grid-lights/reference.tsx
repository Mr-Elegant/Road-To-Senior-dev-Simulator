import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [order, setOrder] = useState<number[]>([]), [phase, setPhase] = useState('ready'), replay = false; function toggle(id: number) { if (phase === 'replay')
    return; setOrder(old => { if (old.includes(id))
    return replay ? old : old.filter(v => v !== id); const next = [...old, id]; if (replay && next.length === 4)
    setPhase('replay'); return next; }); } return <section><div role="group" aria-label="Lights">{[0, 1, 2, 3].map(id => <button key={id} data-cell={id} aria-pressed={order.includes(id)} disabled={phase === 'replay'} onClick={() => toggle(id)}>{id}</button>)}</div><output data-testid="count">{order.length}</output><output data-testid="phase">{phase}</output>{replay && <button data-action="step" onClick={() => { if (phase !== 'replay')
    return; setOrder(old => { const next = old.slice(0, -1); if (!next.length)
    setPhase('ready'); return next; }); }}>Step</button>}</section>; }

