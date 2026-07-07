import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, File, Image, Search, Plus, Download, Trash2, Share2, X, Eye } from 'lucide-react';
import { getDocuments, saveDocument, deleteDocument, updateDocument, addNotification, getStartups } from '../../../utils/localStorageHelper';

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return <FileText size={18} />;
    case 'zip': return <Image size={18} />;
    case 'ppt': case 'pptx': return <File size={18} />;
    case 'xls': case 'xlsx': return <File size={18} />;
    case 'word': case 'doc': case 'docx': return <File size={18} />;
    default: return <File size={18} />;
  }
};

const getFileColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return 'bg-red-100 text-red-600';
    case 'zip': return 'bg-blue-100 text-blue-600';
    case 'ppt': case 'pptx': return 'bg-orange-100 text-orange-600';
    case 'xls': case 'xlsx': return 'bg-green-100 text-green-600';
    case 'word': case 'doc': case 'docx': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const FounderDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [shareRole, setShareRole] = useState('investor');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const startups = getStartups();
      const startupId = startups.length > 0 ? startups[0].startupId : "startup_default";
      
      const newDoc = {
        id: `doc_${Date.now()}`,
        startupId: startupId,
        founderId: "founder_demo_user",
        fileName: file.name,
        fileType: (file.name.split('.').pop() || 'file').toUpperCase(),
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileData: URL.createObjectURL(file),
        category: 'Uploaded File',
        status: "private",
        sharedWith: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      saveDocument(newDoc);
      setDocuments(getDocuments());
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(id);
      setDocuments(getDocuments());
    }
  };

  const handleDownload = (name: string) => {
    window.alert(`Downloading ${name}...`);
  };
  
  const handlePreview = (name: string) => {
    window.alert(`Previewing ${name}...`);
  };

  const openShareModal = (id: string) => {
    setSelectedDocId(id);
    setShareModalOpen(true);
  };

  const handleShare = () => {
    if (!selectedDocId) return;
    
    const doc = documents.find(d => d.id === selectedDocId);
    if (!doc) return;
    
    const updatedSharedWith = [...new Set([...(doc.sharedWith || []), shareRole])];
    
    updateDocument(selectedDocId, {
      status: 'shared',
      sharedWith: updatedSharedWith
    });
    
    // Add Notification
    let title = "Document Shared";
    let message = "A document was shared.";
    let actionUrl = "/dashboard";
    
    if (shareRole === 'investor') {
      title = "New Due Diligence Document Shared";
      message = "Founder shared startup documents for your review.";
      actionUrl = "/dashboard/investor/due-diligence";
    } else if (shareRole === 'mentor') {
      title = "New Startup Document Shared";
      message = "Founder shared documents for mentor review.";
      actionUrl = "/dashboard/mentor/reviews";
    }

    addNotification({
      id: `notification_${Date.now()}`,
      userId: `${shareRole}_demo_user`,
      title,
      message,
      type: "document_share",
      isRead: false,
      actionUrl,
      createdAt: new Date().toISOString()
    });
    
    setDocuments(getDocuments());
    setShareModalOpen(false);
    setSelectedDocId(null);
    window.alert(`Document successfully shared with ${shareRole}.`);
  };

  const filteredDocs = documents.filter(d => 
    d.fileName.toLowerCase().includes(search.toLowerCase()) || 
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <div className="animate-fade-in-up">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Upload and manage all your startup documents securely.</p>
        </div>
        <button onClick={handleUploadClick} className="flex items-center px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl shadow text-sm transition-colors">
          <Plus size={16} className="mr-2" /> Upload File
        </button>
      </div>

    {/* Upload Drop Zone */}
    <div className="mb-8 border-2 border-dashed border-gray-200 hover:border-[#5B21B6]/50 rounded-2xl p-10 text-center bg-white transition-colors cursor-pointer group">
      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
        <Upload size={28} className="text-[#5B21B6]" />
      </div>
      <p className="text-base font-bold text-gray-700 mb-1">Drop files here to upload</p>
      <p className="text-sm text-gray-400">PDF, PPTX, DOCX, XLSX, ZIP up to 50MB</p>
      <button onClick={handleUploadClick} className="mt-4 px-5 py-2 bg-purple-50 hover:bg-purple-100 text-[#5B21B6] text-sm font-bold rounded-xl transition-colors">
        Browse Files
      </button>
    </div>

    {/* Search */}
    <div className="relative mb-6">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search documents..." 
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" 
      />
    </div>

    {/* Documents table */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No documents found.</td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileColor(doc.fileType)}`}>
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{doc.fileName}</span>
                        <span className="text-xs text-gray-400">{doc.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{doc.fileType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.fileSize}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      doc.status === 'shared' 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {doc.status === 'shared' ? 'Shared' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handlePreview(doc.fileName)} title="Preview" className="p-1.5 text-gray-400 hover:text-[#5B21B6] hover:bg-purple-50 rounded-lg transition-colors"><Eye size={16} /></button>
                      <button onClick={() => openShareModal(doc.id)} title="Share" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Share2 size={16} /></button>
                      <button onClick={() => handleDownload(doc.fileName)} title="Download" className="p-1.5 text-gray-400 hover:text-[#5B21B6] hover:bg-purple-50 rounded-lg transition-colors"><Download size={16} /></button>
                      <button onClick={() => handleDelete(doc.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
    
    {/* Share Modal */}
    {shareModalOpen && (
      <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Share Document</h3>
            <button onClick={() => setShareModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4">Select who you want to share this document with:</p>
            <div className="space-y-3 mb-6">
              <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${shareRole === 'mentor' ? 'border-[#5B21B6] bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="mentor" checked={shareRole === 'mentor'} onChange={() => setShareRole('mentor')} className="mr-3" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">Mentor</div>
                  <div className="text-xs text-gray-500">For review and expert feedback</div>
                </div>
              </label>
              <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${shareRole === 'investor' ? 'border-[#5B21B6] bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="investor" checked={shareRole === 'investor'} onChange={() => setShareRole('investor')} className="mr-3" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">Investor</div>
                  <div className="text-xs text-gray-500">For due diligence and funding</div>
                </div>
              </label>
              <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${shareRole === 'admin' ? 'border-[#5B21B6] bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="admin" checked={shareRole === 'admin'} onChange={() => setShareRole('admin')} className="mr-3" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">Admin</div>
                  <div className="text-xs text-gray-500">For platform compliance</div>
                </div>
              </label>
            </div>
            
            <button 
              onClick={handleShare}
              className="w-full py-3 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Share Document
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default FounderDocuments;
