import React from 'react';
import { Trash2, AlertTriangle, X, MapPin, Building2, Tag } from 'lucide-react';
import { Property } from '../types';
import { Language } from '../data/translations';

interface DeletePropertyConfirmModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onConfirmDelete: (propertyId: string) => void;
  lang: Language;
}

export const DeletePropertyConfirmModal: React.FC<DeletePropertyConfirmModalProps> = ({
  isOpen,
  property,
  onClose,
  onConfirmDelete,
  lang,
}) => {
  if (!isOpen || !property) return null;

  const isHi = lang === 'hi';

  return (
    <div 
      id="delete-property-modal" 
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 overflow-hidden relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {isHi ? 'प्रॉपर्टी लिस्टिंग डिलीट करें' : 'Delete Property Listing'}
              </h3>
              <p className="text-xs text-rose-700 font-semibold mt-0.5">
                {isHi ? 'पुष्टिकरण आवश्यक (Confirmation Required)' : 'Permanent Action Warning'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-2 text-rose-800 bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              {isHi 
                ? 'क्या आप वाकई इस प्रॉपर्टी को पोर्टल से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।' 
                : 'Are you sure you want to permanently delete this property listing? This cannot be undone.'}
            </span>
          </div>

          {/* Property Snapshot */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <img 
              src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'} 
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-slate-900 truncate">
                {isHi ? property.titleHi || property.title : property.title}
              </h4>
              <p className="text-xs font-extrabold text-amber-700 mt-0.5">
                {isHi ? property.priceDisplayHi : property.priceDisplayEn}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{property.locality}, {property.city}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {isHi 
              ? 'हटाने के बाद, यह लिस्टिंग खरीदारों, वेबसाइट सर्च और आपके लिस्टिंग डैशबोर्ड से तुरंत हट जाएगी।' 
              : 'Once deleted, this listing will immediately be removed from buyer searches and your dashboard.'}
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {isHi ? 'रद्द करें (Cancel)' : 'Cancel'}
          </button>
          <button
            id="confirm-delete-property-btn"
            type="button"
            onClick={() => onConfirmDelete(property.id)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black shadow-md shadow-rose-600/30 transition flex items-center space-x-1.5 cursor-pointer active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isHi ? 'हाँ, प्रॉपर्टी डिलीट करें' : 'Yes, Delete Property'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
