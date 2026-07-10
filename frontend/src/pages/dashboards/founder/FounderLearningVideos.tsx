import React, { useState, useEffect } from 'react';
import { Search, Play, X, Film } from 'lucide-react';

const categories = [
  'All', 'Startup Basics', 'Business Plan', 'Pitch Deck',
  'Funding', 'Marketing', 'MVP'
];

const FounderLearningVideos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const loadVideos = () => {
    try {
      const stored = localStorage.getItem('ai_startup_builder_videos');
      const all = stored ? JSON.parse(stored) : [];
      setVideos(all);
    } catch {
      setVideos([]);
    }
  };

  useEffect(() => {
    loadVideos();
    window.addEventListener('storage', loadVideos);
    return () => window.removeEventListener('storage', loadVideos);
  }, []);

  const filtered = videos.filter(v => {
    const roleOk = v.targetRole === 'founder' || v.targetRole === 'all';
    if (!roleOk) return false;
    const catOk = category === 'All' || v.category === category;
    if (!catOk) return false;
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Learning Videos</h1>
        <p className="text-gray-500 mt-1">
          Watch startup lessons, pitch deck guides, funding tips, and business tutorials.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search videos..." autoComplete="off"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  category === c
                    ? 'bg-[#5B21B6] text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'All' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Film size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-900 text-lg mb-1">No learning videos available yet.</h3>
          <p className="text-sm text-gray-500">Videos added by admin will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/480x360/1F2937/9CA3AF?text=No+Thumbnail`; }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={24} className="text-[#5B21B6] ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-gray-800 backdrop-blur-sm">
                  {v.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-2">{v.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{v.description}</p>
                <button
                  onClick={() => setSelectedVideo(v)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  <Play size={14} /> Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Watch Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-bold text-gray-900 text-base truncate">{selectedVideo.title}</h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#5B21B6]/10 text-[#5B21B6] inline-block mt-1">
                  {selectedVideo.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            {selectedVideo.description && (
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">{selectedVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderLearningVideos;
