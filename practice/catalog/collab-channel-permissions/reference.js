function solution({tenantId,channel,session,members,action}) {
  const deny = reason => ({allowed:false,reason});
  if(!['read','send','manage'].includes(action)) return deny('invalid_action');
  if(!session || !session.active || !session.userId) return deny('unauthenticated');
  if(session.tenantId!==tenantId || channel.tenantId!==tenantId) return deny('forbidden');
  const member = members.find(m=>m.userId===session.userId && m.active);
  if(channel.private && !member) return deny('forbidden');
  if(action==='manage' && member?.role!=='admin') return deny('forbidden');
  if(action==='send' && channel.archived) return deny('read_only');
  return {allowed:true,reason:'allowed'};
}
