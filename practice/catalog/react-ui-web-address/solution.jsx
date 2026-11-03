import { useState } from 'react';
export default function App() {
  const [value, setValue] = useState('');
  return <section><label>Website <input value={value} onChange={e => setValue(e.target.value)} /></label>
    <p data-testid="feedback" role="status">Enter a web address</p><output data-testid="normalized"></output></section>;
}