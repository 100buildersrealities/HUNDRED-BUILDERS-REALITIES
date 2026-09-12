import React from 'react';
import { 
  Building2, 
  Trash2, 
  ExternalLink, 
  PlusCircle, 
  X, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  Calendar,
  AlertCircle,
  Home,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Property, AuthUser } from '../types';
import { Language } from '../data/translations';
import { isPropertyOwnedByUser } from '../utils/propertyUtils';

interface MyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  authUser: AuthUser | null;
  onSelectProperty: (property: Property) => void;
  onRequestDelete: (property: Property) => void;
  onOpenPostProperty: () => void;
  lang: Language;
}

export const MyListingsModal: React.FC<MyListingsModalProps> = ({
  isOpen,
  onClose,
  properties,
  authUser,
  onSelectProperty,
  onRequestDelete,
  onOpenPostProperty,
  lang,
}) => {
  if (!isOpen || !authUser) return null;

  const isHi = lang === 'hi';

  // Filter properties belonging to the logged-in user
  const myListings = properties.filter((p) => isPropertyOwnedByUser(p, authUser));

  const getRoleTitle = () => {
    switch (authUser.role) {
      case 'owner':
        return isHi ? 'प्रॉपर्टी मालिक डैशबोर्ड' : 'Property Owner Dashboard';
      case 'verified_agent':
        return isHi ? 'वेरिफाइड एजेंट लिस्टिंग्स' : 'Verified Agent Listings';
      case 'hundred_builders':
        return isHi ? 'हंड्रेड बिल्डर्स प्रोजेक्ट इन्वेंटरी' : 'Hundred Builders Inventory';
      case 'registered_broker':
        return isHi ? 'रजिस्टर्ड ब्रोकर पोर्टफोलियो' : 'Registered Broker Portfolio';
    }
  };

  const getRoleIcon = () => {
    switch (authUser.role) {
      case 'owner':
        return <Home className="w-5 h-5 text-amber-500" />;
      case 'verified_agent':
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'hundred_builders':
        return <Building2 className="w-5 h-5 text-emerald-500" />;
      case 'registered_broker':
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div 
      id="my-listings-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              {getRoleIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isHi ? 'मेरी लिस्टेड प्रॉपर्टीज' : 'My Listed Properties'}
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {myListings.length} {isHi ? 'प्रॉपर्टी' : 'Listings'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {authUser.name} • {getRoleTitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="my-listings-post-new-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenPostProperty();
              }}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isHi ? 'नई प्रॉपर्टी जोड़ें' : 'Post Property'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isHi 
                ? 'यहाँ आप अपने द्वारा लिस्ट की गई सभी संपत्तियों को देख सकते हैं एवं आवश्यकतानुसार डिलीट कर सकते हैं।' 
                : 'Manage your listed properties below. You can view details or delete listings at any time.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPostProperty();
            }}
            className="sm:hidden text-amber-900 font-bold underline text-xs"
          >
            {isHi ? '+ नई जोड़ें' : '+ Add New'}
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {myListings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-800">
                {isHi ? 'आपने अभी तक कोई प्रॉपर्टी लिस्ट नहीं की है' : 'No properties listed yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                {isHi 
                  ? 'अपनी प्रॉपर्टी को हंड्रेड बिल्डर्स पोर्टल पर मुफ्त में लिस्ट करें और सीधे बायर्स से इंक्वायरी प्राप्त करें।' 
                  : 'List your property for free on Hundred Builders and start receiving direct buyer inquiries.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPostProperty();
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer hover:from-amber-600 hover:to-amber-700 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isHi ? 'अपनी पहली प्रॉपर्टी लिस्ट करें' : 'Post Your First Property'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {myListings.map((prop) => {
                const isAgri = prop.category === 'agricultural_land';
                const isPlot = prop.category === 'plot';

                return (
                  <div 
                    key={prop.id}
                    id={`my-listing-item-${prop.id}`}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-3 sm:p-4 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      <img 
                        src={prop.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'} 
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-1 mb-1">
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                            {prop.purpose === 'buy' ? (isHi ? 'बिक्री' : 'Sale') : 
                             prop.purpose === 'rent' ? (isHi ? 'किराया' : 'Rent') : 
                             prop.purpose === 'agriculture' ? (isHi ? 'कृषि भूमि' : 'Agri') : 
                             (isHi ? 'प्लॉट' : 'Plot')}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            {prop.category.replace('_', ' ').toUpperCase()}
                          </span>
                          {prop.isVerified && (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {isHi ? prop.titleHi || prop.title : prop.title}
                        </h4>

                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1 flex-wrap gap-y-1">
                          <span className="font-black text-amber-700 text-sm">
                            {isHi ? prop.priceDisplayHi : prop.priceDisplayEn}
                          </span>
                          <span className="flex items-center space-x-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{prop.locality}, {prop.city}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                            <Eye className="w-3 h-3" />
                            <span>{prop.viewsCount || 1} {isHi ? 'देखा गया' : 'views'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProperty(prop);
                        }}
                        className="flex-1 sm:flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                        title={isHi ? 'विवरण देखें' : 'View Details'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isHi ? 'विवरण' : 'View'}</span>
                      </button>

                      {/* Prominent Delete Button */}
                      <button
                        id={`btn-delete-listing-${prop.id}`}
                        type="button"
                        onClick={() => onRequestDelete(prop)}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-xs"
                        title={isHi ? 'प्रॉपर्टी डिलीट करें' : 'Delete Property'}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>{isHi ? 'डिलीट करें' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isHi ? 'कुल लिस्टेड संपत्तियां:' : 'Total Listed Properties:'} <strong className="text-slate-900">{myListings.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer transition"
          >
            {isHi ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
