export function useIntervalTicker(initialPrice = 100) {
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
}
