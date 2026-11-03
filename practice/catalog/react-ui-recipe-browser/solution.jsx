export default function App({ recipes = [] }) {
  return <section><label>Search recipes <input /></label><label>Category <select><option>All</option></select></label>
    <ul data-testid="recipes">{recipes.map(r => <li key={r.id}>{r.name}<button type="button" aria-label={'Select '+r.name}>Select</button></li>)}</ul>
    <output data-testid="selected-count">0</output></section>;
}