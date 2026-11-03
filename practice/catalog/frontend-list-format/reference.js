const solution = (function solution(items) { if (items.length < 2)
        return items[0] || ''; if (items.length === 2)
        return items[0] + ' and ' + items[1]; return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1]; });
