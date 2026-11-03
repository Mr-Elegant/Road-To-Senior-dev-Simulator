const solution = (function solution(commands) { const stack = []; return commands.map(c => { if (c.type === 'push') {
        stack.push(c.value);
        return stack.length;
    } if (c.type === 'size')
        return stack.length; if (c.type === 'peek')
        return stack.length ? stack[stack.length - 1] : null; return stack.length ? stack.pop() : null; }); });
