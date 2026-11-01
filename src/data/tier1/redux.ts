import { Tier1Question } from '@/types/tier1';

export const reduxQuestions: Tier1Question[] = [
  {
    id: 't1-rdx-01',
    title: 'Why is state management useful in web applications and what problem does it solve?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'Prop drilling across deeply nested components',
      'Shared state between distant sibling or cross-tree components',
      'Predictable state transitions and centralized debugging',
      'Single source of truth for application-wide data',
    ],
    shortReferenceAnswer:
      'As an application grows, different parts of the component tree often need to read and update the same data (such as the logged-in user profile, shopping cart items, or global notification toasts). Without centralized state management, data must be passed down through many intermediate components that do not need it (**prop drilling**). Centralized state management provides a single source of truth that any authorized component can access and update directly, keeping state consistent and predictable.',
    practicalExample: `// Without Global State: Needs prop drilling through 5 levels
// <App> -> <Layout> -> <Header> -> <Navbar> -> <UserProfileBadge user={user} />

// With Global State:
// Any component selects only what it needs directly from the store:
function UserProfileBadge() {
  const user = useSelector((state) => state.auth.user);
  return <div>Welcome, {user.name}!</div>;
}`,
    optionalFollowUp: {
      question: 'Does every single piece of data in an app need to go into Redux?',
      expectedAnswer:
        'No. Ephemeral, localized data (like whether a dropdown is open or an input text value) should remain in local component state with useState.',
    },
    hints: [
      'What happens when a component 5 layers deep needs data from the top root component?',
      'What is the term for passing props through components that do not care about them?',
    ],
  },
  {
    id: 't1-rdx-02',
    title: 'What is the difference between local component state and global state?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'Local state (managed with useState/useReducer inside a single component)',
      'Global state (accessible application-wide via store)',
      'Decision criteria: Who needs the data? Does it persist across page navigation?',
    ],
    shortReferenceAnswer:
      '**Local component state** is data isolated to a single component or its immediate children (e.g. form input values, modal open/close toggles, hover states) and is discarded when the component unmounts. **Global state** is data shared across multiple distant components or routes (e.g. user authentication tokens, cart items, cached server data) that persists across page navigations.',
    practicalExample: `// LOCAL STATE: Only this input box cares about what the user is currently typing
function SearchBar() {
  const [query, setQuery] = React.useState(''); // Local state
  const dispatch = useDispatch();

  const handleSearch = () => {
    // Dispatch to GLOBAL STATE only when search is submitted
    dispatch(setGlobalSearchFilter(query));
  };
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
    optionalFollowUp: {
      question: 'Give an example of state that should NOT be put in Redux.',
      expectedAnswer:
        'Text input typing state (on every keystroke), button hover states, or accordion expand/collapse toggles.',
    },
    hints: [
      'Does the navbar need to know that a modal in the footer is open?',
      'If you refresh or leave the page, should the data survive navigation?',
    ],
  },
  {
    id: 't1-rdx-03',
    title: 'What are the three core principles and concepts of Redux: Store, Actions, and Reducers?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'Store: The single source of truth holding the entire state tree',
      'Action: Plain JavaScript object describing "what happened" (type, payload)',
      'Reducer: Pure function taking (previousState, action) => newState',
      'One-way data flow: View -> Dispatch Action -> Reducer updates Store -> View re-renders',
    ],
    shortReferenceAnswer:
      'Redux relies on three core concepts: 1) **The Store**: A single centralized JavaScript object that holds the complete state tree for the application. 2) **Actions**: Plain JavaScript objects with a `type` property (and optional `payload`) describing an event that occurred. 3) **Reducers**: Pure functions that take the current state and an action, calculate the new state, and return it. State is read-only and can only be updated by dispatching an action to a reducer.',
    practicalExample: `// 1. Action
const depositMoney = { type: 'bank/deposit', payload: 100 };

// 2. Reducer (calculates new state)
function bankReducer(state = { balance: 0 }, action) {
  switch (action.type) {
    case 'bank/deposit':
      return { ...state, balance: state.balance + action.payload };
    default:
      return state;
  }
}

// 3. Store holds it: store.dispatch(depositMoney);`,
    optionalFollowUp: {
      question: 'Why must Redux reducers be pure functions with no side effects?',
      expectedAnswer:
        'Because pure functions are deterministic: given the same state and action, they always return the exact same output. This makes state predictable, reproducible, and enables features like time-travel debugging.',
    },
    hints: [
      'What object holds the whole state tree?',
      'What plain object tells the reducer what happened?',
      'What function takes the old state and produces the new state?',
    ],
  },
  {
    id: 't1-rdx-04',
    title: 'What is createSlice in Redux Toolkit and how does it simplify Redux code?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'Combines actions and reducers in a single file/function',
      'Requires name, initialState, and reducers object',
      'Automatically generates action creators matching reducer keys',
      'Eliminates boilerplate switch statements and manual action type constants',
    ],
    shortReferenceAnswer:
      '`createSlice` is a function from Redux Toolkit that accepts a slice name, an `initialState`, and an object of reducer functions. It automatically generates the reducer function along with corresponding action creators and action types for each reducer. This drastically reduces boilerplate by eliminating manual action constants, action creators, and `switch` statements.',
    practicalExample: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Auto-generated action creators:
