import type * as React from 'react';
export interface AppProps {
    items?: ({
        "id": string;
        "title": string;
        "body": string;
    })[];
}
import { useState } from 'react';
export default function App({ items = [{ id: 'one', title: 'One', body: 'First' }, { id: 'two', title: 'Two', body: 'Second' }] }: AppProps = {}): React.JSX.Element { const [id, setId] = useState(items[0]?.id); if (!items.length)
    return <p>No sections</p>; const selected = items.find(item => item.id === id) || items[0]; return <section>{items.map(item => <button key={item.id} data-id={item.id} aria-pressed={selected.id === item.id} onClick={() => setId(item.id)}>{item.title}</button>)}<p data-testid="panel">{selected.body}</p></section>; }

