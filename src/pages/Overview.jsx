import { Boxes, CircleDollarSign, AlertTriangle, CircleSlash } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import StockChart from '../components/StockChart.jsx';
import AlertsPanel from '../components/AlertsPanel.jsx';
import { money } from '../utils/inventory.js';

export default function Overview({ products, onAddProduct, onRestock }) {
  const lowCount = products.filter((p) => p.qty > 0 && p.qty <= p.reorder).length;
  const outCount = products.filter((p) => p.qty === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.qty * p.cost, 0);
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="text-sm font-bold text-slate-900">At a glance</h2><p className="mt-1 text-xs text-slate-400">Current inventory snapshot</p></div>
        <button onClick={onAddProduct} className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">＋ Add product</button>
      </div>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={products.length} note="Unique items in your catalog" icon={Boxes} tone="blue" />
        <StatCard label="Inventory value" value={money(totalValue)} note="Current quantity × unit cost" icon={CircleDollarSign} tone="emerald" />
        <StatCard label="Low stock alerts" value={lowCount} note="Products below reorder level" icon={AlertTriangle} tone="amber" />
        <StatCard label="Out of stock" value={outCount} note="Items unavailable to sell" icon={CircleSlash} tone="rose" />
      </section>
      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <StockChart />
        <AlertsPanel products={products} onRestock={onRestock} />
      </section>
    </>
  );
}
