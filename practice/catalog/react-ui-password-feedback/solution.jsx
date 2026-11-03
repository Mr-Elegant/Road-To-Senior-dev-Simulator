import { useState } from 'react';
export default function App() {
  const [password, setPassword] = useState('');
  return <section><label>Password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    <p data-testid="feedback" role="status">Start typing</p><output data-testid="passed-rules">0</output></section>;
}