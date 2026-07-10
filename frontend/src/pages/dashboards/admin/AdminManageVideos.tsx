import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Film, Video, AlertCircle } from 'lucide-react';

const categories = [
  'Startup Basics', 'Business Plan', 'Pitch Deck',
  'Funding', 'Marketing', 'MVP', 'AI Tools'
];

const AdminManageVideos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [error, setError] = useState('');

  const loadVideos = () => {
    try {
      const stored = localStorage.getItem('ai_startup_builder_videos');
      setVideos(stored ? JSON.parse(stored) : []);
    } catch {
      setVideos([]);
    }
  };

  useEffect(() => { loadVideos(); }, []);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const resetForm = () => {
    setTitle(''); setYoutubeUrl(''); setCategory(categories[0]);
    setDescription(''); setTargetRole('all'); setError('');
  };

  const handleAdd = () => {
    setError('');
    if (!title.trim()) { setError('Please enter a video title.'); return; }
    if (!youtubeUrl.trim()) { setError('Please enter a YouTube URL or Video ID.'); return; }
    const videoId = extractVideoId(youtubeUrl.trim());
    if (!videoId) { setError('Invalid YouTube URL or Video ID.'); return; }

    const newVideo = {
      id: 'video_' + Date.now(),
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      category,
      description: description.trim(),
      targetRole,
      createdAt: new Date().toISOString(),
    };

    const updated = [...videos, newVideo];
    localStorage.setItem('ai_startup_builder_videos', JSON.stringify(updated));
    setVideos(updated);
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    const updated = videos.filter(v => v.id !== id);
    localStorage.setItem('ai_startup_builder_videos', JSON.stringify(updated));
    setVideos(updated);
  };

  const filtered = videos.filter(v => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.title?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Videos</h1>
          <p className="text-gray-500 mt-1">Add and manage learning videos for founders, mentors, and investors.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search videos..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Film size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-1">No videos found</h3>
            <p className="text-sm text-gray-500">{search ? 'No videos match your search.' : 'Click "Add Video" to add the first learning video.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Video</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Target Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Added</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate max-w-[250px]">{v.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[250px]">{v.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5B21B6]/10 text-[#5B21B6]">{v.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        v.targetRole === 'all' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>{v.targetRole}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Video"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Video Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B21B6]/10 flex items-center justify-center">
                  <Video size={20} className="text-[#5B21B6]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Add Learning Video</h3>
                  <p className="text-xs text-gray-500">Add a YouTube video for founders to watch.</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Video Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. How to Validate Your Startup Idea" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">YouTube URL or Video ID</label>
                <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... or video ID" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm bg-white">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Target Role</label>
                  <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm bg-white">
                    <option value="all">All Roles</option>
                    <option value="founder">Founder</option>
                    <option value="mentor">Mentor</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description of this video..." className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm resize-none" />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2">
                <Plus size={14} /> Add Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageVideos;
