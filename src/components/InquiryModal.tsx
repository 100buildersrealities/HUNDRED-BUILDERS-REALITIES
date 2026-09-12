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
  Sparkles,
  MessageSquare,
  Send,
  ExternalLink,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Property, SiteVisitBooking } from '../types';
import { Language, translations } from '../data/translations';
import { sanitizeText, checkRateLimit, isHoneypotTriggered } from '../utils/security';

const WHATSAPP_NOTIFICATION_NUMBER = '917805980006';
const WHATSAPP_DISPLAY_NUMBER = '+91 78059-80006';

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
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<SiteVisitBooking | null>(null);

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

    // Format WhatsApp notification message for +91 78059 80006
    const nowTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const notificationMsg = 
`🚨 *नई साइट विजिट बुकिंग अलर्ट (NEW SITE VISIT ALERT)* 🚨
🏢 *100 BUILDERS REALITIES*

👤 *ग्राहक का विवरण (Client Details):*
• नाम: *${cleanName}*
• मोबाइल: *${cleanPhone}*
${cleanEmail && cleanEmail !== 'user@example.com' ? `• ईमेल: ${cleanEmail}\n` : ''}
📍 *प्रॉपर्टी का विवरण (Property Details):*
• प्रॉपर्टी: *${property.title}*
• स्थान: *${property.locality}, ${property.city}${property.state ? ` (${property.state})` : ''}*
• कीमत: *${property.priceDisplayEn}*
• प्रॉपर्टी ID: *${property.id}*
${property.reraId ? `• RERA No: *${property.reraId}*\n` : ''}
📅 *विजिट शेड्यूलिंग (Visit Schedule):*
• दिनांक: *${date}*
• समय स्लॉट: *${timeSlot}*
${cleanNotes ? `📝 *विशेष मांग / नोट:* ${cleanNotes}\n` : ''}
⏰ *बुकिंग समय:* ${nowTime}
🌐 *पोर्टल:* 100 BUILDERS REALITIES (https://100builders.com)
---------------------------------------
📌 _कृपया ग्राहक से संपर्क कर साइट विजिट कन्फर्म करें।_`;

    const waLink = `https://wa.me/${WHATSAPP_NOTIFICATION_NUMBER}?text=${encodeURIComponent(notificationMsg)}`;
    setWhatsappUrl(waLink);
    setConfirmedBooking(booking);

    // Automatically trigger WhatsApp notification dispatch
    try {
      window.open(waLink, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Browser prevented automatic WhatsApp opening, manual button is available', err);
    }

    onConfirmBooking(booking);
    setIsSuccess(true);
  };

  const handleManualOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    onClose();
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
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'hi' ? 'साइट विजिट सफलतापूर्वक बुक हो गई!' : 'Site Visit Confirmed!'}
              </h3>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>व्हाट्सप्प नोटिफिकेशन: {WHATSAPP_DISPLAY_NUMBER}</span>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {lang === 'hi' 
                  ? `आपकी साइट विजिट का नोटिफिकेशन 100 Builders Realities के आधिकारिक व्हाट्सएप नंबर ${WHATSAPP_DISPLAY_NUMBER} पर प्रेषित कर दिया गया है।` 
                  : `Your site visit alert has been dispatched to official WhatsApp ${WHATSAPP_DISPLAY_NUMBER}.`}
              </p>
            </div>

            {/* Booking Details Summary */}
            {confirmedBooking && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700">{confirmedBooking.propertyTitle}</span>
                  <span className="text-emerald-700 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded">
                    {confirmedBooking.preferredDate}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">क्लाइंट नाम:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.userName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">मोबाइल:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.userPhone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">समय स्लॉट:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.preferredTimeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">अलर्ट स्टेटस:</span>
                    <span className="font-bold text-emerald-600">✓ WhatsApp Sent</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="inquiry-open-whatsapp-btn"
                type="button"
                onClick={handleManualOpenWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>व्हाट्सप्प पर नोटिफिकेशन खोलें / भेजें ({WHATSAPP_DISPLAY_NUMBER})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${WHATSAPP_NOTIFICATION_NUMBER.replace(/[^0-9]/g, '')}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-200 transition flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-700" />
                  <span>हेल्पलाइन कॉल</span>
                </a>

                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer"
                >
                  <span>संपन्न (Done)</span>
                </button>
              </div>
            </div>
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

            {/* WhatsApp Alert Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-900">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold block text-emerald-950">
                  {lang === 'hi' ? `सीधा व्हाट्सप्प अलर्ट: ${WHATSAPP_DISPLAY_NUMBER}` : `Direct WhatsApp Alert: ${WHATSAPP_DISPLAY_NUMBER}`}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {lang === 'hi' 
                    ? 'विजिट बुक करते ही नोटिफिकेशन सीधे हमारे आधिकारिक WhatsApp पर पहुंचेगा।' 
                    : 'Booking alert will instantly ping our dedicated coordinator on WhatsApp.'}
                </span>
              </div>
            </div>

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
              className="w-full bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मुफ्त साइट विजिट बुक करें (WhatsApp अलर्ट के साथ)' : 'Confirm Free Site Visit (With WhatsApp Alert)'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
