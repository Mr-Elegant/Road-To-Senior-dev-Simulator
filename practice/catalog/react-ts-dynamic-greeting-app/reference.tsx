import type * as React from 'react';
export interface AppProps {
    hour?: number;
}
import { useState } from 'react';
export default function App({ hour = 9 }: AppProps = {}): React.JSX.Element { const [name, setName] = useState(''); const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'; return <section><label>Name<input aria-label="Name" value={name} onChange={e => setName(e.target.value)}/></label><p data-testid="greeting">{'Good ' + period + ', ' + (name.trim() || 'friend') + '!'}</p></section>; }

