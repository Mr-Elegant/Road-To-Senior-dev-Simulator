import type * as React from 'react';
export interface AppProps {
    state?: string;
    content?: string;
}
export default function App({ state = 'loading', content = 'Ready' }: AppProps = {}): React.JSX.Element { return <section aria-label="Results" aria-busy={state === 'loading'}>{state === 'loading' ? <div data-testid="skeleton" aria-hidden="true" style={{ height: 40, background: '#d4d4d8' }}/> : state === 'error' ? <p role="alert">Unable to load</p> : state === 'empty' ? <p>No results</p> : <p>{content}</p>}</section>; }

