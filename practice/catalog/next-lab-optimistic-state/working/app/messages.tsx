'use client';
export async function sendMessage(text:string){document.querySelector('ul')!.innerHTML+='<li>'+text+'</li>';await fetch('/api/messages',{method:'POST',body:text});}