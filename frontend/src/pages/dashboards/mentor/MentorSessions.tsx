import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, MoreVertical, Link, MessageSquare, CheckCircle } from 'lucide-react';
import { addNotification } from '../../../utils/localStorageHelper';

const sessions = [
  { id: 1, startup: 'EcoPackage Hub', founder: 'Sarah Jenkins', time: 'Today, 2:00 PM', duration: '45 min', status: 'upcoming' },
  { id: 2, startup: 'AI Legal Reviewer', founder: 'James Park', time: 'Tomorrow, 10:00 AM', duration: '30 min', status: 'upcoming' },
  { id: 3, startup: 'Fintech Micro-SaaS', founder: 'Tom Chen', time: 'Jul 1, 2026', duration: '60 min', status: 'completed' },
];

const MentorSessions: React.FC = () => {
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

  const clarificationRequests = startups.filter(s => s.mentorReview?.status === 'Clarification Requested');

  const handleClarificationAction = (startup: any, action: 'accept' | 'reply') => {
    let replyText = '';
    
    if (action === 'reply') {
      const reply = window.prompt('Enter your reply to the founder:');
      if (!reply) return;
      replyText = reply;
    }

    const updated = {
      ...startup,
      mentorReview: { 
        ...startup.mentorReview, 
        status: 'Clarification Answered',
        ...(replyText ? { mentorReply: replyText } : {})
      }
    };
    localStorage.setItem(`startup_${updated.startupId}`, JSON.stringify(updated));
    setStartups(prev => prev.map(s => s.startupId === updated.startupId ? updated : s));

    addNotification({
      id: Date.now(),
      title: 'Clarification Answered',
      message: action === 'reply' 
        ? `Mentor replied to your clarification for ${startup.startupName}.`
        : `Mentor accepted your clarification for ${startup.startupName}.`,
      type: 'mentor_review',
      time: 'Just now',
      unread: true
    });
    window.alert(action === 'reply' ? 'Reply sent! Founder has been notified.' : 'Clarification accepted! Founder has been notified.');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentor Sessions</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming 1:1 video calls and founder clarifications.</p>
        </div>
        <button 
          onClick={() => window.alert('Redirecting to Google Calendar auth...')}
          className="flex items-center px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl shadow text-sm transition-colors"
        >
          <Link size={16} className="mr-2" /> Connect Calendar
        </button>
      </div>

      {clarificationRequests.length > 0 && (
        <div className="mb-8 bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-100/50">
            <h2 className="font-bold text-yellow-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-yellow-600" /> Pending Clarifications
            </h2>
          </div>
          <div className="divide-y divide-yellow-100">
            {clarificationRequests.map(startup => (
              <div key={startup.startupId} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{startup.startupName}</p>
                  <p className="text-xs text-gray-500 mb-2">From founder</p>
                  <p className="text-sm text-gray-800 italic border-l-2 border-yellow-400 pl-3 bg-white p-2 rounded">
                    "{startup.mentorReview.clarificationMessage}"
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleClarificationAction(startup, 'accept')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white font-bold rounded-lg text-sm hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button 
                    onClick={() => handleClarificationAction(startup, 'reply')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg text-sm hover:bg-yellow-600 transition-colors shadow-sm"
                  >
                    <MessageSquare size={16} /> Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-[#5B21B6]" /> Upcoming & Past Sessions</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {sessions.map(s => (
            <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.status === 'upcoming' ? 'bg-purple-100 text-[#5B21B6]' : 'bg-gray-100 text-gray-400'}`}>
                  <Video size={20} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{s.startup}</p>
                  <p className="text-sm text-gray-500">with {s.founder}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-gray-600"><Calendar size={14} /> {s.time}</span>
                    <span className="flex items-center gap-1 text-gray-600"><Clock size={14} /> {s.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {s.status === 'upcoming' ? (
                  <button 
                    onClick={() => window.alert('Opening Zoom/Meet link for the session...')}
                    className="px-4 py-2 bg-[#5B21B6] text-white font-bold rounded-lg text-sm hover:bg-[#7C3AED] transition-colors shadow"
                  >
                    Join Call
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold rounded-lg text-xs">Completed</span>
                )}
                <button 
                  onClick={() => window.alert('Opening session options...')}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorSessions;
