function solution({recipientId,mutedChannels,mentionsOnly,events}) {
  const seen = new Set(), muted = new Set(mutedChannels), delivered=[];
  const outcomes = events.map(e=>{
    if(seen.has(e.id)) return 'duplicate'; seen.add(e.id);
    if(e.authorId===recipientId) return 'self';
    if(muted.has(e.channelId)) return 'muted';
    if(mentionsOnly && !e.mentionIds.includes(recipientId)) return 'skipped';
    delivered.push(e.id); return 'delivered';
  });
  return {delivered,outcomes};
}
