export const money = (amount) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);

export const getStatus = (product) => {
  if (product.qty === 0) return 'Out of stock';
  if (product.qty <= product.reorder) return 'Low stock';
  return 'In stock';
};

export const getStatusClass = (status) => {
  if (status === 'In stock') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Low stock') return 'bg-amber-50 text-amber-700';
  return 'bg-rose-50 text-rose-700';
};

export const rankProduct = (product, query) => {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const fields = [product.name, product.sku, product.category].map((value) => value.toLowerCase());
  if (fields[0] === q || fields[1] === q) return 100;
  if (fields.some((value) => value.startsWith(q))) return 70;
  if (fields.some((value) => value.includes(q))) return 40;
  const words = q.split(/\s+/);
  return words.every((word) => fields.some((value) => value.includes(word))) ? 20 : 0;
};

export const createRestockPlan = (products, budget) => {
  let remaining = Math.max(0, Number(budget) || 0);
  const plan = [];
  const urgent = products
    .filter((product) => product.qty <= product.reorder)
    .map((product) => ({
      ...product,
      need: Math.max(product.reorder * 2 - product.qty, product.reorder - product.qty),
    }))
    .sort((a, b) => (a.qty === 0 ? 0 : 1) - (b.qty === 0 ? 0 : 1) ||
      (a.qty / Math.max(a.reorder, 1)) - (b.qty / Math.max(b.reorder, 1)));

  for (const product of urgent) {
    const units = Math.min(product.need, Math.floor(remaining / product.cost));
    if (units > 0) {
      plan.push({ ...product, units, total: units * product.cost });
      remaining -= units * product.cost;
    }
  }
  return { plan, spent: Math.max(0, Number(budget) || 0) - remaining, remaining };
};