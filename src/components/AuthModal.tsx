import React, { useState } from 'react';
import { 
  X, 
  Home, 
  ShieldCheck, 
  Building2, 
  Award, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  MapPin,
  FileCheck,
  Building
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { Language, translations } from '../data/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: AuthUser, message: string) => void;
  lang: Language;
}

interface RoleConfig {
  id: UserRole;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  badgeHi: string;
  badgeEn: string;
  colorBg: string;
  borderColor: string;
  textColor: string;
  icon: React.FC<{ className?: string }>;
  defaultDemoUser: AuthUser;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  owner: {
    id: 'owner',
    titleHi: 'प्रॉपर्टी लिस्टिंग मालिक',
    titleEn: 'Property Owner',
    subtitleHi: '0% ब्रोकरेज, सीधी डील, व्यक्तिगत प्रॉपर्टी लिस्टिंग व सीधा ग्राहक संपर्क',
    subtitleEn: '0% Brokerage, direct deal, individual property listing & direct buyers',
    badgeHi: 'व्यक्तिगत मालिक',
    badgeEn: 'Property Owner',
    colorBg: 'bg-amber-500/10',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    icon: Home,
    defaultDemoUser: {
      id: 'usr_owner_demo',
      name: 'राजेश कुमार शर्मा',
      phone: '+91 98271 23456',
      email: 'rajesh.sharma@example.com',
      role: 'owner',
      city: 'Raipur',
      isVerified: true,
      createdAt: '2026-01-10',
    },
  },
  verified_agent: {
    id: 'verified_agent',
    titleHi: 'वेरिफाइड एजेंट',
    titleEn: 'Verified Agent',
    subtitleHi: 'सत्यापित एजेंट प्रोफाइल, मल्टीपल क्लाइंट लिस्टिंग्स व लीड्स एक्सेस',
    subtitleEn: 'Verified agent profile, multi-client listings & direct lead access',
    badgeHi: 'सत्यापित एजेंट',
    badgeEn: 'Verified Agent',
    colorBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    icon: ShieldCheck,
    defaultDemoUser: {
      id: 'usr_agent_demo',
      name: 'आशीष देवांगन',
      phone: '+91 94252 87654',
      email: 'ashish.agent@example.com',
      role: 'verified_agent',
      city: 'Bhilai',
      agencyName: 'देवांगन प्रॉपर्टी कंसल्टेंसी',
      experienceYears: '8 Years',
      isVerified: true,
      createdAt: '2025-11-20',
    },
  },
  hundred_builders: {
    id: 'hundred_builders',
    titleHi: 'हंड्रेड बिल्डर्स / बिल्डर पार्टनर',
    titleEn: 'Hundred Builders Partner',
    subtitleHi: 'आधिकारिक बिल्डर पार्टनर, प्रोजेक्ट व टाउनशिप लॉन्च, रेरा स्वीकृत इन्वेंटरी',
    subtitleEn: 'Official builder partner, project launches & RERA-approved units',
    badgeHi: 'आधिकारिक बिल्डर',
    badgeEn: 'Builder Partner',
    colorBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    icon: Building2,
    defaultDemoUser: {
      id: 'usr_builder_demo',
      name: '100 Builders Project Desk',
      phone: '+91 78059 80006',
      email: 'projects@100builders.com',
      role: 'hundred_builders',
      companyName: 'HUNDRED BUILDERS REALITIES PVT LTD',
      reraNumber: 'CGRERA-P-2025-00188',
      city: 'Raipur / Durg',
      isVerified: true,
      createdAt: '2025-08-15',
    },
  },
  registered_broker: {
    id: 'registered_broker',
    titleHi: 'रजिस्टर्ड रियल एस्टेट ब्रोकर',
    titleEn: 'Registered Real Estate Broker',
    subtitleHi: 'RERA अधिकृत ब्रोकर, करियर केयर नेटवर्क, को-ब्रोकिंग एवं सुरक्षित कमीशन',
    subtitleEn: 'RERA registered broker, Career Care network, co-broking & payouts',
    badgeHi: 'RERA पंजीकृत ब्रोकर',
    badgeEn: 'RERA Registered Broker',
    colorBg: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-700',
    icon: Award,
    defaultDemoUser: {
      id: 'usr_broker_demo',
      name: 'मनोज अग्रवाल (RERA Reg.)',
      phone: '+91 98930 55443',
      email: 'manoj.rera.broker@example.com',
      role: 'registered_broker',
      agencyName: 'अग्रवाल रियल्टी सॉल्यूशंस',
      reraNumber: 'CGRERA-B-2024-00412',
      city: 'Bilaspur',
      experienceYears: '12 Years',
      isVerified: true,
      createdAt: '2025-06-01',
    },
  },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'owner',
  initialMode = 'login',
  onAuthSuccess,
  lang,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('3-5 Years');
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;

