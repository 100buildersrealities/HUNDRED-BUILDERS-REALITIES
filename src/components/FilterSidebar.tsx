import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown,
  Check
} from 'lucide-react';
import { FilterState, PropertyCategory } from '../types';
import { Language, translations, amenitiesList } from '../data/translations';
import { CITIES_LIST, CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES, OTHER_METRO_CITIES, ALL_CHHATTISGARH_OPTION, ALL_MADHYA_PRADESH_OPTION } from '../data/mockProperties';
import { MapPin } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  totalFiltered: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  totalFiltered,
}) => {
  const t = translations[lang];

  const handleBhkToggle = (b: number) => {
    const updated = filters.bhk.includes(b)
      ? filters.bhk.filter((item) => item !== b)
      : [...filters.bhk, b];
    onFilterChange({ bhk: updated });
  };

  const handleFurnishingToggle = (f: string) => {
    const updated = filters.furnishing.includes(f)
      ? filters.furnishing.filter((item) => item !== f)
      : [...filters.furnishing, f];
    onFilterChange({ furnishing: updated });
  };

  const handlePossessionToggle = (p: string) => {
    const updated = filters.possession.includes(p)
      ? filters.possession.filter((item) => item !== p)
      : [...filters.possession, p];
    onFilterChange({ possession: updated });
  };

  const handleListedByToggle = (l: string) => {
    const updated = filters.listedBy.includes(l)
      ? filters.listedBy.filter((item) => item !== l)
      : [...filters.listedBy, l];
    onFilterChange({ listedBy: updated });
  };

  const handleAmenityToggle = (aId: string) => {
    const updated = filters.amenities.includes(aId)
      ? filters.amenities.filter((item) => item !== aId)
      : [...filters.amenities, aId];
    onFilterChange({ amenities: updated });
  };

  const formatPriceLabel = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)} L`;
    }
    return `₹${(amount / 1000).toFixed(0)}k`;
  };

  return (
    <div id="filters-sidebar" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>{t.filters}</span>
          <span className="text-xs font-semibold text-slate-500">
            ({totalFiltered} {t.propertiesFound})
          </span>
        </div>
        <button
          id="filter-reset-btn"
          onClick={onResetFilters}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1 cursor-pointer transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.clearAll}</span>
        </button>
      </div>

      {/* Purpose Tabs (Buy, Rent, Commercial, Plots, Agriculture) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {lang === 'hi' ? 'उद्देश्य (Purpose)' : 'Purpose / Type'}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'buy', label: t.buy },
            { id: 'rent', label: t.rent },
            { id: 'commercial', label: t.commercial },
            { id: 'plot', label: t.plots },
            { id: 'agriculture', label: t.agriculture },
            { id: 'lease', label: t.lease },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              id={`sidebar-purpose-${p.id}`}
              onClick={() => onFilterChange({
                purpose: p.id as any,
                category: p.id === 'agriculture' ? 'agricultural_land' : (filters.category === 'agricultural_land' ? 'all' : filters.category),
                minPrice: p.id === 'rent' ? 10000 : (p.id === 'lease' ? 15000 : (p.id === 'agriculture' ? 500000 : 1500000)),
                maxPrice: p.id === 'rent' ? 250000 : (p.id === 'lease' ? 1000000 : 50000000),
              })}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition border cursor-pointer text-center ${
                filters.purpose === p.id
                  ? p.id === 'agriculture'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : p.id === 'lease'
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-2xs'
                    : 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.id === 'agriculture' ? '🌱 ' : p.id === 'lease' ? '📄 ' : ''}{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* City & State Location Filter */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.citySelect}</span>
          </span>
          {filters.city !== 'All Cities' && (
            <button
              onClick={() => onFilterChange({ city: 'All Cities' })}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </label>
        
        <select
          id="sidebar-city-select"
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
        >
          <option value="All Cities">🌐 All Cities (सभी शहर)</option>
          <option value={ALL_CHHATTISGARH_OPTION} className="font-bold text-amber-800 bg-amber-50">
            ⭐ {ALL_CHHATTISGARH_OPTION}
          </option>
          <option value={ALL_MADHYA_PRADESH_OPTION} className="font-bold text-emerald-800 bg-emerald-50">
            ⭐ {ALL_MADHYA_PRADESH_OPTION}
          </option>
          <optgroup label="📍 Chhattisgarh (छत्तीसगढ़ के 33+ शहर)">
            {CHHATTISGARH_CITIES.map((c) => (
              <option key={c} value={c}>{c} (CG)</option>
            ))}
          </optgroup>
          <optgroup label="📍 Madhya Pradesh (मध्य प्रदेश के 55+ जिले व शहर)">
            {MADHYA_PRADESH_CITIES.map((c) => (
              <option key={c} value={c}>{c} (MP)</option>
            ))}
          </optgroup>
          <optgroup label="🏙️ Other Major Metros">
            {OTHER_METRO_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        </select>

        {/* Quick Location Pills: CG & MP */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onFilterChange({ city: ALL_CHHATTISGARH_OPTION })}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer border ${
                filters.city === ALL_CHHATTISGARH_OPTION
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              ⭐ All CG
            </button>
            {['Raipur', 'Bhilai', 'Bilaspur', 'Durg'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onFilterChange({ city: c })}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer border ${
                  filters.city === c
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onFilterChange({ city: ALL_MADHYA_PRADESH_OPTION })}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer border ${
                filters.city === ALL_MADHYA_PRADESH_OPTION
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              ⭐ All MP
            </button>
            {['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onFilterChange({ city: c })}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer border ${
                  filters.city === c
                    ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                    : 'bg-emerald-50/40 text-slate-700 border-slate-200 hover:bg-emerald-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verified & Hundred Builders Quick Toggles */}
      <div className="space-y-2.5">
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-900">{t.featured}</span>
          </div>
          <input
            type="checkbox"
            checked={filters.hundredBuildersOnly}
            onChange={(e) => onFilterChange({ hundredBuildersOnly: e.target.checked })}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 cursor-pointer hover:bg-emerald-50 transition">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">{t.verified}</span>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </label>
      </div>

      {/* BHK Selection */}
      {(filters.purpose === 'buy' || filters.purpose === 'rent') && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.bedrooms}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((num) => {
              const isSelected = filters.bhk.includes(num);
              return (
                <button
                  key={num}
                  id={`filter-bhk-${num}`}
                  type="button"
                  onClick={() => handleBhkToggle(num)}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {num} BHK
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget / Price Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.price} Range
          </label>
          <span className="text-xs font-bold text-amber-700">
            {formatPriceLabel(filters.minPrice)} - {formatPriceLabel(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={filters.purpose === 'rent' ? 10000 : 1500000}
          max={filters.purpose === 'rent' ? 250000 : 50000000}
          step={filters.purpose === 'rent' ? 5000 : 500000}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />
        <div className="flex justify-between text-[11px] text-slate-600 font-medium">
          <span>{formatPriceLabel(filters.purpose === 'rent' ? 10000 : 1500000)}</span>
          <span>{formatPriceLabel(filters.purpose === 'rent' ? 250000 : 50000000)}</span>
        </div>
      </div>

      {/* Property Type Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.propertyType}
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
        >
          <option value="all">{lang === 'hi' ? 'सभी प्रकार (All Types)' : 'All Property Types'}</option>
          <option value="apartment">{t.apartment}</option>
          <option value="villa">{t.independentHouse}</option>
          <option value="builder_floor">{t.builderFloor}</option>
          <option value="plot">{t.plot}</option>
          <option value="agricultural_land">{t.agriculturalLand}</option>
          <option value="commercial_office">{t.commercialOffice}</option>
          <option value="commercial_shop">{t.commercialShop}</option>
        </select>
      </div>

      {/* Listed By */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.listedBy}
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'hundred_builders', label: t.builder },
            { id: 'owner', label: `${t.owner} (0 Brokerage)` },
            { id: 'verified_agent', label: t.verifiedAgent },
            { id: 'registered_broker', label: lang === 'hi' ? 'रजिस्टर्ड ब्रोकर (RERA)' : 'Registered Broker (RERA)' },
          ].map((item) => (
            <label key={item.id} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.listedBy.includes(item.id)}
                onChange={() => handleListedByToggle(item.id)}
                className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnishing Status */}
      {(filters.purpose === 'buy' || filters.purpose === 'rent') && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.furnishing}
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'furnished', label: t.furnished },
              { id: 'semi_furnished', label: t.semiFurnished },
              { id: 'unfurnished', label: t.unfurnished },
            ].map((item) => (
              <label key={item.id} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.furnishing.includes(item.id)}
                  onChange={() => handleFurnishingToggle(item.id)}
                  className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Amenities Multi-check */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.amenities}
        </label>
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {amenitiesList.map((amenity) => (
            <label key={amenity.id} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
              />
              <span>{lang === 'hi' ? amenity.nameHi : amenity.nameEn}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};
