import type * as React from 'react';
export interface AppProps {
    adapter?: string;
}
import { useState } from 'react';
export default function App({ adapter = 'success' }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(''), [status, setStatus] = useState('Ready'), [copied, setCopied] = useState(''); async function copy() { const snapshot = value; setStatus('Copying'); setCopied(''); try {
    await (adapter === 'success' ? Promise.resolve() : Promise.reject(new Error('Unavailable')));
    setCopied(snapshot);
    setStatus('Copied');
}
catch {
    setStatus('Copy unavailable');
} } return <section><label>Text<input aria-label="Text" value={value} onChange={e => setValue(e.target.value)}/></label><button onClick={copy}>Copy</button><p data-testid="status" role="status">{status}</p><output data-testid="copied">{copied}</output></section>; }

