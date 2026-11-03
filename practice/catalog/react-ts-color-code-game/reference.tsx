import type * as React from 'react';
export interface AppProps {
    colors?: (string)[];
    answer?: string;
}
import { useState } from 'react';
export default function App({ colors = ['red', 'blue', 'green'], answer = 'blue' }: AppProps = {}): React.JSX.Element { const [feedback, setFeedback] = useState(''); return <section>{colors.map(color => <button key={color} data-color={color} onClick={() => { if (feedback !== 'Correct')
    setFeedback(color === answer ? 'Correct' : 'Incorrect'); }}>{color}</button>)}<button data-action="reset" onClick={() => setFeedback('')}>Reset</button><p data-testid="feedback">{feedback}</p></section>; }

