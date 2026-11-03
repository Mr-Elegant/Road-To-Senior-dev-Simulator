import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [value, setValue] = useState(''); const map: Record<string, string> = { ':smile:': '😀', ':heart:': '❤️', ':fire:': '🔥' }; return <section><label>Message<textarea aria-label="Message" value={value} onChange={e => setValue(e.target.value)}/></label><p data-testid="preview">{value.replace(/:smile:|:heart:|:fire:/g, token => map[token])}</p></section>; }

