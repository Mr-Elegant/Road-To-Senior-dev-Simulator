const solution = (function solution({ values, size }) { if (!Number.isInteger(size) || size < 1)
        throw new Error('Invalid size'); const chunks = []; for (let i = 0; i < values.length; i += size)
        chunks.push(values.slice(i, i + size)); return chunks; });