  const currentConfig = ROLE_CONFIGS[selectedRole];
  const isHi = lang === 'hi';

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setCity('');
    setAgencyName('');
    setCompanyName('');
    setReraNumber('');
    setErrorMsg('');
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMsg('');
  };

  const handleDemoLogin = (role: UserRole) => {
    const demo = ROLE_CONFIGS[role].defaultDemoUser;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('hb_auth_user', JSON.stringify(demo));
      const msg = isHi 
        ? `${ROLE_CONFIGS[role].badgeHi} के रूप में सफलतापूर्वक लॉगिन हुआ (${demo.name})`
        : `Successfully logged in as ${ROLE_CONFIGS[role].badgeEn} (${demo.name})`;
      onAuthSuccess(demo, msg);
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!phone || phone.trim().length < 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg(isHi ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
        return;
      }
      if (selectedRole === 'registered_broker' && !reraNumber.trim()) {
        setErrorMsg(isHi ? 'रजिस्टर्ड रियल एस्टेट ब्रोकर के लिए RERA रजिस्ट्रेशन नंबर अनिवार्य है।' : 'RERA registration number is mandatory for registered brokers.');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const user: AuthUser = {
        id: `usr_${selectedRole}_${Date.now()}`,
        name: mode === 'signup' ? fullName.trim() : (fullName.trim() || currentConfig.defaultDemoUser.name),
        phone: phone.trim(),
        email: email.trim() || undefined,
        role: selectedRole,
        city: city.trim() || 'Raipur',
        agencyName: agencyName.trim() || (selectedRole === 'verified_agent' ? 'Verifed Realty Services' : undefined),
        companyName: companyName.trim() || (selectedRole === 'hundred_builders' ? 'HUNDRED BUILDERS PARTNER' : undefined),
        reraNumber: reraNumber.trim() || (selectedRole === 'registered_broker' ? 'CGRERA-B-2026-REG' : undefined),
        experienceYears: selectedRole === 'verified_agent' || selectedRole === 'registered_broker' ? experienceYears : undefined,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem('hb_auth_user', JSON.stringify(user));

      const actionText = mode === 'signup'
        ? (isHi ? 'सफलतापूर्वक पंजीकरण (Sign Up) हुआ!' : 'Account registered successfully!')
        : (isHi ? 'सफलतापूर्वक लॉगिन हुआ!' : 'Logged in successfully!');
      
      const welcomeMsg = isHi
        ? `स्वागत है, ${user.name}! (${currentConfig.badgeHi}) - ${actionText}`
        : `Welcome, ${user.name}! (${currentConfig.badgeEn}) - ${actionText}`;

      onAuthSuccess(user, welcomeMsg);
      onClose();
    }, 600);
  };

  return (
    <div 
      id="auth-portal-modal-backdrop" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div 
        id="auth-portal-modal" 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4 text-slate-900 animate-in zoom-in-95 duration-200"
      >
        {/* Header with Title & Close */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight flex items-center space-x-2">
                <span>{isHi ? 'लॉगिन एवं साइन-अप पोर्टल' : 'Authentication & Sign In Portal'}</span>
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {isHi ? 'मालिक • वेरिफाइड एजेंट • हंड्रेड बिल्डर्स • रजिस्टर्ड ब्रोकर' : 'Owners • Verified Agents • Hundred Builders • RERA Brokers'}
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher (Login vs Sign Up) */}
        <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-center">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex max-w-xs w-full">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                mode === 'login'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{isHi ? 'लॉगिन (Login)' : 'Sign In / Login'}</span>
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{isHi ? 'साइन-अप (Sign Up)' : 'Register / Sign Up'}</span>
            </button>
          </div>
        </div>

        {/* 4 Role Selector Buttons / Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            {isHi ? 'अपनी श्रेणी चुनें (Select Your Role):' : 'Select Your Category / Role:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((roleKey) => {
              const cfg = ROLE_CONFIGS[roleKey];
              const Icon = cfg.icon;
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  id={`auth-role-select-${roleKey}`}
                  type="button"
                  onClick={() => handleRoleChange(roleKey)}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col items-start relative ${
                    isSelected
                      ? `bg-white ${cfg.borderColor} border-2 shadow-sm shadow-slate-200 ring-2 ring-amber-500/20`
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className={`w-7 h-7 rounded-xl ${cfg.colorBg} flex items-center justify-center ${cfg.textColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </div>
                  <span className="font-extrabold text-xs leading-tight text-slate-900 block truncate w-full">
                    {isHi ? cfg.titleHi : cfg.titleEn}
                  </span>
                  <span className={`text-[10px] font-bold mt-0.5 ${cfg.textColor}`}>
                    {isHi ? cfg.badgeHi : cfg.badgeEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Context Banner */}
        <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-amber-950 font-medium leading-tight">
            <span className="font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-[11px]">
              {isHi ? currentConfig.badgeHi : currentConfig.badgeEn}
            </span>
            <span className="text-[11px] text-slate-700">
              {isHi ? currentConfig.subtitleHi : currentConfig.subtitleEn}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleDemoLogin(selectedRole)}
            className="text-[11px] font-extrabold text-amber-700 hover:text-amber-900 bg-white border border-amber-300 px-2 py-1 rounded-lg shrink-0 shadow-2xs hover:bg-amber-100 transition cursor-pointer"
            title="क्लिक करके बिना फॉर्म भरे तुरंत डेमो लॉगिन करें"
          >
            ⚡ {isHi ? '1-क्लिक डेमो लॉगिन' : '1-Click Demo'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          {/* Honeypot */}
          <div className="hidden">
            <input
              type="text"
              name="auth_trap_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If Signup: Full Name */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isHi ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    selectedRole === 'hundred_builders'
                      ? 'e.g. Hundred Builders Executive / Promoter'
                      : selectedRole === 'registered_broker'
                      ? 'e.g. मनोज अग्रवाल (RERA Registered Broker)'
                      : 'e.g. राहुल कुमार शर्मा'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Role specific extra fields for signup */}
          {mode === 'signup' && selectedRole === 'hundred_builders' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'कंपनी / डेवलपर नाम' : 'Company / Firm Name'}
                </label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. HUNDRED BUILDERS REALITIES PVT LTD"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'RERA प्रमोटर रजिस्ट्रेशन' : 'RERA Promoter ID'}
                </label>
                <div className="relative flex items-center">
                  <FileCheck className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. CGRERA-P-2025-00188"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'signup' && selectedRole === 'registered_broker' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'RERA ब्रोकर रजिस्ट्रेशन नंबर *' : 'RERA Broker Reg. No *'}
                </label>
                <div className="relative flex items-center">
                  <FileCheck className="w-4 h-4 text-purple-600 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. CGRERA-B-2024-XXXX"
                    className="w-full bg-slate-50 border border-purple-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'फर्म / एजेंसी का नाम' : 'Brokerage / Firm Name'}
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. श्री रियल्टी एसोसिएट्स"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'signup' && selectedRole === 'verified_agent' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'एजेंसी / फर्म का नाम' : 'Agency / Consultancy Name'}
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. देवांगन प्रॉपर्टी कंसल्टेंसी"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'रियल एस्टेट अनुभव' : 'Real Estate Experience'}
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="1-3 Years">1 - 3 Years</option>
                  <option value="3-5 Years">3 - 5 Years</option>
                  <option value="5-10 Years">5 - 10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>
          )}

          {/* Mobile & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isHi ? 'मोबाइल नंबर (Mobile) *' : 'Mobile Number *'}
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98271 23456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isHi ? 'ईमेल (Email ID)' : 'Email ID'}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* City (if signup) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isHi ? 'कार्यक्षेत्र शहर / जिला (City/District)' : 'Operating City / District'}
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Raipur, Durg, Bilaspur, Indore, Bhopal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isHi ? 'पासवर्ड (Password) *' : 'Password *'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setPhone(currentConfig.defaultDemoUser.phone);
                    setPassword('123456');
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
                >
                  {isHi ? 'डेमो क्रेडेंशियल भरें' : 'Auto-fill Demo'}
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-2">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black py-3 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting ? (
                  isHi ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating...'
                ) : mode === 'login' ? (
                  isHi ? `${currentConfig.titleHi} लॉगिन करें` : `Login as ${currentConfig.titleEn}`
                ) : (
                  isHi ? `${currentConfig.titleHi} नया खाता बनाएं` : `Register New ${currentConfig.titleEn} Account`
                )}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Pill for all 4 roles */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block text-center mb-2">
                {isHi ? 'या 1-क्लिक से सीधे संबंधित पोर्टल में डेमो लॉगिन करें:' : 'Or test immediately with 1-click Demo Login:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('owner')}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer truncate"
                  title="मालिक डेमो लॉगिन"
                >
                  🏡 {isHi ? 'मालिक डेमो' : 'Owner Demo'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('verified_agent')}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition cursor-pointer truncate"
                  title="एजेंट डेमो लॉगिन"
                >
                  🛡️ {isHi ? 'एजेंट डेमो' : 'Agent Demo'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('hundred_builders')}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition cursor-pointer truncate"
                  title="हंड्रेड बिल्डर्स डेमो लॉगिन"
                >
                  🏢 {isHi ? 'बिल्डर डेमो' : 'Builder Demo'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('registered_broker')}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition cursor-pointer truncate"
                  title="रजिस्टर्ड ब्रोकर डेमो लॉगिन"
                >
                  📜 {isHi ? 'ब्रोकर डेमो' : 'Broker Demo'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Support Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>100 BUILDERS REALITIES • 100% Purity & Surety</span>
          <a href="tel:+917805980006" className="text-amber-700 font-bold hover:underline">
            हेल्पलाइन: +91 78059-80006
          </a>
        </div>
      </div>
    </div>
  );
};
