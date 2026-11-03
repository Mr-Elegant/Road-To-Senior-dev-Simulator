const solution = (function solution({ wait, calls, end }) { const out = []; let due = Infinity, value; for (const [t, v] of calls) {
        if (due <= t)
            out.push([due, value]);
        due = t + wait;
        value = v;
    } if (due <= end)
        out.push([due, value]); return out; });
