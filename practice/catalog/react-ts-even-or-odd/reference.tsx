import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
const compute = (function compute(f: Record<string, string>) {
    const n = Number(f.Number);
    if (!f.Number.trim() || !Number.isSafeInteger(n))
        throw new Error('Invalid integer');
    return n % 2 === 0 ? 'even' : 'odd';
});
export default function App(): React.JSX.Element {
    const [fields, setFields] = useState<Record<string, string>>({ "Number": "" });
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {
        const value = compute(fields);
        setResult(JSON.stringify(value));
        setError('');
    }
    catch (reason) {
        setResult('');
        setError((reason instanceof Error ? reason.message : String(reason)));
    } }
    return <form onSubmit={submit}>{["Number"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}

