const solution = (function solution({ values, target }) { let l = 0, r = values.length - 1; while (l <= r) {
        const m = l + Math.floor((r - l) / 2);
        if (values[m] === target)
            return m;
        if (values[l] <= values[m]) {
            if (values[l] <= target && target < values[m])
                r = m - 1;
            else
                l = m + 1;
        }
        else if (values[m] < target && target <= values[r])
            l = m + 1;
        else
            r = m - 1;
    } return -1; });
