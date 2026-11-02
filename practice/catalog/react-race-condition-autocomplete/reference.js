export function useCustomerSearch(query) {
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

    fetch(`/api/customers?q=${encodeURIComponent(query)}`, {
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
}
