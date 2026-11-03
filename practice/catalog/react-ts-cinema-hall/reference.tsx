import type * as React from 'react';
export interface AppProps {
    reserved?: (string)[];
}
import { useState } from 'react';
export default function App({ reserved = ['A2'] }: AppProps = {}): React.JSX.Element { const [selected, setSelected] = useState<string[]>([]); return <section><div role="group" aria-label="Seats">{['A1', 'A2', 'A3', 'A4'].map(id => <button key={id} data-seat={id} aria-label={'Seat ' + id} disabled={reserved.includes(id)} aria-pressed={selected.includes(id)} onClick={() => setSelected(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id])}>{id}</button>)}</div><output data-testid="total">{selected.length * 1000}</output></section>; }

