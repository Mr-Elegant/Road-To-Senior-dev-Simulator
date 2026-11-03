const solution = (function solution({ board, word }) { const chars = Array.from(word); if (!chars.length)
        return true; const rows = board.length, cols = board[0]?.length || 0, used = new Set(); function dfs(r, c, i) { if (i === chars.length)
        return true; const id = r + ',' + c; if (r < 0 || c < 0 || r >= rows || c >= cols || used.has(id) || board[r][c] !== chars[i])
        return false; used.add(id); const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1); used.delete(id); return ok; } for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (dfs(r, c, 0))
                return true; return false; });
