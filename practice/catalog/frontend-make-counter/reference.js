const solution = (function solution({ initial = 0, commands }) { let value = initial; return commands.map(c => { if (c === 'increment')
        value++; if (c === 'decrement')
        value--; if (c === 'reset')
        value = initial; return value; }); });
