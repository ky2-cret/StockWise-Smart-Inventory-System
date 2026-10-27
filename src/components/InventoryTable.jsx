import { Search, ArrowUpDown } from 'lucide-react';
import { getStatus, getStatusClass, money } from '../utils/inventory.js';

export default function InventoryTable({ products, query, setQuery, category, setCategory, statusFilter, setStatusFilter, onUpdateStock, onAddProduct }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-bold text-slate-900">Inventory catalog</h2><p className="mt-1 text-xs text-slate-400">Manage products and monitor stock levels.</p></div>
        <button onClick={onAddProduct} className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700">＋ Add product</button>
      </div>
      <div className="my-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product, category, or SKU…" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600"><option>All categories</option><option>Components</option><option>Peripherals</option><option>Storage</option><option>Accessories</option></select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600"><option>All stock status</option><option>In stock</option><option>Low stock</option><option>Out of stock</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead><tr className="border-y border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400"><th className="px-3 py-3">Product</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Unit cost</th><th className="px-3 py-3">Quantity</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead>
          <tbody>{products.map((product) => { const status = getStatus(product); return <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
            <td className="px-3 py-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-lg">{product.icon || '▤'}</div><div><div className="text-xs font-bold text-slate-800">{product.name}</div><div className="mt-1 text-[10px] text-slate-400">{product.sku}</div></div></div></td>
            <td className="px-3 py-3 text-xs text-slate-500">{product.category}</td><td className="px-3 py-3 text-xs font-semibold text-slate-700">{money(product.cost)}</td><td className="px-3 py-3 text-xs font-bold text-slate-800">{product.qty} <span className="font-normal text-slate-400">units</span></td>
            <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-[10px] font-bold ${getStatusClass(status)}`}>{status}</span></td><td className="px-3 py-3"><button onClick={() => onUpdateStock(product)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-100"><ArrowUpDown size={13} /> Update</button></td>
          </tr>; })}{products.length === 0 && <tr><td colSpan="6" className="py-10 text-center text-sm text-slate-400">No products match your search.</td></tr>}</tbody>
        </table>
      </div>
      <div className="pt-4 text-xs text-slate-400">Showing {products.length} matching product(s) · Demo data resets on refresh</div>
    </section>
  );
}