import React, { useState } from 'react';
import { 
  X, 
  Megaphone, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Handshake, 
  Gem, 
  Award, 
  CheckCircle2, 
  Star, 
  PhoneCall, 
  MessageSquare, 
  Copy, 
  QrCode, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Send
} from 'lucide-react';
import { 
  ADVERTISEMENT_LISTING_PACKAGES, 
  FEATURED_ADDON_PACKAGES, 
  ROLE_SPECIAL_PACKAGES, 
  ADVERTISEMENT_DISCLAIMER_TEXT, 
  AD_PAYMENT_CONFIG,
  AdPackage,
  FeaturedAddonPackage,
  RoleSpecialPackage
} from '../data/advertisementPackages';
import { Language } from '../data/translations';

interface AdvertisementPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  preselectedPackageId?: string;
  onPostPropertyDirect?: () => void;
}

type TabType = 'listings' | 'roles' | 'featured' | 'disclaimer';

export const AdvertisementPackagesModal: React.FC<AdvertisementPackagesModalProps> = ({
  isOpen,
  onClose,
  lang,
  preselectedPackageId,
  onPostPropertyDirect
}) => {
  const isHi = lang === 'hi';
  const disclaimer = isHi ? ADVERTISEMENT_DISCLAIMER_TEXT.hi : ADVERTISEMENT_DISCLAIMER_TEXT.en;

  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    price: number;
    duration: string;
    adsCount: string;
    type: 'listing' | 'role' | 'featured';
  } | null>(() => {
    if (preselectedPackageId) {
      const p = ADVERTISEMENT_LISTING_PACKAGES.find(item => item.id === preselectedPackageId);
      if (p) {
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          duration: p.durationText,
          adsCount: p.adsTextHi,
          type: 'listing'
        };
      }
    }
    return null;
  });

  // Booking Form State
  const [advertiserName, setAdvertiserName] = useState('');
  const [advertiserPhone, setAdvertiserPhone] = useState('');
  const [advertiserWhatsApp, setAdvertiserWhatsApp] = useState('');
  const [advertiserCity, setAdvertiserCity] = useState('');
  const [advertiserType, setAdvertiserType] = useState('Individual (व्यक्ति)');
  const [propertyNote, setPropertyNote] = useState('');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const handleSelectListingPackage = (pkg: AdPackage) => {
    setSelectedPackage({
      id: pkg.id,
      name: isHi ? pkg.nameHi : pkg.name,
      price: pkg.price,
      duration: isHi ? pkg.durationText : pkg.durationTextEn,
      adsCount: isHi ? pkg.adsTextHi : pkg.adsText,
      type: 'listing'
    });
    setBookingSuccess(false);
  };

  const handleSelectRolePackage = (pkg: RoleSpecialPackage) => {
    setSelectedPackage({
      id: pkg.id,
      name: isHi ? pkg.titleHi : pkg.title,
      price: pkg.price,
      duration: isHi ? pkg.billingPeriodHi : pkg.billingPeriod,
      adsCount: isHi ? pkg.listingsLimitTextHi : pkg.listingsLimitText,
      type: 'role'
    });
    setBookingSuccess(false);
  };

  const handleSelectFeaturedPackage = (pkg: FeaturedAddonPackage) => {
    setSelectedPackage({
      id: pkg.id,
      name: isHi ? pkg.titleHi : pkg.title,
      price: pkg.price,
      duration: `${pkg.days} ${isHi ? 'दिन' : 'Days'}`,
      adsCount: isHi ? 'फीचर्ड बूस्ट (शीर्ष पर प्रदर्शन)' : 'Top Priority Featured Boost',
      type: 'featured'
    });
    setBookingSuccess(false);
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(AD_PAYMENT_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleWhatsAppBooking = () => {
    if (!disclaimerAccepted) {
      alert(isHi ? 'कृपया नियम व सत्यता की विधिक जिम्मेदारी स्वीकार करने के लिए चेकबॉक्स पर टिक करें।' : 'Please accept the mandatory disclaimer checkbox before proceeding.');
      return;
    }

    const pkgName = selectedPackage ? selectedPackage.name : 'Advertisement Package';
    const pkgPrice = selectedPackage ? selectedPackage.price : 0;
    const pkgDuration = selectedPackage ? selectedPackage.duration : '';

    const message = `*📢 100 BUILDERS REALITIES – ADVERTISEMENT INQUIRY*
---------------------------------------
*पैकेज का नाम:* ${pkgName}
*शुल्क:* ₹${pkgPrice.toLocaleString()} (${pkgDuration})
*विज्ञापनदाता का नाम:* ${advertiserName || 'Not specified'}
*श्रेणी:* ${advertiserType}
*मोबाइल:* ${advertiserPhone || 'Not specified'}
*WhatsApp:* ${advertiserWhatsApp || advertiserPhone || 'Not specified'}
*शहर:* ${advertiserCity || 'All Cities'}
*विवरण:* ${propertyNote || 'Interested in activating property ads'}
---------------------------------------
*विधिक घोषणा:* विज्ञापनदाता ने प्रमाणित किया है कि प्रॉपर्टी/प्रोजेक्ट विवरण की सत्यता की जिम्मेदारी विज्ञापनदाता की है।

कृपया इस पैकेज को एक्टिवेट करने की प्रक्रिया साझा करें।`;

    const url = `https://wa.me/${AD_PAYMENT_CONFIG.officialWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setBookingSuccess(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclaimerAccepted) {
      alert(isHi ? 'कृपया नियम व सत्यता की विधिक जिम्मेदारी स्वीकार करने के लिए चेकबॉक्स पर टिक करें।' : 'Please accept the mandatory disclaimer checkbox before proceeding.');
      return;
    }
    if (!advertiserPhone.trim()) {
      alert(isHi ? 'कृपया अपना संपर्क मोबाइल नंबर दर्ज करें।' : 'Please enter your contact mobile number.');
      return;
    }
    setBookingSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-5 sm:px-8 py-5 border-b border-amber-500/30 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-md shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-md">
                  100 BUILDERS REALITIES
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                  ₹199 से शुरू
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-1">
                {isHi ? 'सशुल्क विज्ञापन पैकेज (Advertisement Packages)' : 'Paid Advertisement Packages'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-1">
                {isHi 
                  ? 'व्यक्ति, संस्था, सोसाइटी, बिल्डर, रियल-एस्टेट इन्वेस्टर और ब्रोकर हेतु विशेष प्रचार योजनाएं' 
                  : 'Tailored Marketing Packages for Individuals, Builders, Brokers, Institutions & Investors'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 ml-2"
            title="बंद करें (Close)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-4 sm:px-8 py-2.5 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => { setActiveTab('listings'); setSelectedPackage(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'listings'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isHi ? '📢 ऑल-इन-वन विज्ञापन पैकेज (Starter to Business)' : 'Listing Packages'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('roles'); setSelectedPackage(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'roles'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isHi ? '🏢 बिल्डर, ब्रोकर व इन्वेस्टर स्पेशल' : 'Builder, Broker & Investor'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('featured'); setSelectedPackage(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'featured'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{isHi ? '⭐ फीचर्ड ऐड-ऑन (Featured Boost)' : 'Featured Boost'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('disclaimer'); setSelectedPackage(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'disclaimer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? '📜 विधिक अस्वीकरण व नियम (Terms)' : 'Legal Disclaimer & Terms'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

          {/* Selected Package Booking Banner if chosen */}
          {selectedPackage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-400 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shrink-0 mt-0.5">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      {isHi ? 'चयनित पैकेज' : 'Selected Package'}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {selectedPackage.duration}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {selectedPackage.name} — ₹{selectedPackage.price.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {selectedPackage.adsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <a
                  href="#booking-activation-section"
                  className="flex-1 md:flex-none px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-sm transition text-center"
                >
                  {isHi ? 'एक्टिवेशन फॉर्म भरें ↓' : 'Fill Activation Form ↓'}
                </a>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl transition"
                >
                  {isHi ? 'हटाएं' : 'Clear'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Listing Packages */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                    <span>📢 100 BUILDERS REALITIES – ADVERTISEMENT PACKAGES</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isHi 
                      ? 'अपनी आवश्यकतानुसार अवधि और विज्ञापनों की संख्या वाला आदर्श पैकेज चुनें' 
                      : 'Choose the ideal duration and ad quota suited to your real estate marketing needs'}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full w-fit">
                  {isHi ? '6 फ्लेक्सिबल प्लान्स' : '6 Flexible Plans'}
                </span>
              </div>

              {/* Grid of 6 packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ADVERTISEMENT_LISTING_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/40 shadow-lg ring-2 ring-amber-300' 
                          : pkg.popular 
                          ? 'border-purple-300 bg-purple-50/30 shadow-md' 
                          : pkg.bestValue
                          ? 'border-slate-800 bg-slate-900 text-white shadow-xl'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${pkg.badgeBg}`}>
                          {isHi ? pkg.nameHi : pkg.name}
                        </span>

                        {pkg.popular && (
                          <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>POPULAR</span>
                          </span>
                        )}

                        {pkg.bestValue && (
                          <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>BEST VALUE</span>
                          </span>
                        )}
                      </div>

                      {/* Pricing & Duration */}
                      <div className="mb-4">
                        <div className="flex items-baseline space-x-1.5">
                          <span className={`text-2xl sm:text-3xl font-black ${pkg.bestValue ? 'text-amber-300' : 'text-slate-900'}`}>
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-semibold">
                              ₹{pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-1.5 text-xs font-bold">
                          <span className={`px-2 py-0.5 rounded-md ${pkg.bestValue ? 'bg-slate-800 text-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                            📅 {isHi ? pkg.durationText : pkg.durationTextEn}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-extrabold ${pkg.bestValue ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-100 text-emerald-800'}`}>
                            🏠 {isHi ? pkg.adsTextHi : pkg.adsText}
                          </span>
                        </div>

                        <p className={`text-xs mt-2.5 line-clamp-2 ${pkg.bestValue ? 'text-slate-300' : 'text-slate-600'}`}>
                          {isHi ? pkg.descriptionHi : pkg.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 mb-5 text-xs">
                        {(isHi ? pkg.featuresHi : pkg.features).map((feat, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pkg.bestValue ? 'text-amber-400' : 'text-emerald-600'}`} />
                            <span className={pkg.bestValue ? 'text-slate-200' : 'text-slate-700 font-medium'}>
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectListingPackage(pkg)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center space-x-2 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-md'
                            : pkg.bestValue
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>{isSelected ? (isHi ? 'चयनित है ✓' : 'Selected ✓') : (isHi ? 'यह पैकेज चुनें' : 'Choose Plan')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Role-Based Packages (Builder, Broker, Investor) */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-slate-200">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isHi ? '🏢 विशेष श्रेणीवार पैकेज (Builder, Broker & Investor)' : 'Specialized Role Packages'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isHi 
                    ? 'बिल्डर, कॉलोनाइजर, रियल एस्टेट ब्रोकर, सहकारी समिति एवं निवेशकों के लिए संपूर्ण डिजिटल मार्केटिंग' 
                    : 'Turnkey marketing and lead-generation solutions designed for your specific industry role'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {ROLE_SPECIAL_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl p-6 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 shadow-xl ring-2 ring-amber-300'
                          : pkg.role === 'builder'
                          ? 'border-amber-300 bg-gradient-to-b from-amber-50/60 to-white shadow-md'
                          : pkg.role === 'broker'
                          ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white shadow-md'
                          : 'border-purple-300 bg-gradient-to-b from-purple-50/60 to-white shadow-md'
                      }`}
                    >
                      <div>
                        {/* Role Icon & Title */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                            pkg.role === 'builder' ? 'bg-amber-600 text-white' : pkg.role === 'broker' ? 'bg-emerald-600 text-white' : 'bg-purple-700 text-white'
                          }`}>
                            {pkg.role === 'builder' && <Building2 className="w-6 h-6" />}
                            {pkg.role === 'broker' && <Handshake className="w-6 h-6" />}
                            {pkg.role === 'investor' && <Gem className="w-6 h-6" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              {isHi ? pkg.badgeTextHi : pkg.badgeText}
                            </span>
                            <h4 className="text-base font-black text-slate-900 leading-tight">
                              {isHi ? pkg.titleHi : pkg.title}
                            </h4>
                          </div>
                        </div>

                        {/* Price & Billing */}
                        <div className="py-3 px-4 rounded-xl bg-white border border-slate-200 mb-4">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {isHi ? pkg.billingPeriodHi.replace(`₹${pkg.price.toLocaleString()}`, '') : pkg.billingPeriod}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-amber-800 mt-1">
                            {isHi ? pkg.listingsLimitTextHi : pkg.listingsLimitText}
                          </div>
                        </div>

                        {/* Target Audience */}
                        <div className="mb-4 text-xs font-semibold text-slate-600 flex items-center space-x-1.5">
                          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{isHi ? pkg.targetAudienceHi : pkg.targetAudience}</span>
                        </div>

                        {/* Bullet Highlights requested by user */}
                        <div className="space-y-2 mb-6">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                            {isHi ? 'पैकेज में क्या शामिल है:' : 'Package Inclusions:'}
                          </span>
                          {(isHi ? pkg.highlightsHi : pkg.highlights).map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-slate-800 font-semibold">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Select Action Button */}
                      <button
                        onClick={() => handleSelectRolePackage(pkg)}
                        className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center space-x-2 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-md'
                            : pkg.role === 'builder'
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                            : pkg.role === 'broker'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-purple-700 hover:bg-purple-800 text-white shadow-sm'
                        }`}
                      >
                        <span>{isSelected ? (isHi ? 'पैकेज चयनित है ✓' : 'Package Selected ✓') : (isHi ? 'यह पैकेज एक्टिवेट करें' : 'Activate Package')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Featured Addon Packages */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    ⭐ Featured Advertisement Add-ons
                  </h3>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {isHi 
                    ? 'जो विज्ञापन सामान्य लिस्टिंग से ऊपर दिखाना चाहते हैं उनके लिए विशेष फीचर्ड बूस्ट:' 
                    : 'For advertisers wanting their listing pinned above all standard listings on city and category pages:'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED_ADDON_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-lg ring-2 ring-amber-300'
                          : 'border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg">
                            ⭐ FEATURED
                          </span>
                          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            {pkg.days} {isHi ? 'दिन' : 'Days'}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900">
                          {isHi ? pkg.titleHi : pkg.title}
                        </h4>

                        <div className="mt-2 mb-4">
                          <span className="text-3xl font-black text-amber-600">
                            ₹{pkg.price}
                          </span>
                          <span className="text-xs text-slate-500 ml-1 font-semibold">
                            / {pkg.days} {isHi ? 'दिनों के लिए' : 'Days'}
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-amber-200 mb-4 text-[11px] font-bold text-amber-950">
                          🎯 {isHi ? pkg.recommendedForHi : pkg.recommendedFor}
                        </div>

                        <div className="space-y-2 mb-6 text-xs">
                          {(isHi ? pkg.featuresHi : pkg.features).map((f, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span className="text-slate-700 font-semibold">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectFeaturedPackage(pkg)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center space-x-2 ${
                          isSelected
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                        }`}
                      >
                        <span>{isSelected ? (isHi ? 'चयनित है ✓' : 'Selected ✓') : (isHi ? 'फीचर्ड बूस्ट जोड़ें' : 'Add Featured Boost')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Legal Disclaimer & Terms */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-400 shadow-sm space-y-3">
                <div className="flex items-center space-x-2.5 text-amber-900">
                  <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
                  <h3 className="text-base sm:text-lg font-black">
                    {disclaimer.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed bg-white p-3.5 rounded-xl border border-amber-300">
                  {disclaimer.primaryStatement}
                </p>

                <div className="space-y-2 text-xs text-slate-700 pt-2">
                  {disclaimer.points.map((pt, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="font-black text-amber-700 shrink-0">{i + 1}.</span>
                      <span className="font-semibold leading-normal">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Booking & Activation Form (Shown whenever user selects or scrolls down) */}
          <div id="booking-activation-section" className="pt-6 border-t-2 border-slate-200">
            <div className="bg-slate-50 p-5 sm:p-7 rounded-2xl border border-slate-300 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                    <span>📝 {isHi ? 'विज्ञापन पैकेज एक्टिवेशन एवं संपर्क फॉर्म' : 'Ad Package Activation & Booking'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {selectedPackage 
                      ? (isHi ? `चयनित: ${selectedPackage.name} (₹${selectedPackage.price.toLocaleString()})` : `Selected: ${selectedPackage.name} (₹${selectedPackage.price.toLocaleString()})`)
                      : (isHi ? 'कृपया ऊपर से कोई भी पैकेज चुनें अथवा नीचे विवरण भरें:' : 'Please select a package from above or fill in your requirements:')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${AD_PAYMENT_CONFIG.officialPhone}`}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{AD_PAYMENT_CONFIG.officialPhone}</span>
                  </a>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-emerald-950">
                    {isHi ? 'विज्ञापन पैकेज अनुरोध सफलतापूर्वक दर्ज हुआ!' : 'Package Request Received Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900 font-semibold max-w-lg mx-auto">
                    {isHi 
                      ? 'हमारी रियल एस्टेट एडवरटाइजिंग टीम तुरंत आपसे WhatsApp एवं कॉल पर संपर्क करेगी और आपकी लिस्टिंग सक्रिय करेगी।' 
                      : 'Our advertising team will contact you shortly on WhatsApp/Phone to activate your property advertisement.'}
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                    >
                      {isHi ? 'नया विज्ञापन पैकेज चुनें' : 'Select Another Package'}
                    </button>
                    {onPostPropertyDirect && (
                      <button
                        onClick={() => {
                          onClose();
                          onPostPropertyDirect();
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        {isHi ? 'प्रॉपर्टी विवरण पोस्ट करें →' : 'Post Property Details →'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Advertiser Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'विज्ञापनदाता / कंपनी का नाम *' : 'Advertiser / Company Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isHi ? 'उदा: राजेश शर्मा / श्री बिल्डर्स' : 'e.g. Rajesh Sharma / Shri Builders'}
                        value={advertiserName}
                        onChange={(e) => setAdvertiserName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'मोबाइल नंबर (कॉल हेतु) *' : 'Contact Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765-43210"
                        value={advertiserPhone}
                        onChange={(e) => setAdvertiserPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'WhatsApp नंबर' : 'WhatsApp Number'}
                      </label>
                      <input
                        type="tel"
                        placeholder={isHi ? 'WhatsApp नंबर (यदि भिन्न हो)' : 'WhatsApp (if different)'}
                        value={advertiserWhatsApp}
                        onChange={(e) => setAdvertiserWhatsApp(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'शहर / राज्य' : 'City & State'}
                      </label>
                      <input
                        type="text"
                        placeholder={isHi ? 'उदा: रायपुर, बिलासपुर, इंदौर, भोपाल' : 'e.g. Raipur, Bilaspur, Indore'}
                        value={advertiserCity}
                        onChange={(e) => setAdvertiserCity(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* Advertiser Role / Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'आपकी श्रेणी (Advertiser Type)' : 'Advertiser Category'}
                      </label>
                      <select
                        value={advertiserType}
                        onChange={(e) => setAdvertiserType(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold text-slate-800"
                      >
                        <option value="Individual (व्यक्ति)">व्यक्ति (Individual Owner)</option>
                        <option value="Builder / Developer (बिल्डर)">बिल्डर / डेवलपर (Builder / Developer)</option>
                        <option value="Broker / Agent (ब्रोकर)">ब्रोकर / एजेंट (Broker / Property Dealer)</option>
                        <option value="Society / Institution (संस्था/सोसाइटी)">संस्था / सोसाइटी (Institution / Society)</option>
                        <option value="Real Estate Investor (इन्वेस्टर)">रियल-एस्टेट इन्वेस्टर (Real Estate Investor)</option>
                      </select>
                    </div>

                    {/* Property / Project Note */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {isHi ? 'प्रॉपर्टी/प्रोजेक्ट विवरण (संक्षेप में)' : 'Brief Property/Project Note'}
                      </label>
                      <input
                        type="text"
                        placeholder={isHi ? 'उदा: 2 BHK फ्लैट, 1500 sqft प्लॉट, 5 एकड़ जमीन' : 'e.g. 2 BHK Flat, 1500 sqft plot'}
                        value={propertyNote}
                        onChange={(e) => setPropertyNote(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Mandatory Legal Disclaimer Checkbox */}
                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400">
                    <label className="flex items-start space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={disclaimerAccepted}
                        onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-400 text-amber-600 focus:ring-amber-500 mt-0.5 shrink-0 cursor-pointer"
                      />
                      <div className="text-xs text-slate-900 font-bold leading-normal">
                        <span className="text-red-600 font-black">[{isHi ? 'अनिवार्य विधिक घोषणा' : 'Mandatory Declaration'}]: </span>
                        {disclaimer.declarationCheckbox}
                      </div>
                    </label>
                  </div>

                  {/* Payment Info Toggle (UPI / QR) */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                      className="text-xs font-black text-amber-700 hover:text-amber-800 flex items-center space-x-1.5 cursor-pointer underline"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{showPaymentInfo ? (isHi ? 'ऑनलाइन भुगतान विवरण छिपाएं' : 'Hide Payment Details') : (isHi ? 'ऑफिशियल UPI / QR कोड व बैंक विवरण देखें' : 'View Official UPI / QR Details')}</span>
                    </button>
                  </div>

                  {/* Payment Details Drawer */}
                  {showPaymentInfo && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="text-center md:text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Official UPI ID
                        </span>
                        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                          <span className="font-mono text-xs sm:text-sm font-black text-slate-900 truncate">
                            {AD_PAYMENT_CONFIG.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={copyUpiToClipboard}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-amber-600 cursor-pointer transition shrink-0"
                            title="Copy UPI"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copiedUpi && (
                          <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                            ✓ UPI ID क्लिपबोर्ड पर कॉपी हो गई!
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">
                          {AD_PAYMENT_CONFIG.accountName}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-slate-900">{isHi ? 'भुगतान के विकल्प:' : 'Accepted Modes:'}</div>
                        <div>• Google Pay, PhonePe, Paytm, BHIM</div>
                        <div>• {AD_PAYMENT_CONFIG.bankName}</div>
                        <div>• Helpline: {AD_PAYMENT_CONFIG.officialPhone}</div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isHi ? 'पेमेंट UTR / Transaction No. (वैकल्पिक)' : 'UTR / Transaction ID (Optional)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isHi ? 'उदा: 425109876543' : 'e.g. 425109876543'}
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submission Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    
                    {/* Primary Button: Instant WhatsApp Connect */}
                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      disabled={!disclaimerAccepted}
                      className={`flex-1 w-full py-3.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md cursor-pointer ${
                        disclaimerAccepted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-98'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isHi ? 'WhatsApp पर तुरंत एक्टिवेट करें (Fastest)' : 'Activate via Official WhatsApp'}</span>
                    </button>

                    {/* Secondary Button: Submit Online */}
                    <button
                      type="submit"
                      disabled={!disclaimerAccepted}
                      className={`flex-1 w-full py-3.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer ${
                        disclaimerAccepted
                          ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-98'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isHi ? 'ऑनलाइन एक्टिवेशन रिक्वेस्ट भेजें' : 'Submit Activation Request'}</span>
                    </button>

                  </div>
                </form>
              )}

            </div>
          </div>

          {/* Persistent Disclaimer at Bottom */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-slate-900 block mb-0.5">
                {isHi ? 'कानूनी अस्वीकरण (Statutory Notice):' : 'Statutory Disclaimer:'}
              </span>
              <span>
                {disclaimer.primaryStatement}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="sticky bottom-0 z-10 bg-slate-100 px-5 sm:px-8 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Purity & Surety • Official Portal Packages</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-bold transition cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
