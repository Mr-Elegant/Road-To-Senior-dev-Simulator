const solution = (function solution(values) { let l = 0, r = values.length - 1; while (l < r) {
        let m = l + Math.floor((r - l) / 2);
        if (m % 2)
            m--;
        if (values[m] === values[m + 1])
            l = m + 2;
        else
            r = m;
    } return values[l]; });
