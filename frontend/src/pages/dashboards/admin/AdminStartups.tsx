import React, { useState } from 'react';
import { Search, MoreVertical, Building2, X, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import SharedStartupDetailsTabs from '../../../components/shared/SharedStartupDetailsTabs';

const AdminStartups: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [startups, setStartups] = React.useState<any[]>([]);
  const [selectedStartup, setSelectedStartup] = React.useState<any>(null);

  const handleDelete = (startupId: string) => {
    if (window.confirm('Are you sure you want to delete this startup?')) {
      localStorage.removeItem(`startup_${startupId}`);
      setStartups(prev => prev.filter(s => s.startupId !== startupId));
    }
  };

  React.useEffect(() => {
    const keys = Object.keys(localStorage);
    const locals: any[] = [];
    keys.forEach(key => {
      if (key.startsWith('startup_')) {
        try {
          locals.push(JSON.parse(localStorage.getItem(key) || ''));
        } catch (e) {}
      }
    });
    locals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setStartups(locals);
  }, []);

  const filtered = startups.filter(s => {
    const matchesSearch = s.startupName?.toLowerCase().includes(search.toLowerCase()) ||
      s.startupIdea?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || s.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
  <div className="animate-fade-in-up pb-10">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Manage Startups</h1>
      <p className="text-gray-500 mt-1">View, edit, and moderate all startups on the platform.</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search startups..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" 
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Under Review</option>
            <option>Suspended</option>
          </select>
          <select 
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
          >
            <option>All Industries</option>
            <option>ClimateTech</option>
            <option>LegalTech</option>
            <option>FinTech</option>
            <option>SaaS</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Startup</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Founder</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">No startups match your search or filters.</td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.startupId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" /> {s.startupName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Local Founder</td>
                  <td className="px-6 py-4 text-sm text-gray-600 line-clamp-1">{s.aiGenerated?.ideaAnalysis?.businessModel || 'Tech'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.status === 'generated' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {s.status === 'generated' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedStartup(s)}
                      className="px-3 py-1.5 bg-indigo-50 text-[#5B21B6] hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDelete(s.startupId)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    
    {/* Modal Overlay */}
    {selectedStartup && (
      <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-[95%] lg:w-full max-w-[1200px] max-h-[90vh] flex flex-col rounded-[24px] shadow-xl animate-fade-in-up overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-8 flex justify-between items-center shrink-0 z-10">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900">
                Startup Details
              </h2>
              <p className="text-[15px] text-gray-500 mt-1">{selectedStartup.startupName}</p>
            </div>
            <button 
              onClick={() => setSelectedStartup(null)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="p-8 overflow-y-auto flex-1 space-y-8">
            <SharedStartupDetailsTabs startupData={selectedStartup} />
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminStartups;
