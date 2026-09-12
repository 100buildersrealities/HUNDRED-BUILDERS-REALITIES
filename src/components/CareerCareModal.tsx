import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Check,
  Printer,
  MessageSquare,
  Sparkles,
  Download,
  AlertCircle,
  FileCheck2,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Share2,
  Car
} from 'lucide-react';
import { BrokerRegistration } from '../types';
import { Language } from '../data/translations';
import { CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES } from '../data/mockProperties';
import { BrokerSiteVisitPlan } from './BrokerSiteVisitPlan';
import {
  sanitizeText,
  validateUploadedFile,
  maskAadhaar,
  maskPAN,
  checkRateLimit,
  isHoneypotTriggered,
  secureStore,
  secureRetrieve
} from '../utils/security';

interface CareerCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CareerCareModal: React.FC<CareerCareModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  // Active step in registration form
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeView, setActiveView] = useState<'form' | 'success' | 'my_id' | 'site_visit_plan'>('form');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dob: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
    sameAsCurrentAddress: true,
    city: 'Raipur',
    district: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    aadhaarNumber: '',
    panNumber: '',
    drivingLicenseNumber: '',
    reraNumber: '',
    experienceYears: '1-3 years',
    operatingAreas: 'Raipur, Durg-Bhilai, Naya Raipur',
    specializations: ['Residential Flats', 'Plots / Land'] as string[],
    agencyName: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    agreeTerms: false,
  });

  // Attached files mock state
  const [uploadedFiles, setUploadedFiles] = useState<{
    aadhaarDoc?: string;
    panDoc?: string;
    dlDoc?: string;
    profilePhoto?: string;
  }>({});

  // Error validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');

  // Registered Profile (loaded with tamper-evident secure storage)
  const [savedRegistration, setSavedRegistration] = useState<BrokerRegistration | null>(() => {
    return secureRetrieve<BrokerRegistration | null>('hb_career_care_broker_profile', null);
  });

  // Keep saved registration up to date
  useEffect(() => {
    if (savedRegistration && activeView === 'form') {
      // populate default fields if already exists
      setFormData(prev => ({
        ...prev,
        fullName: savedRegistration.fullName || prev.fullName,
        fatherName: savedRegistration.fatherName || prev.fatherName,
        phone: savedRegistration.phone || prev.phone,
        email: savedRegistration.email || prev.email,
        city: savedRegistration.city || prev.city,
        state: savedRegistration.state || prev.state,
      }));
    }
  }, [savedRegistration]);

  if (!isOpen) return null;

  const specializationOptions = [
    { id: 'flats', labelHi: 'रेजिडेंशियल फ्लैट्स / अपार्टमेंट', labelEn: 'Residential Flats / Apartments' },
    { id: 'plots', labelHi: 'रेजिडेंशियल प्लॉट / टाउनशिप भूमि', labelEn: 'Residential Plots / Township Land' },
    { id: 'villas', labelHi: 'लक्जरी विला / स्वतंत्र कोठी', labelEn: 'Luxury Villas & Independent Houses' },
    { id: 'commercial', labelHi: 'कमर्शियल ऑफिस व रिटेल शॉप', labelEn: 'Commercial Office & Retail Shops' },
    { id: 'agri', labelHi: 'फार्म हाउस व कृषि भूमि', labelEn: 'Farm Houses & Agricultural Land' },
    { id: 'builder_floors', labelHi: 'बिल्डर फ्लोर्स व री-सेल', labelEn: 'Builder Floors & Re-sale' },
  ];

  const handleSpecializationToggle = (item: string) => {
    setFormData(prev => {
      const exists = prev.specializations.includes(item);
      if (exists) {
        return { ...prev, specializations: prev.specializations.filter(s => s !== item) };
      } else {
        return { ...prev, specializations: [...prev.specializations, item] };
      }
    });
  };

  const handleFileUpload = (type: 'aadhaarDoc' | 'panDoc' | 'dlDoc' | 'profilePhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateUploadedFile(file);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, [type]: validation.error || 'अमान्य फ़ाइल (Invalid file)' }));
        return;
      }
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[type];
        return copy;
      });
      setUploadedFiles(prev => ({
        ...prev,
        [type]: validation.cleanedName || file.name
      }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'पूरा नाम दर्ज करें (Enter full name)';
    if (!formData.fatherName.trim()) newErrors.fatherName = "पिता का नाम दर्ज करें (Enter father's name)";
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें (Enter 10-digit mobile number)';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'मान्य ईमेल आईडी दर्ज करें (Enter valid email)';
    }
    if (!formData.currentAddress.trim()) newErrors.currentAddress = 'वर्तमान पता दर्ज करें (Enter current address)';
    if (!formData.city.trim()) newErrors.city = 'शहर दर्ज करें (Enter city)';
    if (!formData.pincode.trim() || formData.pincode.length < 6) newErrors.pincode = '6 अंकों का पिनकोड दर्ज करें';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cleanAadhaar = formData.aadhaarNumber.replace(/\s+/g, '');
    if (!cleanAadhaar || cleanAadhaar.length !== 12 || isNaN(Number(cleanAadhaar))) {
      newErrors.aadhaarNumber = '12 अंकों का वैध आधार कार्ड नंबर दर्ज करें (Enter valid 12-digit Aadhaar)';
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.panNumber.trim() || !panRegex.test(formData.panNumber.toUpperCase().trim())) {
      newErrors.panNumber = '10 अंकों का मान्य पैन कार्ड नंबर दर्ज करें (उदा. ABCDE1234F)';
    }
    if (!formData.drivingLicenseNumber.trim()) {
      newErrors.drivingLicenseNumber = 'ड्राइविंग लाइसेंस नंबर दर्ज करें (Enter Driving License number)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'कम से कम 1 कार्य विशेषज्ञता चुनें';
    }
    if (!formData.operatingAreas.trim()) {
      newErrors.operatingAreas = 'कार्य क्षेत्र / पसंदीदा शहर दर्ज करें';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security Guard 1: Bot Honeypot Trap
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[Security Guard] Automated bot submission rejected.');
      return;
    }

    // Security Guard 2: Anti-Spam Rate Limiter (Max 3 submissions per minute)
    const rateCheck = checkRateLimit('career_care_registration', 3, 60000);
    if (!rateCheck.allowed) {
      setErrors({ 
        terms: `सुरक्षा कारणों से बहुत अधिक प्रयास दर्ज किए गए। कृपया ${rateCheck.retryAfterSec} सेकंड बाद पुनः प्रयास करें।` 
      });
      return;
    }

    if (!formData.agreeTerms) {
      setErrors({ terms: 'कृपया नियमों व सत्यता घोषणा पत्र पर सहमति दें' });
      return;
    }

    // Generate random Broker ID: HBR-CAREER-YYYY-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const brokerId = `HBR-BRK-${new Date().getFullYear()}-${randomCode}`;

    // Security Guard 3: Strict Input Sanitization (Anti-XSS)
    const newRegistration: BrokerRegistration = {
      id: brokerId,
      fullName: sanitizeText(formData.fullName, 100),
      fatherName: sanitizeText(formData.fatherName, 100),
      gender: formData.gender,
      dob: formData.dob,
      phone: sanitizeText(formData.phone, 15),
      whatsappNumber: sanitizeText(formData.whatsappNumber || formData.phone, 15),
      email: sanitizeText(formData.email, 100),
      currentAddress: sanitizeText(formData.currentAddress, 300),
      permanentAddress: sanitizeText(formData.sameAsCurrentAddress ? formData.currentAddress : formData.permanentAddress, 300),
      city: sanitizeText(formData.city, 60),
      district: sanitizeText(formData.district || formData.city, 60),
      state: formData.state,
      pincode: sanitizeText(formData.pincode, 10),
      aadhaarNumber: sanitizeText(formData.aadhaarNumber, 16),
      panNumber: sanitizeText(formData.panNumber.toUpperCase(), 12),
      drivingLicenseNumber: sanitizeText(formData.drivingLicenseNumber.toUpperCase(), 30),
      reraNumber: sanitizeText(formData.reraNumber, 50),
      experienceYears: sanitizeText(formData.experienceYears, 20),
      operatingAreas: sanitizeText(formData.operatingAreas, 200),
      specialization: formData.specializations.map(s => sanitizeText(s, 50)),
      agencyName: sanitizeText(formData.agencyName, 100),
      bankName: sanitizeText(formData.bankName, 100),
      accountHolderName: sanitizeText(formData.accountHolderName || formData.fullName, 100),
      accountNumber: sanitizeText(formData.accountNumber, 30),
      ifscCode: sanitizeText(formData.ifscCode.toUpperCase(), 15),
      upiId: sanitizeText(formData.upiId, 60),
      aadhaarDocName: sanitizeText(uploadedFiles.aadhaarDoc || 'Aadhaar_Document.pdf', 80),
      panDocName: sanitizeText(uploadedFiles.panDoc || 'PAN_Card.jpg', 80),
      dlDocName: sanitizeText(uploadedFiles.dlDoc || 'Driving_License.jpg', 80),
      registeredAt: new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'verified_active'
    };

    // Save using tamper-evident checksum storage
    try {
      secureStore('hb_career_care_broker_profile', newRegistration);
      
      // Also add to broker list securely
      const existingList = secureRetrieve<BrokerRegistration[]>('hb_career_care_all_brokers', []);
      secureStore('hb_career_care_all_brokers', [newRegistration, ...existingList]);
    } catch (err) {
      console.error(err);
    }

    setSavedRegistration(newRegistration);
    setActiveView('success');
  };

  const handleShareOnWhatsApp = () => {
    if (!savedRegistration) return;
    const msg = `*HUNDRED BUILDERS REALITIES - करियर केयर (Broker Registration)*%0A%0A` +
      `📌 *पार्टनर आईडी:* ${savedRegistration.id}%0A` +
      `👤 *ब्रोकर नाम:* ${savedRegistration.fullName}%0A` +
      `👨‍👦 *पिता का नाम:* ${savedRegistration.fatherName}%0A` +
      `📞 *मोबाइल:* ${savedRegistration.phone}%0A` +
      `✉️ *ईमेल:* ${savedRegistration.email}%0A` +
      `📍 *कार्य क्षेत्र:* ${savedRegistration.operatingAreas} (${savedRegistration.city}, ${savedRegistration.state})%0A` +
      `🆔 *पैन कार्ड:* ${savedRegistration.panNumber}%0A` +
      `🪪 *आधार कार्ड:* ${savedRegistration.aadhaarNumber}%0A` +
      `🚗 *ड्राइविंग लाइसेंस:* ${savedRegistration.drivingLicenseNumber}%0A` +
      `💼 *अनुभव:* ${savedRegistration.experienceYears}%0A` +
      `💰 *पंजीकरण शुल्क:* बिल्कुल फ्री (100% Free Lifetime Partnership)%0A%0A` +
      `_कृपया मेरा एसोसिएट पार्टनर कोड सक्रिय करें एवं प्रोजेक्ट डिटेल्स साझा करें।_`;

    window.open(`https://wa.me/917805980006?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200/50 my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-5 sm:px-8 py-4 sm:py-5 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-md shadow-amber-500/20 shrink-0">
              <img
                src="/logo.png"
                alt="100 BUILDERS REALITIES Emblem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] sm:text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% फ्री रजिस्ट्रेशन (Zero Fee)</span>
                </span>
                <span className="text-amber-400 text-xs font-semibold hidden md:inline-block">
                  HUNDRED BUILDERS REALITIES
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-1 font-sans">
                करियर केयर (Career Care)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                डायरेक्ट रियल एस्टेट ब्रोकर / चैनल पार्टनर साइन-अप पोर्टल
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {savedRegistration && activeView === 'form' && (
              <button
                type="button"
                onClick={() => setActiveView('my_id')}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold cursor-pointer transition"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>मेरा आईडी कार्ड</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="बंद करें"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Value Highlights Bar */}
        <div className="bg-amber-500/10 border-b border-amber-200/60 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-amber-950 font-semibold gap-2">
          <div className="flex items-center space-x-1.5 text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>सीधे HUNDRED BUILDERS REALITIES प्रोजेक्ट्स से जुड़कर आकर्षक ब्रोकरेज व साइट विजिट इंसेंटिव पाएं</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>लाइफटाइम फ्री मेंबरशिप</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>आधिकारिक पार्टनर कोड</span>
            </span>
          </div>
        </div>

        {/* Primary Career Care Tab Navigation */}
        <div className="bg-slate-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              id="career-care-tab-form"
              onClick={() => setActiveView('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{savedRegistration ? 'ब्रोकर प्रोफाइल (Profile)' : 'ब्रोकर पंजीकरण (Sign Up)'}</span>
            </button>

            <button
              type="button"
              id="career-care-tab-site-visit-plan"
              onClick={() => setActiveView('site_visit_plan')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'site_visit_plan'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>साइट विजिट इनकम प्लान</span>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                NEW
              </span>
            </button>

            {savedRegistration && (
              <button
                type="button"
                id="career-care-tab-my-id"
                onClick={() => setActiveView('my_id')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeView === 'my_id'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>मेरा आईडी कार्ड</span>
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs text-amber-400/90 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>क्षेत्रफल + दूरी = तत्काल पेट्रोल व विजिट इंसेंटिव सुरक्षा</span>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-slate-50">

          {/* VIEW 0: BROKER SITE VISIT EXPENSE & DAILY INCOME PLAN */}
          {activeView === 'site_visit_plan' && (
            <BrokerSiteVisitPlan
              lang={lang}
              savedBroker={savedRegistration}
              onOpenRegister={() => setActiveView('form')}
            />
          )}

          {/* VIEW 1: SUCCESS CONFIRMATION & ID CARD */}
          {activeView === 'success' && savedRegistration && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">बधाई हो! आपका रजिस्ट्रेशन सफल रहा</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  आप HUNDRED BUILDERS REALITIES के अधिकृत रियल एस्टेट ब्रोकर / एसोसिएट पार्टनर के रूप में पंजीकृत हो गए हैं।
                </p>
              </div>

              {/* Digital Broker ID Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-7">
                {/* Card Watermark */}
                <div className="absolute right-3 -bottom-6 opacity-10 pointer-events-none">
                  <img src="/logo.png" alt="" className="w-64 h-64 object-contain" />
                </div>

                <div className="flex items-start justify-between border-b border-amber-500/30 pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-12 h-12 rounded-full border border-amber-400 shadow-md"
                    />
                    <div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                        HUNDRED BUILDERS REALITIES
                      </h4>
                      <p className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                        करियर केयर • अधिकृत ब्रोकर पार्टनर पहचान पत्र
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                      सक्रिय (ACTIVE)
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">100% Free Lifetime</p>
                  </div>
                </div>

                {/* ID Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-sm">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पार्टनर आईडी कोड (Partner ID)</span>
                    <span className="text-base font-black text-amber-300 font-mono tracking-wide">
                      {savedRegistration.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ब्रोकर का नाम (Associate Name)</span>
                    <span className="font-bold text-white text-base">{savedRegistration.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पिता का नाम (Father's Name)</span>
                    <span className="font-medium text-slate-200">{savedRegistration.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">मोबाइल नंबर (Mobile)</span>
                    <span className="font-semibold text-slate-200">{savedRegistration.phone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पैन कार्ड व आधार (KYC Details)</span>
                    <span className="text-xs text-slate-300 font-mono">PAN: {maskPAN(savedRegistration.panNumber)} | UID: {maskAadhaar(savedRegistration.aadhaarNumber)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ड्राइविंग लाइसेंस (DL No.)</span>
                    <span className="text-xs text-slate-300">{savedRegistration.drivingLicenseNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">कार्य क्षेत्र व पता (Operating Base)</span>
                    <span className="text-xs text-slate-200">
                      {savedRegistration.city}, {savedRegistration.state} ({savedRegistration.pincode}) • {savedRegistration.operatingAreas}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-amber-500/30 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>पंजीकरण तिथि: {savedRegistration.registeredAt}</span>
                  <span className="text-amber-300 font-semibold">100% Purity & Surety Certified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleShareOnWhatsApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>व्हाट्सएप पर डिटेल्स भेजें (+91 78059-80006)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('site_visit_plan')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>साइट विजिट इनकम प्लान देखें</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>आईडी स्लिप प्रिंट करें</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-sm text-slate-700 transition cursor-pointer"
                >
                  पोर्टल पर जाएं
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: MY ID CARD (If previously registered) */}
          {activeView === 'my_id' && savedRegistration && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">आपका सक्रिय करियर केयर ब्रोकर प्रोफाइल</h3>
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  नया फॉर्म भरें / विवरण अपडेट करें →
                </button>
              </div>

              {/* ID Card Display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-7">
                <div className="flex items-start justify-between border-b border-amber-500/30 pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-12 h-12 rounded-full border border-amber-400 shadow-md"
                    />
                    <div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                        HUNDRED BUILDERS REALITIES
                      </h4>
                      <p className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                        करियर केयर • आधिकारिक ब्रोकर पार्टनर
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                      वेरिफाइड (ACTIVE)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-sm">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पार्टनर आईडी कोड</span>
                    <span className="text-base font-black text-amber-300 font-mono">{savedRegistration.id}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ब्रोकर का नाम</span>
                    <span className="font-bold text-white text-base">{savedRegistration.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पिता का नाम</span>
                    <span className="font-medium text-slate-200">{savedRegistration.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">मोबाइल नंबर</span>
                    <span className="font-semibold text-slate-200">{savedRegistration.phone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">केवाईसी विवरण (KYC Details)</span>
                    <span className="text-xs text-slate-300 font-mono">PAN: {maskPAN(savedRegistration.panNumber)} | UID: {maskAadhaar(savedRegistration.aadhaarNumber)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ड्राइविंग लाइसेंस</span>
                    <span className="text-xs text-slate-300">{savedRegistration.drivingLicenseNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">पता</span>
                    <span className="text-xs text-slate-200">
                      {savedRegistration.currentAddress}, {savedRegistration.city}, {savedRegistration.state} - {savedRegistration.pincode}
                    </span>
                  </div>
                </div>

                <div className="border-t border-amber-500/30 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>पंजीकृत: {savedRegistration.registeredAt}</span>
                  <span className="text-amber-300 font-semibold">100% Free Partner Program</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('site_visit_plan')}
                  className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>साइट विजिट इनकम प्लान</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareOnWhatsApp}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>व्हाट्सएप पर सहायता लें</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>प्रिंट करें</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: MAIN REGISTRATION FORM */}
          {activeView === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Anti-Bot Honeypot Trap (Hidden from humans, traps bots) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <input
                  type="text"
                  name="user_website_auth_trap"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Multi-step Breadcrumb */}
              <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex flex-col sm:flex-row items-center justify-center p-2 rounded-xl text-xs font-bold transition text-center ${
                    currentStep === 1
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-1 text-[11px]">1</span>
                  <span>व्यक्तिगत व पता</span>
                </button>

                <button
                  type="button"
                  onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                  className={`flex flex-col sm:flex-row items-center justify-center p-2 rounded-xl text-xs font-bold transition text-center ${
                    currentStep === 2
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-1 text-[11px]">2</span>
                  <span>केवाईसी व आईडी</span>
                </button>

                <button
                  type="button"
                  onClick={() => { if (validateStep1() && validateStep2()) setCurrentStep(3); }}
                  className={`flex flex-col sm:flex-row items-center justify-center p-2 rounded-xl text-xs font-bold transition text-center ${
                    currentStep === 3
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-1 text-[11px]">3</span>
                  <span>कार्य व अनुभव</span>
                </button>

                <button
                  type="button"
                  onClick={() => { if (validateStep1() && validateStep2() && validateStep3()) setCurrentStep(4); }}
                  className={`flex flex-col sm:flex-row items-center justify-center p-2 rounded-xl text-xs font-bold transition text-center ${
                    currentStep === 4
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-1 text-[11px]">4</span>
                  <span>पेआउट व सबमिट</span>
                </button>
              </div>

              {/* STEP 1: PERSONAL & ADDRESS DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                    <User className="w-5 h-5 text-amber-600" />
                    <h3 className="font-extrabold text-base sm:text-lg">
                      1. व्यक्तिगत जानकारी एवं संपर्क पता (Personal & Address Details)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पूरा नाम (Full Name) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="जैसे: राहुल कुमार शर्मा"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Father's Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पिता का नाम (Father's Name) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        placeholder="जैसे: श्री रमेश कुमार शर्मा"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                      />
                      {errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName}</p>}
                    </div>

                    {/* Gender & DOB */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">लिंग (Gender)</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="male">पुरुष (Male)</option>
                        <option value="female">महिला (Female)</option>
                        <option value="other">अन्य (Other)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">जन्म तिथि (Date of Birth)</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        व्हाट्सएप नंबर (WhatsApp Number)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                          placeholder="यदि मोबाइल से अलग हो तो"
                          className="w-full pl-12 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Email ID */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ईमेल आईडी (Email ID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="broker.partner@gmail.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Current Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वर्तमान पता (Current Address) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.currentAddress}
                        onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                        placeholder="मकान संख्या, गली/मोहल्ला, कॉलोनी, लैंडमार्क..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      {errors.currentAddress && <p className="text-xs text-red-500 mt-1">{errors.currentAddress}</p>}
                    </div>

                    {/* City, District, State, Pincode */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        शहर (City) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="जैसे: Raipur, Bilaspur, Indore, Bhopal"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">राज्य (State)</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="Chhattisgarh">छत्तीसगढ़ (Chhattisgarh)</option>
                        <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
                        <option value="Maharashtra">महाराष्ट्र (Maharashtra)</option>
                        <option value="Delhi">दिल्ली (Delhi NCR)</option>
                        <option value="Uttar Pradesh">उत्तर प्रदेश (Uttar Pradesh)</option>
                        <option value="Other">अन्य राज्य (Other State)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">जिला (District)</label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="जैसे: रायपुर, दुर्ग, बिलासपुर"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पिनकोड (Pincode) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="492001"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                    </div>

                    {/* Permanent Address Checkbox */}
                    <div className="sm:col-span-2 pt-1">
                      <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sameAsCurrentAddress}
                          onChange={(e) => setFormData({ ...formData, sameAsCurrentAddress: e.target.checked })}
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <span>स्थायी पता वर्तमान पते के समान है (Permanent address is same as current)</span>
                      </label>

                      {!formData.sameAsCurrentAddress && (
                        <div className="mt-3">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            स्थायी पता (Permanent Address)
                          </label>
                          <textarea
                            rows={2}
                            value={formData.permanentAddress}
                            onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                            placeholder="मूल स्थायी निवास का पूरा पता..."
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: KYC & IDENTITY DOCUMENTS */}
              {currentStep === 2 && (
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <h3 className="font-extrabold text-base sm:text-lg">
                      2. पहचान एवं कानूनी दस्तावेज (KYC & Documents)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500">
                    ब्रोकर पार्टनर सत्यापन के लिए कृपया अपने वैध सरकारी पहचान पत्र का नंबर व प्रति दर्ज करें।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">

                    {/* Aadhaar Number */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        आधार कार्ड नंबर (Aadhaar Card Number) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        value={formData.aadhaarNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setFormData({ ...formData, aadhaarNumber: val });
                        }}
                        placeholder="12 अंकों का आधार नंबर दर्ज करें"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                      />
                      {errors.aadhaarNumber && <p className="text-xs text-red-500 mt-1">{errors.aadhaarNumber}</p>}
                      
                      {/* Aadhaar Upload */}
                      <div className="mt-2 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-slate-700">
                            {uploadedFiles.aadhaarDoc ? uploadedFiles.aadhaarDoc : 'आधार कार्ड फोटो / पीडीएफ अपलोड करें'}
                          </span>
                        </div>
                        <label className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold cursor-pointer transition">
                          फ़ाइल चुनें
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('aadhaarDoc', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* PAN Card Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पैन कार्ड नंबर (PAN Card Number) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm uppercase font-mono"
                      />
                      {errors.panNumber && <p className="text-xs text-red-500 mt-1">{errors.panNumber}</p>}
                      
                      {/* PAN Upload */}
                      <div className="mt-2 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">
                            {uploadedFiles.panDoc ? uploadedFiles.panDoc : 'पैन कार्ड कॉपी'}
                          </span>
                        </div>
                        <label className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold cursor-pointer shrink-0 transition">
                          अपलोड
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('panDoc', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Driving License Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ड्राइविंग लाइसेंस नंबर (Driving License Number) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.drivingLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, drivingLicenseNumber: e.target.value.toUpperCase() })}
                        placeholder="जैसे: CG0420220012345"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono uppercase"
                      />
                      {errors.drivingLicenseNumber && <p className="text-xs text-red-500 mt-1">{errors.drivingLicenseNumber}</p>}

                      {/* DL Upload */}
                      <div className="mt-2 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">
                            {uploadedFiles.dlDoc ? uploadedFiles.dlDoc : 'ड्राइविंग लाइसेंस कॉपी'}
                          </span>
                        </div>
                        <label className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold cursor-pointer shrink-0 transition">
                          अपलोड
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('dlDoc', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* RERA Registration (Optional) */}
                    <div className="sm:col-span-2 pt-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        रेरा रजिस्ट्रेशन नंबर (RERA Registration Number - यदि उपलब्ध हो तो)
                      </label>
                      <input
                        type="text"
                        value={formData.reraNumber}
                        onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                        placeholder="उदा. CGRERA010123000... (वैकल्पिक / Optional)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                      />
                      <span className="text-[11px] text-slate-400">यदि आपके पास रेरा एजेंट नंबर नहीं है, तो भी आप निःशुल्क रजिस्ट्रेशन कर सकते हैं।</span>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: WORK PROFILE & EXPERIENCE */}
              {currentStep === 3 && (
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <h3 className="font-extrabold text-base sm:text-lg">
                      3. रियल एस्टेट कार्य अनुभव व क्षेत्र (Broker Profile & Experience)
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Years of Experience */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        रियल एस्टेट में अनुभव (Experience in Real Estate)
                      </label>
                      <select
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="Fresher / New to Real Estate">नया / फ्रेशर (Fresher - शून्य अनुभव)</option>
                        <option value="1-3 years">1 से 3 वर्ष (1-3 years experience)</option>
                        <option value="3-5 years">3 से 5 वर्ष (3-5 years experience)</option>
                        <option value="5-10 years">5 से 10 वर्ष (5-10 years experience)</option>
                        <option value="10+ years">10+ वर्ष (Senior Real Estate Consultant)</option>
                      </select>
                    </div>

                    {/* Specialization checkboxes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        आप किस प्रकार की संपत्तियों में कार्य करते हैं? (Specialization) <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {specializationOptions.map((opt) => {
                          const isSelected = formData.specializations.includes(opt.labelEn);
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => handleSpecializationToggle(opt.labelEn)}
                              className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <span>{opt.labelHi}</span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.specializations && <p className="text-xs text-red-500 mt-1">{errors.specializations}</p>}
                    </div>

                    {/* Operating Areas */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        प्राथमिक कार्य क्षेत्र / शहर (Preferred Operating Cities & Areas) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.operatingAreas}
                        onChange={(e) => setFormData({ ...formData, operatingAreas: e.target.value })}
                        placeholder="उदा. रायपुर, नया रायपुर, भिलाई, बिलासपुर, इंदौर, भोपाल..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      {errors.operatingAreas && <p className="text-xs text-red-500 mt-1">{errors.operatingAreas}</p>}
                    </div>

                    {/* Agency Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        एजेंसी / फर्म का नाम (यदि कोई हो - Agency / Office Name)
                      </label>
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                        placeholder="उदा. शर्मा एसोसिएट्स / इंडिपेंडेंट ब्रोकर"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4: PAYOUT BANK DETAILS & SUBMISSION */}
              {currentStep === 4 && (
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                    <Building className="w-5 h-5 text-amber-600" />
                    <h3 className="font-extrabold text-base sm:text-lg">
                      4. कमीशन भुगतान बैंक खाता (Payout Bank Details)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500">
                    प्रॉपर्टी डील क्लोज होने पर आपकी ब्रोकरेज व कमीशन सीधे इस खाते में ट्रांसफर की जाएगी।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">बैंक का नाम (Bank Name)</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="उदा. SBI / HDFC / ICICI Bank"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">खाता धारक का नाम (Account Holder Name)</label>
                      <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                        placeholder="जैसे बैंक पासबुक में है"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">खाता संख्या (Account Number)</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="बैंक अकाउंट नंबर"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">IFSC कोड (IFSC Code)</label>
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="उदा. SBIN0001234"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm uppercase font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">UPI आईडी (UPI ID for Instant Payout)</label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        placeholder="उदा. yourname@okhdfcbank या 9876543210@paytm"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions Agreement */}
                  <div className="border-t border-slate-200 pt-4 mt-2">
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5 mb-3">
                      <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>HUNDRED BUILDERS REALITIES - करियर केयर प्रतिज्ञा:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>यह रजिस्ट्रेशन <strong>100% बिल्कुल फ्री (Zero Fees)</strong> है। किसी प्रकार का सदस्यता शुल्क नहीं लिया जाता।</li>
                        <li>ब्रोकर को निष्पक्ष, पारदर्शी व समय पर कमीशन भुगतान की गारंटी मिलती है।</li>
                        <li>ग्राहक एवं बिल्डर के साथ सत्य व नैतिक आचरण अनिवार्य है।</li>
                      </ul>
                    </div>

                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 mt-0.5"
                      />
                      <span className="text-xs text-slate-800 font-semibold leading-relaxed">
                        मैं पुष्टि करता/करती हूँ कि मेरे द्वारा दिए गए सभी विवरण (नाम, पिता का नाम, पता, आधार, पैन, ड्राइविंग लाइसेंस) पूर्णतः सत्य हैं। मैं HUNDRED BUILDERS REALITIES के साथ ब्रोकर पार्टनर के रूप में कार्य करने हेतु सहमत हूँ।
                      </span>
                    </label>
                    {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
                  </div>
                </div>
              )}

              {/* Navigation & Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>पिछला स्टेप</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition cursor-pointer"
                  >
                    <span>अगला स्टेप</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition cursor-pointer transform hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>मुफ्त रजिस्ट्रेशन पूरा करें (Submit FREE)</span>
                  </button>
                )}
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