export const { increment, incrementByAmount } = counterSlice.actions;
// Auto-generated reducer:
export default counterSlice.reducer;`,
    optionalFollowUp: {
      question: 'What is the action type string generated for the increment reducer in the example above?',
      expectedAnswer:
        'It combines the slice name and the reducer name: "counter/increment".',
    },
    hints: [
      'Before RTK, you had to write action types, action creators, and reducers in separate files.',
      'What object does counterSlice.actions give you?',
    ],
    codingExercise: {
      instruction:
        'Define a simple slice named "theme" with initialState { mode: "light" } and a reducer toggleTheme that flips between "light" and "dark".',
      starterCode: `import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' },
  reducers: {
    // Add toggleTheme reducer here
  },
});`,
      solutionCode: `import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});`,
      language: 'javascript',
      expectedOutput: 'createSlice with toggleTheme reducer mutating mode',
    },
  },
  {
    id: 't1-rdx-05',
    title: 'How does Immer work inside Redux Toolkit reducers to allow "direct state mutation"?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      'Original Redux rule: Never mutate state directly (always return new copies)',
      'Redux Toolkit wraps reducers with Immer.js automatically',
      'Draft state tracking mutations and producing an immutable copy behind the scenes',
      'Syntactic convenience (state.items.push(item)) without breaking immutability',
    ],
    shortReferenceAnswer:
      'In traditional Redux, mutating state directly (`state.value++` or `state.todos.push()`) causes severe bugs because React cannot detect mutations without new object references. Redux Toolkit integrates the **Immer** library inside `createSlice`. Immer gives you a special "draft" state that records all changes you make with standard mutable syntax, and then automatically produces a pristine, safely copied immutable state tree behind the scenes.',
    practicalExample: `// Traditional Redux (Painful deep copy)
return {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'Boston'
    }
  }
};

// With Redux Toolkit (Immer):
updateCity: (state, action) => {
  state.user.address.city = action.payload; // Safe and clean!
}`,
    optionalFollowUp: {
      question: 'Can you both mutate the state AND return a new state in an Immer reducer?',
      expectedAnswer:
        'No! In Immer reducers, you should either mutate the draft state OR return a completely new state, never both in the same reducer, as Immer throws an error.',
    },
    hints: [
      'Why did traditional Redux require so many spread operators (...state)?',
      'What library lets you write state.push() safely in Redux Toolkit?',
    ],
  },
  {
    id: 't1-rdx-06',
    title: 'How do useSelector and useDispatch connect React components to the Redux store?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'useSelector reads pieces of state from RootState',
      'useSelector subscribes the component to store updates (re-renders only when selected value changes)',
      'useDispatch provides the dispatch function to send actions to the store',
      'Separation of reading data vs updating data',
    ],
    shortReferenceAnswer:
      '`useSelector` and `useDispatch` are React-Redux hooks. `useSelector` takes a selector function `(state) => state.slice.data` to extract data from the Redux store and automatically subscribes the component to updates, triggering a re-render only when the selected value changes. `useDispatch` returns the store’s `dispatch` function, allowing components to trigger state changes by sending actions (`dispatch(increment())`).',
    practicalExample: `import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
  // Read state from Redux
  const count = useSelector((state) => state.counter.value);
  // Get dispatch function
  const dispatch = useDispatch();

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}`,
    optionalFollowUp: {
      question: 'What happens if useSelector returns a brand new object on every render like useSelector(state => ({ count: state.count }))?',
      expectedAnswer:
        'Because a new object reference is created every time, useSelector will think the state changed on every store update and cause unnecessary component re-renders. Select primitive values or use shallowEqual.',
    },
    hints: [
      'Which hook reads data from the store?',
      'Which hook sends an action to trigger a reducer?',
    ],
    codingExercise: {
      instruction:
        'Complete the component to read user.name from state.auth and dispatch logout() when the button is clicked.',
      starterCode: `function UserBadge() {
  // Use useSelector and useDispatch
  return <button>Logout</button>;
}`,
      solutionCode: `function UserBadge() {
  const name = useSelector((state) => state.auth.user.name);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(logout())}>Logout {name}</button>;
}`,
      language: 'javascript',
      expectedOutput: 'useSelector to read name and useDispatch to dispatch logout()',
    },
  },
  {
    id: 't1-rdx-07',
    title: 'How do you handle asynchronous operations like API calls using createAsyncThunk?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'What a thunk is: Function containing async logic dispatched like a regular action',
      'createAsyncThunk generates three promise lifecycle actions: pending, fulfilled, rejected',
      'Handling lifecycle actions in extraReducers inside createSlice',
      'Managing loading spinners and error messages cleanly',
    ],
    shortReferenceAnswer:
      '`createAsyncThunk` is an API from Redux Toolkit that handles asynchronous request lifecycles. It takes an action type string and a payload creator function that returns a Promise. It automatically generates and dispatches three action types: `.pending` (when the request starts), `.fulfilled` (when data resolves successfully), and `.rejected` (when an error occurs). You handle these states in the slice’s `extraReducers` builder to update loading and error state.',
    practicalExample: `// 1. Define async thunk
