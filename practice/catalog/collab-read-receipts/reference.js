function solution({userId,lastRead,highWater,updates}) {
  const outcomes = updates.map(u => {
    if (u.userId !== userId) return 'forbidden';
    if (!Number.isSafeInteger(u.sequence) || u.sequence<0 || u.sequence>highWater) return 'invalid';
    if (u.sequence<=lastRead) return 'stale';
    lastRead=u.sequence; return 'advanced';
  });
  return {lastRead,unread:highWater-lastRead,outcomes};
}
