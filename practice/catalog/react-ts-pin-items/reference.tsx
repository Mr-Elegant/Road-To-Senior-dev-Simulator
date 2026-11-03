import type * as React from 'react';
export interface AppProps {
    items?: (string)[];
}
import { useState } from 'react';
export default function App({ items = ['A', 'B', 'C'] }: AppProps = {}): React.JSX.Element { const [pinned, setPinned] = useState<string[]>([]); const order = [...items.filter(id => pinned.includes(id)), ...items.filter(id => !pinned.includes(id))]; return <section><ul>{order.map(id => <li key={id} data-row={id}>{id}<button data-pin={id} aria-pressed={pinned.includes(id)} onClick={() => setPinned(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id])}>Pin {id}</button></li>)}</ul><output data-testid="order">{order.join(',')}</output></section>; }

