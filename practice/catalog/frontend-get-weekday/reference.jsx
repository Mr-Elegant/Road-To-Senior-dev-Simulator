import { useState } from 'react';
const compute = (function compute(f) { if (!/^\d{4}-\d{2}-\d{2}$/.test(f.Date))
        throw new Error('Invalid date'); const date = new Date(f.Date + 'T00:00:00Z'); if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== f.Date)
        throw new Error('Invalid date'); return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()]; });
export default function App() {
  const [fields, setFields] = useState({"Date":""});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }
  return <form onSubmit={submit}>{["Date"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}