export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await fetch('/api/users');
  return response.json(); // Becomes action.payload in fulfilled
});

// 2. Handle in slice extraReducers
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});`,
    optionalFollowUp: {
      question: 'Where does the value returned from the async payload creator function end up?',
      expectedAnswer:
        'It is automatically assigned to action.payload in the fulfilled reducer case.',
    },
    hints: [
      'What are the 3 states of an async request: started, succeeded, failed?',
      'Where do you place createAsyncThunk cases in createSlice: reducers or extraReducers?',
    ],
  },
  {
    id: 't1-rdx-08',
    title: 'How do you configure the Redux store using configureStore and provide it to React?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'configureStore from @reduxjs/toolkit',
      'Combining slice reducers into a single root reducer object',
      'Automatic Redux DevTools and thunk middleware configuration',
      'The <Provider store={store}> wrapper from react-redux',
    ],
    shortReferenceAnswer:
      '`configureStore` wraps standard Redux `createStore` with sensible defaults: it automatically combines your slice reducers, adds Redux Thunk middleware for async actions, and turns on Redux DevTools extension support. To make this store available to your entire React component tree, you wrap your root component inside `<Provider store={store}>` imported from `react-redux`.',
    practicalExample: `// 1. store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

// 2. App.jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <MainApplication />
    </Provider>
  );
}`,
    optionalFollowUp: {
      question: 'What is the purpose of the Redux DevTools browser extension?',
      expectedAnswer:
        'It allows developers to inspect the current state tree, see a timeline of every dispatched action with its payload, and perform time-travel debugging by replaying or canceling actions.',
    },
    hints: [
      'What component from react-redux wraps the root app?',
      'What function replaces the legacy createStore in modern Redux Toolkit?',
    ],
  },
  {
    id: 't1-rdx-09',
    title: 'When is Redux useful and when is it unnecessary / overkill?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'Good use cases: Large applications with many components sharing data, frequent updates across distinct routes, collaborative tools',
      'Overkill: Simple apps, isolated forms, small projects where React Context or useState suffices',
      'Trade-offs: Added abstraction and learning curve vs centralized predictability',
    ],
    shortReferenceAnswer:
      'Redux is valuable in medium-to-large applications where multiple unrelated components across different pages need access to the same state (like user permissions, shopping carts, or real-time event feeds) or where predictable state auditing is essential. Redux is overkill for simple apps, static blogs, or apps where data is only shared between immediate parents and children; in those cases, standard React `useState` or React Context is simpler.',
    practicalExample: `// Overkill for a simple modal toggle:
// Don't create an entire Redux slice just for:
const [isOpen, setIsOpen] = useState(false);

// Great use for Redux:
// User notifications received from WebSockets that must update:
// 1) Bell icon in Navbar
// 2) Toast notification floating popup
// 3) Activity history tab in Profile page`,
    optionalFollowUp: {
      question: 'How does React Context compare to Redux Toolkit?',
      expectedAnswer:
        'React Context is built into React and great for low-frequency global data (like themes or auth), but lacks selector-based rendering optimizations and middleware capabilities that Redux provides for high-frequency updates.',
    },
    hints: [
      'Would you use Redux for a 3-page personal portfolio?',
      'Think about applications like e-commerce or streaming dashboards.',
    ],
  },
  {
    id: 't1-rdx-10',
    title: 'How do action payloads work in Redux Toolkit and how do you pass parameters to actions?',
    category: 'Redux Toolkit Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'action.payload convention',
      'Passing arguments when calling the action creator dispatch(addItem(item))',
      'Accessing action.payload inside the reducer',
      'TypeScript typing with PayloadAction<T>',
    ],
    shortReferenceAnswer:
      'In Redux Toolkit, any argument you pass to an auto-generated action creator function is automatically assigned to `action.payload` on the dispatched action object. Inside the reducer function, you read `action.payload` to access the passed data. In TypeScript, you type this parameter using `PayloadAction<T>` from `@reduxjs/toolkit` to ensure type-safe payloads.',
    practicalExample: `const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // Reducer reads action.payload
    addItem: (state, action) => {
      // action.payload is the product object passed into dispatch
      state.items.push(action.payload);
    },
    removeItemById: (state, action) => {
      // action.payload is the id string
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

// Calling action creator passes data into payload:
dispatch(addItem({ id: 'p1', title: 'Keyboard', price: 49 }));
dispatch(removeItemById('p1'));`,
    optionalFollowUp: {
      question: 'If you call dispatch(addItem(prod1, prod2)), what happens to the second argument?',
      expectedAnswer:
        'By default, RTK action creators only put the FIRST argument into action.payload. If you need to pass multiple items, wrap them in an object: dispatch(addItem({ item1, item2 })).',
    },
    hints: [
      'What property on the action object holds data passed into the action creator?',
      'If you dispatch updateAge(25), what does action.payload equal?',
    ],
  },
];

