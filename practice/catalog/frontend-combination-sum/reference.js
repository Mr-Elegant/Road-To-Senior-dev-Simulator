const solution = (function solution({ candidates, target }) { const nums = [...candidates].sort((a, b) => a - b), out = []; function dfs(start, left, path) { if (left === 0) {
        out.push([...path]);
        return;
    } for (let i = start; i < nums.length; i++) {
        if (nums[i] > left)
            break;
        path.push(nums[i]);
        dfs(i, left - nums[i], path);
        path.pop();
    } } dfs(0, target, []); return out; });
