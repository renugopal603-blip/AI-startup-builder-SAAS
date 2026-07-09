import React from 'react';
import { ScrollText, Download, TrendingUp, Users, IndianRupee, Rocket } from 'lucide-react';

const reports = [
  { id: 1, title: 'Platform Growth Report — Q2 2026', type: 'Growth', icon: TrendingUp, date: 'Jul 1, 2026', size: '2.4 MB', desc: 'User acquisition, retention, churn rate, and MoM growth breakdown.' },
  { id: 2, title: 'Revenue & MRR Report — June 2026', type: 'Revenue', icon: IndianRupee, date: 'Jul 1, 2026', size: '1.1 MB', desc: 'Monthly recurring revenue, failed payments, upgrades/downgrades, and ARR projection.' },
  { id: 3, title: 'Startup Performance Index — H1 2026', type: 'Startups', icon: Rocket, date: 'Jun 30, 2026', size: '3.8 MB', desc: 'AI-scored startup rankings, sector distribution, and funding success rates.' },
  { id: 4, title: 'User Engagement Report — Q2 2026', type: 'Engagement', icon: Users, date: 'Jun 30, 2026', size: '1.7 MB', desc: 'DAU/MAU ratios, feature adoption rates, and session analytics by role.' },
  { id: 5, title: 'AI Usage & Cost Report — June 2026', type: 'AI', icon: ScrollText, date: 'Jul 1, 2026', size: '0.9 MB', desc: 'Token consumption, API cost breakdown, and model performance by use case.' },
];

const typeColors: Record<string, string> = {
  Growth: 'bg-blue-100 text-blue-700',
  Revenue: 'bg-emerald-100 text-emerald-700',
  Startups: 'bg-purple-100 text-[#5B21B6]',
  Engagement: 'bg-amber-100 text-amber-700',
  AI: 'bg-gray-100 text-gray-700',
};

const AdminReports: React.FC = () => {
  const handleDownloadReport = (title: string, format: 'PDF' | 'CSV') => {
    const safeTitle = title.replace(/\s+/g, '_').toLowerCase();
    if (format === 'CSV') {
      const headers = ["Report Title", "Category", "Generated Date", "Status", "Metric 1", "Metric 2"];
      const rows = [
        [title, "Platform Analytics", new Date().toLocaleDateString(), "Verified", "1,245 Active Users", "₹42,500 MRR"],
        ["Growth Summary", "Growth", "Jul 1, 2026", "Verified", "+18% MoM Growth", "85% Retention"],
        ["AI Token Usage", "System", "Jul 1, 2026", "Optimized", "4.2M Tokens Used", "₹840 Cost"]
      ];
      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${safeTitle}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = `PLATFORM EXECUTIVE REPORT: ${title}\n=======================================================\nGenerated on: ${new Date().toLocaleString()}\nPlatform Status: Healthy & Active\n\nExecutive Summary:\nThis document summarizes core platform metrics, AI growth trajectories, and financial performance over the past quarter.\n\nKey Highlights:\n- Monthly Recurring Revenue (MRR): ₹42,500 (+12% MoM)\n- Active Startups: 142 AI Startups Created & Tracked\n- Funding Term Sheets Issued: 38 Active Offers\n- System Health: 99.98% Uptime across all AI worker clusters\n\n=======================================================\nAI Startup Builder Platform — Confidential Executive Report`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${safeTitle}_report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Download AI-generated platform performance and revenue reports.</p>
        </div>
        <button 
          onClick={() => handleDownloadReport('Custom_Platform_Growth_Report', 'CSV')}
          className="flex items-center px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl shadow text-sm transition-colors"
        >
          <ScrollText size={16} className="mr-2" /> Generate Custom Report (CSV)
        </button>
      </div>

      <div className="space-y-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#5B21B6] flex-shrink-0 shadow-sm">
              <r.icon size={22} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{r.title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{r.desc}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <span>Generated: {r.date}</span>
                <span>·</span>
                <span>{r.size}</span>
              </div>
            </div>

            <div className="flex gap-2 sm:flex-col sm:items-stretch">
              <button 
                onClick={() => handleDownloadReport(r.title, 'PDF')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                <Download size={15} /> PDF
              </button>
              <button 
                onClick={() => handleDownloadReport(r.title, 'CSV')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                <Download size={15} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
