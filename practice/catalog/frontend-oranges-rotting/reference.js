const solution = (function solution(grid) { const a = grid.map(row => [...row]), queue = []; let fresh = 0, minutes = 0; for (let r = 0; r < a.length; r++)
        for (let c = 0; c < a[r].length; c++) {
            if (a[r][c] === 1)
                fresh++;
            if (a[r][c] === 2)
                queue.push([r, c, 0]);
        } for (let head = 0; head < queue.length; head++) {
        const [r, c, t] = queue[head];
        minutes = t;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (a[nr]?.[nc] === 1) {
                a[nr][nc] = 2;
                fresh--;
                queue.push([nr, nc, t + 1]);
            }
        }
    } return fresh ? -1 : minutes; });
