import type * as React from 'react';
export interface AppProps {
}
import { useState, useRef } from 'react';
export default function App(): React.JSX.Element { const [comments, setComments] = useState<{
    id: string;
    text: string;
    parent: string | null;
    deleted: boolean;
}[]>([{ id: '1', text: 'Root', parent: null, deleted: false }]), [draft, setDraft] = useState(''), [parent, setParent] = useState<string | null>(null), next = useRef(2); function add() { if (!draft.trim())
    return; const id = String(next.current++); setComments(old => [...old, { id, text: draft.trim(), parent, deleted: false }]); setDraft(''); setParent(null); } function render(p: string | null): React.JSX.Element { return <ul>{comments.filter(c => c.parent === p).map(c => <li key={c.id} data-comment={c.id}><span data-text={c.id}>{c.deleted ? '[deleted]' : c.text}</span><button data-reply={c.id} disabled={c.deleted} onClick={() => setParent(c.id)}>Reply</button><button data-delete={c.id} onClick={() => setComments(old => old.map(item => item.id === c.id ? { ...item, deleted: true } : item))}>Delete</button>{render(c.id)}</li>)}</ul>; } return <section><label>Text<input aria-label="Text" value={draft} onChange={e => setDraft(e.target.value)}/></label><button data-action="add" onClick={add}>Add</button>{render(null)}</section>; }

