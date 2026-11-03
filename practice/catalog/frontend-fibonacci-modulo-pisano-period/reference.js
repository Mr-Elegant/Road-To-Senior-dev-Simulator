const solution = (function solution({ n, modulus }) { if (!/^\d+$/.test(n) || !Number.isInteger(modulus) || modulus < 1 || modulus > 1000000)
        throw new Error('Invalid input'); const m = BigInt(modulus); function fib(k) { if (k === 0n)
        return [0n, 1n % m]; const [a, b] = fib(k / 2n), c = a * ((2n * b - a + m) % m) % m, d = (a * a + b * b) % m; return k % 2n ? [d, (c + d) % m] : [c, d]; } return Number(fib(BigInt(n))[0]); });
