const solution = (function solution({ wait, calls, end }) { const out = []; let last = -Infinity, pending = null, due = Infinity; function flush(t) { if (due <= t) {
        last = due;
        out.push([due, pending]);
        pending = null;
        due = Infinity;
    } } for (const [t, value] of calls) {
        flush(t);
        if (t - last >= wait) {
            last = t;
            out.push([t, value]);
        }
        else {
            pending = value;
            due = last + wait;
        }
    } flush(end); return out; });
