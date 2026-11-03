const solution = (function solution({ values, k }) { if (!Number.isInteger(k) || k < 1 || k > values.length)
        throw new Error('Invalid window'); const deque = [], out = []; let head = 0; for (let i = 0; i < values.length; i++) {
        while (head < deque.length && deque[head] <= i - k)
            head++;
        while (head < deque.length && values[deque[deque.length - 1]] <= values[i])
            deque.pop();
        deque.push(i);
        if (i >= k - 1)
            out.push(values[deque[head]]);
    } return out; });
