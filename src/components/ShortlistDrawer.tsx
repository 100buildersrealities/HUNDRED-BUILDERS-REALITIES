import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  MapPin, 
  Phone, 
  MessageSquare,
  Building
} from 'lucide-react';
import { Property } from '../types';
import { Language, translations } from '../data/translations';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedProperties: Property[];
  onRemoveShortlist: (id: string) => void;
  onClearShortlist: () => void;
  lang: Language;
  onViewProperty: (property: Property) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistedProperties,
  onRemoveShortlist,
  onClearShortlist,
  lang,
  onViewProperty,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div id="shortlist-drawer-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.shortlisted} ({shortlistedProperties.length})</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'आपकी पसंदीदा प्रॉपर्टीज की लिस्ट' : 'Your saved and favorite properties'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {shortlistedProperties.length > 0 && (
              <button
                onClick={onClearShortlist}
                className="text-xs text-rose-300 hover:text-rose-200 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearAll}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-3">
          {shortlistedProperties.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                {lang === 'hi' ? 'अभी तक कोई पसंदीदा प्रॉपर्टी सेव नहीं की गई है।' : 'No shortlisted properties yet.'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'hi' ? 'कार्ड पर दिल के आइकन पर क्लिक करके प्रॉपर्टी सेव करें।' : 'Click the heart icon on any property to save it for later.'}
              </p>
            </div>
          ) : (
            shortlistedProperties.map((p) => (
              <div 
                key={p.id}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 transition"
              >
                <img 
                  src={p.images[0]} 
                  alt="thumb" 
                  referrerPolicy="no-referrer" 
                  className="w-20 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => { onClose(); onViewProperty(p); }}
                />
                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => { onClose(); onViewProperty(p); }}
                    className="font-bold text-xs text-slate-900 truncate hover:text-amber-600 cursor-pointer"
                  >
                    {p.title}
                  </h4>
                  <div className="flex items-center text-slate-500 text-[11px] mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
                    <span className="truncate">{p.locality}, {p.city}</span>
                  </div>
                  <span className="text-xs font-black text-slate-950 block mt-1">
                    {lang === 'hi' ? p.priceDisplayHi : p.priceDisplayEn}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => onRemoveShortlist(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { onClose(); onViewProperty(p); }}
                    className="text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
