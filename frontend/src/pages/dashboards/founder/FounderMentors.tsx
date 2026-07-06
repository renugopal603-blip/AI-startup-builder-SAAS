import React, { useState, useEffect } from 'react';
import { Star, Clock, ArrowRight } from 'lucide-react';

const FounderMentors: React.FC = () => {
  const [startups, setStartups] = useState<any[]>([]);

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

  const reviewedStartups = startups.filter(s => s.mentorReview);
  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mentor Connections</h1>
        <p className="text-gray-500 mt-1">Get expert feedback, book calls, and review mentor comments.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Active Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Feedback</h2>
          
          <div className="space-y-6">
            {reviewedStartups.length === 0 ? (
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 text-center text-gray-500 text-sm">
                No mentor feedback received yet.
              </div>
            ) : (
              reviewedStartups.map(startup => (
                <div key={startup.startupId} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {startup.mentorReview.mentorName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{startup.mentorReview.mentorName}</p>
                        <p className="text-xs text-gray-500">Mentor Rating: <span className="font-semibold text-gray-700">{startup.mentorReview.rating}</span></p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Completed</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800 mb-2">{startup.startupName}</h4>
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                    "{startup.mentorReview.feedback}"
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Opening full review... This feature is coming soon!")}
                      className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Read Full Review
                    </button>
                    <button 
                      onClick={() => alert(`Booking 1:1 call with ${startup.mentorReview.mentorName}... Integration coming soon!`)}
                      className="flex-1 py-2 bg-[#5B21B6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Book 1:1 Call
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested Mentors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">AI Suggested Mentors</h2>
            <button 
              onClick={() => alert("Loading Mentor Directory...")}
              className="text-sm font-medium text-[#5B21B6] hover:underline"
            >
              Browse Directory
            </button>
          </div>

          <div className="space-y-4">
            {/* Mentor Card */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=F3F4F6&color=1F2937" alt="Sarah Chen" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-gray-900">Sarah Chen</p>
                  <p className="text-xs text-gray-500 mb-1">SaaS Pricing Expert</p>
                  <div className="flex items-center text-xs text-yellow-500 font-medium">
                    <Star size={12} className="fill-yellow-500 mr-1" /> 4.9 (42 reviews)
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert("Viewing Sarah Chen's profile...")}
                className="p-2 text-[#5B21B6] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
            
            {/* Mentor Card */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=1F2937" alt="David Kim" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-gray-900">David Kim</p>
                  <p className="text-xs text-gray-500 mb-1">Supply Chain Specialist</p>
                  <div className="flex items-center text-xs text-yellow-500 font-medium">
                    <Star size={12} className="fill-yellow-500 mr-1" /> 4.8 (18 reviews)
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert("Viewing David Kim's profile...")}
                className="p-2 text-[#5B21B6] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderMentors;
