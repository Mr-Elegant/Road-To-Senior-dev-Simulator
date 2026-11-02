function solution({channelId, messages, incoming}) {
  const byId = new Map(messages.map(m => [m.id, {...m}]));
  const sequences = new Set(messages.map(m => m.seq));
  const outcomes = incoming.map(m => {
    const text = x => typeof x === 'string' && x.length > 0;
    if (!text(m.id) || !text(m.channelId) || !Number.isSafeInteger(m.seq) || m.seq < 1 || typeof m.body !== 'string') return 'invalid';
    if (m.channelId !== channelId) return 'forbidden';
    const old = byId.get(m.id);
    if (old) return old.seq === m.seq && old.body === m.body ? 'duplicate' : 'conflict';
    if (sequences.has(m.seq)) return 'conflict';
    byId.set(m.id, {...m}); sequences.add(m.seq); return 'accepted';
  });
  return {messages: [...byId.values()].sort((a,b) => a.seq-b.seq), outcomes};
}
