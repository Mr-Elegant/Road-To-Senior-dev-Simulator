import type { Scenario, TestCase } from '@/types/scenario';
import { businessCase as tc, businessScenario } from './businessScenario';

function exercise(id: string, title: string, context: string, contract: string, code: string,
  starter: string, cases: TestCase[], explanation: string, followUp: string): Scenario {
  return businessScenario({
    id: `collab-${id}`, title: `Collaboration: ${title}`, type: 'debugging', topic: 'Integrations',
    subtopic: 'Real-time collaboration / Messaging and meetings', difficulty: 'Senior', estimatedMinutes: 35,
    businessContext: context, problemStatement: contract,
    constraints: ['Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.',
      'This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.'],
    candidateTasks: ['Reproduce the starter failure, implement the invariant, and pass every authored case.', followUp],
    starterCode: starter, testCases: cases,
    hints: ['Write down validation and replay precedence before changing state.', 'Use stable IDs and monotonic sequence/version values; preserve input ownership.'],
    assessment: 'Correctly handle retries, ordering, boundaries, and unauthorized/stale events using the stated contract.',
    referenceSolution: { codeOrArtifact: code, explanation,
      architectureNotes: `${followUp} Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees.` },
    alternativeApproaches: ['Use an append-only event log with transactional projections.', 'Use a database snapshot plus a versioned resume cursor.'],
    commonMistakes: ['Trusting delivery order or treating retries as new operations.', 'Mutating caller-owned arrays or accepting cross-channel data.', 'Presenting a fixture result as a guarantee of real-time delivery or media connectivity.'],
    followUpQuestions: [{ id: `${id}-production`, question: followUp,
      expectedConcepts: ['durable ordering', 'authenticated scope', 'replay', 'failure recovery'],
      sampleStrongAnswer: explanation + ' Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests.' }],
  });
}

const m = (id: string, seq: number, body = id, channelId = 'c') => ({ id, seq, body, channelId });
const snapshot = (id: string, userId: string, version: number, expiresAt: number, online = true) => ({ id, userId, version, expiresAt, online });

