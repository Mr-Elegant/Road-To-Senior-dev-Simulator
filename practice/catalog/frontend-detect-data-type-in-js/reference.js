const solution = (function solution(entries) { const values = { null: null, array: [], date: new Date(0), map: new Map(), set: new Set(), nan: NaN, number: 1, string: 'x', boolean: false, function: () => { }, object: {} }; return entries.map(k => { const v = values[k]; if (v === null)
        return 'null'; if (Array.isArray(v))
        return 'array'; if (typeof v === 'number' && Number.isNaN(v))
        return 'nan'; if (v instanceof Date)
        return 'date'; if (v instanceof Map)
        return 'map'; if (v instanceof Set)
        return 'set'; return typeof v; }); });
