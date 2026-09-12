import React from 'react';
import { 
  X, 
  CalendarCheck, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { SiteVisitBooking } from '../types';
import { Language, translations } from '../data/translations';

interface InquiriesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: SiteVisitBooking[];
  onRemoveBooking: (id: string) => void;
  lang: Language;
}

export const InquiriesListModal: React.FC<InquiriesListModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onRemoveBooking,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div id="inquiries-list-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.inquiriesTitle} ({bookings.length})</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'आपकी बुक की गई साइट विजिट्स' : 'Scheduled property visits and coordinator contacts'}
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
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">{t.noInquiries}</p>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'hi' ? 'किसी भी प्रॉपर्टी पर "विजिट बुक करें" बटन दबाएं।' : 'Click "Book Free Site Visit" on any property to schedule your tour.'}
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div 
                key={b.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      {lang === 'hi' ? 'पुष्टीकृत (Confirmed)' : 'Visit Confirmed'}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveBooking(b.id)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                    title="Cancel Visit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{b.propertyTitle}</h4>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{b.preferredDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="font-semibold text-slate-700">{b.preferredTimeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{b.userPhone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{b.userEmail}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                    "{b.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
