import { Download, Menu } from 'lucide-react';

const descriptions = {
  Overview: ['Inventory overview', 'A clear picture of your stock, movement, and what needs attention.'],
  Inventory: ['Inventory catalog', 'Search, filter, and update your current products.'],
  'Restock planner': ['Smart restock planner', 'Build a budget-aware restocking plan using an approximation heuristic.'],
  Transactions: ['Stock transactions', 'Record sales and restocks and review the history.'],
  Reports: ['Inventory reports', 'Review inventory value, stock health, and stock movement.'],
  Settings: ['Workspace settings', 'Personalize the workspace and manage your demo data.'],
};

const initialsOf = (name) => {
  const letters = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  return letters || 'AD';
};

export default function Header({ activeView, workspaceName, userName, onExport, onMenu }) {
  const [title, subtitle] = descriptions[activeView] || descriptions.Overview;
  return (
    <header className="mb-7 flex items-start justify-between gap-4">
      <div>
        <div className="text-xs text-slate-400">{workspaceName} / <span className="text-slate-600">{activeView}</span></div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onMenu} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 lg:hidden" aria-label="Open navigation"><Menu size={18} /></button>
        <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500 sm:block">{new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        <button onClick={onExport} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50" title="Export inventory CSV"><Download size={17} /></button>
        <div title={userName} className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">{initialsOf(userName)}</div>
      </div>
    </header>
  );
}
