import type * as React from 'react';
export interface AppProps {
    accept?: boolean;
}
import { useState } from 'react';
export default function App({ accept = true }: AppProps = {}): React.JSX.Element { const [email, setEmail] = useState(''), [user, setUser] = useState(''), [message, setMessage] = useState('Signed out'); async function signIn() { if (!email.trim()) {
    setMessage('Email required');
    return;
} setMessage('Signing in'); await Promise.resolve(); if (accept) {
    setUser(email.trim());
    setMessage('Signed in: ' + email.trim());
}
else
    setMessage('Sign in failed'); } return <section><label>Email<input aria-label="Email" value={email} onChange={e => setEmail(e.target.value)}/></label>{user ? <button onClick={() => { setUser(''); setMessage('Signed out'); }}>Sign out</button> : <button onClick={signIn}>Sign in</button>}<p data-testid="session">{message}</p></section>; }

