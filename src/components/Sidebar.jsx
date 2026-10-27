import { Boxes, Sparkles } from 'lucide-react';
import { primaryLinks, systemLinks } from '../data/navigation.js';

export default function Sidebar({ activeView, onNavigate, lowCount, workspaceName }) {
  const renderLinks = (links) => links.map(({ label, icon: Icon }) => (
    <button key={label} onClick={() => onNavigate(label)} aria-current={activeView === label ? 'page' : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${activeView === label ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
    </button>
  ));
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white"><Boxes size={22} /></div>
        <div className="min-w-0"><div className="truncate text-lg font-extrabold tracking-tight text-slate-900">{workspaceName}</div><div className="text-[10px] font-bold tracking-[.18em] text-slate-400">SMART INVENTORY</div></div>
      </div>
      <div className="mb-3 px-3 text-[10px] font-extrabold tracking-[.18em] text-slate-400">WORKSPACE</div>
      <nav className="grid gap-1">{renderLinks(primaryLinks)}</nav>
      <div className="mb-3 mt-8 px-3 text-[10px] font-extrabold tracking-[.18em] text-slate-400">SYSTEM</div>
      <nav className="grid gap-1">{renderLinks(systemLinks)}</nav>
      <div className="mt-auto rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><Sparkles size={16} className="text-blue-600" /> Smart insights</div>
        <p className="my-2 text-xs leading-5 text-slate-500">Your inventory has {lowCount} items that may need restocking soon.</p>
        <button className="text-xs font-bold text-blue-700 hover:underline" onClick={() => onNavigate('Restock planner')}>Review recommendations →</button>
      </div>
    </aside>
  );
}
