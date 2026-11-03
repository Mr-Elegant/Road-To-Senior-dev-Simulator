const solution = (function solution(text) { const stack = [-1]; let best = 0; for (let i = 0; i < text.length; i++) {
        if (text[i] === '(')
            stack.push(i);
        else {
            stack.pop();
            if (!stack.length)
                stack.push(i);
            else
                best = Math.max(best, i - stack[stack.length - 1]);
        }
    } return best; });
