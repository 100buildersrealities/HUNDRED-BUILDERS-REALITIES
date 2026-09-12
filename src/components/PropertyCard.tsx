import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Building, 
  Check, 
  MessageSquare,
  CalendarCheck,
  Award,
  Trash2
} from 'lucide-react';
import { Property, AuthUser } from '../types';
import { Language, translations } from '../data/translations';
import { isPropertyOwnedByUser } from '../utils/propertyUtils';

interface PropertyCardProps {
  property: Property;
  lang: Language;
  isShortlisted: boolean;
  onToggleShortlist: (propertyId: string) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  onBookVisit: (property: Property) => void;
  viewMode?: 'grid' | 'list';
  authUser?: AuthUser | null;
  onDeleteProperty?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  lang,
  isShortlisted,
  onToggleShortlist,
  isCompared,
  onToggleCompare,
  onViewDetails,
  onBookVisit,
  viewMode = 'grid',
  authUser,
  onDeleteProperty,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const t = translations[lang];
  const isIndic = lang !== 'en';
  const isOwned = isPropertyOwnedByUser(property, authUser || null);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = property.contactWhatsApp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello, I am interested in your property on Hundred Builders Realities: "${property.title}" (Price: ${property.priceDisplayEn}) in ${property.locality}, ${property.city}. Please share more details.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${property.contactPhone.replace(/\s+/g, '')}`;
  };

  const isList = viewMode === 'list';

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => onViewDetails(property)}
      className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col ${
        isList ? 'md:flex-row' : ''
      }`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-slate-950 ${isList ? 'md:w-72 lg:w-80 shrink-0 h-60 md:h-auto' : 'h-56 sm:h-64'}`}>
        <img
          src={property.images[currentImgIndex] || property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isOwned && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-black bg-amber-400 text-slate-950 shadow-md border border-amber-300">
              <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
              <span>{isIndic ? 'आपकी लिस्टिंग' : 'Your Listing'}</span>
            </span>
          )}
          {property.isExclusiveHundredBuilders && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>{isIndic ? 'हंड्रेड बिल्डर्स' : 'Hundred Builders'}</span>
            </span>
          )}
          {property.isVerified && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-600/95 text-white shadow-md backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>{t.verified}</span>
            </span>
          )}
        </div>

        {/* Top Right Actions: Shortlist & Compare */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <button
            id={`compare-toggle-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            title={t.compare}
            className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer shadow-md ${
              isCompared
                ? 'bg-amber-600 text-white'
                : 'bg-white/80 hover:bg-white text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            id={`shortlist-toggle-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(property.id);
            }}
            title={t.shortlist}
            className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer shadow-md ${
              isShortlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Image carousel arrows (if multiple images) */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image index pill */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white z-10">
          {currentImgIndex + 1}/{property.images.length}
        </div>

        {/* Listed by pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[11px] font-semibold text-slate-200 z-10">
          {property.listedBy === 'hundred_builders' 
            ? 'Hundred Builders' 
            : property.listedBy === 'owner' 
            ? (isIndic ? 'मालिक द्वारा (0 ब्रोकरेज)' : 'By Owner (0 Brokerage)') 
            : property.listedBy === 'registered_broker'
            ? (isIndic ? 'रजिस्टर्ड ब्रोकर (RERA)' : 'Registered Broker')
            : (isIndic ? 'वेरिफाइड एजेंट' : 'Verified Agent')}
        </div>
      </div>

      {/* Property Details Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price and Rate */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                {isIndic ? property.priceDisplayHi : property.priceDisplayEn}
              </span>
              {(property.category === 'agricultural_land' || property.purpose === 'agriculture' || property.agriculturalLandDetails) ? (
                <span className="text-xs text-emerald-700 font-bold ml-2">
                  (₹{Math.round(property.price / (property.agriculturalLandDetails?.totalAreaAcres || (property.carpetAreaSqFt / 43560) || 1)).toLocaleString()}/{isIndic ? 'एकड़' : 'Acre'})
                </span>
              ) : (property.category === 'plot' || property.purpose === 'plot' || property.plotDetails) ? (
                <span className="text-xs text-indigo-700 font-bold ml-2">
                  (₹{property.plotDetails?.ratePerSqFt || Math.round(property.price / (property.carpetAreaSqFt || 1))}/{t.sqft} • ₹{property.plotDetails?.ratePerSqYd || Math.round(property.price / (property.plotAreaSqYds || (property.carpetAreaSqFt / 9) || 1))}/{isIndic ? 'गज' : 'Gaj'})
                </span>
              ) : (
                property.purpose === 'buy' && property.pricePerSqFt && (
                  <span className="text-xs text-slate-500 font-medium ml-2">
                    (₹{property.pricePerSqFt.toLocaleString()}/{t.sqft})
                  </span>
                )
              )}
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
              property.purpose === 'buy'
                ? 'bg-amber-100 text-amber-800'
                : property.purpose === 'rent'
                ? 'bg-emerald-100 text-emerald-800'
                : property.purpose === 'plot'
                ? 'bg-purple-100 text-purple-800'
                : property.purpose === 'agriculture'
                ? 'bg-lime-100 text-lime-900 border border-lime-300 font-extrabold'
                : property.purpose === 'lease'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-extrabold'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {t[property.purpose] || property.purpose}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-amber-600 transition">
            {isIndic ? property.titleHi : property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-slate-500 text-xs mt-1.5 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mr-1" />
            <span className="truncate">
              {property.village ? `${property.village}, ` : ''}{property.locality}, {property.city}
              {property.khasraNumber ? ` • ${isIndic ? 'खसरा' : 'Khasra'}: ${property.khasraNumber}` : ''}
            </span>
          </div>

          {/* Key Specs Pills (BHK vs Agricultural Area Specifications) */}
          {(property.category === 'agricultural_land' || property.purpose === 'agriculture' || property.agriculturalLandDetails) ? (
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs mb-4">
              <div className="flex flex-col">
                <span className="text-emerald-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'कुल रकबा' : 'Total Area'}
                </span>
                <span className="font-black text-emerald-950 truncate">
                  {property.agriculturalLandDetails?.totalAreaAcres || (property.carpetAreaSqFt / 43560).toFixed(2)} {isIndic ? 'एकड़' : 'Acres'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold truncate">
                  {property.agriculturalLandDetails?.totalAreaDismil || Math.round(property.carpetAreaSqFt / 435.6)} {isIndic ? 'डिसमिल' : 'Dismil'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'रोड फ्रंट' : 'Road Front'}
                </span>
                <span className="font-black text-emerald-950 truncate">
                  {property.agriculturalLandDetails?.roadFrontageFt ? `${property.agriculturalLandDetails.roadFrontageFt} ft` : 'मुख्य मार्ग'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold truncate">
                  {property.agriculturalLandDetails?.approachRoadWidthFt ? `${property.agriculturalLandDetails.approachRoadWidthFt} ft Road` : 'Tar Road'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'सिंचाई / बोरवेल' : 'Irrigation'}
                </span>
                <span className="font-black text-emerald-950 truncate">
                  {property.agriculturalLandDetails?.irrigationStatus === 'fully_irrigated' 
                    ? (isIndic ? 'पूर्ण सिंचित' : 'Irrigated') 
                    : (property.agriculturalLandDetails?.hasBorewell ? (isIndic ? 'बोरवेल युक्त' : 'Borewell') : (isIndic ? 'उपजाऊ' : 'Fertile'))}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold truncate">
                  {property.agriculturalLandDetails?.hasElectricityConnection ? (isIndic ? '3-Ph बिजली' : '3-Ph Power') : (isIndic ? 'फ्रीहोल्ड' : 'Clear Title')}
                </span>
              </div>
            </div>
          ) : (property.category === 'plot' || property.purpose === 'plot' || property.plotDetails) ? (
            <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs mb-4">
              <div className="flex flex-col">
                <span className="text-indigo-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'प्लॉट साइज' : 'Dimensions'}
                </span>
                <span className="font-black text-indigo-950 truncate">
                  {property.plotDetails?.dimensionsText || (property.plotDetails?.plotWidthFt && property.plotDetails?.plotLengthFt ? `${property.plotDetails.plotWidthFt}x${property.plotDetails.plotLengthFt} ft` : `${property.carpetAreaSqFt} sq.ft`)}
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold truncate">
                  {property.plotDetails?.totalAreaSqYds || property.plotAreaSqYds || Math.round(property.carpetAreaSqFt / 9)} {isIndic ? 'वर्ग गज (Gaj)' : 'Sq.Yds'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-indigo-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'सड़क / कॉर्नर' : 'Road / Corner'}
                </span>
                <span className="font-black text-indigo-950 truncate">
                  {property.plotDetails?.facingRoadWidthFt || 30} ft {property.plotDetails?.isCornerPlot ? (isIndic ? '(कॉर्नर)' : '(Corner)') : ''}
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold truncate">
                  {property.plotDetails?.roadType ? property.plotDetails.roadType.replace('_', ' ') : 'CC Road'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-indigo-800 text-[10px] font-extrabold uppercase">
                  {isIndic ? 'स्वीकृति / दिशा' : 'Approval / Facing'}
                </span>
                <span className="font-black text-indigo-950 truncate capitalize">
                  {property.plotDetails?.approvalType === 'tncp_approved' ? 'T&CP' : property.plotDetails?.approvalType === 'rera_approved' ? 'RERA' : 'Diverted'}
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold truncate">
                  {property.plotDetails?.facingDirection || property.facing || 'East'} {isIndic ? 'मुखी' : 'Facing'}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
              <div className="flex flex-col">
                <span className="text-slate-600 text-[10px] font-semibold uppercase">{t.bhk} / Type</span>
                <span className="font-bold text-slate-800">
                  {property.bhk ? `${property.bhk} BHK` : property.category.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-600 text-[10px] font-semibold uppercase">{t.carpetArea}</span>
                <span className="font-bold text-slate-800">{property.carpetAreaSqFt} {t.sqft}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-600 text-[10px] font-semibold uppercase">{t.furnishing}</span>
                <span className="font-bold text-slate-800 truncate capitalize">
                  {property.furnishing.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            id={`book-visit-btn-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onBookVisit(property);
            }}
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{isIndic ? 'विजिट बुक करें' : 'Site Visit'}</span>
          </button>

          <button
            id={`whatsapp-btn-${property.id}`}
            onClick={handleWhatsApp}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            id={`call-btn-${property.id}`}
            onClick={handleCall}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
            title="Call Owner / Builder"
          >
            <Phone className="w-4 h-4" />
          </button>

          {isOwned && onDeleteProperty && (
            <button
              id={`delete-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProperty(property);
              }}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer flex items-center justify-center shrink-0"
              title={isIndic ? 'प्रॉपर्टी डिलीट करें' : 'Delete Property'}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
