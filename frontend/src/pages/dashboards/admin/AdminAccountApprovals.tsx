import React, { useState, useEffect } from 'react';
import { Check, X, UserCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminAccountApprovals: React.FC = () => {
  const { getPendingApprovals, approveUser, rejectUser } = useAuth();
  const [pending, setPending] = useState<any[]>([]);

  const loadPending = () => {
    setPending(getPendingApprovals());
  };

  useEffect(() => {
    loadPending();
    const interval = setInterval(loadPending, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id: string, name: string) => {
    if (window.confirm(`Approve ${name}?`)) {
      approveUser(id);
      loadPending();
    }
  };

  const handleReject = (id: string, name: string) => {
    if (window.confirm(`Reject ${name}'s account request?`)) {
      rejectUser(id);
      loadPending();
    }
  };

  if (pending.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <UserCheck size={48} className="mx-auto text-emerald-400 mb-4" />
        <h3 className="font-bold text-gray-900 text-lg mb-1">No Pending Approvals</h3>
        <p className="text-sm text-gray-500">All mentor and investor accounts have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((u: any) => (
        <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#FBBF24] flex items-center justify-center text-white font-black text-lg shadow-md">
              {(u.name || u.fullName || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{u.name || u.fullName}</h3>
              <p className="text-sm text-gray-500">{u.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                  {u.role}
                </span>
                <span className="text-xs text-gray-400">Pending approval</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReject(u.id, u.name || u.fullName)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 font-bold rounded-xl text-sm transition-colors"
            >
              <X size={15} /> Reject
            </button>
            <button
              onClick={() => handleApprove(u.id, u.name || u.fullName)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl text-sm transition-colors shadow"
            >
              <Check size={15} /> Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminAccountApprovals;
