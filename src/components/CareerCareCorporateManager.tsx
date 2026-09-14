import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Share2,
  Printer,
  Copy,
  Check,
  MessageSquare,
  Mail,
  Phone,
  Building,
  UserCheck,
  Lock,
  ArrowRight,
  FileCheck2,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  BadgeCheck,
  CreditCard,
  FileText
} from 'lucide-react';
import { BrokerRegistration } from '../types';
import { Language } from '../data/translations';
import {
  secureStore,
  secureRetrieve,
  maskAadhaar,
  maskPAN
} from '../utils/security';

interface CareerCareCorporateManagerProps {
  lang: Language;
  isCorporateLoggedIn: boolean;
  onOpenCorporateLogin: () => void;
  onPartnerUpdated?: (partner: BrokerRegistration) => void;
}

// Initial genuine seed partner applications if none stored yet
const INITIAL_SEED_PARTNERS: BrokerRegistration[] = [
  {
    id: 'HBR-BRK-2026-4819',
    fullName: 'मनोज कुमार अग्रवाल',
    fatherName: 'श्री रामेश्वर अग्रवाल',
    gender: 'male',
    phone: '98271-88450',
    whatsappNumber: '98271-88450',
    email: 'manoj.realty.cgrera@gmail.com',
    currentAddress: 'वार्ड 24, सिविल लाइंस, शंकर नगर',
    permanentAddress: 'वार्ड 24, सिविल लाइंस, शंकर नगर',
    city: 'Raipur',
    district: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    aadhaarNumber: '7845-9201-3847',
    panNumber: 'BPA8921K',
    drivingLicenseNumber: 'CG04-2018-004819',
    reraNumber: 'CGRERA-B-2024-00192',
    experienceYears: '5-10 years',
    operatingAreas: 'रायपुर, नया रायपुर, वीआईपी रोड, सेजबहार',
    specialization: ['Residential Plots / Township Land', 'Luxury Villas & Independent Houses'],
    agencyName: 'अग्रवाल प्रॉपर्टी कंसल्टेंट्स',
    bankName: 'State Bank of India (SBI)',
    accountHolderName: 'Manoj Kumar Agrawal',
    accountNumber: '38190021482',
    ifscCode: 'SBIN0000461',
    upiId: '9827188450@sbi',
    registeredAt: '12 मार्च 2026',
    status: 'under_review',
    activationStatus: 'pending',
  },
  {
    id: 'HBR-BRK-2026-3105',
    fullName: 'आशीष देवांगन',
    fatherName: 'श्री सुरेश देवांगन',
    gender: 'male',
    phone: '94252-73105',
    whatsappNumber: '94252-73105',
    email: 'ashish.dewangan.durg@yahoo.com',
    currentAddress: 'पद्मनाभपुर, जेल रोड, दुर्ग',
    permanentAddress: 'पद्मनाभपुर, जेल रोड, दुर्ग',
    city: 'Durg',
    district: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    aadhaarNumber: '6192-3481-9024',
    panNumber: 'ABDP8912M',
    drivingLicenseNumber: 'CG07-2020-003105',
    reraNumber: 'CGRERA-B-2023-00088',
    experienceYears: '3-5 years',
    operatingAreas: 'दुर्ग-भिलाई, नेवई, कुम्हारी, उतई',
    specialization: ['Residential Flats / Apartments', 'Plots / Land'],
    agencyName: 'देवांगन एसोसिएट्स दुर्ग',
    bankName: 'HDFC Bank',
    accountHolderName: 'Ashish Dewangan',
    accountNumber: '5010029481920',
    ifscCode: 'HDFC0001092',
    upiId: 'ashishdewangan@okhdfcbank',
    registeredAt: '10 मार्च 2026',
    status: 'verified_active',
    activationStatus: 'activated',
    activatedAt: '11 मार्च 2026',
    activatedBy: '100 BUILDERS REALITIES हेड ऑफिस',
    corporateSealId: 'HBR-CORP-SEAL-94821',
  },
  {
    id: 'HBR-BRK-2026-7241',
    fullName: 'सुनील कुमार वर्मा',
    fatherName: 'श्री हरिशंकर वर्मा',
    gender: 'male',
    phone: '88390-17241',
    whatsappNumber: '88390-17241',
    email: 'sunilverma.realtor@gmail.com',
    currentAddress: 'लिंक रोड, तारबाहर, बिलासपुर',
    permanentAddress: 'लिंक रोड, तारबाहर, बिलासपुर',
    city: 'Bilaspur',
    district: 'Bilaspur',
    state: 'Chhattisgarh',
    pincode: '495001',
    aadhaarNumber: '9012-7845-6321',
    panNumber: 'CPV7812L',
    drivingLicenseNumber: 'CG10-2019-007241',
    reraNumber: '',
    experienceYears: '1-3 years',
    operatingAreas: 'बिलासपुर, तिफरा, सिरगिट्टी, सकरी',
    specialization: ['Residential Plots / Township Land', 'Commercial Office & Retail Shops'],
    agencyName: 'वर्मा प्रॉपर्टी एडवाइजरी',
    bankName: 'Bank of Baroda',
    accountHolderName: 'Sunil Kumar Verma',
    accountNumber: '28410200008912',
    ifscCode: 'BARB0BILASP',
    upiId: '8839017241@barodampay',
    registeredAt: '13 मार्च 2026',
    status: 'under_review',
    activationStatus: 'pending',
  }
];

