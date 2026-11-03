import type * as React from 'react';
export interface AppProps {
    pages?: ((string)[])[];
    failPage?: number;
}
import { useState } from 'react';
export default function App({ pages = [['Ada'], ['Lin']], failPage = -1 }: AppProps = {}): React.JSX.Element { const [page, setPage] = useState(0), [rows, setRows] = useState(pages[0] || []), [status, setStatus] = useState('Ready'); async function load(next: number) { setPage(next); setStatus('Loading'); await Promise.resolve(); if (next === failPage) {
    setRows([]);
    setStatus('Unable to load');
}
else {
    setRows(pages[next] || []);
    setStatus('Ready');
} } return <section><ul>{rows.map(name => <li key={name}>{name}</li>)}</ul><button data-action="previous" disabled={page === 0} onClick={() => load(Math.max(0, page - 1))}>Previous</button><button data-action="next" disabled={page >= pages.length - 1} onClick={() => load(Math.min(pages.length - 1, page + 1))}>Next</button><p data-testid="status">{status}</p></section>; }

