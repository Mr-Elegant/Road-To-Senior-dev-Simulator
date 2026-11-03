import type * as React from 'react';
export interface AppProps {
}
import { useRef, useState } from 'react';
export default function App(): React.JSX.Element { const ref = useRef<HTMLInputElement>(null), [focused, setFocused] = useState(false); return <section><label>Message<input aria-label="Message" ref={ref} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/></label><button onClick={() => ref.current?.focus()}>Focus message</button><output data-testid="focused">{focused ? 'yes' : 'no'}</output></section>; }