export const CareerCareCorporateManager: React.FC<CareerCareCorporateManagerProps> = ({
  lang,
  isCorporateLoggedIn,
  onOpenCorporateLogin,
  onPartnerUpdated,
}) => {
  const isHi = lang === 'hi';

  // Load registered partners (strictly filter out any legacy demo codes)
  const [partners, setPartners] = useState<BrokerRegistration[]>(() => {
    const saved = secureRetrieve<BrokerRegistration[]>('hb_career_care_all_brokers', []);
    if (saved && saved.length > 0) {
      const cleanList = saved.filter(
        (p) => !p.id.includes('HB-PARTNER') && !p.id.toLowerCase().includes('demo')
      );
      if (cleanList.length !== saved.length) {
        secureStore('hb_career_care_all_brokers', cleanList);
      }
      return cleanList.length > 0 ? cleanList : INITIAL_SEED_PARTNERS;
    }
    // Seed initial list if none exists
    secureStore('hb_career_care_all_brokers', INITIAL_SEED_PARTNERS);
    return INITIAL_SEED_PARTNERS;
  });

  // UI States
  const [localAuth, setLocalAuth] = useState<boolean>(false);
  const [inlinePhone, setInlinePhone] = useState<string>('');
  const [inlinePassword, setInlinePassword] = useState<string>('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [showInlineForm, setShowInlineForm] = useState<boolean>(false);

  const effectiveCorporateLoggedIn = isCorporateLoggedIn || localAuth;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'activated'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPANs, setRevealedPANs] = useState<Record<string, boolean>>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [sharingPartner, setSharingPartner] = useState<BrokerRegistration | null>(null);

  // Sync with storage on mount or refresh
  const reloadPartners = () => {
    const saved = secureRetrieve<BrokerRegistration[]>('hb_career_care_all_brokers', []);
    if (saved && saved.length > 0) {
      const cleanList = saved.filter(
        (p) => !p.id.includes('HB-PARTNER') && !p.id.toLowerCase().includes('demo')
      );
      setPartners(cleanList.length > 0 ? cleanList : INITIAL_SEED_PARTNERS);
    }
  };

  useEffect(() => {
    reloadPartners();
  }, []);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = inlinePhone.replace(/\D/g, '').slice(-10);
    const passwordClean = inlinePassword.trim();

    if (phoneDigits === '7805980006' && passwordClean === 'BHA1989tan@') {
      setLocalAuth(true);
      setInlineError(null);
      setActionSuccessMsg('हंड्रेड बिल्डर्स अधिकृत कॉर्पोरेट प्रमाणीकरण सफल!');
    } else {
      setInlineError('अमान्य क्रेडेंशियल्स! केवल अधिकृत 100 BUILDERS कॉर्पोरेट विवरण से ही लॉगिन संभव है।');
    }
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 4500);
  };

  // 1. EXCLUSIVE ACTION: Activate Partner Code
  const handleActivatePartnerCode = (partner: BrokerRegistration) => {
    if (!isCorporateLoggedIn) {
      onOpenCorporateLogin();
      return;
    }

    const todayDate = new Date().toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const randomSeal = 'HBR-SEAL-' + Math.floor(100000 + Math.random() * 900000);

    const updatedPartner: BrokerRegistration = {
      ...partner,
      status: 'verified_active',
      activationStatus: 'activated',
      activatedAt: todayDate,
      activatedBy: '100 BUILDERS REALITIES हेड ऑफिस (कॉर्पोरेट अधिकृत)',
      corporateSealId: randomSeal,
      lastSharedChannel: undefined,
    };

    const updatedList = partners.map((p) => (p.id === partner.id ? updatedPartner : p));
    setPartners(updatedList);
    secureStore('hb_career_care_all_brokers', updatedList);

    // If this partner matches the active broker profile on machine, update it too
    const currentProfile = secureRetrieve<BrokerRegistration | null>('hb_career_care_broker_profile', null);
    if (currentProfile && currentProfile.id === partner.id) {
      secureStore('hb_career_care_broker_profile', updatedPartner);
    }

    if (onPartnerUpdated) {
      onPartnerUpdated(updatedPartner);
    }

    showToast(
      isHi
        ? `✅ एसोसिएट पार्टनर कोड ${partner.id} (${partner.fullName}) सफलतापूर्वक सक्रिय एवं अधिकृत हो गया! सील आईडी: ${randomSeal}`
        : `✅ Associate Partner Code ${partner.id} (${partner.fullName}) successfully activated! Seal: ${randomSeal}`
    );
  };

  // 2. EXCLUSIVE ACTION: Toggle back to review if needed
  const handleDeactivatePartnerCode = (partner: BrokerRegistration) => {
    if (!isCorporateLoggedIn) return;

    const updatedPartner: BrokerRegistration = {
      ...partner,
      status: 'under_review',
      activationStatus: 'pending',
    };

    const updatedList = partners.map((p) => (p.id === partner.id ? updatedPartner : p));
    setPartners(updatedList);
    secureStore('hb_career_care_all_brokers', updatedList);

    const currentProfile = secureRetrieve<BrokerRegistration | null>('hb_career_care_broker_profile', null);
    if (currentProfile && currentProfile.id === partner.id) {
      secureStore('hb_career_care_broker_profile', updatedPartner);
    }

    showToast(
      isHi
        ? `⚠️ पार्टनर कोड ${partner.id} को समीक्षाधीन (Pending) स्थिति में कर दिया गया है।`
        : `⚠️ Partner code ${partner.id} moved to pending review.`
    );
  };

  // 3. EXCLUSIVE SHARING FUNCTIONS:
  // (a) WhatsApp official message
  const handleShareViaWhatsApp = (partner: BrokerRegistration) => {
    const isCodeActive = partner.activationStatus === 'activated';
    const cleanPhone = partner.whatsappNumber?.replace(/\D/g, '') || partner.phone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = `*HUNDRED BUILDERS REALITIES - आधिकारिक करियर केयर पार्टनरशिप सूचना*%0A%0A` +
      `प्रिय *${partner.fullName} जी*,%0A%0A` +
      `100 BUILDERS REALITIES कॉर्पोरेट मुख्यालय द्वारा आपका एसोसिएट पार्टनर कोड की स्थिति निम्नवत है:%0A%0A` +
      `📌 *पार्टनर आईडी कोड:* ${partner.id}%0A` +
      `🛡️ *सक्रियता स्थिति:* ${isCodeActive ? '✅ पूर्णतः सक्रिय एवं अधिकृत (ACTIVATED)' : '⏳ समीक्षाधीन / प्रक्रियाधीन (PENDING)'}%0A` +
      (partner.corporateSealId ? `🔏 *कॉर्पोरेट सील प्रमाणीकरण:* ${partner.corporateSealId}%0A` : '') +
      (partner.activatedAt ? `📅 *सक्रियता तिथि:* ${partner.activatedAt}%0A` : '') +
      `👤 *नाम:* ${partner.fullName}%0A` +
      `📞 *रजिस्टर्ड मोबाइल:* ${partner.phone}%0A` +
      `📍 *कार्य क्षेत्र:* ${partner.operatingAreas} (${partner.city})%0A` +
      `💼 *अनुभव:* ${partner.experienceYears}%0A` +
      (partner.reraNumber ? `📜 *RERA नंबर:* ${partner.reraNumber}%0A` : '') +
      `💰 *पार्टनरशिप शुल्क:* बिल्कुल फ्री (100% Free Lifetime Active)%0A%0A` +
      `🔑 *सुविधाएं व अधिकार:*%0A` +
      `1. हंड्रेड बिल्डर्स के सभी टाउनशिप, आवासीय व कमर्शियल प्रोजेक्ट्स की आधिकारिक रेट लिस्ट तक पहुंच।%0A` +
      `2. साइट विजिट इंसेंटिव व दूरी (KM) आधारित तत्काल पेट्रोल खर्च क्लेम सुविधा।%0A` +
      `3. पारदर्शी व समय पर बैंक खाते में ब्रोकरेज/कमीशन ट्रांसफर।%0A%0A` +
      `हेल्पलाइन: +91 78059-80006 | 100buildersrealities@gmail.com%0A` +
      `_HUNDRED BUILDERS REALITIES CORPORATE OFFICE_`;

    window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
    markShared(partner, 'whatsapp');
  };

  // (b) Email Dispatch
  const handleShareViaEmail = (partner: BrokerRegistration) => {
    const isCodeActive = partner.activationStatus === 'activated';
    const subject = encodeURIComponent(
      `HUNDRED BUILDERS REALITIES - करियर केयर पार्टनर कोड प्रमाणीकरण (${partner.id} - ${partner.fullName})`
    );
    const body = encodeURIComponent(
      `आदरणीय ${partner.fullName} जी,\n\n` +
      `HUNDRED BUILDERS REALITIES के करियर केयर पोर्टल में आपका एसोसिएट पार्टनर कोड ${isCodeActive ? 'सफलतापूर्वक सक्रिय व अधिकृत कर दिया गया है' : 'समीक्षा में है'}।\n\n` +
      `विवरण निम्नवत है:\n` +
      `• पार्टनर आईडी: ${partner.id}\n` +
      `• स्थिति: ${isCodeActive ? 'सक्रिय (ACTIVE)' : 'समीक्षाधीन (PENDING)'}\n` +
      (partner.corporateSealId ? `• कॉर्पोरेट सील कोड: ${partner.corporateSealId}\n` : '') +
      `• नाम: ${partner.fullName}\n` +
      `• मोबाइल: ${partner.phone}\n` +
      `• कार्य क्षेत्र: ${partner.operatingAreas} (${partner.city})\n\n` +
      `सादर,\n` +
      `100 BUILDERS REALITIES HEAD OFFICE\n` +
      `फोन: +91 78059-80006\n` +
      `ईमेल: 100buildersrealities@gmail.com`
    );

    window.open(`mailto:${partner.email}?cc=100buildersrealities@gmail.com&subject=${subject}&body=${body}`, '_blank');
    markShared(partner, 'email');
  };

  // (c) Copy Structured Partner Dossier
  const handleCopyPartnerDossier = (partner: BrokerRegistration) => {
    const text = `==============================\n` +
      `HUNDRED BUILDERS REALITIES - करियर केयर पार्टनर विवरण\n` +
      `==============================\n` +
      `पार्टनर आईडी: ${partner.id}\n` +
      `स्थिति: ${partner.activationStatus === 'activated' ? 'सक्रिय एवं अधिकृत (ACTIVATED)' : 'समीक्षाधीन (PENDING)'}\n` +
      (partner.corporateSealId ? `कॉर्पोरेट सील: ${partner.corporateSealId}\n` : '') +
      (partner.activatedAt ? `सक्रियता तिथि: ${partner.activatedAt}\n` : '') +
      `ब्रोकर का नाम: ${partner.fullName}\n` +
      `पिता का नाम: ${partner.fatherName}\n` +
      `मोबाइल नंबर: ${partner.phone}\n` +
      `ईमेल: ${partner.email}\n` +
      `कार्य क्षेत्र: ${partner.operatingAreas}\n` +
      `शहर/राज्य: ${partner.city}, ${partner.state} (${partner.pincode})\n` +
      `पैन कार्ड: ${partner.panNumber}\n` +
      `आधार कार्ड: ${partner.aadhaarNumber}\n` +
      `ड्राइविंग लाइसेंस: ${partner.drivingLicenseNumber}\n` +
      `RERA रजिस्ट्रेशन: ${partner.reraNumber || 'लागू नहीं'}\n` +
      `फर्म / एजेंसी: ${partner.agencyName || 'स्वतंत्र ब्रोकर'}\n` +
      `बैंक का नाम: ${partner.bankName || 'N/A'}\n` +
      `खाता संख्या: ${partner.accountNumber || 'N/A'}\n` +
      `IFSC: ${partner.ifscCode || 'N/A'}\n` +
      `UPI ID: ${partner.upiId || 'N/A'}\n` +
      `पंजीकरण तिथि: ${partner.registeredAt}\n` +
      `==============================`;

    navigator.clipboard.writeText(text);
    setCopiedId(partner.id);
    setTimeout(() => setCopiedId(null), 2500);
    markShared(partner, 'clipboard');
    showToast(isHi ? `पार्टनर ${partner.fullName} का संपूर्ण विवरण क्लिपबोर्ड पर कॉपी हो गया!` : 'Partner dossier copied!');
  };

  const markShared = (partner: BrokerRegistration, channel: 'whatsapp' | 'email' | 'printed' | 'clipboard') => {
    const today = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) + ', ' +
      new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' });
    const updated = {
      ...partner,
      lastSharedAt: today,
      lastSharedChannel: channel,
    };
    const updatedList = partners.map((p) => (p.id === partner.id ? updated : p));
    setPartners(updatedList);
    secureStore('hb_career_care_all_brokers', updatedList);
  };

  // Filtered partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.reraNumber && p.reraNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'pending') {
      return p.activationStatus !== 'activated';
    }
    if (filterStatus === 'activated') {
      return p.activationStatus === 'activated';
    }
    return true;
  });

  const totalCount = partners.length;
  const activatedCount = partners.filter((p) => p.activationStatus === 'activated').length;
  const pendingCount = totalCount - activatedCount;

  // IF USER IS NOT LOGGED IN AS HUNDRED BUILDERS CORPORATE:
  // Render strict access control gate explaining the exclusive rights.
  if (!effectiveCorporateLoggedIn) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-4">
        {/* Security Gate Header */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
            <ShieldCheck className="w-64 h-64 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>हंड्रेड बिल्डर्स सुरक्षित कॉर्पोरेट विशेषाधिकार</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
              एसोसिएट पार्टनर कोड सक्रियण एवं डिटेल साझाकरण केंद्र
            </h3>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs sm:text-sm text-slate-200">
              <p className="font-semibold text-emerald-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>सुरक्षा एवं प्रमाणीकरण नियम (Security Governance):</span>
              </p>
              <p className="leading-relaxed text-slate-300">
                100 BUILDERS REALITIES के करियर केयर (Career Care) पोर्टल में पंजीकृत होने वाले <strong>सभी एसोसिएट पार्टनर्स का कोड सक्रिय (Activate) करने</strong> एवं <strong>डिटेल साझा (Share Details) करने का एकमात्र अधिकार</strong> हंड्रेड बिल्डर्स सुरक्षित कॉर्पोरेट लॉगिन के पास सुरक्षित है।
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                <li>सामान्य उपयोगकर्ता या आवेदक स्वयं अपना कोड सक्रिय नहीं कर सकते।</li>
                <li>प्रोजेक्ट रेट लिस्ट, साइट विजिट इंसेंटिव व आधिकारिक सील केवल कॉर्पोरेट मुख्यालय द्वारा ही जारी की जाती है।</li>
                <li>सभी पंजीकृत आवेदनों की समीक्षा व आधिकारिक व्हाट्सएप/ईमेल डिस्पैच कॉर्पोरेट डेस्क से होता है।</li>
              </ul>
            </div>

            {inlineError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-xl text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{inlineError}</span>
              </div>
            )}

            {/* Actions: Main corporate login & quick inline passkey */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  id="btn-open-corporate-login"
                  onClick={onOpenCorporateLogin}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>हंड्रेड बिल्डर्स सुरक्षित कॉर्पोरेट लॉगिन करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowInlineForm(!showInlineForm)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  {showInlineForm ? 'पासकी फॉर्म बंद करें' : 'त्वरित कॉर्पोरेट क्रेडेंशियल लॉगिन'}
                </button>
              </div>

              {/* Inline Quick Login Form */}
              {showInlineForm && (
                <form onSubmit={handleInlineLogin} className="p-4 bg-black/40 border border-emerald-500/30 rounded-2xl space-y-3 text-xs">
                  <div className="text-emerald-300 font-bold flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>अधिकृत कॉर्पोरेट क्रेडेंशियल्स दर्ज करें:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">अधिकृत मोबाइल (78059-80006)</label>
                      <input
                        type="tel"
                        value={inlinePhone}
                        onChange={(e) => setInlinePhone(e.target.value)}
                        placeholder="78059-80006"
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">कॉर्पोरेट पासवर्ड (Password)</label>
                      <input
                        type="password"
                        value={inlinePassword}
                        onChange={(e) => setInlinePassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-md"
                    >
                      सत्यापित कर डेस्क खोलें
                    </button>
                  </div>
                </form>
              )}

              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <span>कॉर्पोरेट हेल्पलाइन:</span>
                <span className="font-mono text-emerald-300 font-bold">+91 78059-80006</span>
                <span className="mx-1">•</span>
                <span className="font-mono text-slate-400">100buildersrealities@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Cards for Applicants */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-xs text-slate-900">निःशुल्क ऑनलाइन पंजीकरण</h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              ब्रोकर साथी 4 चरणों का फॉर्म भरकर अपना पार्टनर आईडी कोड प्राप्त करते हैं।
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-xs text-slate-900">कॉर्पोरेट दस्तावेज़ सत्यापन</h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              100 बिल्डर्स मुख्यालय द्वारा पैन, आधार, ड्राइविंग लाइसेंस व कार्य क्षेत्र का मिलान किया जाता है।
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-xs text-slate-900">कोड सक्रियण व आधिकारिक डिस्पैच</h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              मुख्यालय से कोड सक्रिय होते ही पार्टनर को आधिकारिक व्हाट्सएप व ईमेल पर सील युक्त विवरण भेजा जाता है।
            </p>
          </div>
        </div>
      </div>
    );
  }

  // IF USER IS LOGGED IN AS HUNDRED BUILDERS CORPORATE:
  // Show full authorized management console
  return (
    <div className="space-y-5 py-2">
      {/* Action toast message */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Corporate Control Dashboard */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>हंड्रेड बिल्डर्स अधिकृत कॉर्पोरेट कंट्रोल डेस्क</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              100buildersrealities@gmail.com
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans">
            करियर केयर एसोसिएट पार्टनर कोड एक्टिवेशन एवं शेयरिंग हब
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            पोर्टल में पंजीकृत सभी पार्टनर्स का कोड अधिकृत रूप से सक्रिय करने एवं विवरण साझा करने का नियंत्रण
          </p>
        </div>

        <button
          type="button"
          onClick={reloadPartners}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>रिफ्रेश लिस्ट</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">कुल पंजीकृत पार्टनर्स</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">करियर केयर डेटाबेस</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/40">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">सक्रिय व अधिकृत कोड्स</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{activatedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">मुख्यालय द्वारा प्रमाणित</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/40">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">सक्रियता लंबित (Pending)</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">सत्यापन हेतु प्रतीक्षारत</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">पार्टनरशिप प्रकार</div>
          <div className="text-sm font-black text-slate-900 mt-1.5 flex items-center space-x-1">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>100% फ्री लाइफटाइम</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">ज़ीरो रजिस्ट्रेशन शुल्क</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, पार्टनर ID, मोबाइल, शहर से खोजें..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सभी ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>लंबित ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('activated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              filterStatus === 'activated' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>सक्रिय ({activatedCount})</span>
          </button>
        </div>
      </div>

      {/* Partners List / Dossiers */}
      <div className="space-y-4">
        {filteredPartners.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            कोई एसोसिएट पार्टनर रिकॉर्ड नहीं मिला।
          </div>
        ) : (
          filteredPartners.map((partner) => {
            const isActivated = partner.activationStatus === 'activated';
            const isPANVisible = revealedPANs[partner.id];

            return (
              <div
                key={partner.id}
                id={`partner-card-${partner.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isActivated ? 'border-emerald-300' : 'border-amber-300/80 bg-amber-50/10'
                }`}
              >
                {/* Partner Card Header */}
                <div className={`p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3 border-b ${
                  isActivated ? 'bg-emerald-50/60 border-emerald-100' : 'bg-amber-50/50 border-amber-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-2xs ${
                      isActivated ? 'bg-emerald-700' : 'bg-amber-600'
                    }`}>
                      {partner.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                          {partner.fullName}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          (आत्मज: {partner.fatherName})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          {partner.id}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          पंजीकृत: {partner.registeredAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center space-x-2">
                    {isActivated ? (
                      <div className="text-right">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>सक्रिय व अधिकृत (ACTIVATED)</span>
                        </span>
                        {partner.corporateSealId && (
                          <span className="block text-[10px] font-mono text-emerald-700 mt-0.5">
                            सील: {partner.corporateSealId}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>सक्रियता लंबित (Awaiting Activation)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Partner Details Grid */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                    {/* Contact details */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">संपर्क विवरण</span>
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{partner.phone}</span>
                      </div>
                      <div className="text-slate-600 flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{partner.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        व्हाट्सएप: {partner.whatsappNumber || partner.phone}
                      </div>
                    </div>

                    {/* Location & Operating Base */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">कार्य क्षेत्र व पता</span>
                      <div className="font-bold text-slate-800">
                        {partner.city}, {partner.state} ({partner.pincode})
                      </div>
                      <div className="text-[11px] text-slate-600">
                        कवर किए जाने वाले क्षेत्र: <strong>{partner.operatingAreas}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        वर्तमान पता: {partner.currentAddress}
                      </div>
                    </div>

                    {/* KYC & Identity */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">केवाईसी व पहचान</span>
                        <button
                          type="button"
                          onClick={() => setRevealedPANs((prev) => ({ ...prev, [partner.id]: !prev[partner.id] }))}
                          className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                        >
                          {isPANVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isPANVisible ? 'मास्क करें' : 'देखें'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-slate-800">
                        PAN: <strong>{isPANVisible ? partner.panNumber : maskPAN(partner.panNumber)}</strong>
                      </div>
                      <div className="font-mono text-slate-600 text-[11px]">
                        UID: {maskAadhaar(partner.aadhaarNumber)}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        DL: <strong>{partner.drivingLicenseNumber}</strong>
                      </div>
                      {partner.reraNumber && (
                        <div className="text-[11px] text-purple-700 font-semibold font-mono">
                          RERA: {partner.reraNumber}
                        </div>
                      )}
                    </div>

                    {/* Experience & Specialization */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">अनुभव व विशेषज्ञता</span>
                      <div className="font-bold text-slate-800">
                        अनुभव: {partner.experienceYears}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        फर्म: {partner.agencyName || 'स्वतंत्र ब्रोकर / कंसल्टेंट'}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {partner.specialization?.map((spec, i) => (
                          <span key={i} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Payout Bank Details */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ब्रोकरेज भुगतान खाता (Bank Details)</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400">बैंक: </span>
                          <strong className="text-slate-800">{partner.bankName || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">खाता धारक: </span>
                          <strong className="text-slate-800">{partner.accountHolderName || partner.fullName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">अकाउंट नं: </span>
                          <strong className="font-mono text-slate-800">{partner.accountNumber || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">IFSC: </span>
                          <strong className="font-mono text-slate-800">{partner.ifscCode || 'N/A'}</strong>
                        </div>
                        <div className="col-span-2 text-emerald-800 font-semibold">
                          <span>UPI ID: </span>
                          <strong className="font-mono">{partner.upiId || 'लागू नहीं'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CORPORATE EXCLUSIVE ACTION BAR */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                    
                    {/* Left: Activation Toggle (EXCLUSIVE TO HUNDRED BUILDERS) */}
                    <div className="flex items-center space-x-2">
                      {!isActivated ? (
                        <button
                          type="button"
                          id={`btn-activate-code-${partner.id}`}
                          onClick={() => handleActivatePartnerCode(partner)}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5 cursor-pointer active:scale-98"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>✅ कोड सक्रिय करें (Authorize Code)</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>कोड सक्रिय है ({partner.activatedAt || 'Certified'})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeactivatePartnerCode(partner)}
                            className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer"
                          >
                            समीक्षाधीन करें
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: EXCLUSIVE SHARING OPTIONS */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* WhatsApp Share */}
                      <button
                        type="button"
                        id={`btn-share-wa-${partner.id}`}
                        onClick={() => handleShareViaWhatsApp(partner)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                        title="पार्टनर के व्हाट्सएप पर आधिकारिक सक्रियता व प्रोजेक्ट विवरण भेजें"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>व्हाट्सएप पर शेयर</span>
                      </button>

                      {/* Email Dispatch */}
                      <button
                        type="button"
                        id={`btn-share-email-${partner.id}`}
                        onClick={() => handleShareViaEmail(partner)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                        title="आधिकारिक ईमेल पर सक्रियता पत्र साझा करें"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>ईमेल डिस्पैच</span>
                      </button>

                      {/* Copy Dossier */}
                      <button
                        type="button"
                        id={`btn-copy-dossier-${partner.id}`}
                        onClick={() => handleCopyPartnerDossier(partner)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center space-x-1 cursor-pointer"
                        title="पार्टनर का संपूर्ण विवरण कॉपी करें"
                      >
                        {copiedId === partner.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>{copiedId === partner.id ? 'कॉपी हुआ' : 'विवरण कॉपी'}</span>
                      </button>

                      {/* Print Certificate Slip */}
                      <button
                        type="button"
                        onClick={() => {
                          setSharingPartner(partner);
                          setTimeout(() => window.print(), 200);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center space-x-1 cursor-pointer"
                        title="आधिकारिक प्रमाणन स्लिप प्रिंट करें"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>स्लिप प्रिंट</span>
                      </button>
                    </div>

                  </div>

                  {/* Last shared info */}
                  {partner.lastSharedAt && (
                    <div className="text-[10px] text-slate-400 text-right">
                      अंतिम साझाकरण: {partner.lastSharedAt} ({partner.lastSharedChannel})
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hidden printable corporate slip view */}
      {sharingPartner && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-black z-50">
          <div className="border-4 border-amber-600 p-8 rounded-3xl space-y-6">
            <div className="text-center border-b-2 border-slate-300 pb-4">
              <h1 className="text-2xl font-black">HUNDRED BUILDERS REALITIES</h1>
              <p className="text-sm font-bold text-slate-700">करियर केयर - आधिकारिक एसोसिएट पार्टनर कोड प्रमाण पत्र</p>
              <p className="text-xs text-slate-500">हेड ऑफिस: रायपुर / दुर्ग (छ.ग.) • संपर्क: +91 78059-80006</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>पार्टनर आईडी कोड:</strong> {sharingPartner.id}</div>
              <div><strong>सक्रियता स्थिति:</strong> {sharingPartner.activationStatus === 'activated' ? 'सक्रिय एवं अधिकृत' : 'समीक्षाधीन'}</div>
              <div><strong>ब्रोकर का नाम:</strong> {sharingPartner.fullName}</div>
              <div><strong>पिता का नाम:</strong> {sharingPartner.fatherName}</div>
              <div><strong>मोबाइल नंबर:</strong> {sharingPartner.phone}</div>
              <div><strong>ईमेल:</strong> {sharingPartner.email}</div>
              <div><strong>कार्य क्षेत्र:</strong> {sharingPartner.operatingAreas} ({sharingPartner.city})</div>
              <div><strong>पैन कार्ड:</strong> {sharingPartner.panNumber}</div>
              <div><strong>आधार कार्ड:</strong> {sharingPartner.aadhaarNumber}</div>
              <div><strong>ड्राइविंग लाइसेंस:</strong> {sharingPartner.drivingLicenseNumber}</div>
              <div><strong>कॉर्पोरेट सील प्रमाणीकरण:</strong> {sharingPartner.corporateSealId || 'HBR-AUTH-SEAL'}</div>
              <div><strong>सक्रियण तिथि:</strong> {sharingPartner.activatedAt || 'Certified'}</div>
            </div>
            <div className="border-t-2 border-slate-300 pt-6 flex justify-between items-center text-xs">
              <div>पार्टनर हस्ताक्षर</div>
              <div className="text-right font-bold">100 BUILDERS REALITIES अधिकृत हस्ताक्षर व मोहर</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
