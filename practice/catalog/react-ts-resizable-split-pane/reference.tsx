import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [n, setN] = useState(50); return <section><label>Left pane width<input aria-label="Left pane width" type="range" min="20" max="80" value={n} onChange={e => setN(Math.max(20, Math.min(80, Number(e.target.value))))}/></label><div style={{ display: 'flex' }}><div data-testid="left" style={{ width: n + '%' }}>Left</div><div data-testid="right" style={{ width: (100 - n) + '%' }}>Right</div></div><output data-testid="ratio">{n + '/' + (100 - n)}</output></section>; }

