import { useState } from 'react';
import { createRestockPlan, money } from '../utils/inventory.js';

export default function RestockPlanner({ products, defaultBudget }) {
  const [budget, setBudget] = useState(defaultBudget);
  const [plan, setPlan] = useState(null);
  const needCount = products.filter((p) => p.qty <= p.reorder).length;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr]">
      <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Restock budget</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Approximation strategy: prioritize stockouts and low-stock items, then select affordable quantities within your budget. This heuristic is practical, not guaranteed optimal.</p>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500"><strong className="text-slate-800">{needCount}</strong> product(s) are at or below their reorder level.</div>
        <label className="mt-5 grid gap-2 text-xs font-bold text-slate-600">Restock budget (₱)
          <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </label>
        <button onClick={() => setPlan(createRestockPlan(products, budget))} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Calculate plan</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Suggested plan</h2>
        {!plan ? <p className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">Enter a budget and press “Calculate plan” to see what to restock first.</p> : <>
          <p className="mt-1 text-xs text-slate-400">{plan.plan.length} product(s) selected</p>
          <div className="mt-4 grid gap-2">
            {plan.plan.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-xs">
              <div className="min-w-0"><div className="truncate font-bold text-slate-800">{item.name}</div><div className="mt-1 text-[10px] text-slate-400">{item.sku} · {item.units} unit(s) × {money(item.cost)}</div></div>
              <strong className="text-slate-800">{money(item.total)}</strong>
            </div>)}
          </div>
          {plan.plan.length === 0 && <p className="mt-2 text-xs text-slate-500">No full units fit this budget. Increase the budget to include restocks.</p>}
          <div className="mt-4 grid gap-1 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-600">
            <div>Estimated spend: <strong>{money(plan.spent)}</strong></div>
            <div>Budget remaining: <strong>{money(plan.remaining)}</strong></div>
          </div>
        </>}
      </section>
    </div>
  );
}
