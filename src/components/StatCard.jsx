export default function StatCard({ label, value, note, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <span>{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}><Icon size={18} /></span>
      </div>
      <div className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{value}</div>
      <p className="mt-1.5 text-xs text-slate-400">{note}</p>
    </article>
  );
}