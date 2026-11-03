import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
const compute = (function compute(f: Record<string, string>) {
    function parse(s: string) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
            throw new Error('Invalid date');
        const d = new Date(s + 'T00:00:00Z');
        if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s)
            throw new Error('Invalid date');
        return s.split('-').map(Number);
    }
    const b = parse(f.Birthday), t = parse(f.Today);
    if (f.Birthday > f.Today)
        throw new Error('Invalid date');
    return t[0] - b[0] - (t[1] < b[1] || t[1] === b[1] && t[2] < b[2] ? 1 : 0);
});
export default function App(): React.JSX.Element {
    const [fields, setFields] = useState<Record<string, string>>({ "Birthday": "", "Today": "" });
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
    return <form onSubmit={submit}>{["Birthday", "Today"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}

