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
import { useState } from 'react';
function allowed(row: number, col: number, occupied: Occupant[]): number[][] {
    const result = [], at = (r: number, c: number) => occupied.find(p => p.row === r && p.col === c), inside = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
    let piece: string = "queen";
    if (piece === 'pawn') {
        if (inside(row - 1, col) && !at(row - 1, col)) {
            result.push([row - 1, col]);
            if (row === 6 && !at(row - 2, col))
                result.push([row - 2, col]);
        }
        for (const dc of [-1, 1])
            if (inside(row - 1, col + dc) && at(row - 1, col + dc)?.side === 'opponent')
                result.push([row - 1, col + dc]);
        return result;
    }
    if (piece === 'knight' || piece === 'king') {
        const offsets = piece === 'knight' ? [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]] : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dr, dc] of offsets) {
            const r = row + dr, c = col + dc;
            if (inside(r, c) && at(r, c)?.side !== 'own')
                result.push([r, c]);
        }
        return result;
    }
    const directions = piece === 'rook' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : piece === 'bishop' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dr, dc] of directions) {
        let r = row + dr, c = col + dc;
        while (inside(r, c)) {
            const blocker = at(r, c);
            if (blocker?.side !== 'own')
                result.push([r, c]);
            if (blocker)
                break;
            r += dr;
            c += dc;
        }
    }
    return result;
}
export default function App({ start = [3, 3], occupied = [] }: AppProps = {}): React.JSX.Element { const [selected, setSelected] = useState(start); const targets = allowed(selected[0], selected[1], occupied).map(p => p.join(',')); return <section><div role="group" aria-label="Board" style={{ display: 'grid', gridTemplateColumns: 'repeat(8,minmax(0,1fr))' }}>{Array.from({ length: 64 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8, id = r + ',' + c; return <button key={id} data-cell={id} data-allowed={targets.includes(id)} aria-label={'Square ' + id} aria-pressed={selected[0] === r && selected[1] === c} onClick={() => setSelected([r, c])}>{targets.includes(id) ? 'Move' : '·'}</button>; })}</div><output data-testid="moves">{targets.length}</output></section>; }

