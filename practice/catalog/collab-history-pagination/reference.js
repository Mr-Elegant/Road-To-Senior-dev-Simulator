function solution({channelId,messages,before,limit}) {
  const eligible=messages.filter(m=>m.channelId===channelId && (before===null || m.seq<before)).sort((a,b)=>b.seq-a.seq);
  const page=eligible.slice(0,limit).map(m=>({...m}));
  return {messages:page,nextBefore:page.length?page[page.length-1].seq:before,hasMore:eligible.length>page.length};
}
