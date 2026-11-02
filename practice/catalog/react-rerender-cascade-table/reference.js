import React, { useState, useMemo, useDeferredValue } from 'react';

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
});
