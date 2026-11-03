const solution = (function solution(values) { const stack = [], left = [], right = Array(values.length).fill(values.length); for (let i = 0; i < values.length; i++) {
        while (stack.length && values[stack[stack.length - 1]] >= values[i])
            right[stack.pop()] = i;
        left[i] = stack.length ? stack[stack.length - 1] : -1;
        stack.push(i);
    } return values.reduce((sum, n, i) => sum + n * (i - left[i]) * (right[i] - i), 0); });
