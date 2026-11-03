const solution = (function solution({ workers, jobs, events }) { const active = Array(workers).fill(null), queued = [...jobs], assignments = [], completed = []; function pump() { for (let w = 0; w < workers; w++)
        if (active[w] === null && queued.length) {
            active[w] = queued.shift();
            assignments.push([w, active[w]]);
        } } pump(); for (const e of events) {
        const job = active[e.worker];
        if (job !== null && job !== undefined) {
            if (e.type === 'done')
                completed.push(job);
            else
                queued.unshift(job);
            active[e.worker] = null;
        }
        pump();
    } return { assignments, completed, active, queued }; });
