import type * as React from 'react';
export interface AppProps {
}
import { useState, useRef } from 'react';
export default function App(): React.JSX.Element { const [description, setDescription] = useState(''), [amount, setAmount] = useState(''), [items, setItems] = useState<{
    id: string;
    description: string;
    cents: number;
}[]>([]), [error, setError] = useState(''), next = useRef(1); function add() { const cents = Number(amount); if (!description.trim() || !amount.trim() || !Number.isInteger(cents) || cents <= 0) {
    setError('Invalid expense');
    return;
} const id = String(next.current++); setItems(old => [...old, { id, description: description.trim(), cents }]); setDescription(''); setAmount(''); setError(''); } return <section><label>Description<input name="description" value={description} onChange={e => setDescription(e.target.value)}/></label><label>Cents<input name="cents" value={amount} onChange={e => setAmount(e.target.value)}/></label><button data-action="add" onClick={add}>Add</button><ul>{items.map(item => <li key={item.id} data-expense={item.id}>{item.description}<button data-delete={item.id} onClick={() => setItems(old => old.filter(v => v.id !== item.id))}>Delete</button></li>)}</ul><output data-testid="total">{items.reduce((sum, item) => sum + item.cents, 0)}</output><p role="alert">{error}</p></section>; }

