const solution = (function solution(text) { return text.replace(/\S+/gu, word => Array.from(word).reverse().join('')); });
