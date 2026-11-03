export default function App({ value = 0 }) {
  return <section><div role="progressbar" aria-label="Project completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" />
    <output data-testid="percentage">0%</output></section>;
}