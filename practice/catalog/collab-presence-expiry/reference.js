function solution({now,sessions}) {
  const latest = new Map();
  for(const s of sessions) if(!latest.has(s.id) || s.version>latest.get(s.id).version) latest.set(s.id,s);
  const active = [...latest.values()].filter(s=>s.online && s.expiresAt>now);
  return {onlineUsers:[...new Set(active.map(s=>s.userId))].sort(),activeSessions:active.length};
}
