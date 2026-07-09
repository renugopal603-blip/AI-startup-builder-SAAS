import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Rocket, ExternalLink, Trash2 } from 'lucide-react';

interface SavedStartup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  traction: string;
  team: number;
  location: string;
  rating: number;
  logo: string;
  startupData?: any; // Original startup object if saved dynamically
}

const defaultMockSaved: SavedStartup[] = [
  { id: 'mock-1', name: 'EcoPackage Hub', sector: 'ClimateTech', stage: 'Seed', traction: '₹12k MRR', team: 4, location: 'Berlin, DE', rating: 94, logo: 'from-emerald-500 to-teal-600' },
  { id: 'mock-2', name: 'AI Legal Reviewer', sector: 'LegalTech', stage: 'Pre-Seed', traction: '1k Waitlist', team: 2, location: 'London, UK', rating: 88, logo: 'from-blue-500 to-indigo-600' },
  { id: 'mock-3', name: 'Fintech Micro-SaaS', sector: 'FinTech', stage: 'Series A', traction: '₹85k MRR', team: 12, location: 'New York, USA', rating: 91, logo: 'from-purple-500 to-pink-600' },
];

const InvestorSaved: React.FC = () => {
  const [savedList, setSavedList] = useState<SavedStartup[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('investor_saved_startups');
    if (stored) {
      try {
        setSavedList(JSON.parse(stored));
      } catch (e) {
        setSavedList(defaultMockSaved);
      }
    } else {
      localStorage.setItem('investor_saved_startups', JSON.stringify(defaultMockSaved));
      setSavedList(defaultMockSaved);
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = savedList.filter(item => item.id !== id);
    setSavedList(updated);
    localStorage.setItem('investor_saved_startups', JSON.stringify(updated));
  };

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Startups</h1>
        <p className="text-gray-500 mt-1">Startups you have bookmarked for later review.</p>
      </div>

      {savedList.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
          No saved startups yet. Go to the Startup Marketplace to find and save deals!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group relative flex flex-col justify-between">
              <button 
                onClick={() => handleRemove(s.id)}
                className="absolute top-4 right-4 p-2 text-yellow-500 hover:text-red-500 transition-colors bg-white hover:bg-red-50 rounded-full shadow-sm"
                title="Remove from saved"
              >
                <Trash2 size={16} />
              </button>
              
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl shadow-md ${s.logo || 'from-purple-500 to-indigo-600'}`}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="pr-8">
                    <h3 className="font-bold text-gray-900 truncate">{s.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{s.sector}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><Rocket size={14} /> Stage</div>
                    <p className="text-sm font-bold text-gray-800">{s.stage}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><Building2 size={14} /> Traction</div>
                    <p className="text-sm font-bold text-gray-800">{s.traction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-6 px-1">
                  <span className="flex items-center gap-1"><Users size={14} /> {s.team} members</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {s.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
                    {s.rating}
                  </span>
                  <span className="text-xs font-bold text-gray-400">AI Score</span>
                </div>
                <button 
                  onClick={() => window.alert(`Opening full profile for ${s.name}...`)}
                  className="text-[#5B21B6] hover:text-[#7C3AED] font-bold text-sm flex items-center gap-1 transition-colors"
                >
                  View Profile <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorSaved;
