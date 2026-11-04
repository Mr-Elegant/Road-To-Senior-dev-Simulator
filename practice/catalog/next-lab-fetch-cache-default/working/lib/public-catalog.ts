export async function getCatalog(){return (await fetch('https://catalog.example.com/public')).json();}
// The team assumes this fetch is persistently cached by default.