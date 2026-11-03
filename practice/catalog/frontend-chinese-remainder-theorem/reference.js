const solution = (function solution({ residues, moduli }) { const ms = moduli.map((s) => BigInt(s)), as = residues.map((s) => BigInt(s)); const norm = (a, m) => (a % m + m) % m; function egcd(a, b) { if (b === 0n)
        return [a, 1n, 0n]; const [g, x, y] = egcd(b, a % b); return [g, y, x - a / b * y]; } for (let i = 0; i < ms.length; i++)
        for (let j = 0; j < i; j++)
            if (egcd(ms[i], ms[j])[0] !== 1n)
                throw new Error('Not coprime'); const modulus = ms.reduce((a, b) => a * b, 1n); let result = 0n; for (let i = 0; i < ms.length; i++) {
        const part = modulus / ms[i], inverse = norm(egcd(part, ms[i])[1], ms[i]);
        result += as[i] * part * inverse;
    } return { value: norm(result, modulus).toString(), modulus: modulus.toString() }; });
