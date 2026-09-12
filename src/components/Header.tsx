import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Heart, 
  Scale, 
  Calculator, 
  Globe, 
  MapPin, 
  Menu, 
  X, 
  PhoneCall, 
  Sparkles,
  Search,
  CheckCircle2,
  CalendarCheck,
  Briefcase,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { Language, translations, INDIAN_LANGUAGES } from '../data/translations';
import { CITIES_LIST, CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES, OTHER_METRO_CITIES, ALL_CHHATTISGARH_OPTION, ALL_MADHYA_PRADESH_OPTION } from '../data/mockProperties';
import { PurposeType } from '../types';
import { TopIndianLanguageBar } from './TopIndianLanguageBar';
import { IndianLanguageModal } from './IndianLanguageModal';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onSelectLanguage?: (lang: Language) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenPostProperty: () => void;
  onOpenCareerCare: () => void;
  onOpenEmiCalc: () => void;
  onOpenValuation: () => void;
  onOpenShortlist: () => void;
  onOpenCompare: () => void;
  onOpenInquiries: () => void;
  onOpenSecurityTrust?: () => void;
  onOpenAdPackages?: () => void;
  shortlistCount: number;
  compareCount: number;
  inquiryCount: number;
  activeTab: PurposeType;
  onSelectTab: (tab: PurposeType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onSelectLanguage,
  selectedCity,
  onSelectCity,
  onOpenPostProperty,
  onOpenCareerCare,
  onOpenEmiCalc,
  onOpenValuation,
  onOpenShortlist,
  onOpenCompare,
  onOpenInquiries,
  onOpenSecurityTrust,
  onOpenAdPackages,
  shortlistCount,
  compareCount,
  inquiryCount,
  activeTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const t = translations[lang];
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  const handleLanguageSelect = (newLang: Language) => {
    if (onSelectLanguage) {
      onSelectLanguage(newLang);
    } else {
      onToggleLang();
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Topmost Indian Languages Quick Switcher Bar */}
      <TopIndianLanguageBar
        currentLang={lang}
        onSelectLanguage={handleLanguageSelect}
        onOpenAllLanguagesModal={() => setLangModalOpen(true)}
      />

      {/* Top micro bar for Hundred Builders helpline & quick credentials */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'हंड्रेड बिल्डर्स रियलिटीज - प्रीमियम प्रॉपर्टी पोर्टल' : 'Hundred Builders Realities - Verified Real Estate'}</span>
          </div>
          <span className="text-slate-600">|</span>
          <a 
            href="tel:+917805980006" 
            className="flex items-center space-x-1 hover:text-white transition cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>+91 78059-80006</span>
          </a>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <span>{t.officialEmail}</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {onOpenAdPackages && (
              <button 
                id="header-ad-packages-top-btn"
                onClick={onOpenAdPackages}
                className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-amber-100 border border-amber-400/50 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 cursor-pointer transition font-extrabold text-[11px]"
                title="सशुल्क विज्ञापन पैकेज (Paid Ad Packages - ₹199 से शुरू)"
              >
                <Megaphone className="w-3 h-3 text-amber-400" />
                <span>{lang === 'hi' ? 'विज्ञापन पैकेज (₹199 से)' : 'Ad Packages (From ₹199)'}</span>
              </button>
            )}
            <button 
              id="header-career-care-top-btn"
              onClick={onOpenCareerCare}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-100 border border-amber-400/50 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 cursor-pointer transition font-bold text-[11px]"
            >
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>{lang === 'hi' ? 'करियर केयर (ब्रोकर बनें - 100% फ्री)' : 'Career Care (Join as Broker - FREE)'}</span>
            </button>
            <button 
              id="header-valuation-btn"
              onClick={onOpenValuation} 
              className="text-amber-300 hover:text-amber-200 flex items-center space-x-1 cursor-pointer transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.valuationTool}</span>
            </button>
            <button 
              id="header-emi-top-btn"
              onClick={onOpenEmiCalc} 
              className="text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer transition"
            >
              <Calculator className="w-3 h-3" />
              <span>{t.emiCalculator}</span>
            </button>
            {inquiryCount > 0 && (
              <button 
                id="header-inquiries-top-btn"
                onClick={onOpenInquiries}
                className="text-emerald-300 hover:text-emerald-200 flex items-center space-x-1 cursor-pointer transition"
              >
                <CalendarCheck className="w-3 h-3" />
                <span>{lang === 'hi' ? `बुकिंग (${inquiryCount})` : `My Visits (${inquiryCount})`}</span>
              </button>
            )}
            {onOpenSecurityTrust && (
              <button 
                id="header-security-top-btn"
                onClick={onOpenSecurityTrust}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center space-x-1 cursor-pointer transition font-bold text-[11px]"
                title="एंटी-हैक साइबर सुरक्षा स्थिति"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% सुरक्षित (Anti-Hack)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Branding */}
          <div className="flex items-center space-x-3">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectTab('buy'); }} 
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md shadow-amber-600/30 border-2 border-amber-400/80 bg-slate-900 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/logo.png"
                  alt="100 BUILDERS REALITIES Official Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg leading-tight uppercase font-sans">
                    HUNDRED BUILDERS
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold tracking-widest text-amber-600 uppercase">
                    REALITIES
                  </span>
                  <span className="text-[9px] font-semibold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded tracking-normal hidden sm:inline-block border border-amber-200">
                    100% Purity & Surety
                  </span>
                </div>
              </div>
            </a>

              {/* City Selector dropdown */}
              <div className="relative hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
                <MapPin className="w-4 h-4 text-amber-600 mr-1.5" />
                <select
                  id="header-city-select"
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-800 pr-6 py-1 focus:outline-none cursor-pointer hover:text-amber-600 transition"
                >
                  <option value="All Cities" className="text-slate-800 bg-white font-semibold">
                    🌐 {lang === 'hi' ? 'सभी शहर (All Cities)' : 'All Cities (Pan India)'}
                  </option>
                  <option value={ALL_CHHATTISGARH_OPTION} className="text-amber-700 bg-amber-50 font-bold">
                    ⭐ {ALL_CHHATTISGARH_OPTION}
                  </option>
                  <option value={ALL_MADHYA_PRADESH_OPTION} className="text-emerald-700 bg-emerald-50 font-bold">
                    ⭐ {ALL_MADHYA_PRADESH_OPTION}
                  </option>
                  <optgroup label="📍 Chhattisgarh (छत्तीसगढ़ के 33+ शहर)">
                    {CHHATTISGARH_CITIES.map((city) => (
                      <option key={city} value={city} className="text-slate-800 bg-white font-normal">
                        {city} (CG)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📍 Madhya Pradesh (मध्य प्रदेश के सभी 55+ जिले व शहर)">
                    {MADHYA_PRADESH_CITIES.map((city) => (
                      <option key={city} value={city} className="text-slate-800 bg-white font-normal">
                        {city} (MP)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏙️ Other Major Metros">
                    {OTHER_METRO_CITIES.map((city) => (
                      <option key={city} value={city} className="text-slate-800 bg-white font-normal">
                        {city}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
          </div>

          {/* Center Category Links (Buy, Rent, Commercial, Plots) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-tab-buy"
              onClick={() => onSelectTab('buy')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'buy'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.buy}
            </button>
            <button
              id="nav-tab-rent"
              onClick={() => onSelectTab('rent')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'rent'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.rent}
            </button>
            <button
              id="nav-tab-commercial"
              onClick={() => onSelectTab('commercial')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'commercial'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.commercial}
            </button>
            <button
              id="nav-tab-plot"
              onClick={() => onSelectTab('plot')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'plot'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.plots}
            </button>
            <button
              id="nav-tab-agriculture"
              onClick={() => onSelectTab('agriculture')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'agriculture'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60'
              }`}
            >
              {t.agriculture}
            </button>
            <button
              id="nav-tab-lease"
              onClick={() => onSelectTab('lease')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'lease'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-300 font-bold'
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-indigo-50/60'
              }`}
            >
              {t.lease}
            </button>
          </nav>

          {/* Right Action Icons & Post Property Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Indian Language Switcher (All 24+ Indian Languages) */}
            <button
              id="header-language-toggle"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-xs font-bold text-slate-800 shadow-2xs transition cursor-pointer"
              title="भारत की भाषा बदलें (Select Indian Language - 24+ Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-black text-slate-900">{currentLangObj.nameNative}</span>
              <span className="text-[10px] text-amber-600 font-bold">▼</span>
            </button>

            {/* Compare Drawer Trigger */}
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className="relative p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer hidden sm:block"
              title={t.compare}
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Shortlist / Favorites Drawer Trigger */}
            <button
              id="header-shortlist-btn"
              onClick={onOpenShortlist}
              className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title={t.shortlist}
            >
              <Heart className={`w-5 h-5 ${shortlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Advertisement Packages (सशुल्क विज्ञापन पैकेज) */}
            {onOpenAdPackages && (
              <button
                id="header-ad-packages-btn"
                onClick={onOpenAdPackages}
                className="hidden xl:flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                title="सशुल्क विज्ञापन पैकेज - व्यक्ति, बिल्डर, ब्रोकर व संस्था (₹199 से)"
              >
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>{lang === 'hi' ? 'विज्ञापन पैकेज' : 'Ad Packages'}</span>
                <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                  ₹199+
                </span>
              </button>
            )}

            {/* Career Care (ब्रोकर पार्टनर साइन-अप - 100% फ्री) */}
            <button
              id="header-career-care-btn"
              onClick={onOpenCareerCare}
              className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-900 border border-amber-300/90 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
              title="करियर केयर - HUNDRED BUILDERS REALITIES ब्रोकर पार्टनर साइन-अप (100% नि:शुल्क)"
            >
              <Briefcase className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? 'करियर केयर' : 'Career Care'}</span>
              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                FREE
              </span>
            </button>

            {/* Post Property Button (MagicBricks/99acres style prominent CTA) */}
            <button
              id="header-post-property-btn"
              onClick={onOpenPostProperty}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm shadow-amber-500/20 hover:shadow-md transition cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.postPropertyBtn}</span>
              <span className="sm:hidden">{t.postPropertyShort}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-100">
            <img
              src="/logo.png"
              alt="100 BUILDERS REALITIES Logo"
              className="w-9 h-9 rounded-full object-cover border border-amber-400 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-900 leading-tight">HUNDRED BUILDERS REALITIES</span>
              <span className="text-[10px] text-amber-700 font-semibold">100% Purity & Surety • Across India</span>
            </div>
          </div>

          {/* Mobile Indian Language Quick Switcher */}
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>भारत की भाषाएं (Language):</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                  {currentLangObj.nameNative}
                </span>
              </div>
              <button
                id="mobile-all-languages-btn"
                onClick={() => { setLangModalOpen(true); setMobileMenuOpen(false); }}
                className="text-xs font-black text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                सभी 24+ भाषाएं →
              </button>
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {INDIAN_LANGUAGES.filter((l) => l.popular).map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => {
                    handleLanguageSelect(langItem.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                    langItem.code === lang
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {langItem.nameNative}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-500">{t.citySelect}:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => { onSelectCity(e.target.value); setMobileMenuOpen(false); }}
              className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded max-w-[200px]"
            >
              <option value="All Cities">🌐 All Cities (सभी शहर)</option>
              <option value={ALL_CHHATTISGARH_OPTION}>⭐ {ALL_CHHATTISGARH_OPTION}</option>
              <option value={ALL_MADHYA_PRADESH_OPTION}>⭐ {ALL_MADHYA_PRADESH_OPTION}</option>
              <optgroup label="📍 Chhattisgarh (छत्तीसगढ़)">
                {CHHATTISGARH_CITIES.map((city) => (
                  <option key={city} value={city}>{city} (CG)</option>
                ))}
              </optgroup>
              <optgroup label="📍 Madhya Pradesh (मध्य प्रदेश)">
                {MADHYA_PRADESH_CITIES.map((city) => (
                  <option key={city} value={city}>{city} (MP)</option>
                ))}
              </optgroup>
              <optgroup label="🏙️ Other Metros">
                {OTHER_METRO_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => { onSelectTab('buy'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'buy' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {t.buy}
            </button>
            <button
              onClick={() => { onSelectTab('rent'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'rent' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {t.rent}
            </button>
            <button
              onClick={() => { onSelectTab('commercial'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'commercial' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {t.commercial}
            </button>
            <button
              onClick={() => { onSelectTab('plot'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'plot' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {t.plots}
            </button>
            <button
              id="mobile-nav-tab-agriculture"
              onClick={() => { onSelectTab('agriculture'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'agriculture' ? 'bg-emerald-700 text-white ring-2 ring-emerald-400' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}
            >
              🌱 {t.agriculture}
            </button>
            <button
              id="mobile-nav-tab-lease"
              onClick={() => { onSelectTab('lease'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-center font-bold text-sm ${activeTab === 'lease' ? 'bg-indigo-700 text-white ring-2 ring-indigo-400' : 'bg-indigo-50 text-indigo-950 border border-indigo-200'}`}
            >
              📄 {t.lease}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {/* Advertisement Packages in Mobile Menu */}
            {onOpenAdPackages && (
              <button
                onClick={() => { onOpenAdPackages(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-md border border-amber-400 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/30 flex items-center justify-center text-white">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black text-white">सशुल्क विज्ञापन पैकेज (Paid Ads)</div>
                    <div className="text-[10px] text-amber-100 font-medium">बिल्डर, ब्रोकर, इन्वेस्टर व संस्था • ₹199 से शुरू</div>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-950 text-amber-300 font-black px-2 py-0.5 rounded-full shadow-xs uppercase">
                  EXPLORE
                </span>
              </button>
            )}

            {/* Career Care in Mobile Menu */}
            <button
              onClick={() => { onOpenCareerCare(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white font-bold text-sm shadow-md border border-amber-500/40 cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-black text-white">करियर केयर (ब्रोकर साइन-अप)</div>
                  <div className="text-[10px] text-amber-300 font-medium">HUNDRED BUILDERS पार्टनर बनें • 100% फ्री</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full shadow-xs uppercase">
                FREE
              </span>
            </button>

            {/* Post Property in Mobile Menu */}
            <button
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-sm cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-white" />
                <span>{t.postPropertyBtn}</span>
              </div>
              <span className="text-[10px] bg-white text-amber-700 font-black px-1.5 py-0.5 rounded uppercase">
                FREE
              </span>
            </button>

            <button
              onClick={() => { onOpenEmiCalc(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-slate-800 font-semibold text-sm hover:bg-slate-100"
            >
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>{t.emiCalculator}</span>
              </div>
              <span className="text-xs text-amber-600 font-bold">Calculate</span>
            </button>
            <button
              onClick={() => { onOpenValuation(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-slate-800 font-semibold text-sm hover:bg-slate-100"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t.valuationTool}</span>
              </div>
              <span className="text-xs text-amber-600 font-bold">Estimate</span>
            </button>
            <button
              onClick={() => { onOpenCompare(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-slate-800 font-semibold text-sm hover:bg-slate-100"
            >
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>{t.compare} ({compareCount})</span>
              </div>
            </button>

            {onOpenSecurityTrust && (
              <button
                onClick={() => { onOpenSecurityTrust(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-sm hover:bg-emerald-100"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% सुरक्षित (Anti-Hack Shield)</span>
                </div>
                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive All Indian Languages Modal */}
      <IndianLanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLang={lang}
        onSelectLanguage={handleLanguageSelect}
      />
    </header>
  );
};
