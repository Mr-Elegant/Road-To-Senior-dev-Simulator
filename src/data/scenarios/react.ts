import { Scenario } from '@/types/scenario';

export const reactScenarios: Scenario[] = [
  {
    id: 'react-stale-closure-interval',
    title: 'Order-Book Live Ticker Stale Closure Hook Bug',
    type: 'debugging',
    topic: 'React',
    subtopic: 'Stale closures',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A crypto exchange trading terminal renders live price ticks. Traders report that the price counter freezes after the first tick, or flickers wildly between old and new prices. The bug causes incorrect stop-loss orders to trigger.',
    problemStatement:
      'The custom hook `useIntervalTicker` sets up a `setInterval` inside `useEffect`, but closes over the initial `price` state from render #1. Every time the interval fires, it computes the new price based on the initial stale value rather than the latest accumulated value.',
    constraints: [
      'Must maintain accurate ticker increment based on the latest state.',
      'Must not re-create the setInterval timer on every single tick (which resets the timer drift and causes interval jitter).',
      'Must clean up interval on unmount.',
    ],
    starterCode: `import React, { useState, useEffect, useRef } from 'react';

/**
 * Buggy Live Ticker Hook
 */
export function useIntervalTicker(initialPrice = 100) {
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    // BUG: Closure over 'price' captures initial render state (100) forever!
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.48) * 2;
      setPrice(price + delta); // Always calculates 100 + delta
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array keeps stale closure alive

  return price;
}

function solution(input) {
  // Return the pattern that fixes the stale closure:
  // Option A: Functional state update setPrice(prev => prev + delta)
  // Option B: useRef for callback pattern (useInterval)
  return "repaired";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain how the empty dependency array `[]` locks the `useEffect` closure to initial render variables.',
      'Fix the bug using functional state updates: `setPrice(prevPrice => prevPrice + delta)`.',
      'Explain Dan Abramov\'s `useInterval` ref pattern for dynamic callback updates without timer recreation.',
    ],
    hints: [
      'When state updates depend on the previous state, pass an updater function `(prev) => prev + delta` to the setter.',
      'If you include `price` in the dependency array, `clearInterval` and `setInterval` run on every single second, which can cause jitter.',
    ],
    testCases: [
      {
        id: 'tc-react-stale-1',
        name: 'Updates price monotonically without stale snapshot',
        inputDescription: 'null',
        expectedOutput: '"repaired"',
        explanation: 'State updater pattern successfully decouples from stale closure.',
      },
    ],
    rubric: [
      {
        id: 'rb-stale-closure',
        category: 'root_cause',
        label: 'Stale Closure Root Cause Understanding',
        description: 'Explains JavaScript lexical closure retention inside React component lifecycle.',
        weight: 5,
        levels: [
          { score: 3, description: 'Accurately describes how useEffect captures the scope of the render in which it was created.' },
          { score: 2, description: 'Knows dependency array is missing price, but does not realize that adding it resets the timer.' },
          { score: 0, description: 'Fails to recognize closure capture.' },
        ],
      },
      {
        id: 'rb-functional-updater',
        category: 'correctness',
        label: 'Functional State Update & useInterval Pattern',
        description: 'Implements functional updater or ref-based useInterval pattern cleanly.',
        weight: 5,
        levels: [
          { score: 3, description: 'Uses setPrice(prev => ...) or useRef for saved callback without timer churn.' },
          { score: 1, description: 'Adds [price] to dependencies, causing interval recreation every second.' },
          { score: 0, description: 'Leaves bug intact.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Inside React functional components, every render has its own props and state. The useEffect callback runs after the first render and closes over 'price' (value: 100). Because the dependency array is '[]', the effect never re-runs and never re-captures future render scopes. When the timer fires, 'price + delta' always reads 100 + delta, discarding any subsequent changes.
      
There are two ways to fix this:
1. Functional State Updates: 'setPrice(prev => prev + delta)'. The updater receives the current state from React's internal fiber queue without needing 'price' in the closure.
2. Saved Callback Ref (Dan Abramov pattern): Store the tick callback in a 'useRef' that gets updated on every render. The interval calls 'savedCallback.current()', allowing the timer to remain unchanged while always invoking the freshest function.`,
      codeOrArtifact: `export function useIntervalTicker(initialPrice = 100) {
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.48) * 2;
      // Functional state updater bypasses closure snapshot
      setPrice((prevPrice) => Number((prevPrice + delta).toFixed(2)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return price;
}`,
    },
    alternativeApproaches: [
      'useReducer: dispatch({ type: "TICK", delta }) inherently decouples state logic from effect closures.',
      'useRef for storing the mutable price if it only drives canvas rendering without React DOM reconciliation.',
    ],
    commonMistakes: [
      'Adding [price] to the dependency array: this tears down and recreates the interval on every second, causing timer drift and unnecessary effect thrashing.',
      'Using a global variable outside the hook, creating bugs across multiple hook instances.',
    ],
    followUpQuestions: [
      {
        id: 'react-fq-1',
        question: 'Why does useReducer often prevent stale closure bugs compared to useState?',
        expectedConcepts: ['Dispatch identity stability', 'Reducer operates outside component render scope', 'Decouples action from current state'],
        sampleStrongAnswer: 'The `dispatch` function returned by `useReducer` is identity-stable across all renders. It can be called from any callback or effect without being added to dependency arrays. The state calculation happens inside the pure reducer function, which always receives the true current state directly from the React runtime.',
      },
    ],
  },
  {
    id: 'react-rerender-cascade-table',
    title: '10,000-Row Logistics Inventory Table Cascading Re-Render Freeze',
    type: 'debugging',
    topic: 'React',
    subtopic: 'Re-rendering',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A freight forwarding dispatch dashboard displays a live table of 10,000 shipments. When the operator types into a search input at the top of the page, keystrokes experience 800ms input lag, rendering the application unusable.',
    problemStatement:
      'Every single keystroke updates search query state in the parent page component. Because the table row components are un-memoized and receive newly created inline arrow functions and object literals on every render, all 10,000 row components re-render and re-calculate DOM styles on every character typed.',
    constraints: [
      'Typing in the search input must feel instantaneous (under 16ms input latency).',
      'Table must display filtered results responsively.',
      'Must demonstrate proper use of React.memo, useMemo, useCallback, or virtualization.',
    ],
    starterCode: `import React, { useState } from 'react';

/**
 * Laggy Inventory Table
 */
export function LogisticsDashboard({ items }) {
  const [query, setQuery] = useState('');

  // BUG 1: Re-filtering 10,000 items synchronously on every render
  const filtered = items.filter(item => 
    item.trackingNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Filter shipments..."
      />
      <div>
        {/* BUG 2: Rendering 10,000 un-virtualized, un-memoized rows with inline props */}
        {filtered.map(item => (
          <TableRow 
            key={item.id} 
            item={item} 
            onSelect={() => console.log('Selected', item.id)} // Inline callback breaks memo
          />
        ))}
      </div>
    </div>
  );
}

function TableRow({ item, onSelect }) {
  // Heavy computation per row
  return <div onClick={onSelect}>{item.trackingNumber} - {item.status}</div>;
}

function solution(input) {
  return "virtualized_and_memoized";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Diagnose the two major performance bottlenecks: cascading re-renders and un-virtualized DOM node count.',
      'Apply `useMemo` for filtered dataset and `useCallback` or stable handler for `onSelect`.',
      'Explain windowing/virtualization (e.g. `@tanstack/react-virtual` or `react-window`) to only render visible DOM rows.',
    ],
    hints: [
      'Creating inline arrow functions `<TableRow onSelect={() => ...} />` creates a new function reference on every render, defeating `React.memo(TableRow)`.',
      'Even with React.memo, rendering 10,000 actual DOM nodes in the browser causes severe layout and style recalculation bottlenecks.',
    ],
    testCases: [
      {
        id: 'tc-render-1',
        name: 'Eliminates cascading re-renders and bounds rendered nodes',
        inputDescription: 'null',
        expectedOutput: '"virtualized_and_memoized"',
        explanation: 'Transforms heavy table to lightweight virtualized rendering.',
      },
    ],
    rubric: [
      {
        id: 'rb-render-bottleneck',
        category: 'root_cause',
        label: 'Re-render vs DOM Cost Profiling',
        description: 'Distinguishes JavaScript re-render time from browser DOM layout/paint cost.',
        weight: 5,
        levels: [
          { score: 3, description: 'Clearly explains reconciliation vs DOM paint cost and explains why memoization alone is insufficient for 10,000 rows.' },
          { score: 2, description: 'Identifies inline functions and memo, but ignores 10,000 DOM element memory/paint limit.' },
          { score: 0, description: 'Suggests debouncing input as sole fix without addressing table performance.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `There are two compounding problems:
1. Reconciliation & Component Re-render: Parent state update causes all 10,000 TableRow components to run. Passing inline functions '() => console.log(item.id)' creates new function references, causing React.memo to always fail its shallow comparison.
2. DOM Node Overload: The browser cannot comfortably handle 10,000 complex DOM tree nodes with layout and hit-testing.
Fix:
1. State Colocation / Deferred Value: Use 'useDeferredValue(query)' or 'startTransition' so the input responds immediately at 60fps while filtering runs at lower priority.
2. Virtualization: Use windowing (rendering only the 30-50 visible rows in viewport).
3. Stable Callbacks: Pass row ID to a stable handler or use data attributes.`,
      codeOrArtifact: `import React, { useState, useMemo, useDeferredValue } from 'react';

export function LogisticsDashboard({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    if (!deferredQuery) return items;
    const lower = deferredQuery.toLowerCase();
    return items.filter(item => item.trackingNumber.toLowerCase().includes(lower));
  }, [items, deferredQuery]);

  // Windowing: Render only visible window (e.g. 50 items) or use react-window / react-virtual
  const VISIBLE_COUNT = 50;
  const visibleItems = filtered.slice(0, VISIBLE_COUNT);

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Filter shipments..."
      />
      <div>
        {visibleItems.map(item => (
          <MemoizedTableRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

const MemoizedTableRow = React.memo(function TableRow({ item }) {
  return <div>{item.trackingNumber} - {item.status}</div>;
});`,
    },
    alternativeApproaches: [
      'Using React 18 useTransition to mark filtering as non-urgent.',
      'Server-side filtering with pagination / cursor fetching.',
    ],
    commonMistakes: [
      'Assuming React.memo alone solves rendering 10,000 DOM nodes.',
      'Wrapping everything in useMemo without measuring overhead.',
    ],
    followUpQuestions: [
      {
        id: 'react-fq-2',
        question: 'What is the exact mechanism of useDeferredValue in React 18+?',
        expectedConcepts: ['Concurrent rendering', 'Interruptible low-priority render', 'Keeps UI responsive on high-priority input typing'],
        sampleStrongAnswer: 'useDeferredValue receives a value and returns a deferred version of it. During an urgent update (like typing), React renders the input immediately with the new value, while deferring the re-render of the component consuming the deferred value. If another keystroke arrives mid-render, React will interrupt and abandon the deferred render to process the keystroke first.',
      },
    ],
  },
  {
    id: 'react-race-condition-autocomplete',
    title: 'Customer Support CRM Search Out-of-Order Response Overwrite',
    type: 'debugging',
    topic: 'React',
    subtopic: 'Hooks and dependency arrays',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'In a high-volume customer support ticketing portal, agents type customer email addresses into a live autocomplete bar. Often, typing "alexander" shows search results for "alex" because the earlier network request for "alex" took 600ms while the later request for "alexander" took 150ms.',
    problemStatement:
      'Because network latency varies unpredictably, asynchronous responses return out-of-order. The component currently sets state whenever any promise resolves. Implement request cancellation using `AbortController` and ignore stale in-flight results.',
    constraints: [
      'When user types, earlier in-flight requests must be aborted or their results discarded.',
      'Debounce input to prevent API flood (e.g. 250ms).',
      'Properly handle AbortError without triggering uncaught exception logs.',
    ],
    starterCode: `import React, { useState, useEffect } from 'react';

/**
 * Buggy Autocomplete: Prone to out-of-order response race conditions
 */
export function useCustomerSearch(query) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // BUG: No AbortController or active flag.
    // An earlier slow request will overwrite a newer faster request!
    fetch(\`/api/customers?q=\${encodeURIComponent(query)}\`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setIsLoading(false);
      });

  }, [query]);

  return { results, isLoading };
}

function solution(input) {
  return "aborted_stale_requests";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Identify how variable network latency produces stale state overwrites.',
      'Implement `AbortController` in the `useEffect` cleanup function.',
      'Catch `err.name === "AbortError"` gracefully so aborted requests do not set error state.',
    ],
    hints: [
      'Return a cleanup function from `useEffect`: `return () => controller.abort()`.',
      'Pass `signal: controller.signal` into `fetch()`.',
    ],
    testCases: [
      {
        id: 'tc-race-auto-1',
        name: 'Discards stale in-flight responses and aborts signal',
        inputDescription: 'null',
        expectedOutput: '"aborted_stale_requests"',
        explanation: 'Cleanly cancels superseded fetch requests on dependency change.',
      },
    ],
    rubric: [
      {
        id: 'rb-abort-controller',
        category: 'correctness',
        label: 'AbortController & Cleanup Implementation',
        description: 'Uses AbortController in useEffect cleanup and ignores AbortError.',
        weight: 5,
        levels: [
          { score: 3, description: 'Aborts controller signal on cleanup, checks error name, and handles component unmount.' },
          { score: 2, description: 'Uses boolean isMounted flag instead of AbortController (cancels state update but wastes network bandwidth).' },
          { score: 0, description: 'No cancellation mechanism.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `When 'query' changes rapidly, multiple fetch requests are spawned in parallel. If request A takes 500ms and request B takes 100ms, request B resolves first. 400ms later, request A resolves and calls 'setResults(dataA)', overwriting the newer data with stale data.
      
Fix:
Instantiate an 'AbortController' inside the effect and pass 'controller.signal' to 'fetch'. In the effect's cleanup function, invoke 'controller.abort()'. When the query changes or the component unmounts, the in-flight HTTP request is canceled immediately at the browser network socket level.`,
      codeOrArtifact: `export function useCustomerSearch(query) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(\`/api/customers?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          // Expected cancellation, ignore
          return;
        }
        console.error('Fetch error', err);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  return { results, isLoading };
}`,
    },
    alternativeApproaches: [
      'Using TanStack Query (React Query) or SWR with automatic request deduplication and query cancellation.',
      'Using a request sequence ID ref (e.g. currentSeqRef.current === seq) to ignore outdated responses.',
    ],
    commonMistakes: [
      'Only using a boolean flag "let active = true; ... return () => active = false": this ignores state update but does not abort the network request, consuming client bandwidth and battery.',
      'Failing to catch AbortError, resulting in noisy unhandled promise rejection warnings in the browser console.',
    ],
    followUpQuestions: [
      {
        id: 'react-fq-3',
        question: 'How does TanStack Query handle query cancellation under the hood?',
        expectedConcepts: ['Signal injection into queryFn', 'Automatic cancellation when component unmounts or query key changes'],
        sampleStrongAnswer: 'TanStack Query passes a signal object ({ signal }) into the queryFn. If the component unmounts or query keys change before the promise completes, TanStack Query calls abort() on the internal AbortController, automatically signaling the underlying fetch or axios call to abort.',
      },
    ],
  },
  {
    id: 'react-accessible-combobox',
    title: 'Accessible ARIA 1.2 Enterprise Multi-Select Combobox',
    type: 'coding',
    topic: 'React',
    subtopic: 'Accessibility',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'An enterprise healthcare and governance system requires all interface components to comply with WCAG 2.1 AA and Section 508. The current custom assignee dropdown cannot be operated via keyboard navigation and screen readers read it as an unlabelled text box.',
    problemStatement:
      'Build a fully accessible, keyboard-operable Combobox component complying with WAI-ARIA 1.2 Combobox pattern. It must support ArrowDown/ArrowUp navigation, Enter to select, Escape to close, aria-expanded, aria-activedescendant, aria-controls, and live regions.',
    constraints: [
      'Must support complete keyboard interaction without mouse.',
      'Must properly maintain focus on input while using aria-activedescendant to track highlighted option.',
      'Screen readers must announce option count and active selection changes.',
    ],
    starterCode: `import React, { useState, useRef } from 'react';

/**
 * Accessible Combobox Component
 */
export function AccessibleCombobox({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');

  // TODO: Add ARIA attributes and keyboard handlers:
  // - onKeyDown: ArrowDown, ArrowUp, Enter, Escape
  // - role="combobox", aria-expanded, aria-haspopup="listbox"
  // - aria-activedescendant for virtual focus
  return (
    <div className="combobox-wrapper">
      <input
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isOpen && (
        <ul role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.id}
              id={\`opt-\${opt.id}\`}
              role="option"
              aria-selected={activeIndex === i}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function solution(input) {
  return "wcag_compliant";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Implement `onKeyDown` to handle ArrowDown, ArrowUp, Enter, Escape, and Home/End.',
      'Bind `aria-activedescendant` on the input pointing to the active option element ID.',
      'Ensure listbox receives `role="listbox"` and items receive `role="option"`.',
    ],
    hints: [
      'Virtual focus via `aria-activedescendant` allows the keyboard user to keep typing in the input while visually highlighting listbox items.',
      'When the list closes, reset `activeIndex` to -1.',
    ],
    testCases: [
      {
        id: 'tc-a11y-1',
        name: 'Supports full ARIA combobox pattern and keyboard events',
        inputDescription: 'null',
        expectedOutput: '"wcag_compliant"',
        explanation: 'Implements accessible keyboard navigation and ARIA attributes.',
      },
    ],
    rubric: [
      {
        id: 'rb-aria-semantics',
        category: 'code_quality',
        label: 'WAI-ARIA Combobox Semantics',
        description: 'Implements aria-expanded, aria-controls, role="combobox", aria-activedescendant.',
        weight: 5,
        levels: [
          { score: 3, description: 'Full WAI-ARIA 1.2 spec compliance, flawless virtual focus.' },
          { score: 2, description: 'Basic keyboard handling but missing aria-activedescendant.' },
          { score: 0, description: 'Not accessible.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `The WAI-ARIA 1.2 Combobox pattern requires:
1. An input with role="combobox", aria-expanded, aria-haspopup="listbox", aria-controls="listbox-id", and aria-autocomplete.
2. When the popup opens, focus remains inside the text input so typing continues uninterrupted.
3. Virtual focus is conveyed via 'aria-activedescendant="opt-[id]"', where the input references the ID of the currently highlighted list item.
4. ArrowDown/Up moves virtual focus without scrolling the page. Enter selects the highlighted item and closes. Escape closes without selecting.`,
      codeOrArtifact: `export function AccessibleCombobox({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');

  const activeOptionId = activeIndex >= 0 && options[activeIndex] 
    ? \`option-\${options[activeIndex].id}\` 
    : undefined;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0) {
        onSelect(options[activeIndex]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div>
      <input
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="combobox-options-list"
        aria-activedescendant={activeOptionId}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul id="combobox-options-list" role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.id}
              id={\`option-\${opt.id}\`}
              role="option"
              aria-selected={activeIndex === i}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    },
    alternativeApproaches: [
      'Using Radix UI Primitives, Headless UI, or Downshift for battle-tested accessible combobox state machines.',
    ],
    commonMistakes: [
      'Moving physical DOM focus (.focus()) to the list item on ArrowDown, preventing the user from typing more characters.',
      'Missing aria-expanded="false" when closed.',
    ],
    followUpQuestions: [
      {
        id: 'react-fq-4',
        question: 'Why is aria-activedescendant preferred over moving physical document.activeElement focus into the dropdown list?',
        expectedConcepts: ['Keeps text caret active in input', 'Allows uninterrupted typing and filtering', 'Virtual focus paradigm'],
        sampleStrongAnswer: 'With aria-activedescendant, the browser maintains physical focus inside the `<input>`. This allows the user to continue typing or editing text without interruption, while assistive technologies (screen readers) announce the highlighted option as if focus moved to it.',
      },
    ],
  },
  {
    id: 'react-custom-hook-optimistic-mutation',
    title: 'E-Commerce Cart Optimistic Mutation Hook with Rollback',
    type: 'coding',
    topic: 'React',
    subtopic: 'State management',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'In a high-conversion checkout experience, users rapidly tap "+ / -" on cart items. Slow 3G network latency causes UI lag and button stutter. Product management requests instant UI updates, but if the inventory check or coupon calculation fails on the server, the cart must roll back seamlessly with a user alert.',
    problemStatement:
      'Create a custom hook `useOptimisticCart` that updates local cart count immediately, queues the backend sync mutation, rolls back to previous state if the network request fails, and handles concurrent rapid clicks without corrupting final quantity.',
    constraints: [
      'UI must update synchronously with zero perceivable delay.',
      'Server failure must roll back state to pre-mutation snapshot and notify candidate.',
      'Must handle serialized mutations so consecutive clicks (+1, +1, +1) converge accurately.',
    ],
    starterCode: `import React, { useState, useRef } from 'react';

/**
 * Optimistic Cart Hook
 */
export function useOptimisticCart(initialCart, apiSync) {
  const [cart, setCart] = useState(initialCart);
  const [error, setError] = useState(null);
  const previousCartRef = useRef(initialCart);

  const updateQuantity = async (itemId, newQty) => {
    // TODO: Implement optimistic update with rollback on failure
  };

  return { cart, error, updateQuantity };
}

function solution(input) {
  return "optimistic_with_rollback";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Store snapshot before mutation in a ref or previous state holder.',
      'Update UI state optimistically.',
      'If API rejects, restore previous snapshot and set error message.',
      'Explain how React 19 `useOptimistic` hook formalizes this pattern.',
    ],
    hints: [
      'Keep a snapshot of the known-server state.',
      'If consecutive requests fire, ensure the rollback targets the last confirmed server state, not an intermediate optimistic state.',
    ],
    testCases: [
      {
        id: 'tc-opt-1',
        name: 'Updates immediately and recovers on server rejection',
        inputDescription: 'null',
        expectedOutput: '"optimistic_with_rollback"',
        explanation: 'Provides instant feedback and reliable error recovery.',
      },
    ],
    rubric: [
      {
        id: 'rb-optimistic-rollback',
        category: 'reliability',
        label: 'Optimistic State Recovery & Consistency',
        description: 'Implements rollback without race condition corruption during multiple rapid clicks.',
        weight: 5,
        levels: [
          { score: 3, description: 'Handles rollback, snapshots confirmed server state, and queues concurrent actions.' },
          { score: 2, description: 'Implements basic rollback but breaks if multiple rapid clicks occur.' },
          { score: 0, description: 'No rollback on failure.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `An optimistic update applies changes to the local state immediately before sending the network request.
To do this safely:
1. Capture a snapshot of the known-confirmed state.
2. Apply the optimistic change immediately so the user sees instant feedback.
3. Call the backend API.
4. If the call succeeds, update the confirmed snapshot.
5. If the call fails, restore the snapshot, clear the pending state, and notify the user.
In React 19, the new 'useOptimistic' hook natively integrates with Server Actions to manage temporary optimistic state during async transitions.`,
      codeOrArtifact: `export function useOptimisticCart(initialCart, apiSync) {
  const [cart, setCart] = useState(initialCart);
  const [error, setError] = useState(null);
  const confirmedCartRef = useRef(initialCart);

  const updateQuantity = async (itemId, newQty) => {
    // 1. Snapshot prior confirmed state
    const previousSnapshot = confirmedCartRef.current;

    // 2. Optimistic update
    setCart((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));
    setError(null);

    try {
      const serverResult = await apiSync(itemId, newQty);
      confirmedCartRef.current = serverResult;
      setCart(serverResult);
    } catch (err) {
      // 3. Rollback on failure
      setCart(previousSnapshot);
      setError('Failed to update cart. Changes reverted.');
    }
  };

  return { cart, error, updateQuantity };
}`,
    },
    alternativeApproaches: [
      'Using TanStack Query with onMutate context snapshot and onError rollback.',
      'Using React 19 useOptimistic with useActionState.',
    ],
    commonMistakes: [
      'Rolling back to an intermediate optimistic state instead of the last confirmed server response.',
      'Failing to inform the user why the number suddenly dropped back.',
    ],
    followUpQuestions: [
      {
        id: 'react-fq-5',
        question: 'How does React 19 useOptimistic work in tandem with Server Actions?',
        expectedConcepts: ['useOptimistic(state, updateFn)', 'Automatic reversion when Server Action finishes or throws'],
        sampleStrongAnswer: 'In React 19, `useOptimistic` takes the actual server state and an updateFn. When a Server Action is dispatched within `startTransition`, you call the optimistic dispatch. React renders the optimistic value immediately for the duration of the transition. As soon as the Server Action finishes or rejects, React automatically discards the optimistic value and reverts to the actual returned state.',
      },
    ],
  },
  {
    id: 'enterprise-loan-management',
    title: 'Enterprise Loan Management Dashboard (React & Redux Toolkit)',
    type: 'coding',
    topic: 'React',
    subtopic: 'Redux Toolkit, Concurrency & Optimistic UI',
    difficulty: 'Senior',
    estimatedMinutes: 45,
    businessContext:
      'An enterprise Non-Banking Financial Company (NBFC) manages high-volume loan applications across diverse risk tiers. Underwriters need an interactive dashboard to search, filter, paginate, sort, inspect credit profiles, and execute optimistic loan approvals or rejections with zero-drift rollback on network rejection.',
    problemStatement:
      'Design and architect a production-grade enterprise dashboard powered by Redux Toolkit. You must structure domain slices (applications, dashboard, ui), implement asynchronous createAsyncThunk data fetching with AbortController cancellation and monotonic request-ID guards against race conditions, support optimistic status updates with atomic rollback snapshots, and optimize render performance using memoized createSelector selectors and React.memo.',
    constraints: [
      'Older asynchronous search responses must never overwrite newer search queries.',
      'Optimistic updates must record pre-mutation snapshots and roll back atomically on API failure without corrupting concurrent rows.',
      'Filter and search mutations must reset the pagination page index to 1.',
      'Derived metrics must be computed via createSelector rather than duplicated in state.',
      'Component tree must use debounced inputs and React.memo to prevent keystroke render thrashing.',
    ],
    starterCode: `import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// 1. Applications Slice
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async (params, { signal }) => {
    const res = await fetch(\`/api/applications?search=\${params.search}\`, { signal });
    return await res.json();
  }
);

export const updateLoanStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(\`/api/applications/\${id}/status\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update rejected');
      return await res.json();
    } catch (err) {
      return rejectWithValue({ id, message: err.message });
    }
  }
);

// Build slices and selectors here...`,
    codeLanguage: 'typescript',
    candidateTasks: [
      'Structure normalized Redux slices for applications, dashboard metrics, and UI state.',
      'Implement createAsyncThunk with AbortSignal cancellation and latestRequestId monotonic guards.',
      'Implement safe optimistic status updates with snapshot backups and atomic rollback on error.',
      'Reset pagination page index to 1 on filter and search updates.',
      'Prevent excessive re-renders using debounced search, React.memo rows, and memoized selectors.',
      'Handle error recovery with explicit retry actions.',
    ],
    hints: [
      'Pass thunkAPI.signal to fetch so in-flight requests abort when new queries are dispatched. Additionally, track action.meta.requestId in state.latestRequestId in pending, and only commit fulfilled payloads if action.meta.requestId === state.latestRequestId.',
      'In extraReducers.pending, store a clone of the item in optimisticBackups[id] and mark updatingIds[id] = true before applying item.status = newStatus. In extraReducers.rejected, restore the backup item and unlock updatingIds[id].',
      'Use createSelector to calculate pagination ranges, active filter counts, and status breakdowns. Do not store derived counts in Redux state when they can be computed pure from base arrays.',
    ],
    rubric: [
      {
        id: 'rc-redux-arch',
        category: 'code_quality',
        label: 'Redux Architecture & State Management (20%)',
        description: 'Clean separation into applications, dashboard, and ui slices; typed hooks; single source of truth.',
        weight: 5,
        levels: [
          { score: 3, description: 'Exemplary: Normalized slices, createSelector, zero duplicated derived state, typed hooks.' },
          { score: 2, description: 'Competent: Basic slices configured with typed store, minor derived state duplication.' },
          { score: 1, description: 'Needs Work: Bloated monolithic slice or untyped hooks.' },
        ],
      },
      {
        id: 'rc-api-thunks',
        category: 'correctness',
        label: 'API Integration & Asynchronous Handling (20%)',
        description: 'Proper use of createAsyncThunk, AbortSignal cancellation, and lifecycle state management.',
        weight: 5,
        levels: [
          { score: 3, description: 'Exemplary: Full pending/fulfilled/rejected handling with AbortSignal and condition guards.' },
          { score: 2, description: 'Competent: Async thunks handle standard success and error paths without cancellation.' },
          { score: 1, description: 'Needs Work: Raw fetch calls in components or unhandled promise rejections.' },
        ],
      },
      {
        id: 'rc-race-conditions',
        category: 'reliability',
        label: 'Race Conditions & Error Handling (15%)',
        description: 'Monotonic request-ID guards, atomic optimistic rollback, and meaningful error states.',
        weight: 4,
        levels: [
          { score: 3, description: 'Exemplary: Monotonic request tokens discard stale responses; backup snapshot rollback on failure.' },
          { score: 2, description: 'Competent: Basic try/catch and error toasts without sequence tracking.' },
          { score: 1, description: 'Needs Work: Out-of-order network responses overwrite state.' },
        ],
      },
      {
        id: 'rc-performance',
        category: 'tradeoffs',
        label: 'Performance Optimization (10%)',
        description: 'Debounced search, React.memo on rows, fine-grained selectors, and stable callbacks.',
        weight: 3,
        levels: [
          { score: 3, description: 'Exemplary: 300ms debouncing, memoized row components, and useCallback stability.' },
          { score: 2, description: 'Competent: Some memoization applied, but parent renders cascade down.' },
          { score: 1, description: 'Needs Work: Full table re-renders on every keystroke.' },
        ],
      },
    ],
    referenceSolution: {
      explanation:
        'The production solution implements three decoupled Redux Toolkit slices: applicationsSlice (managing server entity state, pagination, and monotonic request IDs), dashboardSlice (KPI metrics), and uiSlice (modals, drawer, toasts). createAsyncThunk connects to the loanApiService with AbortSignal cancellation and atomic optimistic rollback backups. Selectors memoize derived state to guarantee 60fps performance.',
      codeOrArtifact: `// 1. Applications Slice with Monotonic Concurrency Guard
export const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Reset pagination
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state, action) => {
        state.status = 'loading';
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        if (state.latestRequestId === action.meta.requestId) {
          state.status = 'succeeded';
          state.items = action.payload.items;
          state.totalCount = action.payload.totalCount;
        }
      })
      .addCase(updateApplicationStatus.pending, (state, action) => {
        const { id, newStatus } = action.meta.arg;
        const item = state.items.find(i => i.id === id);
        if (item) {
          state.optimisticBackups[id] = { ...item };
          state.updatingIds[id] = true;
          item.status = newStatus;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        const id = action.payload?.id || action.meta.arg.id;
        if (state.optimisticBackups[id]) {
          const index = state.items.findIndex(i => i.id === id);
          if (index !== -1) state.items[index] = state.optimisticBackups[id];
          delete state.optimisticBackups[id];
        }
        delete state.updatingIds[id];
      });
  }
});`,
    },
    alternativeApproaches: [
      'Using RTK Query with auto-generated hooks (useGetApplicationsQuery) and onQueryStarted for optimistic updates.',
      'Using TanStack Query (React Query) with queryClient.setQueryData for optimistic rollback.',
    ],
    commonMistakes: [
      'Failing to reset the page index when search or status filters change, causing empty views.',
      'Omitting optimistic rollback on rejected thunk actions, leaving false-positive approvals on screen.',
      'Allowing older slow search responses to overwrite newer queries due to network jitter.',
      'Directly mutating state arrays using in-place methods like sort() inside selectors or components.',
    ],
    followUpQuestions: [
      {
        id: 'loan-fq-1',
        question: 'How would you scale this dashboard if the record count reached 100,000 active loan applications?',
        expectedConcepts: [
          'DOM Virtualization (react-window or @tanstack/react-virtual)',
          'Cursor / Keyset-based pagination instead of OFFSET',
          'Normalized entity cache with Redux createEntityAdapter',
          'Server-side aggregate computation for metrics',
        ],
        sampleStrongAnswer:
          'At 100,000 records, loading all items in memory will crash the browser. We implement cursor-based keyset pagination on the backend to avoid slow OFFSET queries, use @tanstack/react-virtual to only render the ~20 visible rows in the viewport, normalize state using createEntityAdapter, and calculate all dashboard totals server-side.',
      },
    ],
  },
];

