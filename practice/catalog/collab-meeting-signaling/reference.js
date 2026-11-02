function solution({epoch,phase,offerId,events}) {
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
}
