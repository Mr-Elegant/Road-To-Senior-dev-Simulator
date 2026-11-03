const solution = (function solution(height) { if (!Number.isInteger(height) || height < 0 || height > 50)
        throw new Error('Invalid height'); return Array.from({ length: height }, (_, i) => ' '.repeat(height - i - 1) + '*'.repeat(2 * i + 1)); });
