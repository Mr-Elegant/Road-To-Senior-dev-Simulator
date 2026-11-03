const solution = (function solution({ value, path, fallback = null }) { for (const key of path) {
        if (value === null || typeof value !== 'object' || !Object.hasOwn(value, key))
            return fallback;
        value = value[key];
    } return value; });
