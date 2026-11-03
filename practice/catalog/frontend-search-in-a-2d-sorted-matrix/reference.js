const solution = (function solution({ matrix, target }) { let r = 0, c = (matrix[0]?.length || 0) - 1; while (r < matrix.length && c >= 0) {
        if (matrix[r][c] === target)
            return true;
        if (matrix[r][c] > target)
            c--;
        else
            r++;
    } return false; });
