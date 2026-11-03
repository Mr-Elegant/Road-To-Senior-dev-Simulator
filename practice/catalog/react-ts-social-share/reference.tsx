import type * as React from 'react';
export interface AppProps {
    adapter?: string;
    url?: string;
}
import { useState } from 'react';
export default function App({ adapter = 'success', url = 'https://example.test/article' }: AppProps = {}): React.JSX.Element { const [status, setStatus] = useState('Ready'); async function share() { setStatus('Sharing'); await Promise.resolve(); setStatus(adapter === 'success' ? 'Shared' : adapter === 'cancel' ? 'Cancelled' : 'Copy link instead'); } return <section><button onClick={share}>Share</button><p data-testid="status">{status}</p>{status === 'Copy link instead' && <label>Link<input aria-label="Link" readOnly value={url}/></label>}</section>; }

