const solution = (async function solution(entries) { if (!entries.length)
        return { status: 'pending' }; const result = await new Promise(resolve => { for (const entry of entries)
        Promise.resolve(new Promise((ok, fail) => setTimeout(() => entry.reject ? fail(entry.value) : ok(entry.value), entry.delay))).then(value => resolve({ status: 'fulfilled', value }), value => resolve({ status: 'rejected', value })); }); return result; });
