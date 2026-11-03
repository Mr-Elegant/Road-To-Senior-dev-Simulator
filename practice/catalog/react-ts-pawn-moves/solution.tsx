import type * as React from 'react';

interface Occupant {
    row: number;
    col: number;
    side: "own" | "opponent";
}
export interface AppProps {
    start?: number[];
    occupied?: Occupant[];
}

export default function App(_props: AppProps): React.JSX.Element {
  // Implement the typed component contract.
  return <section><p>Build the documented component here.</p></section>;
}
