const solution = (function solution(matrix) { if (!matrix.length || !matrix[0].length)
        return []; let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1; const out = []; while (top <= bottom && left <= right) {
        for (let c = left; c <= right; c++)
            out.push(matrix[top][c]);
        top++;
        for (let r = top; r <= bottom; r++)
            out.push(matrix[r][right]);
        right--;
        if (top <= bottom) {
            for (let c = right; c >= left; c--)
                out.push(matrix[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (let r = bottom; r >= top; r--)
                out.push(matrix[r][left]);
            left++;
        }
    } return out; });
