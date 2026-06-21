'use client';

type SummaryData = {
  data: string;
  cost: string;
  timestamp: string;
};

export default function SummaryCard({ summary }: { summary: SummaryData }) {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-indigo-50 max-w-3xl w-full mx-auto mt-8 flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold text-emerald-600 flex items-center gap-3 tracking-tight">
        <span>✅</span>
        <span>Call Completed Successfully</span>
      </h2>
      
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Timestamp</h3>
        <p className="text-slate-800 font-medium">{new Date(summary.timestamp).toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Call Summary & Appointments</h3>
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-slate-800 whitespace-pre-wrap leading-relaxed shadow-sm">
          {summary.data}
        </div>
      </div>

      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cost Breakdown</h3>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-700 font-mono text-sm whitespace-pre-wrap shadow-sm leading-relaxed">
          {summary.cost}
        </div>
      </div>
    </div>
  );
}
