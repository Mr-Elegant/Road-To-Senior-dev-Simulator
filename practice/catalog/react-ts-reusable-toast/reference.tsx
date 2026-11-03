import type * as React from 'react';
export interface AppProps {
    autoCloseMs?: number;
}
import { useState, useRef, useEffect } from 'react';
export default function App({ autoCloseMs = 0 }: AppProps = {}): React.JSX.Element { const [items, setItems] = useState<number[]>([]), next = useRef(1), timers = useRef<ReturnType<typeof setTimeout>[]>([]); useEffect(() => () => timers.current.forEach(clearTimeout), []); function notify() { const id = next.current++; setItems(old => [...old, id].slice(-4)); if (autoCloseMs > 0)
    timers.current.push(setTimeout(() => setItems(old => old.filter(v => v !== id)), autoCloseMs)); } return <section><button data-action="notify" onClick={notify}>Notify</button><ul aria-live="polite">{items.map(id => <li key={id} data-toast={id}>Notification {id}<button data-dismiss={id} onClick={() => setItems(old => old.filter(v => v !== id))}>Dismiss</button></li>)}</ul></section>; }

