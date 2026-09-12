import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Calculator, 
  Award,
  Globe,
  Briefcase,
  Megaphone
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { CITIES_LIST, CHHATTISGARH_CITIES, ALL_CHHATTISGARH_OPTION } from '../data/mockProperties';
import { PurposeType } from '../types';

interface FooterProps {
  lang: Language;
  onSelectCity: (city: string) => void;
  onSelectTab: (tab: PurposeType) => void;
  onOpenPostProperty: () => void;
  onOpenCareerCare: () => void;
  onOpenEmiCalc: () => void;
  onOpenValuation: () => void;
  onOpenSecurityTrust?: () => void;
  onOpenAdPackages?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectCity,
  onSelectTab,
  onOpenPostProperty,
  onOpenCareerCare,
  onOpenEmiCalc,
  onOpenValuation,
  onOpenSecurityTrust,
  onOpenAdPackages,
}) => {
  const t = translations[lang];

  return (
    <footer id="app-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm mt-16">
      
      {/* Top Banner with Hundred Builders Trust */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% RERA Verified Listings</h4>
              <p className="text-xs text-slate-400">All properties inspected with authentic builder & owner credentials.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Zero Brokerage Options</h4>
              <p className="text-xs text-slate-400">Direct owner listings and builder projects with zero middleman fees.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Hundred Builders Assurance</h4>
              <p className="text-xs text-slate-400">Dedicated assistance for site visits, legal checks, and home loans.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-amber-500/20 border-2 border-amber-400 bg-slate-900 shrink-0">
                <img
                  src="/logo.png"
                  alt="100 BUILDERS REALITIES Official Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-white text-lg leading-tight uppercase font-sans">
                  HUNDRED BUILDERS
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                    REALITIES
                  </span>
                  <span className="text-[9px] font-semibold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30">
                    100% Purity & Surety
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {lang === 'hi'
                ? 'हंड्रेड बिल्डर्स रियलिटीज - भारत का अग्रणी रियल एस्टेट पोर्टल। फ्लैट, विला, प्लॉट और कमर्शियल प्रॉपर्टीज खरीदने, बेचने और किराए पर देने का सबसे सरल व सुरक्षित माध्यम।'
                : 'Hundred Builders Realities is India’s premier real estate ecosystem connecting buyers, tenants, owners, and developers for seamless property transactions.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100buildersrealities@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+917805980006" className="hover:text-emerald-400 transition">
                  +91 78059-80006 (24x7 Customer Helpline)
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Corporate Hub: Krishna Nagar, Mansapuram Road, Near Tarun Market, Raipur (Chhattisgarh), Pin 492001</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'hi' ? 'प्रॉपर्टी श्रेणियां' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectTab('buy')} 
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t.buy} Homes & Apartments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('rent')} 
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t.rent} Flats & Houses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('commercial')} 
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t.commercial} Offices & Shops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('plot')} 
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t.plots} & Land Parcels
                </button>
              </li>
              <li>
                <button 
                  id="footer-tab-agriculture"
                  onClick={() => onSelectTab('agriculture')} 
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center space-x-1"
                >
                  <span>{t.agriculture}</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-tab-lease"
                  onClick={() => onSelectTab('lease')} 
                  className="hover:text-indigo-400 transition cursor-pointer flex items-center space-x-1"
                >
                  <span>{t.lease} Properties</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPostProperty} 
                  className="text-amber-400 font-bold hover:text-amber-300 transition cursor-pointer"
                >
                  {t.postPropertyBtn}
                </button>
              </li>
            </ul>
          </div>

          {/* Real Estate Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'hi' ? 'टूल्स व सेवाएं' : 'Tools & Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenAdPackages && (
                <li>
                  <button 
                    id="footer-ad-packages-btn"
                    onClick={onOpenAdPackages} 
                    className="text-white font-bold hover:text-amber-300 transition cursor-pointer flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-2.5 py-1.5 rounded-lg border border-amber-400 shadow-sm"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-amber-200" />
                    <span>{lang === 'hi' ? '📢 सशुल्क विज्ञापन पैकेज (₹199 से)' : '📢 Paid Ad Packages (From ₹199)'}</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={onOpenCareerCare} 
                  className="text-amber-400 font-bold hover:text-amber-300 transition cursor-pointer flex items-center space-x-1.5 bg-amber-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/40 hover:border-amber-400"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'hi' ? 'करियर केयर (ब्रोकर बनें - 100% फ्री)' : 'Career Care (Join as Broker - FREE)'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenEmiCalc} 
                  className="hover:text-amber-400 transition cursor-pointer flex items-center space-x-1"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.emiCalculator}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenValuation} 
                  className="hover:text-amber-400 transition cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.valuationTool}</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500">Legal Document Verification</span>
              </li>
              <li>
                <span className="text-slate-500">Home Loan Pre-Approval Assistance</span>
              </li>
              <li>
                <span className="text-slate-500">Property Site Visit Coordination</span>
              </li>
            </ul>
          </div>

          {/* Top Chhattisgarh & Indian Cities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'hi' ? 'छत्तीसगढ़ व अन्य प्रमुख शहर' : 'Chhattisgarh & Metro Cities'}
              </h4>
            </div>
            
            {/* All Chhattisgarh Quick Button */}
            <button
              onClick={() => onSelectCity(ALL_CHHATTISGARH_OPTION)}
              className="w-full text-left px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-600 hover:text-white border border-amber-800/60 rounded-lg text-xs text-amber-300 font-bold transition cursor-pointer flex items-center justify-between"
            >
              <span>⭐ {ALL_CHHATTISGARH_OPTION}</span>
              <span className="text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded">All CG</span>
            </button>

            <div className="flex flex-wrap gap-1.5">
              {CHHATTISGARH_CITIES.slice(0, 10).map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className="px-2 py-1 bg-slate-900 hover:bg-amber-600 hover:text-white rounded-md text-[11px] text-slate-300 transition cursor-pointer"
                >
                  {city} (CG)
                </button>
              ))}
              {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad'].map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className="px-2 py-1 bg-slate-900/60 hover:bg-slate-800 hover:text-white rounded-md text-[11px] text-slate-400 transition cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Paid Advertisement Packages Callout Banner */}
        {onOpenAdPackages && (
          <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 border border-amber-400/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-white text-sm sm:text-base">
                    {lang === 'hi' ? '📢 सशुल्क विज्ञापन पैकेज (Paid Advertisement Packages)' : '📢 Paid Advertisement Packages'}
                  </h4>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/50">
                    ₹199 से शुरू
                  </span>
                </div>
                <p className="text-xs text-amber-100 mt-0.5 font-medium">
                  {lang === 'hi' 
                    ? 'व्यक्ति, संस्था, सोसाइटी, बिल्डर, रियल-एस्टेट इन्वेस्टर और ब्रोकर हेतु विशेष प्रचार योजनाएं। 100% वेरिफाइड लीड्स व सीधी खरीदार पूछताछ।'
                    : 'Showcase your plots, projects, flats & services across India. Dedicated plans for Builders, Brokers & Investors.'}
                </p>
              </div>
            </div>
            <button
              id="footer-ad-packages-banner-btn"
              onClick={onOpenAdPackages}
              className="w-full md:w-auto shrink-0 bg-white hover:bg-amber-50 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer active:scale-98 text-center"
            >
              {lang === 'hi' ? 'सभी विज्ञापन पैकेज देखें (₹199 - ₹9,999) →' : 'Explore Ad Packages (₹199 - ₹9,999) →'}
            </button>
          </div>
        )}

        {/* Career Care Special Callout Banner for Brokers */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-white text-sm sm:text-base">
                  {lang === 'hi' ? 'करियर केयर (Career Care) - रियल एस्टेट ब्रोकर बनें' : 'Career Care - Join as Real Estate Broker Partner'}
                </h4>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  100% FREE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'hi' 
                  ? 'HUNDRED BUILDERS REALITIES से डायरेक्ट जुड़कर रियल एस्टेट ब्रोकर/एजेंट के रूप में कार्य करें। आधार, पैन कार्ड व अन्य डिटेल भरकर फ्री रजिस्ट्रेशन करें।'
                  : 'Partner directly with HUNDRED BUILDERS REALITIES across India as a verified broker. Zero registration fee.'}
              </p>
            </div>
          </div>
          <button
            id="footer-career-care-banner-btn"
            onClick={onOpenCareerCare}
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer active:scale-98 text-center"
          >
            {lang === 'hi' ? 'करियर केयर में फ्री रजिस्टर करें →' : 'Register Free in Career Care →'}
          </button>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t.copyright}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {onOpenSecurityTrust && (
              <button
                type="button"
                onClick={onOpenSecurityTrust}
                className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 cursor-pointer transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>एंटी-हैक साइबर सुरक्षा (Certified Secure)</span>
              </button>
            )}
            {onOpenAdPackages && (
              <button
                type="button"
                onClick={onOpenAdPackages}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer transition underline decoration-dotted"
              >
                {lang === 'hi' ? 'विज्ञापन अस्वीकरण व नियम (Terms)' : 'Ad Disclaimer & Terms'}
              </button>
            )}
            <span>RERA Registered</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
