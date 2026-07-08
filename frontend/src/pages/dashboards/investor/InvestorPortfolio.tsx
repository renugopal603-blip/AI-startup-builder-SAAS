import React from 'react';
import { Briefcase, TrendingUp, Activity, PieChart, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useFunding } from '../../../context/FundingContext';

const staticHoldings = [
  { id: 'static-1', name: 'LumiAI', invested: 500000, stage: 'Seed • Dec 2025', instrument: 'Priced Round', equity: '8.0%', mark: '$750,000', change: '↑ 1.5x', status: 'Completed' },
  { id: 'static-3', name: 'Nova Security', invested: 500000, stage: 'Pre-Seed • Aug 2025', instrument: 'Convertible Note', equity: '15.0%', mark: '$500,000', change: '- 1.0x', status: 'Completed' },
];

const InvestorPortfolio: React.FC = () => {
  const { user } = useAuth();
  const { offers } = useFunding();

  // Filter offers relevant to this investor (fallback to investorId '1' for demo if needed)
  const investorId = user?.id || "1";
  const myOffers = offers.filter(o => o.investorId === investorId);

  // Active (funded) dynamic investments
  const activeOffers = myOffers.filter(o => o.status === 'funded');
  
  // Pending close offers
  const pendingOffers = myOffers.filter(o => ['offer_received', 'accepted', 'counter_offer'].includes(o.status));

  // Totals
  const totalDeployed = 1000000 + activeOffers.reduce((sum, o) => sum + o.offerAmount, 0); // 1M static + dynamic
  const activeCount = 2 + activeOffers.length; // 2 static + dynamic
  const pendingCount = 1 + pendingOffers.length; // 1 static + dynamic

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
        <p className="text-gray-500 mt-1">Track your active portfolio, deployed capital, and equity distribution.</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-[#5B21B6] p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <PieChart size={160} />
          </div>
          <p className="text-indigo-200 font-medium mb-2">Total Deployed Capital</p>
          <p className="text-5xl font-extrabold mb-6">${totalDeployed.toLocaleString()}</p>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Active Investments</p>
              <p className="text-xl font-bold">{activeCount}</p>
            </div>
            <div className="w-px bg-indigo-700/50"></div>
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Avg Equity</p>
              <p className="text-xl font-bold">9.5%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp size={20} /></div>
            <span className="font-bold text-sm">Est. Portfolio IRR</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">24.5%</p>
          <p className="text-sm text-gray-500 font-medium">Tracking above benchmark</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 text-orange-600">
            <div className="p-2 bg-orange-50 rounded-lg"><Activity size={20} /></div>
            <span className="font-bold text-sm">Pending Deals</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{pendingCount}</p>
          <p className="text-sm text-gray-500 font-medium">In active term sheets</p>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Briefcase className="mr-2 text-gray-400" size={20} /> Active Holdings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Startup</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invested</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instrument</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Equity %</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Mark</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Render dynamic pending closings */}
              {pendingOffers.map(o => (
                <tr 
                  key={o.id}
                  onClick={() => window.alert(`Opening pending close details for ${o.startupName}...`)}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer bg-orange-50/5"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                        {o.startupName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{o.startupName}</p>
                        <p className="text-xs text-orange-500 font-medium">Pending Close</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">${o.offerAmount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{o.instrument}</span>
                    {o.valuationCap > 0 && <p className="text-xs text-gray-400 mt-1">${(o.valuationCap/1000000).toFixed(1)}M Cap</p>}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">~{o.equityPercentage}%</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-500">Pending Close</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#5B21B6] transition-colors" />
                  </td>
                </tr>
              ))}

              {/* Render dynamic active holdings */}
              {activeOffers.map(o => (
                <tr 
                  key={o.id}
                  onClick={() => window.alert(`Opening investment details for ${o.startupName}...`)}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        {o.startupName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{o.startupName}</p>
                        <p className="text-xs text-emerald-600 font-medium">Active Holding</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">${o.offerAmount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{o.instrument}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">{o.equityPercentage}%</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-emerald-600">${o.offerAmount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 flex items-center">↑ 1.0x</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#5B21B6] transition-colors" />
                  </td>
                </tr>
              ))}

              {/* Static rows */}
              {staticHoldings.map(s => (
                <tr 
                  key={s.id}
                  onClick={() => window.alert(`Opening investment details for ${s.name}...`)}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold`}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.stage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">${s.invested.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{s.instrument}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">{s.equity}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-emerald-600">{s.mark}</p>
                    <p className="text-xs text-emerald-600 flex items-center">{s.change}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#5B21B6] transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestorPortfolio;
