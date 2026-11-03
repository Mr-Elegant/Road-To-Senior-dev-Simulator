import type * as React from 'react';
export interface AppProps {
    recipes?: {
        id: string;
        name: string;
        category: string;
    }[];
}
import { useState } from 'react';
export default function App({ recipes = [] }: AppProps = {}): React.JSX.Element {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [selected, setSelected] = useState<string[]>([]);
    const categories = [...new Set(recipes.map(r => r.category))];
    const visible = recipes.filter(r => r.name.toLowerCase().includes(query.trim().toLowerCase()) && (category === 'All' || r.category === category));
    function toggle(id: string) { setSelected(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id]); }
    return <section><label>Search recipes <input value={query} onChange={e => setQuery(e.target.value)}/></label>
    <label>Category <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
    <ul data-testid="recipes">{visible.map(r => <li key={r.id}>{r.name}<button type="button" aria-label={(selected.includes(r.id) ? 'Deselect ' : 'Select ') + r.name} onClick={() => toggle(r.id)}>{selected.includes(r.id) ? 'Deselect' : 'Select'}</button></li>)}</ul>
    {!visible.length && <p data-testid="empty">No matching recipes</p>}<output data-testid="selected-count">{selected.length}</output></section>;
}

