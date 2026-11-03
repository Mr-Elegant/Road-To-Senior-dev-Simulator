import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [open, setOpen] = useState(false); return <section><button aria-describedby={open ? 'help-tip' : undefined} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={e => { if (e.key === 'Escape')
    setOpen(false); }}>Help</button>{open && <div id="help-tip" role="tooltip">Extra help</div>}</section>; }

