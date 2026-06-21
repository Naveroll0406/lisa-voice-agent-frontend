'use client';

type SummaryData = {
  data: string;
  timestamp: string;
};

export default function SummaryCard({ summary }: { summary: SummaryData }) {
  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full mx-auto mt-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
        <span>✅</span>
        <span>Call Completed Successfully</span>
      </h2>
      
      <div>
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Timestamp</h3>
        <p className="text-slate-200">{new Date(summary.timestamp).toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Call Summary & Appointments</h3>
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
          {summary.data}
        </div>
      </div>
    </div>
  );
}
