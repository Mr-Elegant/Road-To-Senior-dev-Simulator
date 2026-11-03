import type * as React from 'react';
interface TreeNode {
    id: string;
    title: string;
    children?: TreeNode[];
}
export interface AppProps {
    nodes?: TreeNode[];
}
import { useState, useRef } from 'react';
export default function App({ nodes = [{ id: 'root', title: 'Root', children: [{ id: 'a', title: 'A' }] }] }: AppProps = {}): React.JSX.Element { const [data, setData] = useState(nodes), [expanded, setExpanded] = useState<string[]>([]), [selected, setSelected] = useState('None'), [name, setName] = useState(''), [error, setError] = useState(''), next = useRef(1), editable = true; function remove(list: TreeNode[], id: string): TreeNode[] { return list.filter(n => n.id !== id).map(n => Array.isArray(n.children) ? { ...n, children: remove(n.children, id) } : n); } function add() { const title = name.trim(); if (!title) {
    setError('Name required');
    return;
} if (!data[0] || !Array.isArray(data[0].children)) {
    setError('No folder');
    return;
} if (data[0].children.some(n => n.title === title)) {
    setError('Name exists');
    return;
} const id = 'new' + next.current++; setData(old => old.map((n, i) => i === 0 ? { ...n, children: [...(n.children ?? []), { id, title }] } : n)); setName(''); setError(''); } function render(node: TreeNode): React.ReactNode { const folder = Array.isArray(node.children), open = expanded.includes(node.id); return <li key={node.id} data-node={node.id}>{folder ? <button data-open={node.id} aria-expanded={open} onClick={() => { setSelected(node.id); setExpanded(old => old.includes(node.id) ? old.filter(v => v !== node.id) : [...old, node.id]); }}>{node.title}</button> : <button data-select={node.id} onClick={() => setSelected(node.id)}>{node.title}</button>}{editable && <button data-delete={node.id} onClick={() => { setData(old => remove(old, node.id)); setSelected('None'); }}>Delete</button>}{folder && open && <ul>{node.children?.map(render)}</ul>}</li>; } return <section>{editable && <><label>New file<input aria-label="New file" value={name} onChange={e => setName(e.target.value)}/></label><button data-action="add" onClick={add}>Add file</button></>}<ul>{data.map(render)}</ul><output data-testid="selected">{selected}</output><p role="alert">{error}</p></section>; }

