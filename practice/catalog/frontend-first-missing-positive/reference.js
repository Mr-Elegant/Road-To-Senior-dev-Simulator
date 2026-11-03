const solution = (function solution(values) { for (let i = 0; i < values.length; i++)
        while (Number.isInteger(values[i]) && values[i] > 0 && values[i] <= values.length && values[values[i] - 1] !== values[i]) {
            const j = values[i] - 1;
            [values[i], values[j]] = [values[j], values[i]];
        } for (let i = 0; i < values.length; i++)
        if (values[i] !== i + 1)
            return i + 1; return values.length + 1; });
