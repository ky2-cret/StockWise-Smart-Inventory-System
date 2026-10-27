import { useState } from 'react';

export default function StockChart() {
  const [period, setPeriod] = useState('Last 7 days');
  const days = period === 'Last 7 days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
  const incoming = period === 'Last 7 days' ? [5, 8, 4, 10, 7, 11, 8] : [18, 22, 16, 28, 20, 31, 25];
  const outgoing = period === 'Last 7 days' ? [7, 5, 9, 6, 11, 8, 10] : [23, 19, 27, 21, 30, 24, 28];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="font-bold text-slate-900">Stock movement</h2><p className="mt-1 text-xs text-slate-400">Illustrative incoming vs. outgoing units</p></div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600">
          <option>Last 7 days</option><option>Last 30 days</option>
        </select>
      </div>
      <div className="mt-5 flex h-44 items-end gap-2 border-b border-slate-100 px-1 sm:gap-3">
        {days.map((day, i) => <div key={day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
          <div className="flex h-[calc(100%-22px)] w-full items-end justify-center gap-1">
            <div className="w-3 rounded-t-md bg-blue-200 sm:w-5" style={{ height: `${incoming[i] / 32 * 100}%` }} />
            <div className="w-3 rounded-t-md bg-blue-600 sm:w-5" style={{ height: `${outgoing[i] / 32 * 100}%` }} />
          </div><span className="pb-2 text-[10px] text-slate-400">{day}</span>
        </div>)}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500"><span>● <span className="text-slate-500">Restocked</span></span><span className="text-blue-700">● <span className="text-slate-500">Sold</span></span></div>
    </section>
  );
}