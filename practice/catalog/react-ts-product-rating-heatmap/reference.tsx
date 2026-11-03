import type * as React from 'react';
export interface AppProps {
    values?: ((number | null)[])[];
}
export default function App({ values = [[0, 2], [4, 1]] }: AppProps = {}): React.JSX.Element { const max = Math.max(0, ...values.flat().filter(v => v !== null)); return <table><caption>Ratings</caption><tbody>{values.map((row, r) => <tr key={r}>{row.map((v, c) => <td key={c} data-cell={r + ',' + c} data-level={v === null ? 'missing' : max ? Math.floor(v / max * 4) : 0}>{v === null ? '-' : v}</td>)}</tr>)}</tbody></table>; }

