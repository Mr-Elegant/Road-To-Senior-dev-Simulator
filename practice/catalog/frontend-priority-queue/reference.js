const solution = (function solution(commands) { const heap = []; function push(v) { heap.push(v); let i = heap.length - 1; while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        if (heap[p] <= heap[i])
            break;
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
    } } function pop() { if (!heap.length)
        return null; const first = heap[0], last = heap.pop(); if (heap.length) {
        heap[0] = last;
        let i = 0;
        while (true) {
            let best = i, l = i * 2 + 1, r = l + 1;
            if (l < heap.length && heap[l] < heap[best])
                best = l;
            if (r < heap.length && heap[r] < heap[best])
                best = r;
            if (best === i)
                break;
            [heap[i], heap[best]] = [heap[best], heap[i]];
            i = best;
        }
    } return first; } return commands.map(c => { if (c.type === 'push') {
        push(c.value);
        return heap.length;
    } return c.type === 'peek' ? (heap[0] ?? null) : pop(); }); });
