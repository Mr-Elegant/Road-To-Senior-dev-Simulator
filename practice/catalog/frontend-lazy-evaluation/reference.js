const solution = (function solution({ values, take, minimum }) { let visited = 0; function* source() { for (const n of values) {
        visited++;
        if (n >= minimum)
            yield n * 2;
    } } const output = []; if (take > 0) {
        for (const n of source()) {
            output.push(n);
            if (output.length === take)
                break;
        }
    } return { values: output, visited }; });
