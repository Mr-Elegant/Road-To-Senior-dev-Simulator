const solution = (function solution({ capacity, refillPerSecond, events }) { let tokens = capacity, last = 0; return events.map(({ time, cost }) => { tokens = Math.min(capacity, tokens + (time - last) * refillPerSecond / 1000); last = time; if (cost > tokens)
        return false; tokens -= cost; return true; }); });
