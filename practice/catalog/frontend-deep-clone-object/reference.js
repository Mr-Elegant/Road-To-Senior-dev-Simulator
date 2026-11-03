const solution = (function solution({ value, cycle = false }) { const source = structuredClone(value); if (cycle) {
        source.self = source;
        source.aliasA = { x: 1 };
        source.aliasB = source.aliasA;
    } const seen = new Map(); function clone(v) { if (!v || typeof v !== 'object')
        return v; if (seen.has(v))
        return seen.get(v); const out = Array.isArray(v) ? [] : {}; seen.set(v, out); for (const k of Object.keys(v))
        out[k] = clone(v[k]); return out; } const output = clone(source); function separate(a, b) { if (!a || typeof a !== 'object')
        return true; if (a === b)
        return false; return Object.keys(a).every(k => separate(a[k], b[k])); } const plain = clone(value); return { equal: JSON.stringify(plain) === JSON.stringify(value), distinct: !value || typeof value !== 'object' || output !== source, nestedDistinct: separate(value, plain), cyclePreserved: !cycle || output.self === output, aliasPreserved: !cycle || output.aliasA === output.aliasB && output.aliasA !== source.aliasA }; });
