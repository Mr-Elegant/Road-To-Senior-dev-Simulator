function solution({title,brand,absolute}){const text=typeof title==='string'?title.trim():'';return !text?brand:absolute===true?text:text+' | '+brand;}
