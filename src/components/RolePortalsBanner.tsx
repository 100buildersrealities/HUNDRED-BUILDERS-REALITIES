import React from 'react';
import { 
  Home, 
  ShieldCheck, 
  Building2, 
  Award, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  User,
  LogOut,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { Language } from '../data/translations';

interface RolePortalsBannerProps {
  authUser: AuthUser | null;
  onOpenAuth: (role: UserRole, mode: 'login' | 'signup') => void;
  onOpenPostProperty: () => void;
  onOpenMyListings?: () => void;
  myListingsCount?: number;
  onLogout: () => void;
  lang: Language;
}

export const RolePortalsBanner: React.FC<RolePortalsBannerProps> = ({
  authUser,
  onOpenAuth,
  onOpenPostProperty,
  onOpenMyListings,
  myListingsCount = 0,
  onLogout,
  lang,
}) => {
  const isHi = lang === 'hi';

  const roleCards: {
    role: UserRole;
    titleHi: string;
    titleEn: string;
    subtitleHi: string;
    subtitleEn: string;
    tagHi: string;
    tagEn: string;
    icon: React.FC<{ className?: string }>;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    loginBtnBg: string;
    signupBtnBg: string;
  }[] = [
    {
      role: 'owner',
      titleHi: 'प्रॉपर्टी लिस्टिंग मालिक',
      titleEn: 'Property Listing Owner',
      subtitleHi: '0% ब्रोकरेज, सीधी डील, अपनी प्रॉपर्टी मुफ्त लिस्ट करें व सीधे बायर्स से संपर्क पाएं',
      subtitleEn: '0% Brokerage, direct deals, free listing & direct contact with real buyers',
      tagHi: '0% ब्रोकरेज • मालिक',
      tagEn: 'Direct Owner',
      icon: Home,
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-200 hover:border-amber-400',
      accentText: 'text-amber-700',
      loginBtnBg: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300',
      signupBtnBg: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-amber-600/20',
    },
    {
      role: 'verified_agent',
      titleHi: 'वेरिफाइड एजेंट',
      titleEn: 'Verified Property Agent',
      subtitleHi: 'सत्यापित एजेंट प्रोफाइल, मल्टीपल क्लाइंट लिस्टिंग्स, प्रीमियम लीड्स व साइट विजिट शेड्यूलर',
      subtitleEn: 'Verified badge, multi-client listings, high-intent buyer leads & scheduler',
      tagHi: 'सत्यापित एजेंट बैज',
      tagEn: 'Verified Badge',
      icon: ShieldCheck,
      accentBg: 'bg-blue-500/10',
      accentBorder: 'border-blue-200 hover:border-blue-400',
      accentText: 'text-blue-700',
      loginBtnBg: 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300',
      signupBtnBg: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-600/20',
    },
    {
      role: 'hundred_builders',
      titleHi: 'हंड्रेड बिल्डर्स',
      titleEn: 'Hundred Builders',
      subtitleHi: 'आधिकारिक बिल्डर पोर्टल: केवल अधिकृत कॉर्पोरेट क्रेडेंशियल्स द्वारा सुरक्षित लॉगिन',
      subtitleEn: 'Official Developer portal: secure access restricted to authorized corporate credentials only',
      tagHi: 'आधिकारिक बिल्डर',
      tagEn: 'Official Builder',
      icon: Building2,
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      accentText: 'text-emerald-700',
      loginBtnBg: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300',
      signupBtnBg: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-emerald-600/20',
    },
    {
      role: 'registered_broker',
      titleHi: 'रजिस्टर्ड रियल एस्टेट ब्रोकर',
      titleEn: 'Registered Real Estate Broker',
      subtitleHi: 'RERA अधिकृत ब्रोकर, करियर केयर नेटवर्क, को-ब्रोकिंग, साइट विजिट प्लान्स व सुनिश्चित कमीशन',
      subtitleEn: 'RERA certified brokers, Career Care network, co-broking & guaranteed payouts',
      tagHi: 'RERA अधिकृत ब्रोकर',
      tagEn: 'RERA Registered',
      icon: Award,
      accentBg: 'bg-purple-500/10',
      accentBorder: 'border-purple-200 hover:border-purple-400',
      accentText: 'text-purple-700',
      loginBtnBg: 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300',
      signupBtnBg: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-purple-600/20',
    },
  ];

  return (
    <section id="role-portals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* If User is Logged in, show active session banner */}
      {authUser ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-4 sm:p-6 shadow-md border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-extrabold text-base sm:text-lg text-white">
                  {authUser.name}
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {authUser.role === 'owner' && (isHi ? 'प्रॉपर्टी मालिक' : 'Property Owner')}
                  {authUser.role === 'verified_agent' && (isHi ? 'वेरिफाइड एजेंट' : 'Verified Agent')}
                  {authUser.role === 'hundred_builders' && (isHi ? 'हंड्रेड बिल्डर्स पार्टनर' : 'Hundred Builders')}
                  {authUser.role === 'registered_broker' && (isHi ? 'रजिस्टर्ड ब्रोकर (RERA)' : 'Registered Broker')}
                </span>
                {authUser.isVerified && (
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>सत्यापित (Verified)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                📞 {authUser.phone} {authUser.city ? `• 📍 ${authUser.city}` : ''} {authUser.reraNumber ? `• RERA: ${authUser.reraNumber}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full md:w-auto flex-wrap gap-y-2">
            {onOpenMyListings && (
              <button
                id="portal-my-listings-btn"
                onClick={onOpenMyListings}
                className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/40 px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>{isHi ? `मेरी लिस्टिंग्स (${myListingsCount})` : `My Listings (${myListingsCount})`}</span>
              </button>
            )}

            <button
              id="portal-post-property-btn"
              onClick={onOpenPostProperty}
              className="flex-1 md:flex-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isHi ? 'नई प्रॉपर्टी लिस्ट करें' : 'Post New Property'}</span>
            </button>
            <button
              id="portal-logout-btn"
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isHi ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* The 4 Distinct Role Cards with Login & Signup Buttons */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                  {isHi ? 'पोर्टल लॉगिन एवं साइन-अप (Login & Sign Up Portals)' : 'Dedicated Portals • Login & Sign Up'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHi 
                  ? 'प्रॉपर्टी मालिक, वेरिफाइड एजेंट, हंड्रेड बिल्डर्स और रजिस्टर्ड ब्रोकर के लिए समर्पित लॉगिन एवं पंजीकरण' 
                  : 'Tailored access for Property Owners, Verified Agents, Hundred Builders & RERA Brokers'}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-600">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                🔒 {isHi ? '100% सुरक्षित एन्क्रिप्शन' : '100% Secure Auth'}
              </span>
            </div>
          </div>

          {/* Policy Notice: Sign-Up required before listing */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-center space-x-2.5 text-xs text-amber-950">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
              ✓
            </span>
            <p className="font-semibold text-[11px] sm:text-xs leading-relaxed text-amber-900">
              {isHi
                ? 'नियम: प्रॉपर्टी लिस्टिंग करने वाले मालिक (Owner), वेरिफाइड एजेंट (Verified Agent), रजिस्टर्ड ब्रोकर (Registered Broker) सभी को साइनअप करने के बाद ही प्रॉपर्टी की लिस्टिंग करने की अनुमति है।'
                : 'Policy: Property Owners, Verified Agents, and Registered Brokers must sign up before listing properties on the platform.'}
            </p>
          </div>

          {/* 4 Responsive Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {roleCards.map((card) => {
              const Icon = card.icon;
              const defaultMode: 'login' | 'signup' = card.role === 'hundred_builders' ? 'login' : 'signup';
              return (
                <div
                  key={card.role}
                  id={`portal-card-${card.role}`}
                  className={`bg-slate-50/70 hover:bg-white rounded-2xl border ${card.accentBorder} p-3.5 sm:p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-md group`}
                >
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-9 h-9 rounded-xl ${card.accentBg} flex items-center justify-center ${card.accentText} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${card.accentBg} ${card.accentText}`}>
                        {isHi ? card.tagHi : card.tagEn}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-tight mb-1">
                      {isHi ? card.titleHi : card.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-3">
                      {isHi ? card.subtitleHi : card.subtitleEn}
                    </p>
                  </div>

                  {/* Direct Action Buttons for Login & Sign Up */}
                  <div className="pt-2.5 border-t border-slate-200/60 mt-auto">
                    {card.role === 'hundred_builders' ? (
                      <button
                        type="button"
                        id={`portal-btn-login-${card.role}`}
                        onClick={() => onOpenAuth('hundred_builders', 'login')}
                        className="w-full py-2 px-3 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{isHi ? 'अधिकृत सुरक्षित लॉगिन' : 'Authorized Secure Login'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id={`portal-btn-signup-${card.role}`}
                          onClick={() => onOpenAuth(card.role, 'signup')}
                          className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-2xs transition flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>{isHi ? 'साइन-अप' : 'Sign Up'}</span>
                        </button>
                        <button
                          type="button"
                          id={`portal-btn-login-${card.role}`}
                          onClick={() => onOpenAuth(card.role, 'login')}
                          className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                        >
                          <LogIn className="w-3 h-3 text-slate-500" />
                          <span>{isHi ? 'लॉगिन' : 'Login'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
