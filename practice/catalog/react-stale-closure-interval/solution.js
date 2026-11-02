import React, { useState, useEffect, useRef } from 'react';

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
}