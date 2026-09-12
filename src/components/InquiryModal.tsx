import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  CheckCircle2, 
  Building,
  Sparkles
} from 'lucide-react';
import { Property, SiteVisitBooking } from '../types';
import { Language, translations } from '../data/translations';
import { sanitizeText, checkRateLimit, isHoneypotTriggered } from '../utils/security';

interface InquiryModalProps {
  property: Property | null;
  onClose: () => void;
  onConfirmBooking: (booking: SiteVisitBooking) => void;
  lang: Language;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  onClose,
  onConfirmBooking,
  lang,
}) => {
  if (!property) return null;

  const t = translations[lang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security Guard 1: Anti-Bot Trap
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[Security Guard] Bot inquiry blocked');
      return;
    }

    // Security Guard 2: Rate Limit (Max 4 bookings per minute)
    const rateCheck = checkRateLimit('site_visit_booking', 4, 60000);
    if (!rateCheck.allowed) {
      setErrorMsg(lang === 'hi' 
        ? `सुरक्षा कारणों से बहुत अधिक प्रयास। कृपया ${rateCheck.retryAfterSec} सेकंड बाद प्रयास करें।`
        : `Too many attempts. Please wait ${rateCheck.retryAfterSec} seconds before submitting again.`);
      return;
    }

    if (!name.trim() || !phone.trim()) return;

    // Security Guard 3: Sanitization
    const cleanName = sanitizeText(name.trim(), 80);
    const cleanPhone = sanitizeText(phone.trim(), 20);
    const cleanEmail = sanitizeText(email.trim(), 80);
    const cleanNotes = sanitizeText(notes.trim(), 500);

    const booking: SiteVisitBooking = {
      id: `visit-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      userName: cleanName,
      userPhone: cleanPhone,
      userEmail: cleanEmail || 'user@example.com',
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      notes: cleanNotes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(booking);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div id="inquiry-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.scheduleVisit}</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'मुफ्त कैब पिकअप व साइट गाइड सुविधा' : 'Hundred Builders Certified Assisted Site Tour'}
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {lang === 'hi' ? 'साइट विजिट बुक हो गई है!' : 'Site Visit Confirmed!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {lang === 'hi' 
                ? `हमारी टीम ${phone} पर आपसे जल्द संपर्क करेगी और विजिट की पुष्टि करेगी।` 
                : `Hundred Builders coordinator will call ${phone} to confirm your appointment.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Anti-Bot Trap */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <input
                type="text"
                name="user_visit_trap_input"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Property Summary Pill */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3">
              <img 
                src={property.images[0]} 
                alt="thumb" 
                referrerPolicy="no-referrer" 
                className="w-14 h-12 rounded-xl object-cover" 
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">{property.title}</h4>
                <p className="text-[11px] text-amber-700 font-extrabold">{property.priceDisplayEn} • {property.locality}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t.ownerName} *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.ownerPhone} *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 78059 80006"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.ownerEmail}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                    <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 06:30 PM">Evening (04:00 PM - 06:30 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Specific Requirements or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need cab pickup / loan pre-approval / family visiting together..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              id="confirm-site-visit-submit-btn"
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मुफ्त साइट विजिट कन्फर्म करें' : 'Confirm Free Site Visit'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
