export default function App({ items = [] }) {
  return <section>{items.map(item => <h3 key={item.id}><button type="button" id={'trigger-'+item.id} aria-controls={'panel-'+item.id} aria-expanded="false">{item.title}</button></h3>)}</section>;
}