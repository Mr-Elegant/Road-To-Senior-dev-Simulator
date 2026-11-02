function GreetingForm() {
  const [name, setName] = React.useState('');
  return (
    <div>
      {/* Create a controlled input for name */}
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}