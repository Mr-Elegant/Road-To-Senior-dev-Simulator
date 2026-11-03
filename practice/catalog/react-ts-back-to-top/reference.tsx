import type * as React from 'react';
export interface AppProps {
    initialY?: number;
    threshold?: number;
}
import { useState } from 'react';
export default function App({ initialY = 0, threshold = 200 }: AppProps = {}): React.JSX.Element { const [y, setY] = useState(initialY); return <section><output data-testid="position">{y}</output>{y > threshold && <button onClick={() => setY(0)}>Back to top</button>}</section>; }

