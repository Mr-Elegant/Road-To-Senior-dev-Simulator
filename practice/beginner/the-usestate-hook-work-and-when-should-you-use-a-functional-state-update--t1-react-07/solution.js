function SimpleCounter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      {/* Add increment and decrement buttons */}
    </div>
  );
}