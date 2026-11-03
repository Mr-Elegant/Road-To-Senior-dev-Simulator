import type * as React from 'react';
export interface AppProps {
    count?: number;
    reducedMotion?: boolean;
}
import { useState } from 'react';
export default function App({ count = 8, reducedMotion = false }: AppProps = {}): React.JSX.Element { const [active, setActive] = useState(false); return <section><style>{'@keyframes fall{from{transform:translateY(-10px);opacity:1}to{transform:translateY(30px);opacity:0}}'}</style><button data-action="celebrate" onClick={() => setActive(true)}>Celebrate</button><button data-action="clear" onClick={() => setActive(false)}>Clear</button><div aria-hidden="true">{active && !reducedMotion && Array.from({ length: count }, (_, i) => <span data-particle key={i} style={{ display: 'inline-block', animation: 'fall 600ms ease-out' }}>✦</span>)}</div><p role="status">{active ? 'Celebration complete' : ''}</p></section>; }

