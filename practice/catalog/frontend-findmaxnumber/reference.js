const solution = (function solution(values) { if (!values.length)
        return null; let index = 0; for (let i = 1; i < values.length; i++)
        if (values[i] > values[index])
            index = i; return { value: values[index], index }; });
