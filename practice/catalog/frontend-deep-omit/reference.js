const solution = (function solution({ value, keys }) { const omitted = new Set(keys); function visit(v) { if (Array.isArray(v))
        return v.map(visit); if (v && typeof v === 'object') {
        const out = Object.create(null);
        for (const key of Object.keys(v))
            if (!omitted.has(key))
                out[key] = visit(v[key]);
        return out;
    } return v; } return visit(value); });
