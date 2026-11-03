import { useState } from 'react';
export default function App() {
  const [fields, setFields] = useState({principal:'', rate:'', years:''});
  return <form onSubmit={e => e.preventDefault()}>{[['principal','Principal'],['rate','Annual rate'],['years','Years']].map(([name,label]) =>
    <label key={name}>{label}<input name={name} value={fields[name]} onChange={e => setFields({...fields,[name]:e.target.value})} /></label>)}
    <button type="submit">Calculate</button><p data-testid="error" role="alert"></p><output data-testid="payment"></output></form>;
}