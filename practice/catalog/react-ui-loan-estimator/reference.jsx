import { useState } from 'react';
export default function App() {
  const [fields, setFields] = useState({principal:'', rate:'', years:''});
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    const p=Number(fields.principal), annual=Number(fields.rate), y=Number(fields.years);
    if (Object.values(fields).some(v => !v.trim()) || ![p,annual,y].every(Number.isFinite) || p<=0 || p>1000000000 || annual<0 || annual>100 || !Number.isInteger(y) || y<1 || y>50) {
      setPayment(''); setError('Enter valid loan details'); return;
    }
    const n=y*12, r=annual/1200;
    setPayment((r===0 ? p/n : p*r/(1-Math.pow(1+r,-n))).toFixed(2)); setError('');
  }
  return <form onSubmit={submit}>{[['principal','Principal'],['rate','Annual rate'],['years','Years']].map(([name,label]) =>
    <label key={name}>{label}<input name={name} value={fields[name]} onChange={e => setFields({...fields,[name]:e.target.value})} /></label>)}
    <button type="submit">Calculate</button><p data-testid="error" role="alert">{error}</p><output data-testid="payment">{payment}</output></form>;
}
