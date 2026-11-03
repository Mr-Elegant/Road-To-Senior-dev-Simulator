import { useState } from 'react';
const compute = (function compute(f) { const w = Number(f.Weight), h = Number(f.Height); if (!f.Weight.trim() || !f.Height.trim() || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0)
        throw new Error('Invalid measurements'); return (w / ((h / 100) ** 2)).toFixed(2); });
export default function App() {
  const [fields, setFields] = useState({"Weight":"","Height":""});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }
  return <form onSubmit={submit}>{["Weight","Height"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}
