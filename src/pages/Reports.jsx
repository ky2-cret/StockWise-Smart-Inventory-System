import { Download } from 'lucide-react';
import { getStatus, money } from '../utils/inventory.js';

function Bar({ label, value, total, display, color = 'bg-blue-600' }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between gap-3 text-xs"><span className="font-semibold text-slate-700">{label}</span><span className="text-slate-500">{display} · {pct}%</span></div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export default function Reports({ products, transactions, onExport }) {
  const totalValue = products.reduce((sum, p) => sum + p.qty * p.cost, 0);
  const categories = [...new Set(products.map((p) => p.category))]
    .map((name) => ({ name, value: products.filter((p) => p.category === name).reduce((s, p) => s + p.qty * p.cost, 0) }))
    .sort((a, b) => b.value - a.value);
  const counts = { 'In stock': 0, 'Low stock': 0, 'Out of stock': 0 };
  products.forEach((p) => { counts[getStatus(p)] += 1; });
  const topProducts = [...products].map((p) => ({ ...p, value: p.qty * p.cost })).sort((a, b) => b.value - a.value).slice(0, 5);
  const sold = transactions.filter((t) => t.type === 'sale').reduce((s, t) => s + t.quantity, 0);
  const restocked = transactions.filter((t) => t.type === 'restock').reduce((s, t) => s + t.quantity, 0);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div><div className="text-xs font-semibold text-slate-500">Total inventory value</div><div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{money(totalValue)}</div></div>
        <button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Download size={15} /> Export CSV</button>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Value by category</h2>
          <div className="mt-4 grid gap-4">{categories.map((c) => <Bar key={c.name} label={c.name} value={c.value} total={totalValue} display={money(c.value)} />)}</div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Stock health</h2>
          <div className="mt-4 grid gap-4">
            <Bar label="In stock" value={counts['In stock']} total={products.length} display={`${counts['In stock']} item(s)`} color="bg-emerald-500" />
            <Bar label="Low stock" value={counts['Low stock']} total={products.length} display={`${counts['Low stock']} item(s)`} color="bg-amber-500" />
            <Bar label="Out of stock" value={counts['Out of stock']} total={products.length} display={`${counts['Out of stock']} item(s)`} color="bg-rose-500" />
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Top products by value</h2>
          <div className="mt-4 grid gap-2">{topProducts.map((p, i) => <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-xs">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 font-bold text-slate-500">{i + 1}</span>
            <div className="min-w-0 flex-1"><div className="truncate font-bold text-slate-800">{p.name}</div><div className="mt-0.5 text-[10px] text-slate-400">{p.qty} × {money(p.cost)}</div></div>
            <strong className="text-slate-800">{money(p.value)}</strong>
          </div>)}</div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Stock movement this session</h2>
          <p className="mt-1 text-xs text-slate-400">Based on transactions you recorded</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-rose-50 p-4"><div className="text-2xl font-extrabold text-rose-700">{sold}</div><div className="mt-1 text-xs text-rose-700">units sold</div></div>
            <div className="rounded-xl bg-emerald-50 p-4"><div className="text-2xl font-extrabold text-emerald-700">{restocked}</div><div className="mt-1 text-xs text-emerald-700">units restocked</div></div>
          </div>
        </section>
      </div>
    </div>
  );
}
