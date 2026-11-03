import type * as React from 'react';
export interface AppProps {
    items?: {
        id: string;
        title: string;
        body: string;
    }[];
}
import { useState } from 'react';
export default function App({ items = [] }: AppProps = {}): React.JSX.Element {
    const [openId, setOpenId] = useState<string | null>(null);
    if (!items.length)
        return <p data-testid="empty">No help articles</p>;
    return <section>{items.map(item => {
            const open = openId === item.id;
            return <article key={item.id}><h3><button type="button" id={'trigger-' + item.id} aria-controls={'panel-' + item.id} aria-expanded={open} onClick={() => setOpenId(old => old === item.id ? null : item.id)}>{item.title}</button></h3>
      {open && <div role="region" id={'panel-' + item.id} aria-labelledby={'trigger-' + item.id}>{item.body}</div>}</article>;
        })}</section>;
}

