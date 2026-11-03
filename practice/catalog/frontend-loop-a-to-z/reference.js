const solution = (function solution({ from = 'A', to = 'Z' }) { if (!/^[A-Z]$/.test(from) || !/^[A-Z]$/.test(to) || from > to)
        throw new Error('Invalid range'); return Array.from({ length: to.charCodeAt(0) - from.charCodeAt(0) + 1 }, (_, i) => String.fromCharCode(from.charCodeAt(0) + i)); });
