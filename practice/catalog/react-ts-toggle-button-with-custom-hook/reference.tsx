import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
function useToggle(initial = false) { const [value, setValue] = useState(initial); return [value, () => setValue(v => !v), () => setValue(true), () => setValue(false)] as const; }
export default function App(): React.JSX.Element { const [value, toggle, on, off] = useToggle(); return <section><output data-testid="state">{value ? 'on' : 'off'}</output><button onClick={toggle}>Toggle</button><button onClick={on}>On</button><button onClick={off}>Off</button></section>; }

