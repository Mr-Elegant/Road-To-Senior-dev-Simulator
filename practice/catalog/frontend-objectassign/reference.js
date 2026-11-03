const solution = (function solution({ target, sources }) { const out = Object.create(null); for (const source of [target, ...sources])
        if (source != null)
            for (const key of Object.keys(source))
                Object.defineProperty(out, key, { value: source[key], writable: true, configurable: true, enumerable: true }); return out; });
