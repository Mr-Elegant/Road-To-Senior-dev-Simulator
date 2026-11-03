export default function App({ value = 0 }) {
  const progress = typeof value === 'number' && Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : 0;
  return <section><div role="progressbar" aria-label="Project completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} style={{background:'#e4e4e7', height:16}}>
    <div style={{background:'#2563eb', height:'100%', width:progress + '%'}} /></div>
    <output data-testid="percentage">{progress}%</output></section>;
}
