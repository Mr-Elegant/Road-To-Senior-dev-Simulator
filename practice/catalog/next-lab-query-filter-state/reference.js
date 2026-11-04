function solution({pairs,key,value}) {const result=pairs.filter(pair=>pair[0]!==key).map(pair=>[...pair]);if(value!=='')result.push([key,value]);return result;}
