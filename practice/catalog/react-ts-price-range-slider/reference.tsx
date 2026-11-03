import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [min, setMin] = useState(0), [max, setMax] = useState(100); return <section><label>Minimum<input name="min" aria-label="Minimum" type="range" min="0" max="100" value={min} onChange={e => setMin(Math.min(max, Number(e.target.value)))}/></label><label>Maximum<input name="max" aria-label="Maximum" type="range" min="0" max="100" value={max} onChange={e => setMax(Math.max(min, Number(e.target.value)))}/></label><output data-testid="range">{min + '-' + max}</output></section>; }

