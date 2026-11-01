import { Tier1Question } from '@/types/tier1';

export const reactQuestions: Tier1Question[] = [
  {
    id: 't1-react-01',
    title: 'What is React and why do engineers choose it over vanilla JavaScript for building UIs?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'Component-based architecture',
      'Declarative UI (describe what it should look like, React handles the DOM updates)',
      'Virtual DOM and reconciliation for efficient updates',
      'Unidirectional data flow and rich ecosystem',
    ],
    shortReferenceAnswer:
      'React is a declarative, component-based JavaScript library for building user interfaces. Instead of imperatively manipulating the browser DOM with `document.createElement()` or `innerHTML`, developers describe what the UI should look like for a given state. React uses a **Virtual DOM** in memory and an intelligent reconciliation algorithm (diffing) to calculate the minimal set of real DOM operations required, resulting in maintainable, modular, and performant web applications.',
    practicalExample: `// Declarative: You declare state, React updates the DOM automatically
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    optionalFollowUp: {
      question: 'Is React a full-fledged MVC framework or a UI library?',
      expectedAnswer:
        'React is strictly a UI library focused on the "View" layer of an application, leaving routing, data fetching, and state management architecture up to the developer or higher-level frameworks like Next.js.',
    },
    hints: [
      'What is the difference between telling the browser "how to change each node" vs "what the final state looks like"?',
      'What is the lightweight in-memory representation of the DOM that React uses?',
    ],
  },
  {
    id: 't1-react-02',
    title: 'What is JSX and what are its key syntax rules in React?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'JavaScript XML: Syntax extension for JavaScript',
      'Transpilation to React.createElement() calls',
      'Single root element requirement (or React.Fragment / <>)',
      'className instead of class, htmlFor instead of for',
      'Curly braces {} for embedding JS expressions',
      'All tags must be explicitly closed (including <img /> and <input />)',
    ],
    shortReferenceAnswer:
      'JSX stands for JavaScript XML. It is a syntax extension that lets you write HTML-like structures directly inside JavaScript files. Browsers cannot execute JSX directly; tools like Babel/SWC compile JSX into standard `React.createElement()` calls. Key rules include: components must return a single root element (or Fragment `<>`), standard HTML attributes like `class` become `className` (because `class` is a reserved JS keyword), all tags must be self-closed, and JavaScript expressions are evaluated inside curly braces `{}`.',
    practicalExample: `function UserCard({ name, avatarUrl, unreadCount }) {
  return (
    <div className="user-card">
      <img src={avatarUrl} alt={name} />
      <h3>{name.toUpperCase()}</h3>
      <p>Messages: {unreadCount > 0 ? unreadCount : 'None'}</p>
    </div>
  );
}`,
    optionalFollowUp: {
      question: 'Can you write an if-statement or for-loop directly inside JSX curly braces {}?',
      expectedAnswer:
        'No, JSX curly braces can only accept expressions that evaluate to a value (such as ternaries, map(), or variables), not statements like if/else or for loops.',
    },
    hints: [
      'Why do we write className instead of class in React?',
      'What must wrap sibling elements if you do not want an extra <div> in the DOM?',
    ],
    codingExercise: {
      instruction:
        'Fix the JSX syntax errors in the provided component: ensure valid attribute naming and wrap with a Fragment.',
      starterCode: `// Fix the syntax in this component:
function Badge({ label }) {
  return (
    <span class="badge">
      {label}
    </span>
    <img src="icon.png">
  );
}`,
      solutionCode: `function Badge({ label }) {
  return (
    <>
      <span className="badge">{label}</span>
      <img src="icon.png" alt="icon" />
    </>
  );
}`,
      language: 'javascript',
      expectedOutput: 'Valid Fragment-wrapped JSX with className and self-closing img',
    },
  },
  {
    id: 't1-react-03',
    title: 'What is the difference between props and state in React?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'Props are external inputs passed into a component (like function arguments)',
      'Props are immutable (read-only) for the receiving component',
      'State is internal data managed within the component that changes over time',
      'Updating state triggers a component re-render',
    ],
    shortReferenceAnswer:
      '**Props** (properties) are passed down from a parent component to a child component, behaving like read-only function arguments; a child component must never modify its received props. **State** is private, internal data managed directly by the component itself (e.g. using `useState`) that can change over user interactions. When a component’s state or received props change, React re-renders that component to update the UI.',
    practicalExample: `// Parent passes 'initialScore' as a PROP
function Game() {
  return <ScoreBoard initialScore={0} playerName="Alex" />;
}

// Child manages its own internal STATE
function ScoreBoard({ initialScore, playerName }) {
  const [score, setScore] = React.useState(initialScore);

  return (
    <div>
      <h2>{playerName}: {score}</h2>
      <button onClick={() => setScore(score + 1)}>+1 Point</button>
    </div>
  );
}`,
    optionalFollowUp: {
      question: 'What is meant by "unidirectional data flow" in React?',
      expectedAnswer:
        'Data flows strictly downwards from parent to child via props. Child components cannot alter parent state directly; they must trigger callbacks passed down as props.',
    },
    hints: [
      'Which one is passed into a component like function arguments?',
      'Which one is owned and modified internally by the component itself?',
    ],
  },
  {
    id: 't1-react-04',
    title: 'How does event handling work in React, and why should you pass a function reference instead of invoking it?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'SyntheticEvent system for cross-browser normalization',
      'camelCase naming (onClick, onChange, onSubmit)',
      'Passing function reference vs immediate invocation onClick={handleClick} vs onClick={handleClick()}',
      'Passing arguments with arrow functions onClick={() => handleDelete(id)}',
    ],
    shortReferenceAnswer:
      'In React, event handlers use camelCase naming (`onClick`, `onChange`) and accept function references rather than strings. React wraps browser native events in a **SyntheticEvent** wrapper for consistent behavior across all browsers. You must pass a function reference (e.g. `onClick={handleClick}`) rather than calling the function immediately (`onClick={handleClick()}`); calling it immediately would execute during initial render rather than when the user clicks.',
    practicalExample: `function ActionButton({ userId }) {
  const handleDelete = (id) => {
    console.log('Deleted user:', id);
  };

  // CORRECT: Passes an arrow function that calls handleDelete when clicked
  return (
    <button onClick={() => handleDelete(userId)}>
      Delete User
    </button>
  );

  // WRONG: onClick={handleDelete(userId)} would run immediately on render!
}`,
    optionalFollowUp: {
      question: 'How do you prevent the default form submission page reload in React?',
      expectedAnswer:
        'Call event.preventDefault() inside the form onSubmit handler function.',
    },
    hints: [
      'What happens if you write parentheses () right after the function name in onClick?',
      'How does an arrow function delay execution until the click actually happens?',
    ],
    codingExercise: {
      instruction:
        'Attach a click handler to the button that alerts the passed title without executing on render.',
      starterCode: `function AlertButton({ title }) {
  // Return a button with an onClick handler that calls alert(title)
  return <button>Click Me</button>;
}`,
      solutionCode: `function AlertButton({ title }) {
  return <button onClick={() => alert(title)}>Click Me</button>;
}`,
      language: 'javascript',
      expectedOutput: '<button onClick={() => alert(title)}>Click Me</button>',
    },
  },
  {
    id: 't1-react-05',
    title: 'How do you conditionally render elements in React?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      'Ternary operator condition ? <A /> : <B />',
      'Logical AND (&&) for showing or hiding a single element',
      'Early return / guard clauses for whole component views',
      'Pitfall of 0 && <Element /> rendering 0 to the DOM',
    ],
    shortReferenceAnswer:
      'Conditional rendering in React displays different UI elements based on state or props using standard JavaScript expressions. Common approaches include: 1) **Ternary operator** (`isLoggedIn ? <Dashboard /> : <Login />`) when choosing between two states, 2) **Logical AND (`&&`)** (`hasNotification && <Badge />`) when rendering an element only if a condition is true, and 3) **Early return guard clauses** at the top of a component (e.g. `if (isLoading) return <Spinner />;`).',
    practicalExample: `function UserGreeting({ user, isLoading }) {
  if (isLoading) {
    return <p>Loading profile...</p>; // Guard clause
  }

  return (
    <div>
      {user ? (
        <h2>Welcome back, {user.name}!</h2>
      ) : (
        <button>Please Sign In</button>
      )}

      {/* Logical && for optional badge */}
      {user?.isPremium && <span className="gold-star">⭐ VIP Member</span>}
    </div>
  );
}`,
    optionalFollowUp: {
      question: 'What gets displayed on the screen if you write {items.length && <List />} when items.length is 0?',
      expectedAnswer:
        'The number 0 will be printed to the screen! In JavaScript, 0 is falsy, so 0 && ... evaluates to 0, which React treats as a valid number to render. Use items.length > 0 instead.',
    },
    hints: [
      'When do you use a ternary operator versus logical &&?',
      'Why should you write count > 0 && ... instead of count && ...?',
    ],
  },
  {
    id: 't1-react-06',
    title: 'How do you render lists in React, and why is the key prop strictly necessary?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'Array.prototype.map() to transform data into JSX elements',
      'Unique key prop requirement for reconciliation',
      'How React uses keys to track item additions, removals, and reordering',
      'Why using array index as key is an anti-pattern for dynamic lists',
    ],
    shortReferenceAnswer:
      'Lists are rendered in React by mapping over arrays with `.map()` and returning JSX elements. Every list item requires a unique, stable `key` prop (such as an item ID from a database). React uses this `key` during its reconciliation process to identify which items have changed, been added, or been removed. Using array indices as keys is discouraged because reordering, deleting, or inserting items changes their index, leading to UI rendering bugs and state mismatches.',
    practicalExample: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        // Good: Unique, stable ID used as key
        <li key={todo.id} className={todo.completed ? 'done' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
    optionalFollowUp: {
      question: 'Is it ever acceptable to use the array index as a key?',
      expectedAnswer:
        'Only if the list is strictly static (never filtered, sorted, added to, or deleted from) and items have no unique IDs.',
    },
    hints: [
      'What array method transforms each item into a <li> or <div>?',
      'Why would React get confused if you delete item #1 and every other item shifts to a new index?',
    ],
    codingExercise: {
      instruction:
        'Render an unordered list <ul> of product names from products = [{ id: "p1", name: "Laptop" }, { id: "p2", name: "Mouse" }] using the map function and key prop.',
      starterCode: `function ProductList({ products }) {
  return (
    <ul>
      {/* Map through products and return <li> with key and name */}
    </ul>
  );
}`,
      solutionCode: `function ProductList({ products }) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}`,
      language: 'javascript',
      expectedOutput: '<ul> with <li> items with unique key={p.id}',
    },
  },
  {
    id: 't1-react-07',
    title: 'How does the useState hook work, and when should you use a functional state update?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'Declaring state with const [state, setState] = useState(initialValue)',
      'Asynchronous batching of state updates',
      'Functional update pattern setState(prev => prev + 1) for state depending on previous value',
      'Immutability: Always creating new objects/arrays instead of mutating existing state',
    ],
    shortReferenceAnswer:
      '`useState` is a React Hook that declares a state variable in a functional component, returning a pair: the current state value and an updater function. When an update depends on the previous state value, you should pass an updater callback (`setCount(prev => prev + 1)`). This guarantees you are calculating from the most current state, avoiding stale state bugs caused by React’s asynchronous batching.',
    practicalExample: `function Counter() {
  const [count, setCount] = React.useState(0);

  const incrementThreeTimes = () => {
    // If you wrote setCount(count + 1) three times, count would only increase by 1!
    // Functional updates guarantee each update receives the latest calculated value:
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // Increases count by 3
  };

  return <button onClick={incrementThreeTimes}>Count: {count}</button>;
}`,
    optionalFollowUp: {
      question: 'How do you update an object stored in useState without losing its other properties?',
      expectedAnswer:
        'Use the spread operator: setUser(prev => ({ ...prev, name: "New Name" })). Never mutate user.name directly.',
    },
    hints: [
      'What two values does useState() return in its array?',
      'Why can calling setCount(count + 1) twice in the same function call result in unexpected values?',
    ],
    codingExercise: {
      instruction:
        'Implement an increment and a decrement button using useState initialized to 0.',
      starterCode: `function SimpleCounter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      {/* Add increment and decrement buttons */}
    </div>
  );
}`,
      solutionCode: `function SimpleCounter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
    </div>
  );
}`,
      language: 'javascript',
      expectedOutput: 'Buttons updating count with prev => prev + 1 and prev => prev - 1',
    },
  },
  {
    id: 't1-react-08',
    title: 'What is the useEffect hook, and how does its dependency array control execution?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'Side effects in functional components (data fetching, subscriptions, timers, manual DOM changes)',
      'No dependency array: Runs after every single render',
      'Empty dependency array []: Runs only once on component mount',
      'Array with dependencies [a, b]: Runs when a or b changes',
      'Cleanup function (return () => { ... }) for unsubscribing / clearing timers on unmount',
    ],
    shortReferenceAnswer:
      '`useEffect` enables performing side effects (fetching data, setting up subscriptions, or manipulating timers) in functional components after React renders. Its second argument—the dependency array—controls when it executes: omitting it runs the effect after every render; passing an empty array `[]` runs it only once when the component mounts; passing dependencies `[userId]` re-runs it only when those values change. Returning a function from `useEffect` registers a cleanup handler that runs before re-running or when the component unmounts.',
    practicalExample: `function Timer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // CLEANUP FUNCTION: Clears timer when component unmounts
    return () => clearInterval(timerId);
  }, []); // Runs once on mount

  return <div>Elapsed: {seconds}s</div>;
}`,
    optionalFollowUp: {
      question: 'What happens if you update state inside a useEffect that has no dependency array?',
      expectedAnswer:
        'It causes an infinite loop: the state change triggers a re-render, which runs the effect again, which changes state again.',
    },
    hints: [
      'What happens if you pass an empty array [] to useEffect?',
      'Why is returning a cleanup function important for timers or event listeners?',
    ],
  },
  {
    id: 't1-react-09',
    title: 'What is a controlled component in React and how does it handle form inputs?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'Input value is driven by React state (value={text})',
      'Input updates via onChange handler (onChange={e => setText(e.target.value)})',
      'Single source of truth in React state rather than the DOM',
      'Comparison with uncontrolled components (using refs)',
    ],
    shortReferenceAnswer:
      'A **controlled component** is an input form element whose current value is driven by React state rather than the browser DOM. The component specifies `value={state}` and an `onChange={(e) => setState(e.target.value)}` handler. This establishes React state as the single source of truth, making input validation, formatting, disabling buttons, and clearing fields straightforward.',
    practicalExample: `function SearchInput() {
  const [query, setQuery] = React.useState('');

  return (
    <input
      type="text"
      value={query} // React controls the value
      onChange={(e) => setQuery(e.target.value)} // State updates on user keystroke
      placeholder="Search challenges..."
    />
  );
}`,
    optionalFollowUp: {
      question: 'What warning does React give if an input starts with value={undefined} and later receives a string?',
      expectedAnswer:
        'A warning stating "A component is changing an uncontrolled input to be controlled". Always initialize state with an empty string "" instead of undefined.',
    },
    hints: [
      'What two props make an input controlled: one for the value, one for changes?',
      'Where does the source of truth live in a controlled component?',
    ],
    codingExercise: {
      instruction:
        'Create a controlled text input that stores the user name in state and displays "Hello, [name]" below.',
      starterCode: `function GreetingForm() {
  const [name, setName] = React.useState('');
  return (
    <div>
      {/* Create a controlled input for name */}
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
      solutionCode: `function GreetingForm() {
  const [name, setName] = React.useState('');
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
      language: 'javascript',
      expectedOutput: '<input value={name} onChange={...} />',
    },
  },
  {
    id: 't1-react-10',
    title: 'How does parent-to-child and child-to-parent communication work in React?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'Parent to child: Passing data/props down',
      'Child to parent: Passing callback functions down, which child invokes with data',
      'Lifting state up to the closest common ancestor',
    ],
    shortReferenceAnswer:
      'Communication in React follows unidirectional data flow: 1) **Parent to child**: The parent passes data downwards directly via `props`. 2) **Child to parent**: The parent defines a callback function and passes it as a prop to the child; when an event occurs, the child calls this callback and passes data back up as arguments. If two sibling components need to share data, you **lift the state up** to their closest common parent.',
    practicalExample: `// Parent component holds state and defines callback
function Parent() {
  const [theme, setTheme] = React.useState('light');

  return (
    <div className={theme}>
      {/* Passing callback down to child */}
      <ThemeToggle onToggleTheme={(newTheme) => setTheme(newTheme)} />
    </div>
  );
}

// Child calls callback to send info upwards
function ThemeToggle({ onToggleTheme }) {
  return (
    <button onClick={() => onToggleTheme('dark')}>
      Switch to Dark Mode
    </button>
  );
}`,
    optionalFollowUp: {
      question: 'What is "prop drilling" and how do developers solve it when components are deeply nested?',
      expectedAnswer:
        'Prop drilling occurs when props are passed through many intermediate components that do not need them just to reach a deep child. It is solved using React Context or global state managers like Redux Toolkit.',
    },
    hints: [
      'Can a child change a prop directly?',
      'How does a child trigger an action in its parent?',
    ],
  },
  {
    id: 't1-react-11',
    title: 'What are the main component lifecycle concepts in modern functional React?',
    category: 'React Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 11,
    expectedConcepts: [
      'Mounting: Component is created and inserted into the DOM for the first time',
      'Updating: Component re-renders because state or props changed',
      'Unmounting: Component is removed from the DOM',
      'How useEffect maps to these phases (mount [], update [deps], unmount cleanup)',
    ],
    shortReferenceAnswer:
      'A component’s lifecycle represents its journey in the application: 1) **Mounting**: The component is rendered for the first time and inserted into the real DOM (handled by `useEffect(..., [])`). 2) **Updating**: State or props change, causing React to re-render the component and update the DOM (handled by `useEffect(..., [deps])`). 3) **Unmounting**: The component is removed from the screen, where cleanup handlers (canceling timers, removing window listeners) execute.',
    practicalExample: `function WindowTracker() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    // 1. Mount: Add listener
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // 2. Unmount: Cleanup listener to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty deps = run on mount, cleanup on unmount

  return <div>Window width: {width}px</div>;
}`,
    optionalFollowUp: {
      question: 'What happens if you do not clean up an event listener in the unmount phase?',
      expectedAnswer:
        'The listener remains in memory referencing the unmounted component, leading to memory leaks and errors when it attempts to call setState on an unmounted component.',
    },
    hints: [
      'What are the 3 major phases: when it appears, when it changes, and when it disappears?',
      'Which lifecycle phase does the return function in useEffect correspond to?',
    ],
  },
];

