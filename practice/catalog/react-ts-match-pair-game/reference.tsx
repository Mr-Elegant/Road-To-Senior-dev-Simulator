import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [open, setOpen] = useState<number[]>([]), [matched, setMatched] = useState<number[]>([]), [pending, setPending] = useState(false), pairs = ['A', 'B', 'A', 'B']; function flip(id: number) { if (pending || open.includes(id) || matched.includes(id))
    return; const next = [...open, id]; if (next.length === 2) {
    if (pairs[next[0]] === pairs[next[1]]) {
        setMatched(old => [...old, ...next]);
        setOpen([]);
    }
    else {
        setOpen(next);
        setPending(true);
    }
}
else
    setOpen(next); } return <section>{pairs.map((pair, id) => <button key={id} data-card={id} onClick={() => flip(id)}>{open.includes(id) || matched.includes(id) ? pair : '?'}</button>)}<button data-action="resolve" onClick={() => { if (pending) {
    setOpen([]);
    setPending(false);
} }}>Resolve</button><button data-action="restart" onClick={() => { setOpen([]); setMatched([]); setPending(false); }}>Restart</button><output data-testid="matched">{matched.length}</output></section>; }

