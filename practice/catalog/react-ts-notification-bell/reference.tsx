import type * as React from 'react';
export interface AppProps {
    items?: ({
        "id": string;
        "text": string;
        "read": boolean;
    })[];
}
import { useState } from 'react';
export default function App({ items = [{ id: 'a', text: 'Hello', read: false }, { id: 'b', text: 'Update', read: false }] }: AppProps = {}): React.JSX.Element { const [records, setRecords] = useState(items), [open, setOpen] = useState(false); return <section><button data-action="bell" aria-expanded={open} onClick={() => setOpen(v => !v)}>Bell</button><output data-testid="unread">{records.filter(n => !n.read).length}</output>{open && <ul>{records.map(n => <li key={n.id}>{n.text}<button data-read={n.id} disabled={n.read} onClick={() => setRecords(old => old.map(item => item.id === n.id ? { ...item, read: true } : item))}>Mark read</button></li>)}</ul>}</section>; }

