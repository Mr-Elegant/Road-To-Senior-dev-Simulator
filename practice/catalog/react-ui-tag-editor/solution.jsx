import { useState } from 'react';
export default function App() {
  const [draft, setDraft] = useState('');
  return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} /></label>
    <ul data-testid="tags"></ul><p data-testid="feedback" role="status"></p></section>;
}