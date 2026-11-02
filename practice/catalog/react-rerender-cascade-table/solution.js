import React, { useState } from 'react';

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
}