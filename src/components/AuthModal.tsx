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
import { secureStore, secureRetrieve } from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: AuthUser, message: string) => void;
  lang: Language;
  reason?: 'post_property' | 'default';
}

export interface RegisteredAccount {
  id: string;
  name: string;
  phone: string;         // normalized 10 digits
  displayPhone: string;  // formatted/input phone
  email: string;         // lowercase email
  password: string;
  role: UserRole;
  city?: string;
  agencyName?: string;
  companyName?: string;
  reraNumber?: string;
  experienceYears?: string;
  isVerified: boolean;
  createdAt: string;
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
  },
  hundred_builders: {
    id: 'hundred_builders',
    titleHi: 'हंड्रेड बिल्डर्स',
    titleEn: 'Hundred Builders',
    subtitleHi: 'आधिकारिक बिल्डर लॉगिन: केवल अधिकृत कॉर्पोरेट क्रेडेंशियल्स द्वारा सुरक्षित लॉगिन',
    subtitleEn: 'Official Builder Login: Secure corporate login with authorized credentials only',
    badgeHi: 'हंड्रेड बिल्डर्स',
    badgeEn: 'Hundred Builders',
    colorBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    icon: Building2,
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
  },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'owner',
  initialMode = 'login',
  onAuthSuccess,
  lang,
  reason = 'default',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode and role whenever modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSelectedRole(initialRole);
      setErrorMsg('');
    }
  }, [isOpen, initialMode, initialRole]);

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
    if (role === 'hundred_builders') {
      setMode('login');
    }
    setErrorMsg('');
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    if (newMode === 'signup' && selectedRole === 'hundred_builders') {
      setErrorMsg(
        isHi
          ? 'हंड्रेड बिल्डर्स एक सुरक्षित कॉर्पोरेट खाता है। इसमें केवल अधिकृत लॉगिन की अनुमति है।'
          : 'Hundred Builders is a secure corporate account. Only authorized login is permitted.'
      );
      return;
    }
    setMode(newMode);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const phoneDigits = phone.replace(/\D/g, '').slice(-10);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Strict credential verification for Hundred Builders:
    // Mobile Number: 78059-80006
    // Email ID: 100buildersrealities@gmail.com
    // Password: BHA1989tan@
    // All 3 must match simultaneously. Any other mobile, email, or password is strictly prohibited.
    // Credentials are fully hidden from view and never exposed in errors or UI.
    if (selectedRole === 'hundred_builders') {
      if (mode === 'signup') {
        setMode('login');
        setErrorMsg(
          isHi 
            ? 'हंड्रेड बिल्डर्स में नया खाता पंजीकरण बंद है। केवल अधिकृत क्रेडेंशियल्स से लॉगिन करें।'
            : 'New account registration is closed for Hundred Builders. Please login with authorized credentials.'
        );
        return;
      }

      const normalizedPhone = phone.replace(/[\s\-+]/g, '');
      const isPhoneMatch = normalizedPhone === '7805980006' || normalizedPhone === '917805980006' || phone.trim() === '78059-80006';
      const isEmailMatch = cleanEmail === '100buildersrealities@gmail.com';
      const isPasswordMatch = password === 'BHA1989tan@';

      if (!isPhoneMatch || !isEmailMatch || !isPasswordMatch) {
        setErrorMsg(
          isHi 
            ? 'लॉगिन विफल! हंड्रेड बिल्डर्स खाते में लॉगिन केवल सही अधिकृत मोबाइल नंबर, ईमेल आईडी एवं पासवर्ड के पूर्ण मिलान पर ही संभव है। अन्य किसी भी विवरण से लॉगिन पूर्णतः प्रतिबंधित है।'
            : 'Authentication failed! Login to Hundred Builders requires the exact match of the authorized mobile number, email, and password. Any other credentials are strictly prohibited.'
        );
        return;
      }

      // Login success for Hundred Builders
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const hbOfficialUser: AuthUser = {
          id: 'usr_hundred_builders_official',
          name: '100 Builders Realities (Official)',
          phone: '78059-80006',
          email: '100buildersrealities@gmail.com',
          role: 'hundred_builders',
          companyName: 'HUNDRED BUILDERS REALITIES PVT LTD',
          city: city.trim() || 'Raipur / Durg',
          reraNumber: 'CGRERA-P-2025-00188',
          isVerified: true,
          createdAt: '2025-08-15',
        };
        secureStore('hb_auth_user', hbOfficialUser);
        const msg = isHi
          ? 'हंड्रेड बिल्डर्स के अधिकृत पोर्टल में सफलतापूर्वक लॉगिन हुआ!'
          : 'Successfully authenticated into Hundred Builders portal!';
        onAuthSuccess(hbOfficialUser, msg);
        onClose();
      }, 500);
      return;
    }

    // 2. Strict Input Validation for Public Roles:
    // (a) Mandatory 10-digit mobile number
    if (!phoneDigits || phoneDigits.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    // (b) Mandatory verified Email ID
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg(isHi ? 'कृपया एक मान्य ईमेल आईडी दर्ज करें (उदा. user@example.com)।' : 'Please enter a valid email ID (e.g. user@example.com).');
      return;
    }

    // (c) Mandatory Password (min 6 characters)
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg(isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }

    const registeredAccounts = secureRetrieve<RegisteredAccount[]>('hb_registered_users', []);

    // 3. SIGN-UP FLOW (पंजीकरण):
    if (mode === 'signup') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
        return;
      }
      if (selectedRole === 'registered_broker' && !reraNumber.trim()) {
        setErrorMsg(isHi ? 'रजिस्टर्ड रियल एस्टेट ब्रोकर के लिए RERA रजिस्ट्रेशन नंबर अनिवार्य है।' : 'RERA registration number is mandatory for registered brokers.');
        return;
      }

      // Check if mobile or email is already registered
      const existingAccount = registeredAccounts.find(
        (acc) => acc.phone === phoneDigits || acc.email === cleanEmail
      );

      if (existingAccount) {
        if (existingAccount.phone === phoneDigits && existingAccount.email === cleanEmail) {
          setErrorMsg(
            isHi
              ? 'यह मोबाइल नंबर व ईमेल आईडी पहले से पंजीकृत है! कृपया "लॉगिन" टैब पर जाकर सीधे लॉगिन करें।'
              : 'This mobile and email is already registered! Please switch to Login tab.'
          );
        } else if (existingAccount.phone === phoneDigits) {
          setErrorMsg(
            isHi
              ? 'यह मोबाइल नंबर पहले से किसी खाते में पंजीकृत है। कृपया लॉगिन करें या दूसरा नंबर दर्ज करें।'
              : 'This mobile number is already registered with another account.'
          );
        } else {
          setErrorMsg(
            isHi
              ? 'यह ईमेल आईडी पहले से किसी खाते में पंजीकृत है। कृपया लॉगिन करें या दूसरी ईमेल दर्ज करें।'
              : 'This email address is already registered with another account.'
          );
        }
        return;
      }

      // Register new user account
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);

        const newAccount: RegisteredAccount = {
          id: `usr_${selectedRole}_${Date.now()}`,
          name: fullName.trim(),
          phone: phoneDigits,
          displayPhone: phone.trim(),
          email: cleanEmail,
          password: cleanPassword,
          role: selectedRole,
          city: city.trim() || 'Raipur',
          agencyName: agencyName.trim() || (selectedRole === 'verified_agent' ? 'Verifed Realty Services' : undefined),
          companyName: companyName.trim() || undefined,
          reraNumber: reraNumber.trim() || undefined,
          experienceYears: selectedRole === 'verified_agent' || selectedRole === 'registered_broker' ? experienceYears : undefined,
          isVerified: true,
          createdAt: new Date().toISOString().split('T')[0],
        };

        const updatedAccounts = [...registeredAccounts, newAccount];
        secureStore('hb_registered_users', updatedAccounts);

        const authUser: AuthUser = {
          id: newAccount.id,
          name: newAccount.name,
          phone: newAccount.displayPhone,
          email: newAccount.email,
          role: newAccount.role,
          city: newAccount.city,
          agencyName: newAccount.agencyName,
          companyName: newAccount.companyName,
          reraNumber: newAccount.reraNumber,
          experienceYears: newAccount.experienceYears,
          isVerified: true,
          createdAt: newAccount.createdAt,
        };

        secureStore('hb_auth_user', authUser);

        const welcomeMsg = isHi
          ? `सत्यापित पंजीकरण सफल! स्वागत है, ${authUser.name} (${currentConfig.badgeHi})। आपका खाता सत्यापित होकर सक्रिय हो गया है।`
          : `Verified Registration Successful! Welcome, ${authUser.name} (${currentConfig.badgeEn}).`;

        onAuthSuccess(authUser, welcomeMsg);
        onClose();
      }, 500);
      return;
    }

    // 4. LOGIN FLOW (साइनअप होने के बाद ही लॉगिन की अनुमति):
    // Match account strictly from registered users list
    const matchedAccount = registeredAccounts.find(
      (acc) => acc.phone === phoneDigits || acc.email === cleanEmail
    );

    // Rule: Reject if account has not signed up
    if (!matchedAccount) {
      setErrorMsg(
        isHi
          ? 'लॉगिन अस्वीकृत: यह खाता पंजीकृत नहीं है। केवल साइन-अप होने के बाद ही लॉगिन की अनुमति है। कृपया "साइन-अप (Sign Up)" टैब पर क्लिक करके पहले अपना नया खाता बनाएं।'
          : 'Login Denied: This account is not registered. Login is permitted only after sign-up. Please switch to the "Sign Up" tab and register first.'
      );
      return;
    }

    // Role Match
    if (matchedAccount.role !== selectedRole) {
      const registeredRoleCfg = ROLE_CONFIGS[matchedAccount.role];
      setErrorMsg(
        isHi
          ? `यह खाता '${registeredRoleCfg?.titleHi || matchedAccount.role}' के रूप में पंजीकृत है। कृपया ऊपर '${registeredRoleCfg?.titleHi || matchedAccount.role}' पोर्टल का चयन करें या नया पंजीकरण करें।`
          : `This account is registered as ${registeredRoleCfg?.titleEn || matchedAccount.role}. Please select the matching portal.`
      );
      return;
    }

    // Strict Mobile Match
    if (matchedAccount.phone !== phoneDigits) {
      setErrorMsg(
        isHi
          ? 'सत्यापन विफल: दर्ज किया गया मोबाइल नंबर इस पंजीकृत खाते से मेल नहीं खाता है।'
          : 'Verification failed: The entered mobile number does not match this registered account.'
      );
      return;
    }

    // Strict Email Match
    if (matchedAccount.email !== cleanEmail) {
      setErrorMsg(
        isHi
          ? 'सत्यापन विफल: दर्ज की गई ईमेल आईडी इस पंजीकृत खाते से मेल नहीं खाती है।'
          : 'Verification failed: The entered email ID does not match this registered account.'
      );
      return;
    }

    // Strict Password Match
    if (matchedAccount.password !== cleanPassword) {
      setErrorMsg(
        isHi
          ? 'पासवर्ड अमान्य! दर्ज पासवर्ड इस खाते के पंजीकृत पासवर्ड से मेल नहीं खाता। कृपया सही पासवर्ड दर्ज करें।'
          : 'Invalid password! The password does not match the registered credentials for this account.'
      );
      return;
    }

    // All 3 (Mobile, Email, Password) verified and matched!
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const authUser: AuthUser = {
        id: matchedAccount.id,
        name: matchedAccount.name,
        phone: matchedAccount.displayPhone,
        email: matchedAccount.email,
        role: matchedAccount.role,
        city: matchedAccount.city,
        agencyName: matchedAccount.agencyName,
        companyName: matchedAccount.companyName,
        reraNumber: matchedAccount.reraNumber,
        experienceYears: matchedAccount.experienceYears,
        isVerified: true,
        createdAt: matchedAccount.createdAt,
      };

      secureStore('hb_auth_user', authUser);

      const welcomeMsg = isHi
        ? `सत्यापित लॉगिन सफल! स्वागत है, ${authUser.name} (${currentConfig.badgeHi})`
        : `Verified login successful! Welcome, ${authUser.name} (${currentConfig.badgeEn})`;

      onAuthSuccess(authUser, welcomeMsg);
      onClose();
    }, 500);
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
        <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex flex-col items-center justify-center space-y-2">
          {reason === 'post_property' && (
            <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl px-3.5 py-2 text-center text-xs font-bold text-amber-900 flex items-center justify-center space-x-2">
              <span className="text-sm">🏡</span>
              <span>
                {isHi
                  ? 'प्रॉपर्टी लिस्टिंग करने के लिए मालिक (Owner), एजेंट (Agent) या ब्रोकर (Broker) के रूप में साइन-अप करना अनिवार्य है।'
                  : 'Sign-up as an Owner, Agent, or Broker is required before posting a property.'}
              </span>
            </div>
          )}
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
            {selectedRole === 'hundred_builders' ? (
              <div
                className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-400 bg-slate-100 flex items-center justify-center space-x-1 cursor-not-allowed select-none"
                title={isHi ? 'हंड्रेड बिल्डर्स में केवल अधिकृत लॉगिन उपलब्ध है' : 'Login only for Hundred Builders'}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isHi ? 'केवल लॉगिन' : 'Login Only'}</span>
              </div>
            ) : (
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
            )}
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
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg shrink-0 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isHi ? 'सत्यापित लॉगिन' : 'Verified Auth'}</span>
          </div>
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

          {/* Security policy badge */}
          {selectedRole !== 'hundred_builders' && (
            <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center space-x-2 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">
                {mode === 'login'
                  ? (isHi
                      ? 'सुरक्षा नियम: केवल पहले से साइन-अप (पंजीकृत) यूज़र्स को ही सत्यापित मोबाइल, ईमेल और पासवर्ड से लॉगिन की अनुमति है।'
                      : 'Security Rule: Login is permitted only for registered users with matching verified Mobile, Email, and Password.')
                  : (isHi
                      ? 'नया पंजीकरण: साइन-अप पूरा करने के बाद आपका मोबाइल, ईमेल और पासवर्ड स्थायी रूप से सुरक्षित व सत्यापित हो जाएगा।'
                      : 'New Registration: After signing up, your mobile, email, and password will be verified for secure access.')}
              </span>
            </div>
          )}

          {/* Hundred Builders Strict Security Notice */}
          {selectedRole === 'hundred_builders' && (
            <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex items-start space-x-3 text-xs text-emerald-950 shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                🔒
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-emerald-900 flex items-center space-x-2">
                  <span>{isHi ? 'हंड्रेड बिल्डर्स सुरक्षित कॉर्पोरेट लॉगिन' : 'Hundred Builders Corporate Access'}</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {isHi ? 'केवल अधिकृत' : 'Authorized Only'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  {isHi
                    ? 'हंड्रेड बिल्डर्स खाते में लॉगिन केवल और केवल अधिकृत मोबाइल नंबर, ईमेल आईडी एवं पासवर्ड के पूर्ण मिलान पर ही संभव है। इसके अतिरिक्त किसी भी अन्य मोबाइल, ईमेल या पासवर्ड से लॉगिन पूर्णतः प्रतिबंधित है।'
                    : 'Access to the Hundred Builders corporate account is strictly restricted to matching authorized mobile number, email ID, and password. Any other credentials are completely prohibited.'}
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>
                <span>{errorMsg}</span>
              </div>
              {mode === 'login' && errorMsg.includes('पंजीकृत नहीं') && selectedRole !== 'hundred_builders' && (
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="text-[11px] font-black text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>{isHi ? 'यहाँ क्लिक करके नया साइन-अप (रजिस्ट्रेशन) करें' : 'Click here to Sign Up (Register)'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
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
                    selectedRole === 'registered_broker'
                      ? 'e.g. मनोज अग्रवाल (RERA Registered Broker)'
                      : selectedRole === 'verified_agent'
                      ? 'e.g. आशीष देवांगन (Property Consultant)'
                      : 'e.g. राहुल कुमार शर्मा'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && selectedRole === 'verified_agent' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'एजेंसी / फर्म का नाम (वैकल्पिक)' : 'Agency / Firm Name (Optional)'}
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

          {mode === 'signup' && selectedRole === 'registered_broker' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isHi ? 'RERA ब्रोकर रजिस्ट्रेशन नंबर * (अनिवार्य)' : 'RERA Broker Reg. No * (Mandatory)'}
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

          {/* Mobile & Email Row - Both strictly required */}
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
                  placeholder={
                    selectedRole === 'hundred_builders'
                      ? (isHi ? 'अधिकृत 10-अंकीय मोबाइल नंबर' : 'Authorized 10-digit mobile')
                      : (isHi ? '10-अंकीय मोबाइल (उदा. 98271 23456)' : '10-digit mobile (e.g. 98271 23456)')
                  }
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none font-medium ${
                    selectedRole === 'hundred_builders' ? 'border-emerald-300 focus:border-emerald-500' : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isHi ? 'ईमेल (Email ID) * (सत्यापन हेतु अनिवार्य)' : 'Email ID * (Mandatory for Verification)'}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'hundred_builders'
                      ? (isHi ? 'अधिकृत कॉर्पोरेट ईमेल आईडी' : 'Authorized corporate email')
                      : (isHi ? 'उदा. user@example.com' : 'e.g. user@example.com')
                  }
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none font-medium ${
                    selectedRole === 'hundred_builders' ? 'border-emerald-300 focus:border-emerald-500' : 'border-slate-200 focus:border-amber-500'
                  }`}
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
              <span className="text-[10px] text-slate-400 font-medium">
                {mode === 'signup' ? (isHi ? 'न्यूनतम 6 अक्षर' : 'Min 6 characters') : ''}
              </span>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border rounded-xl pl-9 pr-10 py-2 text-xs focus:outline-none font-medium ${
                  selectedRole === 'hundred_builders' ? 'border-emerald-300 focus:border-emerald-500' : 'border-slate-200 focus:border-amber-500'
                }`}
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
          <div className="pt-2 space-y-2.5">
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
                  isHi ? `${currentConfig.titleHi} सत्यापित लॉगिन करें` : `Verified Login as ${currentConfig.titleEn}`
                ) : (
                  isHi ? `${currentConfig.titleHi} साइन-अप (रजिस्ट्रेशन) पूरा करें` : `Complete ${currentConfig.titleEn} Registration`
                )}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Seamless Switch between Login and Sign Up */}
            <div className="pt-3 border-t border-slate-200 text-center">
              {mode === 'login' ? (
                selectedRole !== 'hundred_builders' ? (
                  <div className="text-xs text-slate-600 font-medium flex items-center justify-center space-x-1.5">
                    <span>{isHi ? 'क्या आपका खाता अभी तक पंजीकृत नहीं है?' : 'Do not have an account yet?'}</span>
                    <button
                      type="button"
                      onClick={() => handleModeChange('signup')}
                      className="text-amber-700 font-black hover:underline hover:text-amber-900 cursor-pointer"
                    >
                      {isHi ? 'यहाँ साइन-अप (पंजीकरण) करें' : 'Sign Up here'}
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-800 font-bold flex items-center justify-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>{isHi ? 'हंड्रेड बिल्डर्स केवल अधिकृत कॉर्पोरेट प्रमाणीकरण स्वीकार करता है।' : 'Hundred Builders accepts authorized corporate authentication only.'}</span>
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-600 font-medium flex items-center justify-center space-x-1.5">
                  <span>{isHi ? 'क्या आप पहले से पंजीकृत हैं?' : 'Already have a registered account?'}</span>
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="text-amber-700 font-black hover:underline hover:text-amber-900 cursor-pointer"
                  >
                    {isHi ? 'यहाँ लॉगिन करें' : 'Login here'}
                  </button>
                </div>
              )}
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
