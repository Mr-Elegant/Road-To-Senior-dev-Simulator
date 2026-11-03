import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [open, setOpen] = useState(true); return <aside><button aria-label="Toggle sidebar" aria-controls="workspace-nav" aria-expanded={open} onClick={() => setOpen(v => !v)} onKeyDown={e => { if (e.key === 'Escape')
    setOpen(false); }}>Toggle sidebar</button>{open && <nav id="workspace-nav" aria-label="Workspace"><a href="#dashboard">Dashboard</a><a href="#reports">Reports</a></nav>}</aside>; }

