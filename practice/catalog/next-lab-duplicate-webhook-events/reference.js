function solution({seen,events}){const known=new Set(seen),accepted=[];for(const id of events)if(!known.has(id)){known.add(id);accepted.push(id);}return {accepted,seen:[...known]};}
