const solution = (function solution(records) { return [...records].sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); });
