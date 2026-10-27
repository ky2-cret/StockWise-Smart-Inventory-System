import { AlertTriangle, CircleSlash, PackageCheck } from 'lucide-react';
import { getStatus, money } from '../utils/inventory.js';

export default function AlertsPanel({ products, onRestock }) {
  const alerts = [...products].filter((product) => product.qty <= product.reorder).sort((a, b) => (a.qty / Math.max(a.reorder, 1)) - (b.qty / Math.max(b.reorder, 1)));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div><h2 className="font-bold text-slate-900">Low stock & stockouts</h2><p className="mt-1 text-xs text-slate-400">Items at or below their reorder level.</p></div>
      <div className="mt-4 grid gap-2.5">
        {alerts.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${product.qty === 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>{product.qty === 0 ? <CircleSlash size={17} /> : <AlertTriangle size={17} />}</div>
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold text-slate-800">{product.name}</div><div className="mt-1 text-[10px] text-slate-400">{product.sku} · {getStatus(product)}</div></div>
          <div className="text-right"><div className="text-xs font-extrabold text-slate-800">{product.qty} left</div><div className="mt-1 text-[10px] text-slate-400">Min. {product.reorder}</div></div>
          <button onClick={() => onRestock(product)} className="rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-bold text-blue-700 hover:bg-blue-50">Restock</button>
        </div>)}
        {alerts.length === 0 && <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"><PackageCheck size={20} /> All products are above their reorder levels.</div>}
      </div>
    </section>
  );
}