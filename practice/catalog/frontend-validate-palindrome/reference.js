const solution = (function solution(text) { const s = text.toLowerCase().replace(/[^a-z0-9]/g, ''); let l = 0, r = s.length - 1; while (l < r)
        if (s[l++] !== s[r--])
            return false; return true; });
