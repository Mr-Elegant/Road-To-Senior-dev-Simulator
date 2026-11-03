import { useState } from 'react';
const compute = (function compute(f) { return f.Text.trim() ? f.Text.trim().split(/\s+/).map((s, i) => i % 2 ? Array.from(s).reverse().join('') : s).join(' ') : ''; });
export default function App() {
  const [fields, setFields] = useState({"Text":""});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }
  return <form onSubmit={submit}>{["Text"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}
