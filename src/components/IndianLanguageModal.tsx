import React, { useState, useMemo } from 'react';
import { X, Search, Check, Globe, Sparkles, MapPin } from 'lucide-react';
import { Language, INDIAN_LANGUAGES, IndianLanguageInfo } from '../data/translations';

interface IndianLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const IndianLanguageModal: React.FC<IndianLanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'north_central' | 'south' | 'west' | 'east_ne'>('all');

  const filteredLanguages = useMemo(() => {
    return INDIAN_LANGUAGES.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.regionCategory === selectedCategory || item.regionCategory === 'all';
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nameNative.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.nameHi.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.script.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <div
      id="indian-language-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="indian-language-modal"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tricolor Accent */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-4 sm:p-6 border-b border-amber-500/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 text-xl shadow-inner shrink-0">
                🇮🇳
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">
                    भारत की भाषाएं (Languages of India)
                  </h2>
                  <span className="text-[10px] font-extrabold bg-amber-400/20 border border-amber-300/40 text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    24+ भाषाएं
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  अपनी पसंदीदा भारतीय भाषा चुनें • भारतीय संविधान की 8वीं अनुसूची की भाषाएं एवं प्रमुख क्षेत्रीय बोलियां
                </p>
              </div>
            </div>

            <button
              id="indian-language-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="indian-language-search-input"
              type="text"
              placeholder="भाषा खोजें (Search e.g. বাংলা, Tamil, मराठी, Telugu, ગુજરાતી, हिन्दी)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Regional Filter Chips */}
          <div className="mt-3 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🇮🇳 सभी भाषाएं ({INDIAN_LANGUAGES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('north_central')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === 'north_central'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🏔️ उत्तर व मध्य भारत
            </button>
            <button
              onClick={() => setSelectedCategory('south')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === 'south'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🌴 दक्षिण भारत
            </button>
            <button
              onClick={() => setSelectedCategory('west')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === 'west'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🌅 पश्चिम भारत
            </button>
            <button
              onClick={() => setSelectedCategory('east_ne')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === 'east_ne'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🌾 पूर्व व पूर्वोत्तर भारत
            </button>
          </div>
        </div>

        {/* Current Active Language Info */}
        <div className="bg-amber-50/80 px-4 sm:px-6 py-2 border-b border-amber-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-amber-900 font-medium">
            <span className="text-slate-500">वर्तमान सक्रिय भाषा:</span>
            <span className="font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
              {currentLangObj.nameNative} ({currentLangObj.nameEn})
            </span>
          </div>
          <span className="text-amber-700 font-semibold hidden sm:inline">
            1-क्लिक में तुरंत भाषा बदलें
          </span>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[55vh]">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Globe className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">कोई भाषा नहीं मिली</p>
              <p className="text-xs text-slate-400 mt-1">कृपया दूसरा शब्द या लिपि खोजें</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredLanguages.map((item: IndianLanguageInfo) => {
                const isActive = item.code === currentLang;
                return (
                  <button
                    key={item.code}
                    id={`lang-btn-${item.code}`}
                    onClick={() => {
                      onSelectLanguage(item.code);
                      onClose();
                    }}
                    className={`group relative text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/50 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {/* Native Script Large Display */}
                        <div className="text-base sm:text-lg font-black text-slate-900 leading-tight group-hover:text-amber-700 transition">
                          {item.nameNative}
                        </div>
                        {/* English and Hindi Names */}
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          {item.nameEn} {item.nameEn !== item.nameHi && `• ${item.nameHi}`}
                        </div>
                      </div>

                      {isActive ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 group-hover:text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition shrink-0">
                          चुनें →
                        </span>
                      )}
                    </div>

                    {/* Region and metadata */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1 truncate max-w-[170px]" title={item.region}>
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.region}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.script}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>हंड्रेड बिल्डर्स रियलिटीज भारत के सभी नागरिकों व राज्यों का स्वागत करता है।</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
