const solution = (function solution({ age, minimum }) { if (!Number.isInteger(age) || age < 0 || !Number.isInteger(minimum) || minimum < 0)
        throw new Error('Invalid age'); return age >= minimum; });
