// Corrected review reference: app/messages.tsx
'use client';
import { useOptimistic } from 'react';
type Message={id:string;text:string;pending?:boolean};
export default function Messages({messages,send}:{messages:Message[];send:(data:FormData)=>Promise<void>}){
 const [visible,add]=useOptimistic(messages,(state:Message[],item:Message)=>[...state,{...item,pending:true}]);
 return <><ul>{visible.map(item=><li key={item.id}>{item.text}{item.pending?' (sending)':''}</li>)}</ul><form action={async data=>{add({id:'pending:'+crypto.randomUUID(),text:String(data.get('text')||'')});await send(data);}}><input name="text"/><button>Send</button></form></>;
}
// send must be a Server Action. Temporary IDs identify concurrent optimistic rows; durable idempotency belongs on the server.
