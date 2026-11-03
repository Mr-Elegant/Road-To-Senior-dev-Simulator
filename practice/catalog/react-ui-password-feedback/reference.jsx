import { useState } from 'react';
export default function App() {
  const [password, setPassword] = useState('');
  const score = [password.length >= 10, /[a-z]/.test(password) && /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length;
  const feedback = !password ? 'Start typing' : score < 2 ? 'Weak' : score < 4 ? 'Fair' : 'Strong';
  return <section><label>Password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    <p data-testid="feedback" role="status">{feedback}</p><output data-testid="passed-rules">{score}</output></section>;
}
