import React, { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addNotification } from '../../../utils/localStorageHelper';
import type { InvestorProfileData } from '../investor/InvestorProfileDetails';
import type { KYCDocument } from '../investor/InvestorKYC';

const AdminInvestorApproval: React.FC = () => {
  const [profiles, setProfiles] = useState<InvestorProfileData[]>([]);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<KYCDocument | null>(null);

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('investor_kyc_updated', loadData);
    window.addEventListener('focus', loadData);
    const interval = setInterval(loadData, 1500);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('investor_kyc_updated', loadData);
      window.removeEventListener('focus', loadData);
      clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    try {
      // Load investor profiles
      const storedProfiles = localStorage.getItem('ai_startup_builder_investor_profiles');
      let loadedProfiles: InvestorProfileData[] = [];
      if (storedProfiles) {
        loadedProfiles = JSON.parse(storedProfiles);
      }
      
      setProfiles(loadedProfiles);

      // Load KYC documents
      const storedDocs = localStorage.getItem('ai_startup_builder_kyc_documents');
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else {
        setDocuments([]);
      }
    } catch (e) {
      setProfiles([]);
      setDocuments([]);
    }
  };

  const handleApproveInvestor = (investorId: string, investorName: string) => {
    try {
      // Update profile status to Verified across matching IDs
      const updatedProfiles = profiles.map(p => 
        (p.id === investorId || p.investorName === investorName || (investorId === "investor_demo_user" && p.id === "4") || (investorId === "4" && p.id === "investor_demo_user")) ? { ...p, verificationStatus: 'Verified' as any } : p
      );
      localStorage.setItem('ai_startup_builder_investor_profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);

      // Approve all pending docs for this investor
      const updatedDocs = documents.map(doc => 
        (doc.investorId === investorId || doc.investorName === investorName || (investorId === "investor_demo_user" && doc.investorId === "4") || (investorId === "4" && doc.investorId === "investor_demo_user")) ? { ...doc, status: 'Approved' as any } : doc
      );
      localStorage.setItem('ai_startup_builder_kyc_documents', JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);

      // Notify investor across all IDs (and demo IDs)
      [investorId, "investor_demo_user", "4"].filter((v, idx, self) => self.indexOf(v) === idx && v).forEach(uid => {
        addNotification({
          id: Date.now() + Math.random(),
          userId: uid,
          title: "KYC & Accreditation Approved ✅",
          desc: `Admin approved your KYC verification documents. Your investor account (${investorName}) status is now Verified!`,
          time: "Just now",
          read: false,
          link: "/dashboard/investor/profile"
        });
      });

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('investor_kyc_updated'));
      window.alert(`✅ ${investorName} KYC approved successfully! Status is now Verified.`);
    } catch (e) {
      window.alert("Error approving investor.");
    }
  };

  const handleRejectInvestor = (investorId: string, investorName: string) => {
    const reason = window.prompt(
      `Enter rejection reason for ${investorName}:`,
      "Document image is unclear or missing proof of accredited investor status."
    );
    if (reason === null) return; // cancelled

    try {
      // Update profile status to Rejected across matching IDs
      const updatedProfiles = profiles.map(p => 
        (p.id === investorId || p.investorName === investorName || (investorId === "investor_demo_user" && p.id === "4") || (investorId === "4" && p.id === "investor_demo_user")) ? { ...p, verificationStatus: 'Rejected' as any } : p
      );
      localStorage.setItem('ai_startup_builder_investor_profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);

      // Reject all pending docs for this investor with reason
      const updatedDocs = documents.map(doc => 
        (doc.investorId === investorId || doc.investorName === investorName || (investorId === "investor_demo_user" && doc.investorId === "4") || (investorId === "4" && doc.investorId === "investor_demo_user")) ? { ...doc, status: 'Rejected' as any, rejectionReason: reason } : doc
      );
      localStorage.setItem('ai_startup_builder_kyc_documents', JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);

      // Notify investor
      [investorId, "investor_demo_user", "4"].filter((v, idx, self) => self.indexOf(v) === idx && v).forEach(uid => {
        addNotification({
          id: Date.now() + Math.random(),
          userId: uid,
          title: "KYC & Accreditation Rejected ❌",
          desc: `Your KYC verification was rejected by Admin. Reason: ${reason}. Please go to Profile & KYC to re-upload.`,
          time: "Just now",
          read: false,
          link: "/dashboard/investor/profile"
        });
      });

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('investor_kyc_updated'));
      window.alert(`❌ ${investorName} KYC rejected. Reason has been sent to the investor for re-upload.`);
    } catch (e) {
      window.alert("Error rejecting investor.");
    }
  };

  const handleApproveDoc = (docId: string) => {
    try {
      const updatedDocs = documents.map(doc => doc.id === docId ? { ...doc, status: 'Approved' as any } : doc);
      localStorage.setItem('ai_startup_builder_kyc_documents', JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('investor_kyc_updated'));
      window.alert("Document approved!");
    } catch (e) {}
  };

  const handleRejectDoc = (docId: string, invId: string, invName: string) => {
    const reason = window.prompt("Enter rejection reason for this document:", "Expired or unreadable document.");
    if (reason === null) return;
    try {
      const updatedDocs = documents.map(doc => doc.id === docId ? { ...doc, status: 'Rejected' as any, rejectionReason: reason } : doc);
      localStorage.setItem('ai_startup_builder_kyc_documents', JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);

      // Also mark investor verificationStatus as Rejected across matching IDs
      const updatedProfiles = profiles.map(p => (p.id === invId || p.investorName === invName || (invId === "investor_demo_user" && p.id === "4") || (invId === "4" && p.id === "investor_demo_user")) ? { ...p, verificationStatus: 'Rejected' as any } : p);
      localStorage.setItem('ai_startup_builder_investor_profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);

      // Notify
      [invId, "investor_demo_user", "4"].filter((v, idx, self) => self.indexOf(v) === idx && v).forEach(uid => {
        addNotification({
          id: Date.now() + Math.random(),
          userId: uid,
          title: "KYC Document Rejected ❌",
          desc: `Your document was rejected. Reason: ${reason}. Please re-upload.`,
          time: "Just now",
          read: false,
          link: "/dashboard/investor/profile"
        });
      });

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('investor_kyc_updated'));
      window.alert("Document rejected and reason saved.");
    } catch (e) {}
  };

  const getInvestorDocs = (inv: InvestorProfileData) => {
    return documents.filter(d => 
      d.investorId === inv.id || 
      d.investorName === inv.investorName ||
      (inv.id === 'investor_demo_user' && (d.investorId === '4' || d.investorId === 'investor_demo_user' || !d.investorId)) ||
      (inv.id === '4' && d.investorId === 'investor_demo_user')
    );
  };

  return (
    <div className="animate-fade-in-up pb-10 space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Investor Approvals (KYC & Accreditation)</h1>
        <p className="text-gray-500 mt-1">Review uploaded investor profiles and KYC document accreditations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Pending KYC Review', val: profiles.filter(i => !i.verificationStatus || i.verificationStatus === 'pending').length, color: 'text-amber-600' },
          { label: 'Verified Investors', val: profiles.filter(i => i.verificationStatus === 'Verified' || (i.verificationStatus as any) === 'Approved').length, color: 'text-emerald-600' },
          { label: 'Rejected Applications', val: profiles.filter(i => i.verificationStatus === 'Rejected').length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.val}</div>
            <div className="text-sm text-gray-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {profiles.map(inv => {
          const invDocs = getInvestorDocs(inv);
          const isVerified = inv.verificationStatus === 'Verified' || (inv.verificationStatus as any) === 'Approved';
          const isRejected = inv.verificationStatus === 'Rejected';

          return (
            <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center pb-5 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                    {inv.investorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {inv.investorName}
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{inv.investorType}</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Email: <span className="text-gray-700 font-medium">{inv.email}</span> · Phone: <span className="text-gray-700 font-medium">{inv.phone}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">Address: {inv.address} · Check Size: <span className="font-bold text-gray-700">{inv.typicalCheckSize}</span></p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end">
                  <div className="self-start sm:self-center">
                    {isVerified ? (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verified Investor
                      </span>
                    ) : isRejected ? (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 inline-flex items-center gap-1">
                        <AlertCircle size={14} /> Rejected
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                        <Clock size={14} /> Pending Review
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRejectInvestor(inv.id, inv.investorName)}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={14} /> Reject KYC
                    </button>
                    <button
                      onClick={() => handleApproveInvestor(inv.id, inv.investorName)}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Approve KYC
                    </button>
                  </div>
                </div>
              </div>

              {/* Thesis snippet */}
              <div className="py-3 bg-gray-50/70 px-4 rounded-xl mt-4 border border-gray-100 text-xs text-gray-600">
                <span className="font-bold text-gray-800">Sectors of Interest:</span> {inv.sectorsOfInterest}
                <div className="mt-1"><span className="font-bold text-gray-800">Thesis:</span> "{inv.investmentThesis}"</div>
              </div>

              {/* Uploaded KYC Documents Table/List */}
              <div className="mt-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText size={14} /> Uploaded KYC Documents ({invDocs.length})
                </h4>

                {invDocs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">No documents uploaded specifically by this investor yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {invDocs.map(doc => (
                      <div key={doc.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between gap-3">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-800 truncate">{doc.documentType}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                              doc.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{doc.fileName}</p>
                          {doc.status === 'Rejected' && (
                            <p className="text-[11px] text-red-700 mt-1 font-medium truncate">Reason: {doc.rejectionReason}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 bg-white hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-colors"
                            title="Preview Document"
                          >
                            <Eye size={14} />
                          </button>
                          {doc.status !== 'Approved' && (
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
                              title="Approve Document"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {doc.status !== 'Rejected' && (
                            <button
                              onClick={() => handleRejectDoc(doc.id, inv.id, inv.investorName)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors"
                              title="Reject Document"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Preview Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <FileText size={18} className="text-[#5B21B6]" /> Document Preview: {previewDoc.documentType}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-xs border border-gray-100">
                <div>
                  <span className="text-gray-400 font-bold uppercase">File Name</span>
                  <p className="font-bold text-gray-800 mt-0.5">{previewDoc.fileName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase">Investor Name</span>
                  <p className="font-bold text-gray-800 mt-0.5">{previewDoc.investorName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase">Document Status</span>
                  <p className="font-bold text-gray-800 mt-0.5">{previewDoc.status}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase">Uploaded At</span>
                  <p className="text-gray-700 mt-0.5">{new Date(previewDoc.uploadedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 min-h-[220px] flex flex-col items-center justify-center">
                {previewDoc.fileData.startsWith('data:image/') ? (
                  <img src={previewDoc.fileData} alt={previewDoc.fileName} className="max-h-[300px] rounded shadow-sm object-contain" />
                ) : (
                  <div className="py-6 space-y-3">
                    <FileText size={48} className="mx-auto text-[#5B21B6]" />
                    <p className="font-bold text-gray-800 text-sm">{previewDoc.fileName}</p>
                    <p className="text-xs text-gray-500">Preview simulated for non-image binary / PDF file data.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestorApproval;
