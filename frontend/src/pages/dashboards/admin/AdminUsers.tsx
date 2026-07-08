import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Mail, Shield, UserCheck, UserX, BadgeCheck, Filter, Eye, Trash2, Download, X } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah@startup.ai', role: 'Founder', status: 'Active', plan: 'Growth', joined: 'Jan 15, 2026', avatar: 'S', color: 'from-[#7C3AED] to-[#FBBF24]' },
  { id: 2, name: 'Alex Rivera', email: 'alex@startup.ai', role: 'Mentor', status: 'Active', plan: 'N/A', joined: 'Feb 10, 2026', avatar: 'A', color: 'from-blue-500 to-indigo-600' },
  { id: 3, name: 'Capital Ventures', email: 'cv@invest.com', role: 'Investor', status: 'Active', plan: 'N/A', joined: 'Mar 5, 2026', avatar: 'C', color: 'from-emerald-500 to-teal-600' },
  { id: 4, name: 'Tom Chen', email: 'tom@startup.ai', role: 'Founder', status: 'Suspended', plan: 'Starter', joined: 'Apr 2, 2026', avatar: 'T', color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'Maria Lopez', email: 'maria@invest.io', role: 'Investor', status: 'Pending', plan: 'N/A', joined: 'Jun 20, 2026', avatar: 'M', color: 'from-pink-500 to-rose-600' },
  { id: 6, name: 'James Park', email: 'james@startup.ai', role: 'Founder', status: 'Active', plan: 'Scale', joined: 'May 12, 2026', avatar: 'J', color: 'from-cyan-500 to-blue-500' },
];

const roleColors: Record<string, string> = {
  Founder: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Mentor: 'bg-blue-100 text-blue-700 border border-blue-200',
  Investor: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Admin: 'bg-purple-100 text-[#5B21B6] border border-purple-200',
};

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  Suspended: 'bg-red-50 text-red-600 border border-red-100',
  Pending: 'bg-amber-50 text-amber-600 border border-amber-100',
};

const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [usersList, setUsersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('admin_users_list');
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    localStorage.setItem('admin_users_list', JSON.stringify(usersList));
  }, [usersList]);

  const filtered = usersList.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteUser = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} completely?`)) {
      setUsersList(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleExportCSV = () => {
    if (usersList.length === 0) {
      window.alert("No user data available to export.");
      return;
    }
    const headers = ["User ID", "Name", "Email", "Role", "Status", "Plan", "Joined Date"];
    const rows = usersList.map(u => [u.id, u.name, u.email, u.role, u.status, u.plan, u.joined]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `platform_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">View and manage all platform users across every role.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 text-sm transition-colors shadow-sm"
          >
            <Download size={15} className="mr-2 text-gray-600" /> Export CSV
          </button>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="px-3 py-1.5 bg-purple-100 text-[#5B21B6] rounded-lg">{usersList.length} Total</span>
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg">{usersList.filter(u => u.status === 'Active').length} Active</span>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg">{usersList.filter(u => u.status === 'Pending').length} Pending</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" />
          </div>
          <div className="flex gap-2">
            {['All', 'Founder', 'Mentor', 'Investor'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${roleFilter === r ? 'bg-[#5B21B6] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-sm font-black shadow flex-shrink-0`}>
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{u.plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      {u.status === 'Active'
                        ? <button 
                            onClick={() => handleToggleStatus(u.id)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Suspend User"
                          >
                            <UserX size={15} />
                          </button>
                        : <button 
                            onClick={() => handleToggleStatus(u.id)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                            title="Activate User"
                          >
                            <UserCheck size={15} />
                          </button>
                      }
                      <button 
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        title="Delete User"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No users matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedUser.color} flex items-center justify-center text-white text-base font-black shadow flex-shrink-0`}>
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Role</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleColors[selectedUser.role]}`}>{selectedUser.role}</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[selectedUser.status]}`}>{selectedUser.status}</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Subscription Plan</span>
                  <span className="font-bold text-gray-900">{selectedUser.plan}</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Joined Platform</span>
                  <span className="font-bold text-gray-900">{selectedUser.joined}</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl">
                <h4 className="font-bold text-[#5B21B6] mb-1 text-xs uppercase tracking-wider">Administrative Access & Audit Log</h4>
                <p className="text-xs text-gray-600">
                  User Account #{selectedUser.id} has full platform credentials enabled. Last login verified via multi-factor authentication.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Account
              </button>
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
