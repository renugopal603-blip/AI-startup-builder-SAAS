import React, { useState, useEffect } from 'react';
import { Search, Clock, X, Cpu, CheckCircle2, AlertTriangle, MessageSquare, Send } from 'lucide-react';

const MentorReviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [startups, setStartups] = useState<any[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'review' | 'report' | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
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

  const handleReviewSubmit = () => {
    if (!selectedStartup || !feedback) return;
    const updated = { ...selectedStartup, status: 'reviewed', mentorFeedback: feedback };
    localStorage.setItem(`startup_${updated.startupId}`, JSON.stringify(updated));
    setStartups(prev => prev.map(s => s.startupId === updated.startupId ? updated : s));
    setSelectedStartup(null);
    setModalMode(null);
    setFeedback('');
    window.alert('Feedback submitted successfully!');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Startups to Review</h1>
        <p className="text-gray-500 mt-1">Evaluate AI-generated reports and provide expert feedback to founders.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('Pending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'Pending' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Pending (3)
          </button>
          <button 
            onClick={() => setActiveTab('Completed')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'Completed' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Completed (12)
          </button>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search startups..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Startups List */}
      <div className="space-y-4">
        {startups.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl border border-gray-200 text-gray-500">
            No startups available for review.
          </div>
        ) : (
          startups.filter(s => {
            if (activeTab === 'Completed' && s.status !== 'reviewed') return false;
            if (activeTab === 'Pending' && s.status === 'reviewed') return false;
            if (search && !s.startupName.toLowerCase().includes(search.toLowerCase()) && !s.startupIdea.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
          }).map((startup, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{startup.startupName}</h3>
                    {startup.status !== 'reviewed' && <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Action Required</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{startup.startupIdea}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      <span className="font-medium">{startup.aiGenerated?.ideaAnalysis?.businessModel || 'Startup'}</span>
                    </div>
                    {startup.status === 'generated' && (
                      <div className="flex items-center text-gray-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                        <span className="font-bold mr-1 text-purple-700">AI Score:</span> 
                        <span className="font-bold">{startup.aiGenerated?.aiReport?.investmentReadinessScore || '85'}/100</span>
                      </div>
                    )}
                    <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 font-medium">
                      <Clock size={14} className="mr-1.5" />
                      Due in 2 days
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col gap-2 shrink-0 md:pl-4">
                  <button 
                    onClick={() => { setSelectedStartup(startup); setModalMode('review'); }}
                    className="w-full md:w-40 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                  >
                    Review Startup
                  </button>
                  <button 
                    onClick={() => { setSelectedStartup(startup); setModalMode('report'); }}
                    className="w-full md:w-40 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-sm transition-colors shadow-sm"
                  >
                    View AI Report
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal Overlay */}
      {modalMode && selectedStartup && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'review' ? 'Provide Expert Review' : 'AI Analysis Report'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedStartup.startupName}</p>
              </div>
              <button 
                onClick={() => { setModalMode(null); setSelectedStartup(null); setFeedback(''); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              {modalMode === 'report' ? (
                <div className="space-y-6">
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-[#5B21B6] mb-2 flex items-center"><Cpu size={18} className="mr-2"/> System Rating</h3>
                    <p className="text-sm text-gray-700">The AI rated this startup at <strong>{selectedStartup.aiGenerated?.aiReport?.investmentReadinessScore || '85'}/100</strong>.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center text-green-700"><CheckCircle2 size={18} className="mr-2"/> Key Strengths</h3>
                    <ul className="space-y-2">
                      {selectedStartup.aiGenerated?.aiReport?.keyStrengths?.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100 flex items-start">
                          <span className="font-bold mr-2 text-green-700">{i + 1}.</span> {s}
                        </li>
                      )) || <li className="text-sm text-gray-500">Strong founder background and clear market need.</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center text-orange-600"><AlertTriangle size={18} className="mr-2"/> Risk Factors</h3>
                    <ul className="space-y-2">
                      {selectedStartup.aiGenerated?.aiReport?.riskFactors?.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start">
                          <span className="font-bold mr-2 text-orange-700">{i + 1}.</span> {r}
                        </li>
                      )) || <li className="text-sm text-gray-500">High competition in the current market sector.</li>}
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => setModalMode('review')}
                      className="px-6 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-700 italic border-l-2 border-[#5B21B6] pl-3">"{selectedStartup.startupIdea}"</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#5B21B6]" /> Your Feedback & Recommendations
                    </label>
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your expert advice, actionable steps, and general feedback for the founder..."
                      className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent text-sm resize-none transition-shadow"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => { setModalMode(null); setSelectedStartup(null); setFeedback(''); }}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReviewSubmit}
                      disabled={!feedback}
                      className="flex items-center px-6 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                    >
                      <Send size={16} className="mr-2" /> Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorReviews;
