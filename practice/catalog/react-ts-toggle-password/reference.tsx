import type * as React from 'react';
export interface AppProps {
}
import { useState } from 'react';
export default function App(): React.JSX.Element { const [value, setValue] = useState(''), [show, setShow] = useState(false); return <form onSubmit={e => e.preventDefault()}><label>Password<input aria-label="Password" type={show ? 'text' : 'password'} value={value} onChange={e => setValue(e.target.value)}/></label><button type="button" onClick={() => setShow(v => !v)}>{show ? 'Hide password' : 'Show password'}</button></form>; }

