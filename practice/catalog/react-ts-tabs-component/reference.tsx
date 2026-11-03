import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [index, setIndex] = useState(0), titles = ['One', 'Two']; function choose(i: number) { setIndex(i); document.getElementById('tab-' + i)?.focus(); } return <section><div role="tablist" aria-label="Sections">{titles.map((title, i) => <button key={title} role="tab" id={'tab-' + i} aria-controls={'panel-' + i} aria-selected={index === i} tabIndex={index === i ? 0 : -1} onClick={() => choose(i)} onKeyDown={e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
    choose(e.key === 'Home' ? 0 : e.key === 'End' ? 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + 2) % 2);
} }}>{title}</button>)}</div><div role="tabpanel" id={'panel-' + index} aria-labelledby={'tab-' + index}>{index === 0 ? 'First' : 'Second'}</div></section>; }

