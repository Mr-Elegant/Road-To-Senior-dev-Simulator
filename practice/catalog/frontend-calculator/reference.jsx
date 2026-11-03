import { useState } from 'react';
const compute = (function compute(f) { const match = f.Expression.trim().match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))\s*([+*\/\-])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))$/); if (!match)
        throw new Error('Invalid expression'); const a = Number(match[1]), b = Number(match[3]); if (!Number.isFinite(a) || !Number.isFinite(b) || match[2] === '/' && b === 0)
        throw new Error('Invalid expression'); return match[2] === '+' ? a + b : match[2] === '-' ? a - b : match[2] === '*' ? a * b : a / b; });
export default function App() {
  const [fields, setFields] = useState({"Expression":""});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }
  return <form onSubmit={submit}>{["Expression"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}
