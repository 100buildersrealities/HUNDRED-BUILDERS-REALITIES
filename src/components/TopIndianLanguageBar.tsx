import React, { useRef } from 'react';
import { Globe, ChevronRight, ChevronLeft, ChevronDown, Sparkles } from 'lucide-react';
import { Language, INDIAN_LANGUAGES } from '../data/translations';

interface TopIndianLanguageBarProps {
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenAllLanguagesModal: () => void;
}

export const TopIndianLanguageBar: React.FC<TopIndianLanguageBarProps> = ({
  currentLang,
  onSelectLanguage,
  onOpenAllLanguagesModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prominent Indian languages displayed directly as quick 1-click pills
  const popularLanguages = INDIAN_LANGUAGES.filter((item) => item.popular);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <div
      id="top-indian-language-bar"
      className="bg-slate-950 text-white border-b border-slate-800 text-xs select-none"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        {/* Left Badge: Bharat Flag & Label */}
        <div className="flex items-center space-x-1.5 shrink-0 pr-2 border-r border-slate-800">
          <span className="text-sm">🇮🇳</span>
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-[11px] sm:text-xs text-amber-400 tracking-tight hidden xs:inline">
              भारत की भाषाएं:
            </span>
            <span className="font-extrabold text-[11px] text-amber-400 tracking-tight xs:hidden">
              भाषा:
            </span>
          </div>
        </div>

        {/* Scrollable Quick Pills for Popular Indian Languages */}
        <div className="relative flex-1 flex items-center min-w-0 overflow-hidden">
          {/* Scroll left button */}
          <button
            onClick={() => scroll('left')}
            className="p-0.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded hidden md:flex items-center justify-center shrink-0 mr-1"
            title="Scroll Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
          >
            {popularLanguages.map((langItem) => {
              const isActive = langItem.code === currentLang;
              return (
                <button
                  key={langItem.code}
                  id={`top-quick-lang-${langItem.code}`}
                  onClick={() => onSelectLanguage(langItem.code)}
                  title={`${langItem.nameNative} (${langItem.nameEn}) - ${langItem.region}`}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap transition-all duration-150 cursor-pointer font-bold shrink-0 flex items-center space-x-1 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black ring-1 ring-amber-300'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{langItem.nameNative}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* Scroll right button */}
          <button
            onClick={() => scroll('right')}
            className="p-0.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded hidden md:flex items-center justify-center shrink-0 ml-1"
            title="Scroll Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Trigger: All 24+ Languages Modal Button */}
        <button
          id="top-all-languages-modal-btn"
          onClick={onOpenAllLanguagesModal}
          className="shrink-0 flex items-center space-x-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-2.5 sm:px-3 py-1 rounded-full text-[11px] shadow-xs cursor-pointer transition active:scale-95 border border-amber-400/40"
          title="भारत की सभी 24+ भाषाएं देखें व चुनें"
        >
          <Globe className="w-3 h-3 text-white" />
          <span className="hidden sm:inline">सभी 24+ भाषाएं</span>
          <span className="sm:hidden">24+ भाषाएं</span>
          <ChevronDown className="w-3 h-3 text-amber-200" />
        </button>
      </div>
    </div>
  );
};
