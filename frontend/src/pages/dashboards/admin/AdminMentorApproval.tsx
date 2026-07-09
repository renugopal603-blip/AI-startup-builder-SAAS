import React, { useState, useEffect } from 'react';
import { Check, X, GraduationCap, Calendar, ExternalLink, Mail, Phone, MapPin, Globe } from 'lucide-react';

const initialApplicants = [
  {
    id: 1, name: 'Dr. Priya Sharma', expertise: 'AI/ML, Product Strategy', experience: '12+ years',
    applied: '2 hours ago', linkedin: 'linkedin.com/in/priyasharma',
    bio: 'Former Google PM with expertise in AI products. Mentored 40+ startups.', status: 'Pending',
    email: 'priya.sharma@example.com', phone: '+91 98765 43210', location: 'Bangalore, Karnataka',
    category: 'AI/ML', availability: 'Available', languages: 'English, Hindi, Kannada'
  },
  {
    id: 2, name: 'Marcus Webb', expertise: 'B2B SaaS, Sales', experience: '8+ years',
    applied: '1 day ago', linkedin: 'linkedin.com/in/marcuswebb',
    bio: 'Scaled two B2B SaaS companies to ₹10M ARR. YC alumni.', status: 'Pending',
    email: 'marcus.webb@saasgrowth.io', phone: '+1 (415) 555-0192', location: 'San Francisco, CA',
    category: 'SaaS', availability: 'Available', languages: 'English'
  },
  {
    id: 3, name: 'Amelia Torres', expertise: 'ClimateTech, Fundraising', experience: '15+ years',
    applied: '3 days ago', linkedin: 'linkedin.com/in/ameliatorres',
    bio: 'Partner at Green Ventures. Led 30+ climate-tech deals.', status: 'Under Review',
    email: 'amelia@greenventures.com', phone: '+44 20 7946 0921', location: 'London, UK',
    category: 'Strategy', availability: 'Busy', languages: 'English, Spanish'
  },
];

const AdminMentorApproval: React.FC = () => {
  const [applicants, setApplicants] = useState<any[]>(initialApplicants);

  const loadApplicants = () => {
    try {
      const stored = localStorage.getItem('ai_startup_builder_mentor_profiles');
      let loadedMentors: any[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        loadedMentors = parsed.map((p: any, idx: number) => ({
          id: p.id || `mentor_dynamic_${idx}`,
          name: p.name || 'Anonymous Mentor',
          expertise: p.expertise || `${p.category || 'SaaS'} Specialist`,
          experience: p.experienceYears || '10+ years',
          applied: p.updatedAt || 'Just now',
          linkedin: p.linkedin || 'linkedin.com',
          bio: p.bio || 'Experienced mentor.',
          email: p.email || 'mentor@private.email',
          phone: p.phone || 'N/A (Private)',
          location: p.location || 'Location not specified',
          category: p.category || 'SaaS',
          availability: p.availability || 'Available',
          languages: p.languages || 'English',
          status: p.verificationStatus === 'Verified' ? 'Approved' : 
                  p.verificationStatus === 'Rejected' ? 'Rejected' : 'Pending',
          rawId: p.id
        }));
      }

      // Merge dynamically saved mentor profiles at the top, followed by initial demo applicants if not already present
      const combined = [...loadedMentors];
      initialApplicants.forEach(sample => {
        if (!combined.some(c => c.name === sample.name || c.id === sample.id)) {
          combined.push(sample);
        }
      });
      setApplicants(combined);
    } catch (e) {
      setApplicants(initialApplicants);
    }
  };

  useEffect(() => {
    loadApplicants();
    window.addEventListener('storage', loadApplicants);
    window.addEventListener('mentor_profile_updated', loadApplicants);
    return () => {
      window.removeEventListener('storage', loadApplicants);
      window.removeEventListener('mentor_profile_updated', loadApplicants);
    };
  }, []);

  const handleApprove = (id: any, name: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    try {
      const stored = localStorage.getItem('ai_startup_builder_mentor_profiles');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((p: any) => (p.id === id || p.name === name) ? { ...p, verificationStatus: 'Verified' } : p);
        localStorage.setItem('ai_startup_builder_mentor_profiles', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('mentor_profile_updated'));
      }
    } catch (e) {}
    window.alert(`✅ ${name} has been approved as a Mentor!`);
  };

  const handleReject = (id: any, name: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    try {
      const stored = localStorage.getItem('ai_startup_builder_mentor_profiles');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((p: any) => (p.id === id || p.name === name) ? { ...p, verificationStatus: 'Pending' } : p);
        localStorage.setItem('ai_startup_builder_mentor_profiles', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('mentor_profile_updated'));
      }
    } catch (e) {}
    window.alert(`❌ ${name}'s application has been rejected.`);
  };

  return (
  <div className="animate-fade-in-up pb-10">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Mentor Approval</h1>
      <p className="text-gray-500 mt-1">Review and approve mentor applications before they go live on the platform.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Pending Review', val: applicants.filter(a => a.status === 'Pending').length, color: 'text-amber-600' },
        { label: 'Under Review', val: applicants.filter(a => a.status === 'Under Review').length, color: 'text-blue-600' },
        { label: 'Approved This Month', val: applicants.filter(a => a.status === 'Approved').length + 14, color: 'text-emerald-600' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.val}</div>
          <div className="text-sm text-gray-500 font-medium">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="space-y-5">
      {applicants.map(a => (
        <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0">
                {a.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{a.name}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    a.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    a.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{a.status}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#5B21B6] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                    {a.category || 'SaaS'} Specialist
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    a.availability === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    a.availability === 'Busy' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {a.availability || 'Available'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">{a.expertise}</p>
                <p className="text-sm text-gray-600 italic mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">"{a.bio}"</p>
                
                {/* Public Metadata */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 font-medium mb-4">
                  <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-[#5B21B6]" /> {a.experience} experience</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {a.location || 'Location not set'}</span>
                  <span className="flex items-center gap-1.5"><Globe size={14} className="text-blue-500" /> Languages: {a.languages || 'English'}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> Applied {a.applied}</span>
                  <a href={a.linkedin?.startsWith('http') ? a.linkedin : `https://${a.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline font-bold"><ExternalLink size={13} /> LinkedIn</a>
                </div>

                {/* Private Contact Box (Admin Only) */}
                <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-purple-950 font-medium">
                    <span className="flex items-center gap-1.5 font-bold"><Mail size={14} className="text-[#5B21B6]" /> {a.email || 'N/A'}</span>
                    <span className="flex items-center gap-1.5 font-bold"><Phone size={14} className="text-[#5B21B6]" /> {a.phone || 'N/A'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-[#5B21B6] text-white px-2 py-0.5 rounded uppercase tracking-wider">🔒 Admin Private View</span>
                </div>
              </div>
            </div>

            {a.status === 'Approved' || a.status === 'Rejected' ? (
              <div className="flex items-center">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  a.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>{a.status}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 lg:flex-col lg:items-stretch">
                <button 
                  onClick={() => handleReject(a.id, a.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 font-bold rounded-xl text-sm transition-colors"
                >
                  <X size={15} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(a.id, a.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl text-sm transition-colors shadow"
                >
                  <Check size={15} /> Approve
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default AdminMentorApproval;
