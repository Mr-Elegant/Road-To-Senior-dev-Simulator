const solution = (function solution({ text, limit }) { if (!Number.isInteger(limit) || limit < 1)
        throw new Error('Invalid limit'); const out = []; for (const char of Array.from(text)) {
        const last = out[out.length - 1];
        if (last && last[0] === char && last[1] < limit)
            last[1]++;
        else
            out.push([char, 1]);
    } return out; });
