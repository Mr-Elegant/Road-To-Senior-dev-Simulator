import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
const compute = (function compute(f: Record<string, string>) {
    const value = f.Name.trim().toLowerCase();
    if (!value)
        throw new Error('Name required');
    return Array.from(value).reduce((sum, c) => sum + (c.codePointAt(0) ?? 0), 0) % 9 + 1;
});
export default function App(): React.JSX.Element {
    const [fields, setFields] = useState<Record<string, string>>({ "Name": "" });
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
    return <form onSubmit={submit}>{["Name"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}

