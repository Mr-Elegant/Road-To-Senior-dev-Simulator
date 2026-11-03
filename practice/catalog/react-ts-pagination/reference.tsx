import type * as React from 'react';
export interface AppProps {
    items?: (string)[];
    pageSize?: number;
}
import { useState } from 'react';
export default function App({ items = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'], pageSize = 2 }: AppProps = {}): React.JSX.Element { const [query, setQuery] = useState(''), [descending, setDescending] = useState(false), [page, setPage] = useState(0); const filtered = items.filter(value => value.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0) * (descending ? -1 : 1)), pages = Math.ceil(filtered.length / pageSize), current = Math.min(page, Math.max(0, pages - 1)); return <section><label>Search<input aria-label="Search" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }}/></label><button data-action="sort" onClick={() => { setDescending(v => !v); setPage(0); }}>Sort</button><ul>{filtered.slice(current * pageSize, current * pageSize + pageSize).map(value => <li key={value}>{value}</li>)}</ul><button data-action="previous" onClick={() => setPage(n => Math.max(0, n - 1))}>Previous</button><button data-action="next" onClick={() => setPage(n => Math.min(Math.max(0, pages - 1), n + 1))}>Next</button><output data-testid="page">{(pages ? current + 1 : 0) + '/' + pages}</output></section>; }

