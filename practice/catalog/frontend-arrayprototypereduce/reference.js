const solution = (function solution(input) { const { values, operation } = input; let index = 0, acc; if (Object.hasOwn(input, 'initial'))
        acc = input.initial;
    else {
        if (!values.length)
            throw new Error('Empty reduction');
        acc = values[index++];
    } for (; index < values.length; index++)
        acc = operation === 'multiply' ? acc * values[index] : acc + values[index]; return acc; });
