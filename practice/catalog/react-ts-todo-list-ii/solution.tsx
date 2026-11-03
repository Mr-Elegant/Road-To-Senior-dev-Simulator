import type * as React from 'react';

interface Task {
    id: string;
    title: string;
    done: boolean;
}
export interface AppProps {
}

export default function App(_props: AppProps): React.JSX.Element {
  // Implement the typed component contract.
  return <section><p>Build the documented component here.</p></section>;
}
