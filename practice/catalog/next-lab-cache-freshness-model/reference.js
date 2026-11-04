function solution({age,revalidate,expire}){return age<revalidate?'fresh':age<expire?'stale':'expired';}
