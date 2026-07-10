import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Briefcase, GraduationCap, Globe, FileText, Building2, IndianRupee, TrendingUp, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleCards = [
  {
    id: 'founder',
    title: 'Founder',
    desc: 'Build and launch your startup with AI-powered tools',
    icon: Rocket,
    color: 'from-[#7C3AED] to-[#5B21B6]',
    bgColor: 'bg-purple-50 border-purple-200',
    activeBg: 'bg-purple-100 border-[#5B21B6]',
    iconBg: 'bg-purple-100 text-[#5B21B6]',
  },
  {
    id: 'mentor',
    title: 'Mentor',
    desc: 'Guide founders and earn from your expertise',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 border-blue-200',
    activeBg: 'bg-blue-100 border-blue-600',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'investor',
    title: 'Investor',
    desc: 'Discover and invest in promising startups',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    activeBg: 'bg-emerald-100 border-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
];

const Signup: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [expertise, setExpertise] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [bio, setBio] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [typicalCheckSize, setTypicalCheckSize] = useState('');
  const [sectorsOfInterest, setSectorsOfInterest] = useState('');
  const [investmentThesis, setInvestmentThesis] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!password.trim()) return 'Please enter a password.';
    if (!confirmPassword.trim()) return 'Please confirm your password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      };

      if (selectedRole === 'mentor') {
        payload.expertise = expertise.trim();
        payload.experienceYears = experienceYears.trim();
        payload.linkedin = linkedin.trim();
        payload.bio = bio.trim();
      }

      if (selectedRole === 'investor') {
        payload.companyName = companyName.trim();
        payload.typicalCheckSize = typicalCheckSize.trim();
        payload.sectorsOfInterest = sectorsOfInterest.trim();
        payload.investmentThesis = investmentThesis.trim();
      }

      const result = await signup(payload);

      if (result.success) {
        setSuccess('Account created successfully! Your account is pending admin approval.');
        setTimeout(() => {
          navigate('/pending-approval');
        }, 800);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setExpertise('');
    setExperienceYears('');
    setLinkedin('');
    setBio('');
    setCompanyName('');
    setTypicalCheckSize('');
    setSectorsOfInterest('');
    setInvestmentThesis('');
    setError('');
    setSuccess('');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/10 blur-[100px]"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FBBF24]/10 blur-[100px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="flex justify-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-[#5B21B6] text-[#FBBF24] p-3 rounded-xl shadow-lg">
            <Rocket size={32} />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-[#1F2937]">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#6B7280]">
          Join AI Startup Builder — select your role to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* Role Selection Cards */}
          {!selectedRole ? (
            <div className="space-y-3">
              {roleCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleRoleSelect(card.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${card.bgColor} ${card.activeBg}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-[#1F2937] text-base">{card.title}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">{card.desc}</p>
                    </div>
                    <ArrowRight size={20} className="text-[#6B7280] shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* Role header + back */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'founder' ? 'bg-purple-100 text-[#5B21B6]' :
                    selectedRole === 'mentor' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {selectedRole === 'founder' ? <Rocket size={20} /> :
                     selectedRole === 'mentor' ? <GraduationCap size={20} /> : <Briefcase size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F2937] capitalize">{selectedRole} Signup</p>
                    <p className="text-xs text-[#6B7280]">Fill in your details below</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedRole(null); resetForm(); }}
                  className="text-xs font-semibold text-[#5B21B6] hover:text-[#7C3AED] transition-colors"
                >
                  Change role
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSignup}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-sm flex items-center">
                    <CheckCircle2 size={16} className="mr-2 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-[#1F2937]">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text" required value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] sm:text-sm outline-none transition-colors"
                      placeholder="John Doe" autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937]">Email Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] sm:text-sm outline-none transition-colors"
                      placeholder="john@example.com" autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937]">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'} required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] sm:text-sm outline-none transition-colors"
                      placeholder="Min. 6 characters" autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937]">Confirm Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] sm:text-sm outline-none transition-colors"
                      placeholder="Re-enter password" autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Mentor fields */}
                {selectedRole === 'mentor' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Professional Details</p>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Expertise</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="e.g. AI/ML, SaaS, Product Strategy" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Years of Experience</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="e.g. 8+ years" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">LinkedIn Profile</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="https://linkedin.com/in/yourprofile" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Bio</label>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors resize-none"
                        placeholder="Tell us about your background and mentoring experience..." />
                    </div>
                  </div>
                )}

                {/* Investor fields */}
                {selectedRole === 'investor' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Investment Profile</p>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Company Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="Your firm or personal name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Typical Check Size</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" value={typicalCheckSize} onChange={(e) => setTypicalCheckSize(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="e.g. ₹50k - ₹250k" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Sectors of Interest</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" value={sectorsOfInterest} onChange={(e) => setSectorsOfInterest(e.target.value)}
                          className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors"
                          placeholder="e.g. AI, SaaS, FinTech" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563]">Short Investment Thesis</label>
                      <textarea value={investmentThesis} onChange={(e) => setInvestmentThesis(e.target.value)} rows={2}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#5B21B6] focus:border-[#5B21B6] text-sm outline-none transition-colors resize-none"
                        placeholder="Describe your investment philosophy briefly..." />
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium flex items-start gap-2">
                      <FileText size={14} className="shrink-0 mt-0.5" />
                      <span>KYC documents can be uploaded later from your profile after approval.</span>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#5B21B6] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B21B6] disabled:opacity-70 transition-all mt-2"
                >
                  {isLoading ? 'Creating Account...' : `Create ${selectedRole === 'founder' ? 'Founder' : selectedRole === 'mentor' ? 'Mentor' : 'Investor'} Account`}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#5B21B6] hover:text-[#7C3AED] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
