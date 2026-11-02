function solution({cursor, highWater, retainedFrom, limit, events}) {
  if (cursor > highWater) return {status:'invalid_cursor',events:[],nextCursor:cursor,hasMore:false};
  if (cursor < retainedFrom-1) return {status:'reset',events:[],nextCursor:highWater,hasMore:false};
  const page = events.filter(e => e.seq > cursor).slice(0,limit).map(e => ({...e}));
  const nextCursor = page.length ? page[page.length-1].seq : cursor;
  return {status:'ok',events:page,nextCursor,hasMore:nextCursor<highWater};
}
