import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  Building, 
  Layers, 
  ShieldCheck, 
  BadgePercent, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Sprout,
  FileSignature
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { PurposeType } from '../types';
import { CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES, OTHER_METRO_CITIES, ALL_CHHATTISGARH_OPTION, ALL_MADHYA_PRADESH_OPTION } from '../data/mockProperties';

interface HeroSearchProps {
  lang: Language;
  activePurpose: PurposeType;
  onSelectPurpose: (purpose: PurposeType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedBhk: number[];
  onToggleBhk: (bhk: number) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onExecuteSearch: () => void;
  totalListingsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  lang,
  activePurpose,
  onSelectPurpose,
  searchQuery,
  onSearchChange,
  selectedCity,
  onSelectCity,
  selectedBhk,
  onToggleBhk,
  selectedCategory,
  onSelectCategory,
  onExecuteSearch,
  totalListingsCount,
}) => {
  const t = translations[lang];
  const [showAllCgDropdown, setShowAllCgDropdown] = useState(false);
  const [showAllMpDropdown, setShowAllMpDropdown] = useState(false);

  const bhkOptions = [1, 2, 3, 4];

  // Key popular Chhattisgarh cities to display as prominent quick pills
  const popularCgCities = [
    'Raipur',
    'Bhilai',
    'Bilaspur',
    'Durg',
    'Korba',
    'Rajnandgaon',
    'Raigarh',
    'Jagdalpur',
    'Ambikapur',
    'Dhamtari',
    'Mahasamund'
  ];

  // Key popular Madhya Pradesh cities/towns to display as prominent quick pills
  const popularMpCities = [
    'Indore',
    'Bhopal',
    'Jabalpur',
    'Gwalior',
    'Ujjain',
    'Sagar',
    'Rewa',
    'Satna',
    'Ratlam',
    'Chhindwara',
    'Dewas',
    'Vidisha',
    'Pithampur',
    'Mhow (Dr. Ambedkar Nagar)'
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onExecuteSearch();
    }
  };

  return (
    <div id="hero-search-section" className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle architectural background grid & radial glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Hero Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-sm">
            <img 
              src="/logo.png" 
              alt="100 Builders Realities Emblem" 
              className="w-5 h-5 rounded-full object-cover border border-amber-400/50 shadow-xs shrink-0" 
              referrerPolicy="no-referrer" 
            />
            <span>{lang === 'hi' ? 'हंड्रेड बिल्डर्स रियलिटीज - 100% Purity & Surety (अखिल भारतीय रियल एस्टेट)' : 'Hundred Builders Realities - 100% Purity & Surety (Pan India)'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {lang === 'hi' ? (
              <>
                घर खरीदें, बेचें या किराए पर लें <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  पूरे भारत में (Across India)
                </span>
              </>
            ) : (
              <>
                Buy, Rent & Sell Real Estate <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Across India
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'रायपुर, इंदौर, भोपाल, दिल्ली-एनसीआर, मुंबई, बंगलुरु समेत पूरे भारत में वेरिफाइड फ्लैट्स, विला, प्लॉट्स और कमर्शियल स्पेस।'
              : 'Explore verified apartments, villas, plots, and commercial properties across all cities, regions, and prime locations in India.'}
          </p>
        </div>

        {/* Search Box Console */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 border border-slate-100">
          
          {/* Purpose Tabs */}
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
            <button
              id="hero-tab-buy"
              onClick={() => onSelectPurpose('buy')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'buy'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.buy}</span>
            </button>
            <button
              id="hero-tab-rent"
              onClick={() => onSelectPurpose('rent')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'rent'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{t.rent}</span>
            </button>
            <button
              id="hero-tab-commercial"
              onClick={() => onSelectPurpose('commercial')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'commercial'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.commercial}</span>
            </button>
            <button
              id="hero-tab-plot"
              onClick={() => onSelectPurpose('plot')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'plot'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.plots}</span>
            </button>
            <button
              id="hero-tab-agriculture"
              onClick={() => onSelectPurpose('agriculture')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'agriculture'
                  ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-emerald-50/90 text-emerald-900 hover:bg-emerald-100 border border-emerald-300/80 hover:text-emerald-950'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{t.agriculture}</span>
            </button>
            <button
              id="hero-tab-lease"
              onClick={() => onSelectPurpose('lease')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activePurpose === 'lease'
                  ? 'bg-indigo-800 text-white shadow-md ring-2 ring-indigo-400'
                  : 'bg-indigo-50/90 text-indigo-950 hover:bg-indigo-100 border border-indigo-200 hover:text-indigo-900'
              }`}
            >
              <FileSignature className="w-4 h-4 text-indigo-600" />
              <span>{t.lease}</span>
            </button>
          </div>

          {/* Search & City Input Bar */}
          <div className="mt-4 flex flex-col md:flex-row items-stretch gap-2.5">
            
            {/* Integrated City Selector in Search Bar */}
            <div className="md:w-60 flex items-center bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-2 text-slate-900 focus-within:ring-2 focus-within:ring-amber-500/30">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mr-1.5" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  {lang === 'hi' ? 'शहर / राज्य चुनें' : 'City / State'}
                </span>
                <select
                  id="hero-city-select-input"
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer w-full truncate"
                >
                  <option value="All Cities">🌐 All Cities (सभी शहर)</option>
                  <option value={ALL_CHHATTISGARH_OPTION} className="font-bold text-amber-700 bg-amber-50">
                    ⭐ {ALL_CHHATTISGARH_OPTION}
                  </option>
                  <option value={ALL_MADHYA_PRADESH_OPTION} className="font-bold text-emerald-700 bg-emerald-50">
                    ⭐ {ALL_MADHYA_PRADESH_OPTION}
                  </option>
                  <optgroup label="📍 Chhattisgarh (छत्तीसगढ़ के 33+ शहर)">
                    {CHHATTISGARH_CITIES.map((c) => (
                      <option key={c} value={c}>{c} (CG)</option>
                    ))}
                  </optgroup>
                  <optgroup label="📍 Madhya Pradesh (मध्य प्रदेश के सभी 55+ जिले व शहर)">
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
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="flex-1 relative flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 px-3.5 transition">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedCity !== 'All Cities'
                    ? `${t.searchPlaceholder} (${selectedCity})`
                    : (lang === 'hi' ? 'रायपुर, भिलाई, इलाका, कॉलोनी, या प्रोजेक्ट नाम से खोजें...' : 'Search by locality, project name, or city...')
                }
                className="w-full bg-transparent py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Execute Search Button */}
            <button
              id="hero-search-submit-btn"
              onClick={onExecuteSearch}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition cursor-pointer active:scale-98 shrink-0"
            >
              <Search className="w-5 h-5" />
              <span>{lang === 'hi' ? 'प्रॉपर्टी खोजें' : 'Search'}</span>
            </button>
          </div>

          {/* Dedicated Chhattisgarh City Quick Filters Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'hi' ? 'छत्तीसगढ़ के प्रमुख शहर (Search CG Cities):' : 'Chhattisgarh Cities:'}</span>
              </div>
              
              {/* All CG Cities Quick Toggle */}
              <button
                id="hero-btn-all-cg"
                onClick={() => onSelectCity(ALL_CHHATTISGARH_OPTION)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                  selectedCity === ALL_CHHATTISGARH_OPTION
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                ⭐ {lang === 'hi' ? 'छत्तीसगढ़ के सभी शहर' : 'All Chhattisgarh Cities'}
              </button>
            </div>

            {/* Pills for Popular Chhattisgarh Cities */}
            <div className="flex flex-wrap items-center gap-1.5">
              {popularCgCities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    id={`hero-pill-${city.toLowerCase()}`}
                    onClick={() => onSelectCity(city)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}

              {/* Toggle More CG Cities Button */}
              <div className="relative">
                <button
                  id="hero-btn-more-cg-cities"
                  onClick={() => setShowAllCgDropdown(!showAllCgDropdown)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition cursor-pointer flex items-center space-x-1"
                >
                  <span>{lang === 'hi' ? '+ 24 और शहर ▾' : '+ 24 More CG Cities ▾'}</span>
                </button>

                {showAllCgDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-72 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 grid grid-cols-2 gap-1 text-xs">
                    {CHHATTISGARH_CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onSelectCity(c);
                          setShowAllCgDropdown(false);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-lg transition ${
                          selectedCity === c
                            ? 'bg-amber-600 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dedicated Madhya Pradesh Cities, Tehsils & Villages Quick Filters Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'hi' ? 'मध्य प्रदेश के सभी शहर व गांव (Search MP):' : 'Madhya Pradesh (Cities & Rural):'}</span>
              </div>
              
              {/* All MP Cities Quick Toggle */}
              <button
                id="hero-btn-all-mp"
                onClick={() => onSelectCity(ALL_MADHYA_PRADESH_OPTION)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                  selectedCity === ALL_MADHYA_PRADESH_OPTION
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                ⭐ {lang === 'hi' ? 'मध्य प्रदेश के सभी शहर व गांव' : 'All Madhya Pradesh'}
              </button>
            </div>

            {/* Pills for Popular Madhya Pradesh Cities */}
            <div className="flex flex-wrap items-center gap-1.5">
              {popularMpCities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    id={`hero-pill-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onSelectCity(city)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                        : 'bg-emerald-50/40 text-slate-700 border-slate-200 hover:bg-emerald-100 hover:border-emerald-300'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}

              {/* Toggle More MP Cities / Villages Button */}
              <div className="relative">
                <button
                  id="hero-btn-more-mp-cities"
                  onClick={() => setShowAllMpDropdown(!showAllMpDropdown)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition cursor-pointer flex items-center space-x-1"
                >
                  <span>{lang === 'hi' ? '+ 70+ और जिले व तहसीलें ▾' : '+ 70+ More MP Districts & Towns ▾'}</span>
                </button>

                {showAllMpDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-80 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 grid grid-cols-2 gap-1 text-xs">
                    {MADHYA_PRADESH_CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onSelectCity(c);
                          setShowAllMpDropdown(false);
                        }}
                        className={`text-left px-2 py-1.5 rounded-lg transition truncate ${
                          selectedCity === c
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title={c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedCity !== 'All Cities' && (
                <button
                  onClick={() => onSelectCity('All Cities')}
                  className="text-xs text-slate-500 hover:text-amber-600 underline ml-auto cursor-pointer"
                >
                  {lang === 'hi' ? '✕ सभी शहर रीसेट करें' : '✕ Reset City'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters Row (BHK Chips + Category Chips) */}
          {(activePurpose === 'buy' || activePurpose === 'rent') && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                {t.bhk}:
              </span>
              {bhkOptions.map((b) => {
                const isSelected = selectedBhk.includes(b);
                return (
                  <button
                    key={b}
                    id={`hero-bhk-${b}`}
                    onClick={() => onToggleBhk(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {b} {t.bhk}
                  </button>
                );
              })}

              <div className="hidden sm:flex items-center space-x-2 ml-auto text-xs text-slate-500">
                <span className="font-medium">
                  {lang === 'hi' ? 'प्रॉपर्टी टाइप:' : 'Type:'}
                </span>
                <button
                  onClick={() => onSelectCategory('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => onSelectCategory('apartment')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    selectedCategory === 'apartment'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Flats
                </button>
                <button
                  onClick={() => onSelectCategory('villa')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    selectedCategory === 'villa'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Villas
                </button>
              </div>
            </div>
          )}

          {/* Quick Filters for Agriculture */}
          {activePurpose === 'agriculture' && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mr-1 flex items-center space-x-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'hi' ? 'कृषि भूमि खोजें:' : 'Agriculture Filters:'}</span>
              </span>
              {[
                { label: lang === 'hi' ? 'सभी कृषि भूमि (All)' : 'All Agriculture', q: '' },
                { label: lang === 'hi' ? 'सिंचित (Borewell / Canal)' : 'Irrigated / Borewell', q: 'सिंचित' },
                { label: lang === 'hi' ? 'फार्म हाउस (Farmhouse)' : 'Farmhouse / Plantation', q: 'फार्म हाउस' },
                { label: lang === 'hi' ? 'हाईवे टच (Highway Touch)' : 'Highway Touch Land', q: 'हाईवे' },
                { label: lang === 'hi' ? 'फलोद्यान / बागीचा (Orchard)' : 'Fruit Orchard', q: 'बागीचा' },
              ].map((pill, idx) => {
                const isSelected = searchQuery === pill.q;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSearchChange(pill.q)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Filters for Lease */}
          {activePurpose === 'lease' && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider mr-1 flex items-center space-x-1">
                <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'hi' ? 'लीज़ प्रॉपर्टीज:' : 'Lease Properties:'}</span>
              </span>
              {[
                { label: lang === 'hi' ? 'सभी लीज़ प्रॉपर्टी (All)' : 'All Lease', q: '' },
                { label: lang === 'hi' ? 'वेयरहाउस व गोदाम (Warehouse)' : 'Warehouse / Godown', q: 'वेयरहाउस' },
                { label: lang === 'hi' ? 'कमर्शियल ऑफिस / शोरूम' : 'Showroom / Office', q: 'शोरूम' },
                { label: lang === 'hi' ? 'इंडस्ट्रियल शेड व फैक्ट्री' : 'Industrial / Factory', q: 'इंडस्ट्रियल' },
                { label: lang === 'hi' ? 'लंबे समय की लीज़ (3-9 साल)' : 'Long-term (3-9 Yrs)', q: '3-9 वर्ष' },
                { label: lang === 'hi' ? 'कृषि / फार्म लीज़' : 'Agri / Farm Lease', q: 'फार्म लीज़' },
              ].map((pill, idx) => {
                const isSelected = searchQuery === pill.q;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSearchChange(pill.q)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-2xs'
                        : 'bg-indigo-50 text-indigo-950 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Feature Badges under Search console */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lang === 'hi' ? '100% CG-RERA वेरिफाइड' : '100% Verified Listings'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl px-3 py-2">
            <BadgePercent className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lang === 'hi' ? 'जीरो ब्रोकरेज विकल्प' : 'Zero Brokerage Options'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl px-3 py-2">
            <Building className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{lang === 'hi' ? 'हंड्रेड बिल्डर्स एक्सक्लूसिव' : 'Hundred Builders Direct'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl px-3 py-2">
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{lang === 'hi' ? 'छत्तीसगढ़ में साइट विजिट' : 'Free Site Visit Support'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
