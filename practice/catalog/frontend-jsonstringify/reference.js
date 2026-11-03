const solution = (function solution(value) { function quote(s) { return '"' + s.replace(/["\\\u0000-\u001f]/g, c => { const escapes = { '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' }; return escapes[c] || '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'); }) + '"'; } function encode(v) { if (v === null)
        return 'null'; if (typeof v === 'string')
        return quote(v); if (typeof v === 'number' || typeof v === 'boolean')
        return String(v); if (Array.isArray(v))
        return '[' + v.map(encode).join(',') + ']'; return '{' + Object.keys(v).map(k => quote(k) + ':' + encode(v[k])).join(',') + '}'; } return encode(value); });
