const solution = (function solution(values) { const stack = [...values].reverse(), out = []; while (stack.length) {
        const value = stack.pop();
        if (Array.isArray(value)) {
            for (let i = value.length - 1; i >= 0; i--)
                stack.push(value[i]);
        }
        else
            out.push(value);
    } return out; });
