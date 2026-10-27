import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100';
const formatDate = (iso) => new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function Transactions({ products, transactions, onRecord }) {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('sale');
  const [quantity, setQuantity] = useState(1);
  const selectedId = productId || String(products[0]?.id ?? '');
  const [confirming, setConfirming] = useState(false);
  const selected = products.find((p) => String(p.id) === selectedId);
  const qty = Number(quantity);

  const submit = (event) => {
    event.preventDefault();
    if (!selected) return;
    const invalid = !Number.isInteger(qty) || qty < 1 || (type === 'sale' && qty > selected.qty);
    if (invalid) { onRecord(selected.id, type, qty); return; } // shows the error message
    setConfirming(true);
  };
  const confirmApply = () => {
    setConfirming(false);
    if (onRecord(selected.id, type, qty)) setQuantity(1);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.6fr]">
      <form onSubmit={submit} className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Record transaction</h2>
        <p className="mt-1 text-xs text-slate-400">Stock is recalculated as soon as you apply it.</p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Product
            <select value={selectedId} onChange={(e) => setProductId(e.target.value)} className={fieldClass}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-xs font-bold text-slate-600">Transaction
              <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}><option value="sale">Record sale</option><option value="restock">Restock units</option></select>
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-slate-600">Quantity
              <input type="number" min="1" step="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className={fieldClass} />
            </label>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">Current quantity: <strong className="text-slate-800">{selected?.qty ?? 0}</strong></div>
          <button type="submit" disabled={!selected} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">Apply transaction</button>
        </div>
      </form>

      <ConfirmDialog open={confirming && !!selected} title="Are you sure?" confirmLabel="Yes" cancelLabel="No" onConfirm={confirmApply} onCancel={() => setConfirming(false)}>
        Do you want to {type === 'sale' ? 'record a sale of' : 'restock'} <strong className="text-slate-800">{qty} × {selected?.name}</strong>? Stock will change from <strong className="text-slate-800">{selected?.qty}</strong> to <strong className="text-blue-700">{selected ? selected.qty + (type === 'sale' ? -qty : qty) : 0}</strong>.
      </ConfirmDialog>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Transaction history</h2>
        <p className="mt-1 text-xs text-slate-400">Newest first · history resets on refresh</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead><tr className="border-y border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400"><th className="px-3 py-3">When</th><th className="px-3 py-3">Product</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Qty</th><th className="px-3 py-3">Stock after</th></tr></thead>
            <tbody>
              {transactions.map((t) => <tr key={t.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3 text-xs text-slate-500">{formatDate(t.at)}</td>
                <td className="px-3 py-3"><div className="text-xs font-bold text-slate-800">{t.name}</div><div className="mt-0.5 text-[10px] text-slate-400">{t.sku}</div></td>
                <td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-[10px] font-bold ${t.type === 'sale' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{t.type === 'sale' ? 'Sale' : 'Restock'}</span></td>
                <td className="px-3 py-3 text-xs font-bold text-slate-800">{t.type === 'sale' ? '−' : '+'}{t.quantity}</td>
                <td className="px-3 py-3 text-xs text-slate-600">{t.balance}</td>
              </tr>)}
              {transactions.length === 0 && <tr><td colSpan="5" className="py-10 text-center text-sm text-slate-400">No transactions yet. Record a sale or restock to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
