export function useOptimisticCart(initialCart, apiSync) {
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
}
