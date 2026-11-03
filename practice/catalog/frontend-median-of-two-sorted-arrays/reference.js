const solution = (function solution({ left, right }) { let a = left, b = right; if (a.length > b.length)
        [a, b] = [b, a]; if (!a.length && !b.length)
        throw new Error('Empty arrays'); let low = 0, high = a.length; const half = Math.floor((a.length + b.length + 1) / 2); while (low <= high) {
        const i = Math.floor((low + high) / 2), j = half - i, al = i ? a[i - 1] : -Infinity, ar = i < a.length ? a[i] : Infinity, bl = j ? b[j - 1] : -Infinity, br = j < b.length ? b[j] : Infinity;
        if (al <= br && bl <= ar)
            return (a.length + b.length) % 2 ? Math.max(al, bl) : (Math.max(al, bl) + Math.min(ar, br)) / 2;
        if (al > br)
            high = i - 1;
        else
            low = i + 1;
    } throw new Error('Invalid arrays'); });
