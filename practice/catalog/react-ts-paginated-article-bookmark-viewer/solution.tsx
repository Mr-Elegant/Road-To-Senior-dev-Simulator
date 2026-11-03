import type * as React from 'react';

export interface AppProps {
    items?: (string)[];
    pageSize?: number;
}

export default function App(_props: AppProps): React.JSX.Element {
  // Implement the typed component contract.
  return <section><p>Build the documented component here.</p></section>;
}