export const collaborationScenarios: Scenario[] = [
  exercise('message-ordering', 'Deduplicate and Order Retried Messages',
    'After reconnecting, a team chat shows duplicate messages and places delayed deliveries after newer messages.',
    'Implement solution({ channelId, messages, incoming }). Existing messages are valid and have unique IDs/sequences in this channel. A message has nonempty string id/channelId, positive safe-integer seq, and string body. For each incoming record: invalid shape => invalid; foreign channel => forbidden; an existing ID with identical seq/body => duplicate, otherwise conflict; an occupied seq under another ID => conflict; otherwise accepted. Return { messages, outcomes }, ordered by ascending seq. Inputs are plain objects; incoming records may have missing or invalid fields.',
    `function solution({channelId, messages, incoming}) {
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
}`,
    `function solution({messages, incoming}) { return {messages: messages.concat(incoming), outcomes: incoming.map(() => 'accepted')}; }`,
    [tc('msg-1', 'Accept first message', {channelId:'c',messages:[],incoming:[m('a',1)]}, {messages:[m('a',1)],outcomes:['accepted']}),
      tc('msg-2', 'Sort delayed deliveries', {channelId:'c',messages:[m('b',2)],incoming:[m('a',1)]}, {messages:[m('a',1),m('b',2)],outcomes:['accepted']}),
      tc('msg-3', 'Deduplicate a retry in the same batch', {channelId:'c',messages:[],incoming:[m('a',1),m('a',1)]}, {messages:[m('a',1)],outcomes:['accepted','duplicate']},true),
      tc('msg-4', 'Reject changed payload under same ID', {channelId:'c',messages:[m('a',1)],incoming:[m('a',1,'changed')]}, {messages:[m('a',1)],outcomes:['conflict']},true),
      tc('msg-5', 'Reject sequence collision', {channelId:'c',messages:[m('a',1)],incoming:[m('b',1)]}, {messages:[m('a',1)],outcomes:['conflict']},true),
      tc('msg-6', 'Reject cross-channel deliveries before deduplication', {channelId:'c',messages:[m('a',1)],incoming:[m('a',1,'a','other')]}, {messages:[m('a',1)],outcomes:['forbidden']},true),
      tc('msg-7', 'Validate malformed and unsafe sequence fields', {channelId:'c',messages:[],incoming:[m('a',0),m('b',1.5),m('c',9007199254740992),{id:'x'},m('',1)]}, {messages:[],outcomes:['invalid','invalid','invalid','invalid','invalid']},true)],
    'Keep both an ID index and a sequence index. Validate before checking channel ownership, then distinguish identical retries from conflicting reuse. Sort a new array rather than mutating the existing timeline. Production requires server-assigned per-conversation sequences and unique constraints; timestamps alone cannot establish a total order.',
    'How would you persist server-assigned ordering and idempotency keys across concurrent message producers?'),

  exercise('reconnect-cursor', 'Resume a Conversation After Disconnection',
    'A laptop reconnects after a long outage. Blindly replaying the latest page loses messages, while an expired cursor silently hides history.',
    'Implement solution({ cursor, highWater, retainedFrom, limit, events }). Inputs are valid safe integers: 0 <= cursor, 0 <= highWater, 1 <= retainedFrom <= highWater+1, limit >= 1. events is the ascending contiguous retained log with seq retainedFrom through highWater. Return { status, events, nextCursor, hasMore }. cursor > highWater => invalid_cursor with empty events and unchanged cursor. cursor < retainedFrom-1 => reset with empty events and nextCursor=highWater; obtain a separate snapshot before continuing. Otherwise return up to limit events strictly after cursor, status ok, nextCursor=last returned seq or cursor, hasMore=nextCursor<highWater. Error/reset hasMore is false.',
    `function solution({cursor, highWater, retainedFrom, limit, events}) {
  if (cursor > highWater) return {status:'invalid_cursor',events:[],nextCursor:cursor,hasMore:false};
  if (cursor < retainedFrom-1) return {status:'reset',events:[],nextCursor:highWater,hasMore:false};
  const page = events.filter(e => e.seq > cursor).slice(0,limit).map(e => ({...e}));
  const nextCursor = page.length ? page[page.length-1].seq : cursor;
  return {status:'ok',events:page,nextCursor,hasMore:nextCursor<highWater};
}`,
    `function solution({events,highWater}) { return {status:'ok',events,nextCursor:highWater,hasMore:false}; }`,
    [tc('resume-1','Resume strictly after acknowledged cursor',{cursor:1,highWater:3,retainedFrom:1,limit:5,events:[{seq:1},{seq:2},{seq:3}]},{status:'ok',events:[{seq:2},{seq:3}],nextCursor:3,hasMore:false}),
      tc('resume-2','Bound a replay page',{cursor:0,highWater:3,retainedFrom:1,limit:2,events:[{seq:1},{seq:2},{seq:3}]},{status:'ok',events:[{seq:1},{seq:2}],nextCursor:2,hasMore:true}),
      tc('resume-3','Retention boundary remains resumable',{cursor:2,highWater:4,retainedFrom:3,limit:1,events:[{seq:3},{seq:4}]},{status:'ok',events:[{seq:3}],nextCursor:3,hasMore:true},true),
      tc('resume-4','Expired cursor requires snapshot reset',{cursor:1,highWater:4,retainedFrom:3,limit:2,events:[{seq:3},{seq:4}]},{status:'reset',events:[],nextCursor:4,hasMore:false},true),
      tc('resume-5','Reject a future cursor',{cursor:5,highWater:4,retainedFrom:3,limit:2,events:[{seq:3},{seq:4}]},{status:'invalid_cursor',events:[],nextCursor:5,hasMore:false},true),
      tc('resume-6','Already caught up does not replay last message',{cursor:2,highWater:2,retainedFrom:1,limit:2,events:[{seq:1},{seq:2}]},{status:'ok',events:[],nextCursor:2,hasMore:false},true),
      tc('resume-7','Empty log has a stable zero cursor',{cursor:0,highWater:0,retainedFrom:1,limit:2,events:[]},{status:'ok',events:[],nextCursor:0,hasMore:false},true)],
    'A cursor acknowledges the last applied sequence, not a page number. Replay strictly greater sequences within a fixed high-water snapshot. Distinguish an expired cursor from an empty result so the client fetches a fresh snapshot instead of treating missing history as complete. Persist the cursor only after applying a page successfully.',
    'How would you atomically capture a snapshot/high-water pair and handle a connection dropping before acknowledgement?'),

  exercise('read-receipts', 'Keep Read Receipts Monotonic Across Devices',
    'An old mobile receipt arrives after a desktop receipt and increases the unread badge. Another user’s receipt is mistakenly applied locally.',
    'Implement solution({ userId, lastRead, highWater, updates }). lastRead/highWater are safe integers with 0 <= lastRead <= highWater. Each update is an object. A nonmatching userId => forbidden before validation. For this user, sequence must be a safe integer in [0,highWater], otherwise invalid. sequence <= current lastRead => stale; otherwise advance and return advanced. Return { lastRead, unread:highWater-lastRead, outcomes }. Empty updates leave the receipt unchanged.',
    `function solution({userId,lastRead,highWater,updates}) {
  const outcomes = updates.map(u => {
    if (u.userId !== userId) return 'forbidden';
    if (!Number.isSafeInteger(u.sequence) || u.sequence<0 || u.sequence>highWater) return 'invalid';
    if (u.sequence<=lastRead) return 'stale';
    lastRead=u.sequence; return 'advanced';
  });
  return {lastRead,unread:highWater-lastRead,outcomes};
}`,
    `function solution({lastRead,highWater,updates}) { for(const u of updates) lastRead=u.sequence; return {lastRead,unread:highWater-lastRead,outcomes:updates.map(()=>'advanced')}; }`,
    [tc('read-1','Advance a receipt',{userId:'u',lastRead:1,highWater:5,updates:[{userId:'u',sequence:3}]},{lastRead:3,unread:2,outcomes:['advanced']}),
      tc('read-2','Ignore older device acknowledgement',{userId:'u',lastRead:3,highWater:5,updates:[{userId:'u',sequence:2}]},{lastRead:3,unread:2,outcomes:['stale']}),
      tc('read-3','Repeated acknowledgement is stale',{userId:'u',lastRead:3,highWater:5,updates:[{userId:'u',sequence:3}]},{lastRead:3,unread:2,outcomes:['stale']},true),
      tc('read-4','Reject other user before sequence validation',{userId:'u',lastRead:0,highWater:5,updates:[{userId:'other',sequence:99}]},{lastRead:0,unread:5,outcomes:['forbidden']},true),
      tc('read-5','Reject future negative fractional and string sequences',{userId:'u',lastRead:0,highWater:5,updates:[{userId:'u',sequence:6},{userId:'u',sequence:-1},{userId:'u',sequence:1.5},{userId:'u',sequence:'2'}]},{lastRead:0,unread:5,outcomes:['invalid','invalid','invalid','invalid']},true),
      tc('read-6','Out of order updates never regress',{userId:'u',lastRead:0,highWater:5,updates:[{userId:'u',sequence:4},{userId:'u',sequence:2},{userId:'u',sequence:5}]},{lastRead:5,unread:0,outcomes:['advanced','stale','advanced']},true),
      tc('read-7','Empty conversation stays unread-free',{userId:'u',lastRead:0,highWater:0,updates:[]},{lastRead:0,unread:0,outcomes:[]},true)],
    'Model the receipt as a monotonic maximum bounded by the conversation high-water mark. Authenticate the receipt owner, reject impossible sequence values, and derive unread rather than incrementally adjusting a counter on retries. A production unread count may need visibility filters and deletion semantics beyond this contiguous-log model.',
    'How would you atomically merge read positions across devices while excluding messages the recipient cannot see?'),

  exercise('presence-expiry', 'Expire Presence Without Disconnecting Other Tabs',
    'Closing one browser tab marks a user offline despite another active tab. Delayed heartbeats also resurrect disconnected sessions.',
    'Implement solution({ now, sessions }). now is a nonnegative safe integer. Each valid snapshot has nonempty id/userId, nonnegative safe-integer version and expiresAt, and boolean online. Snapshots may arrive out of order. For each session id retain the highest version; equal-version first arrival wins. All versions of one session id belong to the same user. A retained session is active iff online and expiresAt > now. Return { onlineUsers, activeSessions }, where onlineUsers contains unique user IDs in ascending JavaScript string order. Empty sessions gives empty users and zero active sessions.',
    `function solution({now,sessions}) {
  const latest = new Map();
  for(const s of sessions) if(!latest.has(s.id) || s.version>latest.get(s.id).version) latest.set(s.id,s);
  const active = [...latest.values()].filter(s=>s.online && s.expiresAt>now);
  return {onlineUsers:[...new Set(active.map(s=>s.userId))].sort(),activeSessions:active.length};
}`,
    `function solution({sessions}) { return {onlineUsers:sessions.filter(s=>s.online).map(s=>s.userId),activeSessions:sessions.length}; }`,
    [tc('presence-1','Track an active session',{now:10,sessions:[snapshot('s','u',1,11)]},{onlineUsers:['u'],activeSessions:1}),
      tc('presence-2','Expiry at now is offline',{now:10,sessions:[snapshot('s','u',1,10)]},{onlineUsers:[],activeSessions:0}),
      tc('presence-3','Aggregate multiple tabs once per user',{now:10,sessions:[snapshot('a','u',1,20),snapshot('b','u',1,20)]},{onlineUsers:['u'],activeSessions:2},true),
      tc('presence-4','One closed tab does not close another',{now:10,sessions:[snapshot('a','u',1,20,false),snapshot('b','u',1,20)]},{onlineUsers:['u'],activeSessions:1},true),
      tc('presence-5','Stale heartbeat cannot resurrect disconnect',{now:10,sessions:[snapshot('s','u',2,20,false),snapshot('s','u',1,30)]},{onlineUsers:[],activeSessions:0},true),
      tc('presence-6','First equal version wins and output is sorted',{now:10,sessions:[snapshot('b','z',1,20),snapshot('a','a',1,20),snapshot('b','z',1,0,false)]},{onlineUsers:['a','z'],activeSessions:2},true),
      tc('presence-7','Empty snapshot is offline',{now:10,sessions:[]},{onlineUsers:[],activeSessions:0},true)],
    'Retain session tombstones by version before calculating expiry, then aggregate active sessions into a distinct user set. Expiry uses a strict greater-than boundary. Production needs authoritative server clocks, bounded leases, and retained disconnect revisions; deleting a tombstone too early can let stale heartbeats resurrect presence.',
    'How would you implement leases, typing-indicator expiry, and disconnect tombstone retention across presence servers?'),
  exercise('channel-permissions', 'Authorize Channel Reads and Sends',
    'A guessed private-channel ID lets an authenticated user read another team’s messages. Archived channels also accept new sends.',
    'Implement solution({ tenantId, channel, session, members, action }). channel has id, tenantId, private and archived booleans. session is null or { userId, tenantId, active }. members contains unique users with { userId, role:member|admin, active }. action outside read/send/manage => invalid_action first. Missing/inactive session or empty userId => unauthenticated. Session or channel tenant mismatch => forbidden. Private channels require active membership; manage always requires an active admin membership, including public channels. Fail these checks as forbidden. An authorized send to an archived channel => read_only. Otherwise allow. Return { allowed, reason } with reason allowed for success. Inputs otherwise have valid shapes.',
    `function solution({tenantId,channel,session,members,action}) {
  const deny = reason => ({allowed:false,reason});
  if(!['read','send','manage'].includes(action)) return deny('invalid_action');
  if(!session || !session.active || !session.userId) return deny('unauthenticated');
  if(session.tenantId!==tenantId || channel.tenantId!==tenantId) return deny('forbidden');
  const member = members.find(m=>m.userId===session.userId && m.active);
  if(channel.private && !member) return deny('forbidden');
  if(action==='manage' && member?.role!=='admin') return deny('forbidden');
  if(action==='send' && channel.archived) return deny('read_only');
  return {allowed:true,reason:'allowed'};
}`,
    `function solution({session}) { return {allowed:!!session,reason:session?'allowed':'unauthenticated'}; }`,
    (() => {
      const base = {tenantId:'t',channel:{id:'c',tenantId:'t',private:false,archived:false},session:{userId:'u',tenantId:'t',active:true},members:[],action:'read'};
      return [tc('auth-1','Read a public channel as active tenant user',base,{allowed:true,reason:'allowed'}),
        tc('auth-2','Deny private channel to nonmember',{...base,channel:{...base.channel,private:true}},{allowed:false,reason:'forbidden'}),
        tc('auth-3','Deny cross-tenant session even with membership',{...base,session:{...base.session,tenantId:'other'},members:[{userId:'u',role:'admin',active:true}]},{allowed:false,reason:'forbidden'},true),
        tc('auth-4','Deny inactive membership in private channel',{...base,channel:{...base.channel,private:true},members:[{userId:'u',role:'member',active:false}]},{allowed:false,reason:'forbidden'},true),
        tc('auth-5','Archived channels reject authorized sends',{...base,action:'send',channel:{...base.channel,archived:true}},{allowed:false,reason:'read_only'},true),
        tc('auth-6','Public channel management still requires admin',{...base,action:'manage'},{allowed:false,reason:'forbidden'},true),
        tc('auth-7','Active admin can manage archived private channel',{...base,action:'manage',channel:{...base.channel,private:true,archived:true},members:[{userId:'u',role:'admin',active:true}]},{allowed:true,reason:'allowed'},true),
        tc('auth-8','Reject unknown action before missing session',{...base,action:'delete_everything',session:null},{allowed:false,reason:'invalid_action'},true),
        tc('auth-9','Reject inactive session',{...base,session:{...base.session,active:false}},{allowed:false,reason:'unauthenticated'},true),
        tc('auth-10','Reject cross-tenant channel',{...base,channel:{...base.channel,tenantId:'other'}},{allowed:false,reason:'forbidden'},true)];
    })(),
    'Apply explicit action allowlists and authenticated tenant scope before channel rules. Public visibility does not grant administration. Membership revocation and archived-send restrictions must apply on every server operation, including reconnect subscriptions and history queries. This fixture assumes trusted session/membership inputs; it is not a replacement for server authentication.',
    'How would you revoke an active socket subscription immediately when channel membership changes?'),

  exercise('notification-delivery', 'Deduplicate Notifications and Respect Preferences',
    'A reconnect replay sends the same mention notification repeatedly, including muted channels and messages the recipient wrote.',
    'Implement solution({ recipientId, mutedChannels, mentionsOnly, events }). Events are valid { id, authorId, channelId, mentionIds } with nonempty string IDs and arrays of string mentionIds. Process in arrival order. An already-seen event id => duplicate; first occurrences consume the ID even if suppressed. Then authorId==recipientId => self; muted channel => muted; mentionsOnly without recipient in mentionIds => skipped; otherwise delivered. Return { delivered: [event IDs], outcomes }. A replay with changed contents still uses the first event decision. No actual delivery is performed.',
    `function solution({recipientId,mutedChannels,mentionsOnly,events}) {
  const seen = new Set(), muted = new Set(mutedChannels), delivered=[];
  const outcomes = events.map(e=>{
    if(seen.has(e.id)) return 'duplicate'; seen.add(e.id);
    if(e.authorId===recipientId) return 'self';
    if(muted.has(e.channelId)) return 'muted';
    if(mentionsOnly && !e.mentionIds.includes(recipientId)) return 'skipped';
    delivered.push(e.id); return 'delivered';
  });
  return {delivered,outcomes};
}`,
    `function solution({events}) { return {delivered:events.map(e=>e.id),outcomes:events.map(()=>'delivered')}; }`,
    (() => {
      const event = (id: string, authorId='other', channelId='c', mentionIds: string[]=[]) => ({id,authorId,channelId,mentionIds});
      const base={recipientId:'u',mutedChannels:[] as string[],mentionsOnly:false};
      return [tc('notify-1','Deliver a normal message',{...base,events:[event('a')]},{delivered:['a'],outcomes:['delivered']}),
        tc('notify-2','Retry delivers only once',{...base,events:[event('a'),event('a')]},{delivered:['a'],outcomes:['delivered','duplicate']}),
        tc('notify-3','Suppress own messages',{...base,events:[event('a','u')]},{delivered:[],outcomes:['self']},true),
        tc('notify-4','Mute takes precedence over mention',{...base,mutedChannels:['c'],mentionsOnly:true,events:[event('a','other','c',['u'])]},{delivered:[],outcomes:['muted']},true),
        tc('notify-5','Mentions-only skips unrelated recipients',{...base,mentionsOnly:true,events:[event('a'),event('b','other','c',['u'])]},{delivered:['b'],outcomes:['skipped','delivered']},true),
        tc('notify-6','Suppressed ID remains consumed on changed replay',{...base,events:[event('a','u'),event('a')]},{delivered:[],outcomes:['self','duplicate']},true),
        tc('notify-7','Empty event batch produces no notifications',{...base,events:[]},{delivered:[],outcomes:[]},true)];
    })(),
    'Record the event decision before evaluating preferences so replay cannot turn a suppressed event into a new notification. Keep first-event ordering and apply self/mute rules before mentions. Production needs a durable recipient-event idempotency key and transactional outbox, plus a separate acknowledgement/retry policy for the external delivery provider.',
    'How would an outbox and provider idempotency key handle a crash after sending but before recording success?'),

  exercise('meeting-signaling', 'Reject Stale Meeting Signaling After Reconnect',
    'A delayed disconnect from an old call ends a new meeting. Conflicting offers and early answers corrupt the signaling state.',
    'Implement solution({ epoch, phase, offerId, events }). Initial phase is idle/offered/connected/closed; idle has null offerId, other phases have a nonempty offerId. Events have unique-or-replayed nonempty id, nonnegative safe-integer epoch, and type offer/answer/disconnect. Offer/answer have nonempty offerId. All shapes are valid. First deduplicate event IDs within this batch, consuming them even when rejected. Lower epoch => stale. Higher epoch accepts only an offer, replacing state with offered; other types => unexpected. At the current epoch: idle accepts an offer; offered/connected with same offerId => duplicate, different => conflict; closed rejects offers as unexpected. A matching answer changes offered to connected, or is duplicate if already connected; otherwise unexpected. Disconnect changes offered/connected to closed (preserve offerId), returns duplicate if already closed, and is unexpected while idle. Return { epoch, phase, offerId, outcomes }. No SDP, WebRTC negotiation, or media is executed.',
    `function solution({epoch,phase,offerId,events}) {
  const seen = new Set();
  const outcomes = events.map(e=>{
    if(seen.has(e.id)) return 'duplicate'; seen.add(e.id);
    if(e.epoch<epoch) return 'stale';
    if(e.epoch>epoch) {
      if(e.type!=='offer') return 'unexpected';
      epoch=e.epoch; phase='offered'; offerId=e.offerId; return 'offered';
    }
    if(e.type==='offer') {
      if(phase==='closed') return 'unexpected';
      if(phase==='idle') { phase='offered'; offerId=e.offerId; return 'offered'; }
      return offerId===e.offerId ? 'duplicate' : 'conflict';
    }
    if(e.type==='answer') {
      if(e.offerId!==offerId) return 'unexpected';
      if(phase==='connected') return 'duplicate';
      if(phase!=='offered') return 'unexpected';
      phase='connected'; return 'connected';
    }
    if(phase==='closed') return 'duplicate';
    if(phase==='idle') return 'unexpected';
    phase='closed'; return 'closed';
  });
  return {epoch,phase,offerId,outcomes};
}`,
    `function solution({epoch,phase,offerId,events}) { for(const e of events){epoch=e.epoch;offerId=e.offerId||offerId;phase=e.type==='disconnect'?'closed':'connected';} return {epoch,phase,offerId,outcomes:events.map(()=>'connected')}; }`,
    (() => {
      const base={epoch:1,phase:'idle',offerId:null};
      const offer={id:'o',type:'offer',epoch:1,offerId:'a'};
      return [tc('signal-1','Offer followed by matching answer',{...base,events:[offer,{id:'a',type:'answer',epoch:1,offerId:'a'}]},{epoch:1,phase:'connected',offerId:'a',outcomes:['offered','connected']}),
        tc('signal-2','Deduplicate repeated event ID',{...base,events:[offer,offer]},{epoch:1,phase:'offered',offerId:'a',outcomes:['offered','duplicate']}),
        tc('signal-3','Old disconnect cannot end a new call',{epoch:2,phase:'connected',offerId:'b',events:[{id:'d',type:'disconnect',epoch:1}]},{epoch:2,phase:'connected',offerId:'b',outcomes:['stale']},true),
        tc('signal-4','Conflicting same-epoch offer preserves active offer',{...base,events:[offer,{...offer,id:'o2',offerId:'b'}]},{epoch:1,phase:'offered',offerId:'a',outcomes:['offered','conflict']},true),
        tc('signal-5','Early answer cannot create a connection',{...base,events:[{id:'a',type:'answer',epoch:2,offerId:'a'}]},{...base,outcomes:['unexpected']},true),
        tc('signal-6','Closed epoch cannot be resurrected',{epoch:1,phase:'closed',offerId:'a',events:[offer]},{epoch:1,phase:'closed',offerId:'a',outcomes:['unexpected']},true),
        tc('signal-7','New epoch starts clean after disconnect',{epoch:1,phase:'connected',offerId:'a',events:[{id:'d',type:'disconnect',epoch:1},{...offer,id:'new',epoch:2,offerId:'b'},{id:'late',type:'answer',epoch:1,offerId:'a'}]},{epoch:2,phase:'offered',offerId:'b',outcomes:['closed','offered','stale']},true),
        tc('signal-8','Wrong answer rejected and repeated matching answer is idempotent',{...base,events:[offer,{id:'bad',type:'answer',epoch:1,offerId:'b'},{id:'a1',type:'answer',epoch:1,offerId:'a'},{id:'a2',type:'answer',epoch:1,offerId:'a'}]},{epoch:1,phase:'connected',offerId:'a',outcomes:['offered','unexpected','connected','duplicate']},true),
        tc('signal-9','Disconnect without an offer cannot create closed state',{...base,events:[{id:'d',type:'disconnect',epoch:1}]},{...base,outcomes:['unexpected']},true)];
    })(),
    'Fence each call generation with an epoch and correlate answers with the active offer. A stale disconnect must never mutate a newer generation, and a closed epoch cannot reopen. This model deliberately omits SDP/ICE and glare resolution: real WebRTC needs authenticated room signaling, perfect-negotiation rules, TURN connectivity, and browser interoperability tests.',
    'How would you add perfect negotiation, ICE restart, TURN fallback, and participant authorization to a real meeting service?'),

  exercise('history-pagination', 'Page Chat History Without Gaps or Repeats',
    'New messages arrive while a user loads older history. Offset pagination repeats rows and misses messages around page boundaries.',
    'Implement solution({ channelId, messages, before, limit }). messages are valid objects with id, channelId, positive unique-per-channel safe-integer seq, and body; input order is arbitrary. before is null for newest, otherwise a positive safe integer. limit is a positive safe integer. Filter to channelId and seq < before (exclusive); sort descending by seq; return at most limit rows as { messages, nextBefore, hasMore }. nextBefore is the last returned seq or the supplied before when empty. hasMore means additional eligible rows exist beyond this page. Return copies and leave input unchanged. Sequence gaps are allowed.',
    `function solution({channelId,messages,before,limit}) {
  const eligible=messages.filter(m=>m.channelId===channelId && (before===null || m.seq<before)).sort((a,b)=>b.seq-a.seq);
  const page=eligible.slice(0,limit).map(m=>({...m}));
  return {messages:page,nextBefore:page.length?page[page.length-1].seq:before,hasMore:eligible.length>page.length};
}`,
    `function solution({messages,limit}) { return {messages:messages.slice(0,limit),nextBefore:null,hasMore:false}; }`,
    [tc('history-1','Return newest messages first',{channelId:'c',messages:[m('a',1),m('c',3),m('b',2)],before:null,limit:2},{messages:[m('c',3),m('b',2)],nextBefore:2,hasMore:true}),
      tc('history-2','Cursor is exclusive',{channelId:'c',messages:[m('a',1),m('b',2),m('c',3)],before:2,limit:2},{messages:[m('a',1)],nextBefore:1,hasMore:false}),
      tc('history-3','New arrivals do not shift an older page',{channelId:'c',messages:[m('a',1),m('b',2),m('new',9)],before:3,limit:1},{messages:[m('b',2)],nextBefore:2,hasMore:true},true),
      tc('history-4','Foreign channels never leak into history',{channelId:'c',messages:[m('a',1),m('x',8,'secret','other')],before:null,limit:2},{messages:[m('a',1)],nextBefore:1,hasMore:false},true),
      tc('history-5','Sequence gaps do not imply missing page rows',{channelId:'c',messages:[m('a',1),m('z',20)],before:20,limit:3},{messages:[m('a',1)],nextBefore:1,hasMore:false},true),
      tc('history-6','Empty older page preserves cursor',{channelId:'c',messages:[m('a',1)],before:1,limit:2},{messages:[],nextBefore:1,hasMore:false},true),
      tc('history-7','Empty conversation preserves null cursor',{channelId:'c',messages:[],before:null,limit:2},{messages:[],nextBefore:null,hasMore:false},true)],
    'Use an exclusive sequence cursor and fetch limit+1 eligible rows to determine hasMore in a database implementation. Filter by authorized conversation before paging and use a composite channel/sequence index. Newer inserts cannot shift an older cursor page, unlike offsets; deletion and retention still need an explicit history policy.',
    'Which composite index and authorization checks would you use for cursor paging under concurrent inserts and deletions?'),
];
