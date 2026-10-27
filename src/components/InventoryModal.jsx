import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog.jsx';
import { money } from '../utils/inventory.js';

const fieldClass = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100';
const emptyForm = (reorder) => ({ name: '', sku: '', category: 'Components', cost: '', qty: '', reorder });

export default function InventoryModal({ mode, product, defaultReorder = 5, onClose, onSaveProduct, onSaveStock }) {
  const [form, setForm] = useState(emptyForm(defaultReorder));
  const [action, setAction] = useState('restock');
  const [quantity, setQuantity] = useState(1);
  // Which confirmation is showing: null | 'stock' | 'add' | 'discard'
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    setConfirming(null);
    if (mode === 'edit-stock' && product) {
      setAction('restock'); setQuantity(1);
    } else {
      setForm(emptyForm(defaultReorder));
    }
  }, [mode, product, defaultReorder]);
  if (!mode) return null;

  const isStock = mode === 'edit-stock';
  const qty = Number(quantity);
  const hasTypedData = !isStock && Boolean(form.name.trim() || form.sku.trim() || form.cost !== '' || form.qty !== '');
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const requestClose = () => { if (hasTypedData) setConfirming('discard'); else onClose(); };
  const submit = (event) => {
    event.preventDefault();
    if (isStock) {
      const invalid = !Number.isInteger(qty) || qty < 1 || (action === 'sale' && qty > (product?.qty ?? 0));
      if (invalid) onSaveStock({ action, quantity: qty }); // shows the error message
      else setConfirming('stock');
    } else {
      setConfirming('add');
    }
  };
  const saveProduct = () => onSaveProduct({ ...form, cost: Number(form.cost), qty: Number(form.qty), reorder: Number(form.reorder), name: form.name.trim(), sku: form.sku.trim() });
  const cancel = () => setConfirming(null);

  const dialogs = {
    stock: {
      title: 'Are you sure?', confirmLabel: 'Yes', cancelLabel: 'No', danger: false,
      onConfirm: () => { setConfirming(null); onSaveStock({ action, quantity: qty }); },
      body: <>Do you want to {action === 'sale' ? 'record a sale of' : 'restock'} <strong className="text-slate-800">{qty} × {product?.name}</strong>? Stock will change from <strong className="text-slate-800">{product?.qty ?? 0}</strong> to <strong className="text-blue-700">{(product?.qty ?? 0) + (action === 'sale' ? -qty : qty)}</strong>.</>,
    },
    add: {
      title: 'Add this product?', confirmLabel: 'Yes, add it', cancelLabel: 'No', danger: false,
      onConfirm: () => { setConfirming(null); saveProduct(); },
      body: <>
        <strong className="text-slate-800">{form.name.trim()}</strong> ({form.sku.trim()}) will be added to the <strong className="text-slate-800">{form.category}</strong> category with <strong className="text-slate-800">{Number(form.qty)}</strong> unit(s) at <strong className="text-slate-800">{money(Number(form.cost))}</strong> each.
      </>,
    },
    discard: {
      title: 'Discard this product?', confirmLabel: 'Yes, discard', cancelLabel: 'Keep editing', danger: true,
      onConfirm: () => { setConfirming(null); onClose(); },
      body: <>You have unsaved details in this form. If you close it now, they will be lost.</>,
    },
  };
  const dialog = confirming ? dialogs[confirming] : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) requestClose(); }}>
      <form onSubmit={submit} className="my-8 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between"><div><h2 className="text-xl font-extrabold text-slate-900">{isStock ? 'Update stock' : 'Add product'}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{isStock ? `Record a sale or restock for ${product?.name}.` : 'Add a product to your inventory catalog.'}</p></div><button type="button" onClick={requestClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close"><X size={18} /></button></div>
        {isStock ? <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Transaction<select value={action} onChange={(e) => setAction(e.target.value)} className={fieldClass}><option value="sale">Record sale</option><option value="restock">Restock units</option></select></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Quantity<input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className={fieldClass} /></label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 sm:col-span-2">Current quantity: <strong className="text-slate-800">{product?.qty ?? 0}</strong></div>
        </div> : <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-bold text-slate-600 sm:col-span-2">Product name<input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Wireless mouse" className={fieldClass} /></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">SKU<input required value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="ACC-009" className={fieldClass} /></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Category<select value={form.category} onChange={(e) => set('category', e.target.value)} className={fieldClass}><option>Components</option><option>Peripherals</option><option>Storage</option><option>Accessories</option></select></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Unit cost (₱)<input type="number" min="0" required value={form.cost} onChange={(e) => set('cost', e.target.value)} className={fieldClass} /></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600">Quantity<input type="number" min="0" required value={form.qty} onChange={(e) => set('qty', e.target.value)} className={fieldClass} /></label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-600 sm:col-span-2">Reorder level<input type="number" min="0" required value={form.reorder} onChange={(e) => set('reorder', e.target.value)} className={fieldClass} /></label>
        </div>}
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={requestClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">{isStock ? 'Apply transaction' : 'Save product'}</button></div>
      </form>
      <ConfirmDialog open={!!dialog} title={dialog?.title} confirmLabel={dialog?.confirmLabel} cancelLabel={dialog?.cancelLabel} danger={dialog?.danger} onConfirm={dialog?.onConfirm} onCancel={cancel}>
        {dialog?.body}
      </ConfirmDialog>
    </div>
  );
}
