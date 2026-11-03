import { useState } from 'react';
export default function App({ initialTheme = 'light' }) {
  const [dark, setDark] = useState(() => initialTheme === 'dark');
  return <section data-testid="surface" data-theme={dark ? 'dark' : 'light'} style={{padding:16, background:dark ? '#18181b' : '#ffffff', color:dark ? '#fafafa' : '#18181b'}}>
    <button type="button" aria-label="Toggle appearance" aria-pressed={dark} onClick={() => setDark(old => !old)}>Toggle appearance</button>
    <p data-testid="current-theme">{dark ? 'Dark appearance' : 'Light appearance'}</p></section>;
}
