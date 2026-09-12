import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Scale, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Building, 
  Home, 
  Compass, 
  Calendar, 
  Layers, 
  Calculator, 
  Share2, 
  CheckCircle2, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  CalendarCheck,
  Award,
  Zap,
  Car,
  Waves,
  Dumbbell,
  Trees,
  Flame,
  Droplets,
  BatteryCharging,
  Smile,
  KeyRound,
  ArrowUpDown,
  Landmark,
  Tractor,
  Ruler,
  Shield
} from 'lucide-react';
import { Property } from '../types';
import { Language, translations, amenitiesList } from '../data/translations';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  lang: Language;
  isShortlisted: boolean;
  onToggleShortlist: (propertyId: string) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  lang,
  isShortlisted,
  onToggleShortlist,
  isCompared,
  onToggleCompare,
  onBookVisit,
}) => {
  if (!property) return null;

  const t = translations[lang];
  const isIndic = lang !== 'en';
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // EMI Calculator internal state for this property
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // Calculate EMI
  const loanAmount = Math.max(0, property.price * (1 - downPaymentPercent / 100));
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = property.purpose === 'buy' && loanAmount > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
    : 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const phone = property.contactWhatsApp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello, I am interested in your property on Hundred Builders Realities: "${property.title}" (Price: ${property.priceDisplayEn}) located in ${property.locality}, ${property.city}. Please share complete details.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${property.contactPhone.replace(/\s+/g, '')}`;
  };

  // Helper icon map for amenities
  const getAmenityIcon = (id: string) => {
    switch (id) {
      case 'lift': return <ArrowUpDown className="w-4 h-4 text-amber-600" />;
      case 'parking': return <Car className="w-4 h-4 text-amber-600" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'power_backup': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'gym': return <Dumbbell className="w-4 h-4 text-amber-600" />;
      case 'pool': return <Waves className="w-4 h-4 text-amber-600" />;
      case 'clubhouse': return <Building className="w-4 h-4 text-amber-600" />;
      case 'park': return <Trees className="w-4 h-4 text-amber-600" />;
      case 'gas_pipeline': return <Flame className="w-4 h-4 text-amber-600" />;
      case 'water_supply': return <Droplets className="w-4 h-4 text-amber-600" />;
      case 'ev_charging': return <BatteryCharging className="w-4 h-4 text-amber-600" />;
      case 'kids_play_area': return <Smile className="w-4 h-4 text-amber-600" />;
      case 'vastu': return <Compass className="w-4 h-4 text-amber-600" />;
      case 'gated_society': return <KeyRound className="w-4 h-4 text-amber-600" />;
      default: return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div id="property-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide ${
              property.purpose === 'buy'
                ? 'bg-amber-100 text-amber-800'
                : property.purpose === 'rent'
                ? 'bg-emerald-100 text-emerald-800'
                : property.purpose === 'plot'
                ? 'bg-purple-100 text-purple-800'
                : property.purpose === 'agriculture'
                ? 'bg-lime-100 text-lime-900 border border-lime-300'
                : property.purpose === 'lease'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-extrabold'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {t[property.purpose] || property.purpose}
            </span>
            {property.isExclusiveHundredBuilders && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-amber-500 text-slate-950">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hundred Builders Exclusive</span>
              </span>
            )}
            {property.reraId && (
              <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                <span>RERA: {property.reraId}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer relative"
              title="Share property link"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
            <button
              onClick={() => onToggleCompare(property)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isCompared ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={t.compare}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleShortlist(property.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isShortlisted ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={t.shortlist}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              id="detail-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                {isIndic ? property.titleHi : property.title}
              </h2>
              <div className="flex items-center text-slate-600 text-sm mt-2">
                <MapPin className="w-4 h-4 text-amber-600 mr-1.5 shrink-0" />
                <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
              </div>
            </div>
            <div className="md:text-right shrink-0 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
              <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider">
                {property.purpose === 'rent' ? 'Monthly Rent' : 'Expected Price'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950">
                {isIndic ? property.priceDisplayHi : property.priceDisplayEn}
              </span>
              {(property.category === 'agricultural_land' || property.purpose === 'agriculture' || property.agriculturalLandDetails) ? (
                <span className="block text-xs text-emerald-800 font-extrabold mt-1">
                  ₹{Math.round(property.price / (property.agriculturalLandDetails?.totalAreaAcres || (property.carpetAreaSqFt / 43560) || 1)).toLocaleString()} / {isIndic ? 'एकड़' : 'Acre'} • ₹{Math.round(property.price / ((property.agriculturalLandDetails?.totalAreaAcres || (property.carpetAreaSqFt / 43560) || 1) * 100)).toLocaleString()} / {isIndic ? 'डिसमिल' : 'Dismil'}
                </span>
              ) : (property.category === 'plot' || property.purpose === 'plot' || property.plotDetails) ? (
                <span className="block text-xs text-indigo-900 font-extrabold mt-1">
                  ₹{(property.plotDetails?.ratePerSqFt || Math.round(property.price / (property.carpetAreaSqFt || 1))).toLocaleString()} / {isIndic ? 'वर्ग फीट' : 'Sq.Ft'} • ₹{(property.plotDetails?.ratePerSqYd || Math.round(property.price / (property.plotAreaSqYds || (property.carpetAreaSqFt / 9) || 1))).toLocaleString()} / {isIndic ? 'वर्ग गज (Gaj)' : 'Sq.Yd (Gaj)'}
                </span>
              ) : (
                property.pricePerSqFt && (
                  <span className="block text-xs text-slate-500 font-semibold mt-0.5">
                    ₹{property.pricePerSqFt.toLocaleString()} per {t.sqft}
                  </span>
                )
              )}
              {property.isNegotiable && (
                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                  {t.priceNegotiable}
                </span>
              )}
            </div>
          </div>

          {/* Photo Gallery & Thumbnail Selector */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-72 sm:h-96 w-full shadow-inner">
              <img
                src={property.images[selectedImgIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImgIndex((prev) => (prev + 1) % property.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                {selectedImgIndex + 1} of {property.images.length} Photos
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      selectedImgIndex === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          {(property.category === 'agricultural_land' || property.purpose === 'agriculture' || property.agriculturalLandDetails) ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
                    <Tractor className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950">
                      {isIndic ? 'कृषि भूमि संपूर्ण क्षेत्रफल एवं भौतिक विवरण' : 'Complete Agricultural Land Specifications'}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {isIndic ? 'एकड़, डिसमिल, हेक्टेयर, रोड कनेक्टिविटी व सिंचाई रिकॉर्ड' : 'Acres, Dismil, Hectare, Frontage & Irrigation Records'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full">
                  {isIndic ? '100% सटीक मापन' : 'Live Area Converter'}
                </span>
              </div>

              {/* 1. Multi-Unit Measurement Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="p-3.5 bg-emerald-50 rounded-xl border-2 border-emerald-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isIndic ? 'कुल एकड़' : 'Total Acres'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-950 block">
                    {property.agriculturalLandDetails?.totalAreaAcres || (property.carpetAreaSqFt / 43560).toFixed(2)} {isIndic ? 'एकड़' : 'Acres'}
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isIndic ? 'डिसमिल' : 'Total Dismil'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-950 block">
                    {property.agriculturalLandDetails?.totalAreaDismil || Math.round((property.carpetAreaSqFt / 435.6))} {isIndic ? 'डिसमिल' : 'Dismil'}
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isIndic ? 'बी-1 सरकारी रकबा' : 'Govt B-1 Area'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-950 block">
                    {property.agriculturalLandDetails?.govtRakbaHectare 
                      ? `${property.agriculturalLandDetails.govtRakbaHectare} Ha` 
                      : (property.agriculturalLandDetails?.totalAreaHectares ? `${property.agriculturalLandDetails.totalAreaHectares} Ha` : `${((property.carpetAreaSqFt / 43560) / 2.471).toFixed(3)} Ha`)}
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isIndic ? 'बीघा (क्षेत्रीय)' : 'Bigha'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-950 block">
                    ~ {property.agriculturalLandDetails?.totalAreaBigha || ((property.carpetAreaSqFt / 43560) / 0.625).toFixed(1)} {isIndic ? 'बीघा' : 'Bigha'}
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isIndic ? 'कुल वर्ग फीट' : 'Total Sq.Ft'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-950 block">
                    {property.carpetAreaSqFt.toLocaleString()} sq.ft
                  </span>
                </div>
              </div>

              {/* 2. Road Frontage, Width & Infrastructure Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'रोड फ्रंट / मुखौटा' : 'Road Frontage'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {property.agriculturalLandDetails?.roadFrontageFt ? `${property.agriculturalLandDetails.roadFrontageFt} ft` : 'मुख्य मार्ग'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'सड़क चौड़ाई व प्रकार' : 'Approach Road'}
                  </span>
                  <span className="font-black text-slate-900 text-sm capitalize">
                    {property.agriculturalLandDetails?.approachRoadWidthFt ? `${property.agriculturalLandDetails.approachRoadWidthFt} ft ` : ''}
                    {property.agriculturalLandDetails?.approachRoadType ? property.agriculturalLandDetails.approachRoadType.replace('_', ' ') : 'Paved Road'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'मिट्टी की किस्म' : 'Soil Type'}
                  </span>
                  <span className="font-black text-slate-900 text-sm capitalize">
                    {property.agriculturalLandDetails?.soilType 
                      ? (property.agriculturalLandDetails.soilType === 'kanhar' ? (isIndic ? 'कन्हार (काली मिट्टी)' : 'Black Soil (Kanhar)') : property.agriculturalLandDetails.soilType)
                      : (isIndic ? 'उपजाऊ दोमट' : 'Fertile Loam')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'सिंचाई की स्थिति' : 'Irrigation Status'}
                  </span>
                  <span className="font-black text-emerald-800 text-sm capitalize">
                    {property.agriculturalLandDetails?.irrigationStatus 
                      ? property.agriculturalLandDetails.irrigationStatus.replace('_', ' ')
                      : (isIndic ? 'पूर्ण सिंचित' : 'Irrigated')}
                  </span>
                </div>
              </div>

              {/* 3. Utility badges: Borewell, 3-phase electricity, fencing, title */}
              <div className="flex flex-wrap gap-2 pt-1">
                {property.agriculturalLandDetails?.hasBorewell && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isIndic ? `बोरवेल उपलब्ध (${property.agriculturalLandDetails.borewellCount || 1} बोरवेल)` : 'Borewell Available'}</span>
                  </span>
                )}
                {property.agriculturalLandDetails?.hasElectricityConnection && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isIndic ? '3-फेज कृषि बिजली कनेक्शन' : '3-Phase Agricultural Power'}</span>
                  </span>
                )}
                {property.agriculturalLandDetails?.isFenced && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-700" />
                    <span>{isIndic ? 'सुरक्षित तारबंदी / बाउंड्री' : 'Fenced Boundary'}</span>
                  </span>
                )}
                {property.agriculturalLandDetails?.isCornerLand && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-700" />
                    <span>{isIndic ? 'कॉर्नर जमीन (2 तरफ रास्ता)' : 'Corner Land (2-Side Access)'}</span>
                  </span>
                )}
                <span className="px-3 py-1 bg-teal-100 text-teal-900 border border-teal-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isIndic ? 'सामान्य फ्रीहोल्ड टाइटल (तुरंत रजिस्ट्री)' : 'General Freehold (Clear Title)'}</span>
                </span>
              </div>
            </div>
          ) : (property.category === 'plot' || property.purpose === 'plot' || property.plotDetails) ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-black shadow-xs">
                    <Ruler className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-indigo-950">
                      {isIndic ? 'रेसिडेंशियल प्लॉट संपूर्ण क्षेत्रफल एवं भौतिक विवरण' : 'Complete Residential Plot Specifications'}
                    </h3>
                    <p className="text-xs text-indigo-700 font-semibold">
                      {isIndic ? 'वर्ग फीट, वर्ग गज (Gaj), आयाम (साइज), रोड चौड़ाई, कॉर्नर व डायवर्सन' : 'Sq.Ft, Sq.Yards (Gaj), Dimensions, Road Width, Corner & Approvals'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-300 px-2.5 py-1 rounded-full">
                  {isIndic ? '100% सटीक मापन' : 'Live Area Record'}
                </span>
              </div>

              {/* 1. Multi-Unit Measurement Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-indigo-50/90 rounded-xl border-2 border-indigo-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-indigo-800 uppercase block mb-0.5">
                    {isIndic ? 'कुल वर्ग फीट' : 'Total Sq.Ft'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-indigo-950 block">
                    {(property.plotDetails?.totalAreaSqFt || property.carpetAreaSqFt).toLocaleString()} sq.ft
                  </span>
                </div>

                <div className="p-3.5 bg-indigo-50/90 rounded-xl border-2 border-indigo-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-indigo-800 uppercase block mb-0.5">
                    {isIndic ? 'वर्ग गज / गज (Gaj)' : 'Total Gaj / Sq.Yds'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-indigo-950 block">
                    {(property.plotDetails?.totalAreaSqYds || property.plotAreaSqYds || Math.round((property.plotDetails?.totalAreaSqFt || property.carpetAreaSqFt) / 9)).toLocaleString()} {isIndic ? 'गज' : 'Sq.Yds'}
                  </span>
                </div>

                <div className="p-3.5 bg-purple-50/90 rounded-xl border-2 border-purple-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-purple-800 uppercase block mb-0.5">
                    {isIndic ? 'डिसमिल' : 'Total Dismil'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-purple-950 block">
                    {property.plotDetails?.totalAreaDismil || (((property.plotDetails?.totalAreaSqFt || property.carpetAreaSqFt) / 435.6).toFixed(2))} {isIndic ? 'डिसमिल' : 'Dismil'}
                  </span>
                </div>

                <div className="p-3.5 bg-blue-50/90 rounded-xl border-2 border-blue-300 shadow-2xs">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block mb-0.5">
                    {isIndic ? 'वर्ग मीटर' : 'Total Sq.Mtr'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-blue-950 block">
                    {property.plotDetails?.totalAreaSqMtr || (((property.plotDetails?.totalAreaSqFt || property.carpetAreaSqFt) / 10.7639).toFixed(2))} sq.m
                  </span>
                </div>
              </div>

              {/* 2. Dimensions & Road Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'प्लॉट आयाम (साइज)' : 'Plot Dimensions'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {property.plotDetails?.dimensionsText || (property.plotDetails?.plotWidthFt && property.plotDetails?.plotLengthFt ? `${property.plotDetails.plotWidthFt} ft × ${property.plotDetails.plotLengthFt} ft` : '30 ft × 50 ft')}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {property.plotDetails?.plotWidthFt ? `${property.plotDetails.plotWidthFt} ft ${isIndic ? 'फ्रंट' : 'Front'}` : ''}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'सड़क चौड़ाई व प्रकार' : 'Facing Road'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {property.plotDetails?.facingRoadWidthFt || 30} ft Road
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold block mt-0.5 capitalize">
                    {property.plotDetails?.roadType ? property.plotDetails.roadType.replace('_', ' ') : 'CC Road'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'प्लॉट दिशा (वास्तु)' : 'Facing / Vastu'}
                  </span>
                  <span className="font-black text-indigo-900 text-sm">
                    {property.plotDetails?.facingDirection || property.facing || 'East'} Facing
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    100% {isIndic ? 'वास्तु अनुकूल' : 'Vastu Compliant'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">
                    {isIndic ? 'कॉर्नर / ओपन साइड्स' : 'Corner / Open Sides'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {property.plotDetails?.isCornerPlot || (property.plotDetails?.openSidesCount && property.plotDetails.openSidesCount >= 2) 
                      ? (isIndic ? '2-तरफ रास्ता (कॉर्नर)' : 'Corner Plot (2 Sides)') 
                      : (isIndic ? '1-तरफ रास्ता' : '1 Side Open')}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {property.plotDetails?.openSidesCount || 1} {isIndic ? 'खुली दिशाएं' : 'Open Sides'}
                  </span>
                </div>
              </div>

              {/* 3. Approvals, Colony & Utility Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {property.plotDetails?.approvalType && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-950 border border-indigo-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-700" />
                    <span>
                      {property.plotDetails.approvalType === 'tncp_approved'
                        ? 'T&CP Approved'
                        : property.plotDetails.approvalType === 'rera_approved'
                        ? 'RERA Approved'
                        : property.plotDetails.approvalType.replace('_', ' ')}
                    </span>
                  </span>
                )}
                {property.plotDetails?.diversionStatus && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {property.plotDetails.diversionStatus === 'diverted_residential'
                        ? (isIndic ? '100% आवासीय व्यपवर्तित (Diverted)' : '100% Residential Diverted')
                        : property.plotDetails.diversionStatus.replace('_', ' ')}
                    </span>
                  </span>
                )}
                <span className="px-3 py-1 bg-teal-100 text-teal-950 border border-teal-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isIndic ? 'फ्रीहोल्ड (क्लियर रजिस्ट्री)' : 'Freehold Clear Title'}</span>
                </span>
                {property.plotDetails?.hasElectricityPoles && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isIndic ? 'बिजली लाइन चालू' : 'Electricity Available'}</span>
                  </span>
                )}
                {property.plotDetails?.hasWaterSupplyLine && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-950 border border-blue-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isIndic ? 'पानी सप्लाई / बोरवेल' : 'Water Supply'}</span>
                  </span>
                )}
                {property.plotDetails?.isGatedColony && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-950 border border-purple-300 rounded-lg text-xs font-black flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-700" />
                    <span>{isIndic ? 'गेटेड / कवर्ड कैंपस' : 'Gated Campus'}</span>
                  </span>
                )}
                {property.plotDetails?.plotNumber && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-900 border border-slate-300 rounded-lg text-xs font-black">
                    {property.plotDetails.plotNumber}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {isIndic ? 'प्रॉपर्टी स्पेसिफिकेशन्स व विवरण' : 'Key Property Specifications'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block">{t.carpetArea}</span>
                  <span className="font-extrabold text-slate-900 text-base">{property.carpetAreaSqFt} {t.sqft}</span>
                </div>
                {property.superBuiltUpAreaSqFt && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 block">{t.superArea}</span>
                    <span className="font-extrabold text-slate-900 text-base">{property.superBuiltUpAreaSqFt} {t.sqft}</span>
                  </div>
                )}
                {property.bhk && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 block">{t.bedrooms}</span>
                    <span className="font-extrabold text-slate-900 text-base">{property.bhk} BHK</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 block">{t.bathrooms}</span>
                    <span className="font-extrabold text-slate-900 text-base">{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.floor !== undefined && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 block">{t.floorNumber}</span>
                    <span className="font-extrabold text-slate-900 text-base">
                      {property.floor === 0 ? 'Ground' : `${property.floor}th`} (of {property.totalFloors})
                    </span>
                  </div>
                )}
                {property.facing && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 block">{t.facing}</span>
                    <span className="font-extrabold text-slate-900 text-base">{property.facing} Facing</span>
                  </div>
                )}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block">{t.furnishing}</span>
                  <span className="font-extrabold text-slate-900 text-base capitalize">
                    {property.furnishing.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block">{t.possessionStatus}</span>
                  <span className="font-extrabold text-slate-900 text-base capitalize">
                    {property.possession.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Revenue & Land Record Details (जिला, तहसील, राजस्व निरीक्षक मंडल, ग्राम, खसरा नंबर) */}
          {(property.district || property.tehsil || property.revenueCircle || property.village || property.khasraNumber) && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 via-orange-50/20 to-amber-50/60 rounded-2xl border-2 border-amber-300/80 shadow-2xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-amber-200/70">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isIndic ? 'राजस्व एवं भू-अभिलेख विवरण' : 'Revenue & Land Record Details'}
                  </h3>
                </div>
                <span className="self-start sm:self-auto text-[10px] font-black tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
                  {isIndic ? 'सत्यापित राजस्व डेटा' : 'Revenue Verified'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {property.district && (
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                      {isIndic ? 'जिला' : 'District'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">
                      {property.district}
                    </span>
                  </div>
                )}
                {property.tehsil && (
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                      {isIndic ? 'तहसील' : 'Tehsil'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">
                      {property.tehsil}
                    </span>
                  </div>
                )}
                {property.revenueCircle && (
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                      {isIndic ? 'रा.नि. मंडल' : 'RI Circle'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">
                      {property.revenueCircle}
                    </span>
                  </div>
                )}
                {property.village && (
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                      {isIndic ? 'ग्राम / मौजा' : 'Village'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">
                      {property.village}
                    </span>
                  </div>
                )}
                {property.khasraNumber && (
                  <div className="p-3 bg-amber-100/80 rounded-xl border-2 border-amber-400/90 shadow-2xs col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-black text-amber-900 uppercase block mb-0.5">
                      {isIndic ? 'खसरा नंबर' : 'Khasra No.'}
                    </span>
                    <span className="font-black text-amber-950 text-xs sm:text-sm block truncate">
                      {property.khasraNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              {t.description}
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {isIndic ? property.descriptionHi : property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {property.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {t.amenities}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities.map((amenityId) => {
                  const am = amenitiesList.find((a) => a.id === amenityId);
                  return (
                    <div key={amenityId} className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      {getAmenityIcon(amenityId)}
                      <span className="text-xs font-bold text-slate-800">
                        {am ? (isIndic ? am.nameHi : am.nameEn) : amenityId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby Landmarks & Distances */}
          {property.nearbyLandmarks && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {t.localityNearby}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.nearbyLandmarks.metroDistance && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block">Metro Connectivity</span>
                    <span className="text-slate-700 mt-0.5 block">{property.nearbyLandmarks.metroDistance}</span>
                  </div>
                )}
                {property.nearbyLandmarks.airportDistance && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block">Airport Distance</span>
                    <span className="text-slate-700 mt-0.5 block">{property.nearbyLandmarks.airportDistance}</span>
                  </div>
                )}
                {property.nearbyLandmarks.hospitalDistance && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block">Hospitals Nearby</span>
                    <span className="text-slate-700 mt-0.5 block">{property.nearbyLandmarks.hospitalDistance}</span>
                  </div>
                )}
                {property.nearbyLandmarks.mallDistance && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block">Shopping & Malls</span>
                    <span className="text-slate-700 mt-0.5 block">{property.nearbyLandmarks.mallDistance}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Property EMI Calculator (for Buy purpose) */}
          {property.purpose === 'buy' && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-base mb-2">
                <Calculator className="w-5 h-5" />
                <span>{t.emiCalculator}</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                {isIndic ? 'इस प्रॉपर्टी के लिए अपनी मासिक किस्त (EMI) कैलकुलेट करें।' : 'Plan your finances with customized home loan EMI estimation.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{t.downPayment}: {downPaymentPercent}%</span>
                      <span className="text-amber-400">₹{Math.round(property.price * (downPaymentPercent / 100)).toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{t.interestRate}: {interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="6.5"
                      max="12.0"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{t.tenureYears}: {tenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl text-center">
                  <span className="text-xs text-slate-400 font-semibold block">{t.emiMonthlyEstimate}</span>
                  <span className="text-3xl font-black text-amber-400 block my-1">
                    ₹{emi.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Loan Amount: ₹{Math.round(loanAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Box & Call to Actions */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  {property.listedBy === 'hundred_builders' 
                    ? 'Hundred Builders Official Desk' 
                    : property.listedBy === 'owner'
                    ? (isIndic ? 'प्रॉपर्टी मालिक (0% ब्रोकरेज)' : 'Direct Property Owner (0% Brokerage)')
                    : property.listedBy === 'registered_broker'
                    ? (isIndic ? 'रजिस्टर्ड रियल एस्टेट ब्रोकर' : 'Registered Real Estate Broker (RERA)')
                    : (isIndic ? 'वेरिफाइड एजेंट डेस्क' : 'Verified Agent Desk')}
                </span>
                <span className="text-base font-extrabold text-slate-900 block">{property.contactName}</span>
                <span className="text-xs text-slate-600">{property.contactPhone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                id="modal-book-visit-cta"
                onClick={() => onBookVisit(property)}
                className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>{t.scheduleVisit}</span>
              </button>
              <button
                id="modal-whatsapp-cta"
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.chatWhatsApp}</span>
              </button>
              <button
                id="modal-call-cta"
                onClick={handleCall}
                className="p-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl transition cursor-pointer shadow-xs"
                title="Call Now"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
