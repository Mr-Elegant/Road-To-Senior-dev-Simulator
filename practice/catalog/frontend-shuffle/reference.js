const solution = (function solution({ values, draws }) { const result = [...values]; let d = 0; for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(draws[d++] * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    } return result; });
