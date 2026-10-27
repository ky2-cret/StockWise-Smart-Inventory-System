import { useMemo, useState } from 'react';
import InventoryTable from '../components/InventoryTable.jsx';
import { getStatus, rankProduct } from '../utils/inventory.js';

export default function InventoryPage({ products, onUpdateStock, onAddProduct }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All stock status');

  const filteredProducts = useMemo(() => products
    .map((product) => ({ ...product, score: rankProduct(product, query) }))
    .filter((product) => product.score > 0 &&
      (category === 'All categories' || product.category === category) &&
      (statusFilter === 'All stock status' || getStatus(product) === statusFilter))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)), [products, query, category, statusFilter]);

  return (
    <InventoryTable products={filteredProducts} query={query} setQuery={setQuery} category={category} setCategory={setCategory}
      statusFilter={statusFilter} setStatusFilter={setStatusFilter} onUpdateStock={onUpdateStock} onAddProduct={onAddProduct} />
  );
}
