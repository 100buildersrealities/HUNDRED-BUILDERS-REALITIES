import React, { useState } from 'react';
import {
  Car,
  MapPin,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  Smartphone,
  Camera,
  Layers,
  Fuel,
  TrendingUp,
  Receipt,
  FileCheck,
  Check,
  AlertTriangle,
  RotateCcw,
  Share2
} from 'lucide-react';
import { Language } from '../data/translations';
import { BrokerRegistration } from '../types';

interface BrokerSiteVisitPlanProps {
  lang: Language;
  savedBroker: BrokerRegistration | null;
  onOpenRegister?: () => void;
}

export const BrokerSiteVisitPlan: React.FC<BrokerSiteVisitPlanProps> = ({
  lang,
  savedBroker,
  onOpenRegister,
}) => {
  // Calculator interactive state
  const [landArea, setLandArea] = useState<number>(5); // acres
  const [distanceKm, setDistanceKm] = useState<number>(35); // km one way
  const [isVerifiedCustomer, setIsVerifiedCustomer] = useState<boolean>(true);
  const [isSecondVisit, setIsSecondVisit] = useState<boolean>(false);
  const [isDealBookingBonus, setIsDealBookingBonus] = useState<boolean>(false);
  const [brokerTier, setBrokerTier] = useState<'bronze' | 'silver' | 'gold'>('silver');

  // 6-step Verification Workflow State
  const [verifyStep, setVerifyStep] = useState<number>(1);
  const [brokerIdInput, setBrokerIdInput] = useState<string>(savedBroker?.id || 'HB-PARTNER-7824');
  const [customerName, setCustomerName] = useState<string>('राजेश शर्मा (Rajesh Sharma)');
  const [customerPhone, setCustomerPhone] = useState<string>('9826189000');
  const [propertyVisited, setPropertyVisited] = useState<string>('Royal City Township & Farm Villa, Abhanpur');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [isGpsLocked, setIsGpsLocked] = useState<boolean>(false);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false);
  const [claimSubmitted, setClaimSubmitted] = useState<boolean>(false);

  // Helper functions for incentive calculations
  const calculateAreaIncentive = (acres: number): number => {
    if (acres < 1) return 100;
    if (acres <= 2) return 150;
    if (acres <= 5) return 250;
    if (acres <= 10) return 350;
    if (acres <= 25) return 500;
    if (acres <= 50) return 750;
    return 1000;
  };

  const calculateDistanceIncentive = (km: number): number => {
    if (km <= 10) return 0;
    if (km <= 25) return 100;
    if (km <= 50) return 250;
    if (km <= 75) return 400;
    if (km <= 100) return 600;
    return 800;
  };

  const areaBase = calculateAreaIncentive(landArea);
  const travelIncentive = calculateDistanceIncentive(distanceKm);
  const verifiedBonus = isVerifiedCustomer ? 50 : 0;
  const repeatVisitBonus = isSecondVisit ? 100 : 0;
  const bookingBonus = isDealBookingBonus ? 1000 : 0;

  const rawTotal = areaBase + travelIncentive + verifiedBonus + repeatVisitBonus + bookingBonus;
  
  // Daily caps
  const maxCap = brokerTier === 'bronze' ? 1200 : brokerTier === 'silver' ? 1600 : 2000;
  const totalPayout = Math.min(rawTotal, maxCap);
  const isCapped = rawTotal > maxCap;

  // Verification step handlers
  const handleSendOtp = () => {
    if (!customerPhone || customerPhone.length < 10) return;
    setOtpSent(true);
    setOtpInput('5892'); // Pre-fill mock OTP for quick simulation
  };

  const handleVerifyOtp = () => {
    if (otpInput === '5892' || otpInput.length >= 4) {
      setOtpVerified(true);
      setVerifyStep(4);
    }
  };

  const handleLockGps = () => {
    setIsGpsLocked(true);
  };

  const handleCapturePhoto = () => {
    setIsPhotoCaptured(true);
  };

  const handleCompleteVisitClaim = () => {
    setClaimSubmitted(true);
    setVerifyStep(6);
  };

  const handleResetVerification = () => {
    setVerifyStep(1);
    setOtpSent(false);
    setOtpVerified(false);
    setIsGpsLocked(false);
    setIsPhotoCaptured(false);
    setClaimSubmitted(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & Philosophy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border-2 border-amber-400/40 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                  100 BUILDERS REALITIES
                </span>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  DAILY EXPENSE INCOME
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                ब्रोकर साइट विजिट डेली इनकम प्लान
              </h3>
            </div>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-3.5 py-2 text-right self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-[11px] text-slate-300 block">दैनिक पेट्रोल व यात्रा सुरक्षा</span>
            <span className="text-sm font-black text-amber-300">अप टू ₹2,000 / दिन</span>
          </div>
        </div>

        {/* Tagline & Mission */}
        <div className="mt-4 pt-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-amber-400 font-bold block mb-1">🎯 मूल मंत्र (Core Motto)</span>
            <p className="text-slate-300 leading-relaxed font-semibold">
              “जितनी बड़ी जमीन + जितनी ज्यादा दूरी = उतना ज्यादा Site Visit Incentive”
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 md:col-span-2">
            <span className="text-emerald-400 font-bold block mb-1">⛽ बिना डील के इंतज़ार के दैनिक सुरक्षा</span>
            <p className="text-slate-300 leading-relaxed">
              रियल एस्टेट में ग्राहक को जमीन दिखाने में ब्रोकर का भारी पेट्रोल व समय खर्च होता है। यह प्लान ब्रोकर को डील फाइनल होने का महीनों इंतज़ार किए बिना, हर वास्तविक साइट विजिट का तुरंत पारिश्रमिक सुनिश्चित करता है।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Calculator Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                लाइव इंसेंटिव कैलकुलेटर (Live Incentive Simulator)
              </h4>
              <p className="text-xs text-slate-500">
                Formula: Total Income = Area Base Incentive + Distance Incentive + Verified Bonuses
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg self-start sm:self-auto">
            100% ट्रांसपेरेंट स्लैब
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Land Area Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>जमीन का क्षेत्रफल (Land Area in Acres)</span>
                </label>
                <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {landArea} एकड़ ({landArea * 43560} sq.ft)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="60"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>1 एकड़ (₹150)</span>
                <span>5 एकड़ (₹250)</span>
                <span>10 एकड़ (₹350)</span>
                <span>25 एकड़ (₹500)</span>
                <span>50+ एकड़ (₹1,000)</span>
              </div>
            </div>

            {/* 2. Distance Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>यात्रा दूरी (One-Way Travel Distance in KM)</span>
                </label>
                <span className="text-sm font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {distanceKm} KM
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>0-10 km (₹0)</span>
                <span>25 km (₹100)</span>
                <span>50 km (₹250)</span>
                <span>75 km (₹400)</span>
                <span>100+ km (₹800)</span>
              </div>
            </div>

            {/* 3. Broker Tier Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                ब्रोकर ग्रेड / एक्टिविटी टियर (Daily Protection Level)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bronze', name: 'Bronze', visits: '1 विजिट / दिन', cap: 'Cap: ₹1,200' },
                  { id: 'silver', name: 'Silver', visits: '2 विजिट / दिन', cap: 'Cap: ₹1,600' },
                  { id: 'gold', name: 'Gold', visits: '3 विजिट / दिन', cap: 'Cap: ₹2,000' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBrokerTier(tier.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      brokerTier === tier.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black block">{tier.name} Broker</span>
                    <span className={`text-[10px] block ${brokerTier === tier.id ? 'text-amber-100' : 'text-slate-500'}`}>{tier.visits}</span>
                    <span className={`text-[10px] font-bold block mt-1 ${brokerTier === tier.id ? 'text-white' : 'text-amber-700'}`}>{tier.cap}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Verification Bonuses Switches */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                अतिरिक्त बोनस व शर्तें (Additional Bonuses)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                <label className={`flex items-start space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  isVerifiedCustomer ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={isVerifiedCustomer}
                    onChange={(e) => setIsVerifiedCustomer(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">वेरिफाइड ग्राहक</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">+₹50 (OTP Verified)</span>
                  </div>
                </label>

                <label className={`flex items-start space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  isSecondVisit ? 'bg-blue-50 border-blue-300 text-blue-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={isSecondVisit}
                    onChange={(e) => setIsSecondVisit(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">रीपीट विजिट</span>
                    <span className="text-[10px] text-blue-700 font-bold block">+₹100 (2nd Visit)</span>
                  </div>
                </label>

                <label className={`flex items-start space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  isDealBookingBonus ? 'bg-purple-50 border-purple-300 text-purple-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={isDealBookingBonus}
                    onChange={(e) => setIsDealBookingBonus(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">डील बुकिंग बोनस</span>
                    <span className="text-[10px] text-purple-700 font-bold block">+₹1,000 (Booking Bonus)</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Real-time Calculation Result Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-amber-400/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Receipt className="w-4 h-4" />
                  <span>अनुमानित भुगतान ब्रेकअप</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  INSTANT UPI DISBURSAL
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span>1. जमीन क्षेत्रफल बेस ({landArea} एकड़):</span>
                  <span className="font-mono font-bold text-white text-sm">₹{areaBase}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span>2. यात्रा दूरी इंसेंटिव ({distanceKm} km):</span>
                  <span className="font-mono font-bold text-white text-sm">₹{travelIncentive}</span>
                </div>
                {isVerifiedCustomer && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80 text-emerald-300">
                    <span>3. वेरिफाइड ग्राहक बोनस (OTP):</span>
                    <span className="font-mono font-bold">+₹{verifiedBonus}</span>
                  </div>
                )}
                {isSecondVisit && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80 text-blue-300">
                    <span>4. पुनः विजिट बोनस (2nd Visit):</span>
                    <span className="font-mono font-bold">+₹{repeatVisitBonus}</span>
                  </div>
                )}
                {isDealBookingBonus && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80 text-purple-300">
                    <span>5. बुकिंग बोनस (Deal Token):</span>
                    <span className="font-mono font-bold">+₹{bookingBonus}</span>
                  </div>
                )}

                {isCapped && (
                  <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[11px] text-amber-200 flex items-center space-x-1.5 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{brokerTier.toUpperCase()} टियर हेतु अधिकतम दैनिक कैप ₹{maxCap} लागू है।</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                कुल प्रति विजिट देय राशि (Total Site Visit Income)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                  ₹{totalPayout.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">
                  / साइट विजिट
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                * वास्तविक सत्यापन (OTP + लाइव जीपीएस चेक-इन) के बाद सीधे आपके पंजीकृत बैंक खाते/UPI पर ट्रांसफर।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Rate Cards (Tables) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rate Card 1: Area Based */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h5 className="font-bold text-sm">1. जमीन के क्षेत्रफल अनुसार Base Incentive</h5>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              क्षेत्रफल स्लैब
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { slab: '1 एकड़ से 2 एकड़', amount: '₹150', desc: 'छोटे प्लॉट्स व फार्म लैंड' },
              { slab: '2 एकड़ से 5 एकड़', amount: '₹250', desc: 'मध्यम कृषि भूमि व एग्रो प्लॉट्स' },
              { slab: '5 एकड़ से 10 एकड़', amount: '₹350', desc: 'व्यावसायिक व फार्म हाउस क्लस्टर' },
              { slab: '10 एकड़ से 25 एकड़', amount: '₹500', desc: 'टाउनशिप व लॉजिस्टिक्स पार्सल' },
              { slab: '25 एकड़ से 50 एकड़', amount: '₹750', desc: 'औद्योगिक व बड़ी आवासीय परियोजनाएं' },
              { slab: '50+ एकड़ (Mega Land)', amount: '₹1,000', desc: 'मेगा प्रोजेक्ट्स व वेयरहाउसिंग पार्क' },
            ].map((row, idx) => (
              <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <span className="font-bold text-slate-900 block">{row.slab}</span>
                  <span className="text-[11px] text-slate-500">{row.desc}</span>
                </div>
                <span className="font-mono font-black text-emerald-700 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Card 2: Distance Based */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-amber-400" />
              <h5 className="font-bold text-sm">2. ब्रोकर की यात्रा दूरी (Distance) अनुसार Incentive</h5>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              पेट्रोल भरपाई
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { slab: '0 से 10 KM (One-Way)', amount: '₹0', desc: 'स्थानीय नगर पालिका क्षेत्र (Base Included)' },
              { slab: '10 से 25 KM (One-Way)', amount: '₹100', desc: 'उपनगरीय व आउटर रिंग रोड' },
              { slab: '25 से 50 KM (One-Way)', amount: '₹250', desc: 'निकटवर्ती ब्लॉक व तहसील' },
              { slab: '50 से 75 KM (One-Way)', amount: '₹400', desc: 'हाईवे व ग्रामीण कृषि बेल्ट' },
              { slab: '75 से 100 KM (One-Way)', amount: '₹600', desc: 'सीमावर्ती जिला क्षेत्र' },
              { slab: '100+ KM (Outstation)', amount: '₹800', desc: 'लंबी दूरी व अंतर-जिला साइट विजिट' },
            ].map((row, idx) => (
              <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <span className="font-bold text-slate-900 block">{row.slab}</span>
                  <span className="text-[11px] text-slate-500">{row.desc}</span>
                </div>
                <span className="font-mono font-black text-amber-700 text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Daily Expense Protection & Bonuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Expense Protection */}
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h5 className="font-black text-base">4. डेली खर्च सुरक्षा (Daily Expense Protection)</h5>
          </div>
          <p className="text-xs text-slate-600">
            ब्रोकर्स की सक्रियता के अनुसार स्तर निर्धारित किया गया है, ताकि हर ब्रोकर को रोज़ाना काम का सुरक्षित इंसेंटिव मिले:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-amber-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-950 block">🥉 Bronze Broker (1 विजिट/दिन)</span>
                <span className="text-[11px] text-slate-500">शुरुआती पार्टनर</span>
              </div>
              <span className="font-black text-amber-800 font-mono text-sm">₹200 से ₹500 / दिन</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">🥈 Silver Broker (2 विजिट/दिन)</span>
                <span className="text-[11px] text-slate-500">नियमित सक्रिय पार्टनर</span>
              </div>
              <span className="font-black text-slate-800 font-mono text-sm">₹400 से ₹1,000 / दिन</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-900 block">🥇 Gold Broker (3 विजिट/दिन)</span>
                <span className="text-[11px] text-slate-500">टॉप परफ़ॉर्मिंग पार्टनर</span>
              </div>
              <span className="font-black text-emerald-700 font-mono text-sm">₹600 से ₹1,500 / दिन</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-center font-bold text-amber-950 text-xs">
              🛡️ Maximum Daily Cap: ₹1,500 से ₹2,000 / दिन (उचित उपयोग नीति)
            </div>
          </div>
        </div>

        {/* Bonus & Additional Perks */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <Award className="w-5 h-5" />
            <h5 className="font-black text-base text-white">5. बोनस और अतिरिक्त लाभ (Perks & Bonus)</h5>
          </div>
          <p className="text-xs text-slate-400">
            गुणवत्तापूर्ण क्लाइंट्स व सफल बुकिंग पर ब्रोकर को अतिरिक्त रिवॉर्ड प्रदान किए जाते हैं:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Verified Customer Bonus</span>
                  <span className="text-[11px] text-slate-400">ग्राहक का मोबाइल नंबर OTP से सत्यापित होने पर</span>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-300 text-sm">+₹50</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Repeat / 2nd Visit Bonus</span>
                  <span className="text-[11px] text-slate-400">वही ग्राहक अगर दोबारा जमीन देखने आता है</span>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-300 text-sm">+₹100</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Deal Booking Bonus</span>
                  <span className="text-[11px] text-slate-400">साइट विजिट के 15-30 दिनों में रजिस्ट्री/टोकन होने पर</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">₹500 से ₹2,000</span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Fraud Prevention & Real-Time 6-Step Verification Workflow */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                100% TRANSPARENT & FRAUD-FREE SYSTEM
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1">
              6. पारदर्शी और धोखाधड़ी-मुक्त सत्यापन प्रक्रिया (Verification Engine)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Broker ID दर्ज → Customer Registration → Customer OTP → Site Arrival → Geo/Photo Verification → Site Visit Complete
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full font-bold">
              स्टेप {verifyStep} of 6
            </span>
          </div>
        </div>

        {/* Progress Bar of 6 Steps */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {[
              { step: 1, title: 'Broker ID' },
              { step: 2, title: 'Customer' },
              { step: 3, title: 'Client OTP' },
              { step: 4, title: 'Site Arrival' },
              { step: 5, title: 'Geo/Photo' },
              { step: 6, title: 'Complete' },
            ].map((s) => {
              const isDone = verifyStep > s.step;
              const isCurrent = verifyStep === s.step;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => s.step <= verifyStep && setVerifyStep(s.step)}
                  className={`py-1.5 px-1 sm:px-2 rounded-lg text-center transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white font-bold'
                      : isCurrent
                      ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-400'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs truncate">
                    {isDone ? '✓ ' : ''}{s.step}. {s.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Interactive Form */}
        <div className="p-5 sm:p-7">
          
          {/* STEP 1: Broker ID */}
          {verifyStep === 1 && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  चरण 1: अधिकृत ब्रोकर आईडी दर्ज करें
                </span>
                <h5 className="text-lg font-bold text-slate-900">आपकी करियर केयर पार्टनर आईडी</h5>
                <p className="text-xs text-slate-500">
                  हंड्रेड बिल्डर्स का रजिस्टर्ड पार्टनर कोड दर्ज करें ताकि इंसेंटिव आपके खाते में क्रेडिट हो सके।
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  पार्टनर आईडी कोड (Partner ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={brokerIdInput}
                    onChange={(e) => setBrokerIdInput(e.target.value)}
                    placeholder="उदा. HB-PARTNER-7824"
                    className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-300 font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 top-3" />
                </div>
                {savedBroker && (
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ आपके सक्रिय प्रोफाइल ({savedBroker.fullName}) से कोड स्वतः भरा गया है।
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setVerifyStep(2)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-md"
              >
                <span>अगला: ग्राहक विवरण भरें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Customer Registration */}
          {verifyStep === 2 && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  चरण 2: ग्राहक का विवरण (Customer Registration)
                </span>
                <h5 className="text-lg font-bold text-slate-900">साइट विजिट पर आए ग्राहक की जानकारी</h5>
                <p className="text-xs text-slate-500">
                  फर्जी विजिट रोकने के लिए वास्तविक ग्राहक का नाम व सक्रिय 10-अंकों का मोबाइल नंबर अनिवार्य है।
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    ग्राहक का नाम (Customer Full Name)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ग्राहक का नाम लिखें"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    ग्राहक का मोबाइल नंबर (10-Digit Mobile)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="उदा. 9826189000"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    साइट / जमीन का नाम व स्थान (Property Location)
                  </label>
                  <input
                    type="text"
                    value={propertyVisited}
                    onChange={(e) => setPropertyVisited(e.target.value)}
                    placeholder="प्रॉपर्टी का नाम / खसरा / गांव"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyStep(1)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  पीछे जाएं
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSendOtp();
                    setVerifyStep(3);
                  }}
                  className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <span>ओटीपी भेजें और आगे बढ़ें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer OTP */}
          {verifyStep === 3 && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  चरण 3: ग्राहक मोबाइल सत्यापन (Customer OTP)
                </span>
                <h5 className="text-lg font-bold text-slate-900">सुरक्षित 4-अंकीय ओटीपी दर्ज करें</h5>
                <p className="text-xs text-slate-500">
                  ग्राहक के नंबर <strong className="text-slate-800 font-mono">+91 {customerPhone}</strong> पर ओटीपी भेजा गया है।
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>सत्यापन एसएमएस कोड: <strong>5892</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpInput('5892')}
                  className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  ओटीपी दर्ज करें
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  ग्राहक से प्राप्त ओटीपी दर्ज करें (Client OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="उदा. 5892"
                  className="w-full text-center text-xl font-mono tracking-widest font-black py-3 rounded-xl border-2 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyStep(2)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  नंबर बदलें
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>ओटीपी सत्यापित करें</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Site Arrival Confirmation */}
          {verifyStep === 4 && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  चरण 4: साइट पर आगमन (Site Arrival Check-in)
                </span>
                <h5 className="text-lg font-bold text-slate-900">साइट पर भौतिक उपस्थिति की पुष्टि</h5>
                <p className="text-xs text-slate-500">
                  जैसे ही आप और ग्राहक जमीन पर पहुंचें, चेक-इन बटन दबाएं।
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">विजिट की जा रही प्रॉपर्टी:</span>
                  <span className="font-bold text-slate-900">{propertyVisited}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">ग्राहक का नाम:</span>
                  <span className="font-bold text-emerald-700">{customerName} (OTP Verified ✓)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">चेक-इन टाइमस्टैम्प:</span>
                  <span className="font-mono font-bold text-slate-800">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerifyStep(5)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>साइट अराइवल कन्फर्म करें (Next: Geo/Photo)</span>
              </button>
            </div>
          )}

          {/* STEP 5: Geo-Tag & Photo Verification */}
          {verifyStep === 5 && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  चरण 5: जियो-टैग व रियल-टाइम फोटो (Geo & Photo Verification)
                </span>
                <h5 className="text-lg font-bold text-slate-900">साइट लोकेशन व फोटो सत्यापन</h5>
                <p className="text-xs text-slate-500">
                  मोबाइल का जीपीएस लॉक करें एवं ग्राहक के साथ साइट पर लाइव फोटो अपलोड करें।
                </p>
              </div>

              {/* Geo GPS Lock Simulation */}
              <div className={`p-4 rounded-xl border transition ${
                isGpsLocked ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className={`w-5 h-5 ${isGpsLocked ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-xs font-bold block">1. लाइव जीपीएस निर्देशांक लॉक (GPS Lock)</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {isGpsLocked ? 'Lat: 21.1642° N, Long: 81.7761° E (Accuracy: 4m)' : 'जीपीएस सिग्नल डिटेक्ट करें'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLockGps}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isGpsLocked ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {isGpsLocked ? 'जीपीएस लॉक्ड ✓' : 'लोकेशन लॉक करें'}
                  </button>
                </div>
              </div>

              {/* Live Photo Upload / Capture Simulation */}
              <div className={`p-4 rounded-xl border transition ${
                isPhotoCaptured ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className={`w-5 h-5 ${isPhotoCaptured ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-xs font-bold block">2. साइट फोटो व लैंडमार्क (Site Photo)</span>
                      <span className="text-[11px] text-slate-500">
                        {isPhotoCaptured ? 'site_visit_geo_photo_verified.jpg (Watermarked)' : 'साइट बोर्ड या जमीन के साथ फोटो लें'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isPhotoCaptured ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {isPhotoCaptured ? 'फोटो कैप्चर्ड ✓' : 'कैमरा फोटो लें'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!isGpsLocked || !isPhotoCaptured}
                onClick={handleCompleteVisitClaim}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center space-x-2 shadow-md ${
                  isGpsLocked && isPhotoCaptured
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>साइट विजिट पूर्ण करें एवं इंसेंटिव क्रेडिट क्लेम करें</span>
              </button>
            </div>
          )}

          {/* STEP 6: Site Visit Complete & Claim Disbursement Receipt */}
          {verifyStep === 6 && (
            <div className="space-y-5 max-w-lg mx-auto py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  सत्यापन सफल (SITE VISIT VERIFIED & COMPLETE)
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  बधाई! आपकी साइट विजिट सत्यापित हो गई है
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  धोखाधड़ी-मुक्त 6-चरणीय प्रक्रिया सफलतापूर्वक पूरी हुई। आपका इंसेंटिव क्रेडिट स्वीकृत कर दिया गया है।
                </p>
              </div>

              {/* Digital Verified Visit Slip */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-left text-xs font-mono space-y-3 border-2 border-amber-400 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-amber-400 font-bold uppercase">100 BUILDERS SITE VISIT RECEIPT</span>
                  <span className="text-emerald-400 font-bold">APPROVED ✓</span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span>ब्रोकर पार्टनर कोड:</span>
                    <span className="text-white font-bold">{brokerIdInput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>सत्यापित ग्राहक:</span>
                    <span className="text-white">{customerName} (+91 {customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>विजिट की गई भूमि:</span>
                    <span className="text-white truncate max-w-[200px]">{propertyVisited}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>जमीन क्षेत्रफल इंसेंटिव:</span>
                    <span className="text-emerald-300 font-bold">₹{areaBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>यात्रा दूरी पेट्रोल भरपाई:</span>
                    <span className="text-amber-300 font-bold">₹{travelIncentive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>सत्यापित ओटीपी बोनस:</span>
                    <span className="text-emerald-300 font-bold">+₹{verifiedBonus}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2.5 flex justify-between items-baseline">
                  <span className="text-slate-400 text-xs font-sans font-bold">कुल स्वीकृत भुगतान:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">₹{totalPayout}</span>
                </div>

                <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-800/80">
                  रेफरेंस आईडी: HB-SV-{Math.floor(100000 + Math.random() * 900000)} | स्टेटस: DIRECT UPI DISPATCHED
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetVerification}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition cursor-pointer"
                >
                  नई साइट विजिट दर्ज करें
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const msg = `*HUNDRED BUILDERS REALITIES - साइट विजिट इंसेंटिव क्लेम स्लिप*%0A%0A` +
                      `📌 *ब्रोकर आईडी:* ${brokerIdInput}%0A` +
                      `👤 *ग्राहक:* ${customerName} (+91 ${customerPhone})%0A` +
                      `📍 *लोकेशन:* ${propertyVisited}%0A` +
                      `💰 *स्वीकृत राशि:* ₹${totalPayout}%0A` +
                      `✅ *स्टेटस:* OTP + Geo/Photo Verified%0A%0A` +
                      `_कृपया भुगतान सत्यापन पुष्ट करें।_`;
                    window.open(`https://wa.me/917805980006?text=${msg}`, '_blank');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप पर स्लिप भेजें</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Footer Support Notice */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            किसी भी साइट विजिट क्लेम या पेट्रोल बिल सहायता के लिए हंड्रेड बिल्डर्स ब्रोकर हेल्पडेस्क से संपर्क करें।
          </span>
        </div>
        <a
          href="tel:+917805980006"
          className="font-bold text-amber-800 hover:underline shrink-0"
        >
          हेल्पलाइन: +91 78059 80006
        </a>
      </div>

    </div>
  );
};
