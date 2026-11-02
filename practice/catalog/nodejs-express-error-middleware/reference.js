/**
 * Higher-order utility wrapping async handlers to forward rejections to next(err)
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage:
// app.post('/api/inventory/update', asyncHandler(async (req, res) => {
//   const result = await db.updateInventory(req.body);
//   res.json({ success: true, result });
// }));
