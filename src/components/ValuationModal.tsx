import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Compass, 
  IndianRupee, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { CITIES_LIST } from '../data/mockProperties';
import { PropertyCategory, FurnishingStatus } from '../types';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenPostProperty: () => void;
}

export const ValuationModal: React.FC<ValuationModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenPostProperty,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const [valuationType, setValuationType] = useState<'sale' | 'rent'>('sale');
  const [city, setCity] = useState(CITIES_LIST[1] || 'Delhi NCR');
  const [category, setCategory] = useState<PropertyCategory>('apartment');
  const [bhk, setBhk] = useState<number>(2);
  const [carpetArea, setCarpetArea] = useState<number>(1150);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('semi_furnished');
  const [ageYears, setAgeYears] = useState<number>(2);

  // Base rates per sq.ft by city
  const cityBaseRateMap: Record<string, number> = {
    'Mumbai': 16500,
    'Delhi NCR': 7200,
    'Noida': 6800,
    'Gurgaon': 9500,
    'Bengaluru': 8200,
    'Hyderabad': 6500,
    'Pune': 6200,
    'Jaipur': 4200,
    'Ahmedabad': 4800,
    'Kolkata': 5200,
    'Chennai': 7000,
    'Lucknow': 4500,
    'Chandigarh': 6800,
  };

  const baseRate = cityBaseRateMap[city] || 6000;
  
  // Category multiplier
  let catMult = 1.0;
  if (category === 'villa') catMult = 1.35;
  if (category === 'plot') catMult = 0.85;
  if (category === 'commercial_office') catMult = 1.5;
  if (category === 'commercial_shop') catMult = 1.8;

  // Furnishing multiplier
  let furnMult = furnishing === 'furnished' ? 1.15 : furnishing === 'semi_furnished' ? 1.05 : 1.0;
  
  // Age depreciation
  let ageFactor = Math.max(0.75, 1 - (ageYears * 0.015));

  const estimatedRatePerSqFt = Math.round(baseRate * catMult * furnMult * ageFactor);
  const estimatedSalePrice = Math.round(estimatedRatePerSqFt * carpetArea);
  
  // Monthly rental yield estimation (around 2.8% to 3.5% annually)
  const estimatedMonthlyRent = Math.round((estimatedSalePrice * 0.032) / 12);

  const formatLakhsCrores = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div id="valuation-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.valuationTool}</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'बाजार दरों के आधार पर अपनी प्रॉपर्टी का सटीक मूल्यांकन' : 'Instant AI fair price & rental estimation engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Valuation Type Switch */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setValuationType('sale')}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                valuationType === 'sale' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'hi' ? 'बिक्री मूल्य (Sale Value)' : 'Sale Valuation'}
            </button>
            <button
              onClick={() => setValuationType('rent')}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                valuationType === 'rent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'hi' ? 'मासिक किराया (Monthly Rent)' : 'Rental Valuation'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t.citySelect}</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                {CITIES_LIST.filter(c => c !== 'All Cities').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t.propertyType}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="apartment">{t.apartment}</option>
                <option value="villa">{t.independentHouse}</option>
                <option value="builder_floor">{t.builderFloor}</option>
                <option value="plot">{t.plot}</option>
                <option value="commercial_office">{t.commercialOffice}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t.bedrooms}</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} BHK</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t.carpetArea} ({t.sqft})</label>
              <input
                type="number"
                value={carpetArea}
                onChange={(e) => setCarpetArea(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t.furnishing}</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="furnished">Furnished</option>
                <option value="semi_furnished">Semi</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Valuation Result Box */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-100 block">
              {valuationType === 'sale' ? 'Estimated Market Value' : 'Estimated Monthly Rent'}
            </span>
            <span className="text-3xl sm:text-4xl font-black block my-2">
              {valuationType === 'sale' 
                ? `${formatLakhsCrores(estimatedSalePrice)} - ${formatLakhsCrores(Math.round(estimatedSalePrice * 1.1))}`
                : `₹${estimatedMonthlyRent.toLocaleString()} - ₹${Math.round(estimatedMonthlyRent * 1.15).toLocaleString()}/mo`}
            </span>
            <div className="inline-flex items-center space-x-1 text-xs bg-black/20 px-3 py-1 rounded-full text-amber-100 mt-1">
              <span>Avg Rate: ~₹{estimatedRatePerSqFt.toLocaleString()}/{t.sqft} in {city}</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenPostProperty();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
            >
              <span>{lang === 'hi' ? 'इस कीमत पर प्रॉपर्टी लिस्ट करें' : 'Post Property at this Value (Free)'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
