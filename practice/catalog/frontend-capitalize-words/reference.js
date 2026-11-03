const solution = (function solution(text) { return text.replace(/\S+/gu, word => { const chars = Array.from(word); return chars[0].toUpperCase() + chars.slice(1).join(''); }); });
