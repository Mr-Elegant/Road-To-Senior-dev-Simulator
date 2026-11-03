const solution = (async function solution({ values, limit }) { if (!Number.isInteger(limit) || limit < 1)
        throw new Error('Invalid limit'); let next = 0, active = 0, peak = 0; const result = new Array(values.length); async function worker() { while (next < values.length) {
        const i = next++;
        active++;
        peak = Math.max(peak, active);
        try {
            result[i] = await new Promise(resolve => setTimeout(() => resolve(values[i]), 0));
        }
        finally {
            active--;
        }
    } } await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker)); return { values: result, peak }; });
