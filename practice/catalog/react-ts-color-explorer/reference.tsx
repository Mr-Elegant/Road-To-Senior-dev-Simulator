import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
const compute = (function compute(f: Record<string, string>) {
    const value = f.Color.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(value))
        throw new Error('Invalid color');
    return value.toUpperCase();
});
export default function App(): React.JSX.Element {
    const [fields, setFields] = useState<Record<string, string>>({ "Color": "" });
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
    return <form onSubmit={submit}>{["Color"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}

