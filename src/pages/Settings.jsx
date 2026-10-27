import { useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const fieldClass = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100';
const btnClass = 'rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50';

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

// One field with its own draft value. Saving asks for confirmation first.
function SettingField({ label, type = 'text', value, maxLength, onRequestSave }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  const isNumber = type === 'number';
  const changed = isNumber ? Number(draft) !== Number(value) : draft.trim() !== String(value).trim();
  const invalid = isNumber ? draft === '' || !Number.isFinite(Number(draft)) || Number(draft) < 0 : draft.trim() === '';
  const submit = (event) => {
    event.preventDefault();
    if (changed && !invalid) onRequestSave(label, String(value), isNumber ? String(Number(draft)) : draft.trim(), setDraft);
  };
  return (
    <form onSubmit={submit} className="grid gap-1.5 text-xs font-bold text-slate-600">
      <label>{label}
        <input type={type} min={isNumber ? 0 : undefined} maxLength={maxLength} value={draft} onChange={(e) => setDraft(e.target.value)} className={`mt-1.5 ${fieldClass}`} />
      </label>
      {changed && <div className="flex items-center gap-2">
        <button type="submit" disabled={invalid} className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-50">Save</button>
        <button type="button" onClick={() => setDraft(String(value))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
        {invalid && <span className="font-semibold text-rose-600">{isNumber ? 'Enter a number, 0 or higher.' : 'This can’t be empty.'}</span>}
      </div>}
    </form>
  );
}

const keyOf = { 'Workspace name': 'workspaceName', 'Your name': 'userName', 'Default reorder level': 'defaultReorder', 'Default restock budget (₱)': 'defaultBudget' };

const actionDialogs = {
  restore: { title: 'Restore default settings?', body: 'Workspace name, your name, reorder level and budget will go back to their defaults.', label: 'Restore defaults', danger: false },
  clear: { title: 'Clear transaction history?', body: 'The history list will be emptied. Stock quantities will not change.', label: 'Clear history', danger: true },
  reset: { title: 'Reset demo data?', body: 'All products and transactions will go back to the original demo data. Anything you added or changed will be lost.', label: 'Reset data', danger: true },
};

export default function Settings({ settings, onChange, onResetSettings, onResetData, onClearTransactions, onExport }) {
  const [pendingChange, setPendingChange] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const confirmChange = () => {
    onChange({ [keyOf[pendingChange.label]]: pendingChange.to });
    setPendingChange(null);
  };
  const confirmAction = () => {
    ({ restore: onResetSettings, clear: onClearTransactions, reset: onResetData })[pendingAction]();
    setPendingAction(null);
  };
  const request = (label, from, to) => setPendingChange({ label, from, to });
  const dialog = pendingAction ? actionDialogs[pendingAction] : null;

  return (
    <div className="grid max-w-3xl gap-4">
      <Card title="Workspace" description="Shown in the sidebar and page header. Edit a field, then press Save to confirm.">
        <SettingField label="Workspace name" value={settings.workspaceName} maxLength={24} onRequestSave={request} />
        <SettingField label="Your name" value={settings.userName} maxLength={32} onRequestSave={request} />
      </Card>

      <Card title="Defaults" description="Used to pre-fill the Add product form and the Restock planner.">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingField label="Default reorder level" type="number" value={settings.defaultReorder} onRequestSave={request} />
          <SettingField label="Default restock budget (₱)" type="number" value={settings.defaultBudget} onRequestSave={request} />
        </div>
        <div><button onClick={() => setPendingAction('restore')} className={btnClass}>Restore default settings</button></div>
      </Card>

      <Card title="Data" description="Product data lives in memory and resets on refresh. These actions affect the current session.">
        <div className="flex flex-wrap gap-2">
          <button onClick={onExport} className={btnClass}>Export inventory CSV</button>
          <button onClick={() => setPendingAction('clear')} className={btnClass}>Clear transaction history</button>
          <button onClick={() => setPendingAction('reset')} className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50">Reset demo data</button>
        </div>
      </Card>

      <ConfirmDialog open={!!pendingChange} title={`Change ${pendingChange?.label.toLowerCase()}?`} confirmLabel="Confirm change" onConfirm={confirmChange} onCancel={() => setPendingChange(null)}>
        <div className="grid gap-2 rounded-xl bg-slate-50 p-3 text-xs">
          <div className="flex justify-between gap-3"><span className="text-slate-400">Current</span><strong className="truncate text-slate-700">{pendingChange?.from}</strong></div>
          <div className="flex justify-between gap-3"><span className="text-slate-400">New</span><strong className="truncate text-blue-700">{pendingChange?.to}</strong></div>
        </div>
      </ConfirmDialog>
      <ConfirmDialog open={!!dialog} title={dialog?.title} confirmLabel={dialog?.label} danger={dialog?.danger} onConfirm={confirmAction} onCancel={() => setPendingAction(null)}>
        {dialog?.body}
      </ConfirmDialog>
    </div>
  );
}
