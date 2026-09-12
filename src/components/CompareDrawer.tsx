import React from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  MessageSquare,
  Building
} from 'lucide-react';
import { Property } from '../types';
import { Language, translations, amenitiesList } from '../data/translations';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: Property[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  lang: Language;
  onViewProperty: (property: Property) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  comparedProperties,
  onRemoveFromCompare,
  onClearCompare,
  lang,
  onViewProperty,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div id="compare-drawer-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.compareProperties}</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'कीमत, एरिया, स्पेसिफिकेशन व लोकेशन की साथ-साथ तुलना करें' : 'Side-by-side comparison of prices, areas, specs & amenities'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {comparedProperties.length > 0 && (
              <button
                onClick={onClearCompare}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {comparedProperties.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                {lang === 'hi' ? 'तुलना करने के लिए कोई प्रॉपर्टी नहीं चुनी गई है।' : 'No properties added to comparison yet.'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'hi' ? 'किसी भी प्रॉपर्टी कार्ड पर तराजू आइकन पर क्लिक करें।' : 'Click the scale icon on any property card to add it to comparison.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase border-b border-slate-200 w-44">
                      Feature
                    </th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="p-3 border-b border-slate-200 min-w-[240px] max-w-[280px]">
                        <div className="relative">
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="absolute top-0 right-0 p-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-lg text-slate-500 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="h-32 rounded-xl overflow-hidden mb-2 bg-slate-100">
                            <img src={p.images[0]} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{p.title}</h4>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.price}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-extrabold text-slate-950 text-sm">
                        {lang === 'hi' ? p.priceDisplayHi : p.priceDisplayEn}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">Location</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-slate-700">
                        {p.locality}, {p.city}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.carpetArea}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-slate-800">
                        {p.carpetAreaSqFt} {t.sqft}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.bhk} / Category</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-semibold text-slate-800">
                        {p.bhk ? `${p.bhk} BHK` : p.category.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.furnishing}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 capitalize text-slate-700">
                        {p.furnishing.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.possessionStatus}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 capitalize text-slate-700">
                        {p.possession.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">{t.listedBy}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-semibold text-slate-800">
                        {p.listedBy === 'hundred_builders' ? 'Hundred Builders' : p.listedBy === 'owner' ? 'Owner' : 'Agent'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50/50">Actions</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            onClose();
                            onViewProperty(p);
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                        >
                          {t.viewDetails}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
