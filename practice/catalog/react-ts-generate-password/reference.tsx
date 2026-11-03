import type * as React from 'react';
export interface AppProps {
    draws?: (number)[];
}
import { useState, useRef } from 'react';
export default function App({ draws }: AppProps): React.JSX.Element { const [length, setLength] = useState('8'), [password, setPassword] = useState(''), [error, setError] = useState(''), cursor = useRef(0); function index(bound: number) { if (draws)
    return Math.floor((draws[cursor.current++ % draws.length] ?? 0) * bound); const values = new Uint32Array(1), max = Math.floor(4294967296 / bound) * bound; do {
    crypto.getRandomValues(values);
} while (values[0] >= max); return values[0] % bound; } function generate() { const n = Number(length); if (!length.trim() || !Number.isInteger(n) || n < 4 || n > 32) {
    setPassword('');
    setError('Invalid length');
    return;
} const groups = ['ab', 'AB', '01', '!'], all = groups.join(''), chars = groups.map(group => group[index(group.length)]); while (chars.length < n)
    chars.push(all[index(all.length)]); for (let i = chars.length - 1; i > 0; i--) {
    const j = index(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
} setPassword(chars.join('')); setError(''); } return <section><label>Length<input aria-label="Length" value={length} onChange={e => setLength(e.target.value)}/></label><button onClick={generate}>Generate</button><output data-testid="password" data-length={password.length}>{password}</output><p role="alert">{error}</p></section>; }

