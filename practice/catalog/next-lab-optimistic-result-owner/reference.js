function solution({current,pendingId,result}){return result.id!==pendingId?{value:current,pendingId}:{value:result.ok?result.value:current,pendingId:null};}
