import { useState } from 'react';
const compute = (function compute(f) { const q = Number(f.Quantity), u = Number(f.Unit), d = Number(f.Discount); if (Object.values(f).some((s) => !s.trim()) || ![q, u, d].every(Number.isInteger) || q < 0 || q > 100 || u < 0 || d < 0 || d > 100)
        throw new Error('Invalid bill'); const subtotal = q * u, discount = Math.round(subtotal * d / 100); return { subtotal, discount, total: subtotal - discount }; });
export default function App() {
  const [fields, setFields] = useState({"Quantity":"","Unit":"","Discount":""});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }
  return <form onSubmit={submit}>{["Quantity","Unit","Discount"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}
    <button type="submit">Calculate</button><output data-testid="result">{result}</output><p role="alert" data-testid="error">{error}</p></form>;
}
