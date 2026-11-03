import { useState } from 'react';
export default function App() {
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  let normalized = '';
  try {
    const url = new URL(trimmed);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) normalized = url.href;
  } catch {}
  const feedback = !trimmed ? 'Enter a web address' : normalized ? 'Valid web address' : 'Invalid web address';
  return <section><label>Website <input value={value} onChange={e => setValue(e.target.value)} /></label>
    <p data-testid="feedback" role="status">{feedback}</p><output data-testid="normalized">{normalized}</output></section>;
}
