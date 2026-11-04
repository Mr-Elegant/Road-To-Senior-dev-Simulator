function solution(input){const seen=new Set();return input.map(t=>t.trim()).filter(t=>{if(!t||t.length>256||seen.has(t))return false;seen.add(t);return true;});}
