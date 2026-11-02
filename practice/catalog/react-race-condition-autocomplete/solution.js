import React, { useState, useEffect } from 'react';

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
    fetch(`/api/customers?q=${encodeURIComponent(query)}`)
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
}