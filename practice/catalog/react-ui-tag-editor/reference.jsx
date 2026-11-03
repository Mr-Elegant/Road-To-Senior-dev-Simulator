import { useState } from 'react';
export default function App({ limit = 3 }) {
  const [draft, setDraft] = useState('');
  const [tags, setTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  function remove(tag) { setTags(old => old.filter(item => item !== tag)); setFeedback(''); }
  function onKeyDown(e) {
    if (e.key === 'Backspace' && draft === '') { setTags(old => old.slice(0, -1)); setFeedback(''); }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const tag = draft.trim();
    if (!tag) return;
    if (tags.some(item => item.toLowerCase() === tag.toLowerCase())) { setFeedback('Tag already exists'); return; }
    if (tags.length >= limit) { setFeedback('Tag limit reached'); return; }
    setTags(old => [...old, tag]); setDraft(''); setFeedback('');
  }
  return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKeyDown} /></label>
    <ul data-testid="tags">{tags.map(tag => <li key={tag}>{tag}<button type="button" aria-label={'Remove ' + tag} onClick={() => remove(tag)}>Remove</button></li>)}</ul>
    <p data-testid="feedback" role="status">{feedback}</p></section>;
}
