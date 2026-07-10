import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft, Search, HelpCircle, FileText, Users, Shield } from 'lucide-react';

const faqs = [
  { q: 'How do I create an account?', a: 'Click "Sign up" on the landing page, select your role (Founder, Mentor, or Investor), fill in your details, and submit. Your account will be reviewed by an admin before you can log in.' },
  { q: 'How does AI startup analysis work?', a: 'Our AI analyzes your startup idea across multiple dimensions — market size, competition, revenue model, team strength, and investment readiness — and generates a comprehensive report with actionable insights.' },
  { q: 'Can I change my role after signing up?', a: 'Role changes can be requested through the admin. Contact support or reach out to an admin from your dashboard.' },
  { q: 'How do I connect with mentors?', a: 'Founders can browse available mentors from the Mentors section in their dashboard. You can filter by expertise, view profiles, and request mentoring sessions.' },
  { q: 'How does funding work?', a: 'Investors can browse startup profiles in the marketplace and express interest. Founders receive funding offers which they can review, negotiate, and accept.' },
  { q: 'Is my data secure?', a: 'Yes, all data is encrypted and stored securely. We follow industry best practices for data protection and privacy.' },
];

const categories = [
  { icon: HelpCircle, title: 'Getting Started', desc: 'Account setup, roles, and platform basics', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: FileText, title: 'AI Features', desc: 'Idea analysis, business plans, pitch decks', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Users, title: 'Mentorship', desc: 'Finding mentors, scheduling sessions', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Shield, title: 'Security & Privacy', desc: 'Data protection, account safety', color: 'text-red-500', bg: 'bg-red-50' },
];

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6B7280] hover:text-[#5B21B6] font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#5B21B6] text-[#FBBF24] p-2 rounded-lg">
            <Rocket size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F2937]">Help Center</h1>
        </div>
        <p className="text-[#6B7280] mb-8 ml-12">Find answers to common questions and learn how to use the platform.</p>

        <div className="relative max-w-md mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search for help..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-sm bg-white" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {categories.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                <c.icon size={22} className={c.color} />
              </div>
              <div>
                <h3 className="font-bold text-[#1F2937] text-sm">{c.title}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[#1F2937] mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="px-6 py-4 font-bold text-[#1F2937] text-sm cursor-pointer list-none flex items-center justify-between hover:text-[#5B21B6] transition-colors">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-sm text-[#6B7280] border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
