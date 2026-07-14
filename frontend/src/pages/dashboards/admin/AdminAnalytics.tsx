import React from 'react';
import { BarChart2, PieChart, Sparkles, CheckCircle2 } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const monthlyReports = [
    { month: 'Jan', val: '₹18k', pct: 43, raw: 18000 },
    { month: 'Feb', val: '₹24k', pct: 57, raw: 24000 },
    { month: 'Mar', val: '₹22k', pct: 52, raw: 22000 },
    { month: 'Apr', val: '₹31k', pct: 74, raw: 31000 },
    { month: 'May', val: '₹28k', pct: 67, raw: 28000 },
    { month: 'Jun', val: '₹35k', pct: 83, raw: 35000 },
    { month: 'Jul', val: '₹42.5k', pct: 100, raw: 42500 }
  ];

  const topStartupsAIOutput: any[] = [];

  return (
    <div className="animate-fade-in-up pb-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Analytics</h1>
        <p className="text-gray-500 mt-1">Platform-wide insights, user growth, and revenue analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Working Monthly Revenue (2026) Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2.5">
              <BarChart2 size={20} className="text-[#5B21B6]" /> Monthly Revenue (2026)
            </h2>
            <span className="text-xs font-extrabold text-[#5B21B6] bg-purple-50 px-3 py-1 rounded-full border border-purple-100 w-fit">
              +136% Total Growth YTD
            </span>
          </div>

          {/* Explicitly Heighted & Structured Bar Container */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-64 pt-8 px-2 pb-2 bg-gray-50/50 rounded-2xl border border-gray-100/80">
            {monthlyReports.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <span className="text-xs font-bold text-gray-700 mb-2 transition-transform transform group-hover:-translate-y-1 group-hover:text-[#5B21B6]">
                  {v.val}
                </span>
                <div className="w-full flex items-end h-44 bg-gray-100/70 rounded-t-xl px-1 sm:px-2 overflow-hidden shadow-inner">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#5B21B6] via-[#7C3AED] to-[#9F7AEA] group-hover:from-[#7C3AED] group-hover:to-[#A78BFA] transition-all duration-500 shadow-sm" 
                    style={{ height: `${v.pct}%` }} 
                  />
                </div>
                <span className="text-xs text-gray-600 font-extrabold mt-3">{v.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-6">
              <PieChart size={20} className="text-[#5B21B6]" /> User Roles
            </h2>
            <div className="space-y-4">
              {[
                { role: 'Founders', pct: 58, count: '1,647', color: 'bg-[#5B21B6]' },
                { role: 'Investors', pct: 22, count: '625', color: 'bg-emerald-500' },
                { role: 'Mentors', pct: 15, count: '426', color: 'bg-blue-500' },
                { role: 'Admins', pct: 5, count: '142', color: 'bg-amber-400' },
              ].map(r => (
                <div key={r.role}>
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1.5">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} /> {r.role}
                    </span>
                    <span className="font-bold text-gray-900">{r.pct}% <span className="text-xs text-gray-400 font-normal">({r.count})</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-50/70 rounded-xl border border-purple-100/80 text-xs text-purple-900 font-medium">
            💡 <strong>Platform Ratio:</strong> Healthy 3:1 Founder-to-Investor ratio ensures high term-sheet matching efficiency across all active sectors.
          </div>
        </div>
      </div>

      {/* Top Performing Startups & AI Output */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-xl flex items-center gap-2.5">
              <Sparkles size={22} className="text-[#5B21B6]" /> Top Performing Startups — AI Analytics & Output
            </h2>
            <p className="text-sm text-gray-500 mt-1">Real-time AI evaluation output showing Product-Market Fit prediction, estimated valuation, and strategic recommendations.</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold border border-emerald-200">
            <CheckCircle2 size={14} className="text-emerald-600" /> Live AI Engine Active
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {topStartupsAIOutput.map((s, i) => (
            <div key={s.name} className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors rounded-2xl px-2">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white font-black flex items-center justify-center text-sm shadow-md shrink-0 mt-0.5">
                  #{i + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-extrabold text-gray-900 text-base">{s.name}</h3>
                    <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full font-bold">
                      {s.sector}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      AI PMF: {s.pmfScore}
                    </span>
                  </div>

                  <div className="bg-purple-50/50 border border-purple-100/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-purple-950 font-medium">
                    <Sparkles size={16} className="text-[#5B21B6] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#5B21B6] uppercase tracking-wide text-[10px] block mb-0.5">AI Strategic Output & Action Plan:</span>
                      {s.aiAction}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex sm:items-center justify-between lg:justify-end gap-6 lg:w-72 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 font-bold block uppercase">AI Valuation</span>
                  <span className="text-sm font-extrabold text-gray-900">{s.valuation}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold block uppercase">Monthly Revenue</span>
                  <span className="text-base font-extrabold text-emerald-600 block">{s.mrr}</span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{s.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
