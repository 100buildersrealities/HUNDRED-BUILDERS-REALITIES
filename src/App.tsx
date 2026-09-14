import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Building2, 
  Sparkles, 
  Grid, 
  List, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Heart, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  Search, 
  CalendarCheck, 
  TrendingUp, 
  X, 
  Megaphone, 
  Home,
  UserCheck,
  Briefcase,
  LayoutGrid,
  RefreshCw
} from 'lucide-react';
import { 
  Property, 
  FilterState, 
  PurposeType, 
  SiteVisitBooking,
  UserRole,
  AuthUser 
} from './types';
import { Language, translations, INDIAN_LANGUAGES } from './data/translations';
import { initialProperties, CITIES_LIST, CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES, ALL_CHHATTISGARH_OPTION, ALL_MADHYA_PRADESH_OPTION } from './data/mockProperties';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PropertyCard } from './components/PropertyCard';
import { FilterSidebar } from './components/FilterSidebar';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { CompareDrawer } from './components/CompareDrawer';
import { InquiryModal } from './components/InquiryModal';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { ValuationModal } from './components/ValuationModal';
import { InquiriesListModal } from './components/InquiriesListModal';
import { CareerCareModal } from './components/CareerCareModal';
import { SecurityTrustModal } from './components/SecurityTrustModal';
import { AdvertisementPackagesModal } from './components/AdvertisementPackagesModal';
import { AuthModal } from './components/AuthModal';
import { RolePortalsBanner } from './components/RolePortalsBanner';
import { DeletePropertyConfirmModal } from './components/DeletePropertyConfirmModal';
import { MyListingsModal } from './components/MyListingsModal';
import { Footer } from './components/Footer';
import { secureStore, secureRetrieve } from './utils/security';
import { isPropertyOwnedByUser } from './utils/propertyUtils';

export default function App() {
  // Language state (defaults to Hindi as requested by the user, easily switchable to English)
  const [lang, setLang] = useState<Language>('hi');

  // User Authentication State (tamper-evident storage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    return secureRetrieve<AuthUser | null>('hb_auth_user', null);
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('owner');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalReason, setAuthModalReason] = useState<'default' | 'post_property'>('default');

  const handleOpenAuth = (
    role: UserRole = 'owner', 
    mode: 'login' | 'signup' = 'login',
    reason: 'default' | 'post_property' = 'default'
  ) => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  // Rule: Property Owner, Verified Agent, Registered Broker must all sign up before posting a property
  const handleTriggerPostProperty = (preferredRole?: UserRole) => {
    if (authUser) {
      setEditingProperty(null);
      setIsPostPropertyOpen(true);
    } else {
      const targetRole = preferredRole || 'owner';
      handleOpenAuth(targetRole, 'signup', 'post_property');
    }
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    secureStore('hb_auth_user', user);
    const roleNameHi = 
      user.role === 'owner' ? 'प्रॉपर्टी मालिक' :
      user.role === 'verified_agent' ? 'वेरिफाइड एजेंट' :
      user.role === 'hundred_builders' ? 'हंड्रेड बिल्डर्स पार्टनर' : 'रजिस्टर्ड ब्रोकर (RERA)';
    setToastMessage(
      lang === 'hi'
        ? `स्वागत है, ${user.name}! आप ${roleNameHi} के रूप में सफलतापूर्वक लॉगिन हो चुके हैं।`
        : `Welcome, ${user.name}! Successfully logged in as ${user.role}.`
    );

    // If the authentication was triggered specifically to post a property, open post property form immediately
    if (authModalReason === 'post_property') {
      setIsPostPropertyOpen(true);
      setAuthModalReason('default');
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    secureStore('hb_auth_user', null);
    setToastMessage(lang === 'hi' ? 'आप सफलतापूर्वक लॉगआउट हो चुके हैं।' : 'You have been logged out.');
  };

  // Properties State (loads user-added listings and baseline genuine listings with tamper-evident secure storage)
  const [properties, setProperties] = useState<Property[]>(() => {
    const deletedIds = secureRetrieve<string[]>('hb_deleted_property_ids', []) || [];
    try {
      const saved = secureRetrieve<Property[] | null>('hb_realities_properties', null);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        const list = saved.filter((p: Property) => p && p.id && !p.id.startsWith('hb-') && !deletedIds.includes(p.id));
        if (list.length > 0) return list;
      }
    } catch (e) {
      console.error(e);
    }
    // Baseline seed properties so user immediately sees Owner, Agent, Builder, and Broker listings
    return initialProperties.filter(p => !deletedIds.includes(p.id));
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Shortlisted Properties IDs (tamper-evident storage)
  const [shortlistIds, setShortlistIds] = useState<string[]>(() => {
    const saved = secureRetrieve<string[]>('hb_shortlist', []) || [];
    return saved.filter(id => !id.startsWith('hb-'));
  });

  // Compare List Properties IDs (up to 3)
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Site Visits Bookings (tamper-evident storage)
  const [siteVisits, setSiteVisits] = useState<SiteVisitBooking[]>(() => {
    return secureRetrieve<SiteVisitBooking[]>('hb_site_visits', []);
  });

  // Filter State (defaults to 'all' so every visitor immediately sees all listings across all roles)
  const [filters, setFilters] = useState<FilterState>({
    purpose: 'all',
    city: 'All Cities',
    searchQuery: '',
    category: 'all',
    bhk: [],
    minPrice: 10000,
    maxPrice: 50000000,
    furnishing: [],
    possession: [],
    listedBy: [],
    amenities: [],
    verifiedOnly: false,
    hundredBuildersOnly: false,
    sortBy: 'relevance',
  });

  // View Mode: Grid or List
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals & Drawers
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isEmiCalcOpen, setIsEmiCalcOpen] = useState(false);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isCareerCareOpen, setIsCareerCareOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAdPackagesOpen, setIsAdPackagesOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[lang];

  // Number of listings owned by the logged-in user
  const myListingsCount = useMemo(() => {
    if (!authUser) return 0;
    return properties.filter(p => isPropertyOwnedByUser(p, authUser)).length;
  }, [properties, authUser]);

  // Handle request to delete property (opens confirmation modal)
  const handleRequestDeleteProperty = (property: Property) => {
    setDeletingProperty(property);
  };

  // Handle actual confirmed deletion of property
  const handleConfirmDeleteProperty = (propertyId: string) => {
    const targetProp = properties.find(p => p.id === propertyId);
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setShortlistIds(prev => prev.filter(id => id !== propertyId));
    setCompareIds(prev => prev.filter(id => id !== propertyId));
    
    // Persist deleted property ID so it is never re-added from mock/storage
    try {
      const existingDeleted = secureRetrieve<string[]>('hb_deleted_property_ids', []) || [];
      const updatedDeleted = Array.from(new Set([...existingDeleted, propertyId]));
      secureStore('hb_deleted_property_ids', updatedDeleted);
    } catch (e) {
      console.error(e);
    }

    // Sync deletion to central server
    fetch(`/api/properties/${propertyId}`, { method: 'DELETE' })
      .catch(err => console.warn('[Sync] Delete error:', err));

    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(null);
    }

    if (editingProperty?.id === propertyId) {
      setEditingProperty(null);
      setIsPostPropertyOpen(false);
    }

    setDeletingProperty(null);

    const propName = targetProp 
      ? (lang === 'hi' ? targetProp.titleHi : targetProp.title) 
      : 'प्रॉपर्टी';

    showToast(
      lang === 'hi'
        ? `लिस्टिंग "${propName}" पोर्टल से स्थायी रूप से हटा दी गई है।`
        : `Listing "${propName}" has been successfully deleted from the portal.`
    );
  };

  // Central Server synchronization: Fetch all properties so every user sees all listings
  const fetchPropertiesFromServer = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const deletedIds = secureRetrieve<string[]>('hb_deleted_property_ids', []) || [];
          const validList = data.filter((p: Property) => p && p.id && !p.id.startsWith('hb-') && !deletedIds.includes(p.id));
          if (validList.length > 0) {
            setProperties(validList);
            secureStore('hb_realities_properties', validList);
          }
        }
      }
    } catch (err) {
      console.warn('[Sync] Fallback to secure storage', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync on mount and periodically every 15 seconds so new properties posted by any user appear automatically
  useEffect(() => {
    fetchPropertiesFromServer();

    // Two-way sync: merge any local listings created offline
    try {
      const saved = secureRetrieve<Property[] | null>('hb_realities_properties', null);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        fetch('/api/properties/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientProperties: saved }),
        })
          .then(res => res.json())
          .then(result => {
            if (result.success && Array.isArray(result.properties)) {
              const deletedIds = secureRetrieve<string[]>('hb_deleted_property_ids', []) || [];
              const validList = result.properties.filter((p: Property) => p && p.id && !p.id.startsWith('hb-') && !deletedIds.includes(p.id));
              setProperties(validList);
              secureStore('hb_realities_properties', validList);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }

    const interval = setInterval(() => {
      fetchPropertiesFromServer();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPropertiesFromServer]);

  // Save to secureStorage when properties change
  useEffect(() => {
    try {
      secureStore('hb_realities_properties', properties);
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  // Save shortlist securely
  useEffect(() => {
    try {
      secureStore('hb_shortlist', shortlistIds);
    } catch (e) {
      console.error(e);
    }
  }, [shortlistIds]);

  // Save site visits securely
  useEffect(() => {
    try {
      secureStore('hb_site_visits', siteVisits);
    } catch (e) {
      console.error(e);
    }
  }, [siteVisits]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSelectLanguage = (newLang: Language) => {
    setLang(newLang);
    const langInfo = INDIAN_LANGUAGES.find((l) => l.code === newLang);
    if (langInfo) {
      showToast(`भाषा: ${langInfo.nameNative} (${langInfo.nameEn}) में सफलतापूर्वक बदली गई`);
    }
  };

  const handleSelectCity = (city: string) => {
    setFilters((prev) => ({ ...prev, city }));
  };

  const handleSelectTab = (purpose: PurposeType) => {
    setFilters((prev) => ({
      ...prev,
      purpose,
      category: purpose === 'agriculture' ? 'agricultural_land' : (prev.category === 'agricultural_land' ? 'all' : prev.category),
      minPrice: purpose === 'rent' ? 10000 : (purpose === 'lease' ? 15000 : (purpose === 'agriculture' ? 500000 : 1500000)),
      maxPrice: purpose === 'rent' ? 250000 : (purpose === 'lease' ? 1000000 : 50000000),
    }));
  };

  const handleToggleShortlist = (propertyId: string) => {
    setShortlistIds((prev) => {
      const exists = prev.includes(propertyId);
      const updated = exists ? prev.filter(id => id !== propertyId) : [...prev, propertyId];
      showToast(
        exists 
          ? (lang === 'hi' ? 'प्रॉपर्टी को शॉर्टलिस्ट से हटा दिया गया।' : 'Removed from shortlist.') 
          : (lang === 'hi' ? 'प्रॉपर्टी को पसंदीदा में सेव कर लिया गया!' : 'Added to favorites!')
      );
      return updated;
    });
  };

  const handleToggleCompare = (property: Property) => {
    setCompareIds((prev) => {
      const exists = prev.includes(property.id);
      if (exists) {
        return prev.filter(id => id !== property.id);
      }
      if (prev.length >= 3) {
        showToast(lang === 'hi' ? 'आप अधिकतम 3 संपत्तियों की तुलना कर सकते हैं।' : 'Maximum 3 properties can be compared.');
        return prev;
      }
      showToast(lang === 'hi' ? 'तुलना सूची में जोड़ा गया।' : 'Added to comparison.');
      return [...prev, property.id];
    });
  };

  const handleAddProperty = (newProp: Property) => {
    // 1. Immediately update UI state so listing appears instantly for the user
    setProperties((prev) => [newProp, ...prev]);
    setIsPostPropertyOpen(false);
    setEditingProperty(null);
    showToast(t.listingSuccessMsg);
    setSelectedProperty(newProp);

    // 2. Publish to Central Server so ALL users, browsers, and app instances see it immediately
    fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProp),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.property) {
          console.log('[Central Server] Published property live:', result.property.id);
        }
      })
      .catch(err => {
        console.warn('[Central Server] Published locally; server sync queued:', err);
      });
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsPostPropertyOpen(true);
  };

  const handleClosePostProperty = () => {
    setIsPostPropertyOpen(false);
    setEditingProperty(null);
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    setProperties((prev) => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
    if (selectedProperty?.id === updatedProp.id) {
      setSelectedProperty(updatedProp);
    }
    setEditingProperty(null);
    setIsPostPropertyOpen(false);

    // Sync to server
    fetch(`/api/properties/${updatedProp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProp),
    }).catch(err => console.warn('[Sync] Update error:', err));

    const propName = lang === 'hi' ? updatedProp.titleHi : updatedProp.title;
    showToast(
      lang === 'hi'
        ? `लिस्टिंग "${propName}" में फोटो, कीमत, साइज व सभी बदलाव सफलतापूर्वक सहेज लिए गए हैं!`
        : `Listing "${propName}" has been successfully updated with photos, price, and size changes!`
    );
  };

  const handleConfirmBooking = (booking: SiteVisitBooking) => {
    setSiteVisits((prev) => [booking, ...prev]);
    showToast(lang === 'hi' 
      ? '✅ साइट विजिट बुक! नोटिफिकेशन व्हाट्सएप +91 78059-80006 पर भेजा गया।' 
      : '✅ Site visit booked! Notification sent to WhatsApp +91 78059-80006.');
  };

  const handleRemoveBooking = (id: string) => {
    setSiteVisits((prev) => prev.filter(b => b.id !== id));
  };

  // Real-time counts across the 4 primary posting roles:
  // 1. मालिक (Owner - 0% ब्रोकरेज)
  // 2. वेरिफाइड एजेंट (Verified Agent)
  // 3. हंड्रेड बिल्डर्स (Hundred Builders)
  // 4. रजिस्टर्ड ब्रोकर (Registered Broker)
  const roleCounts = useMemo(() => {
    return {
      all: properties.length,
      owner: properties.filter(p => p.listedBy === 'owner').length,
      verified_agent: properties.filter(p => p.listedBy === 'verified_agent').length,
      hundred_builders: properties.filter(p => p.listedBy === 'hundred_builders').length,
      registered_broker: properties.filter(p => p.listedBy === 'registered_broker').length,
    };
  }, [properties]);

  // Filtered & Sorted Properties computation
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Purpose match
      if (filters.purpose === 'all') {
        // Show all listed properties from everyone!
      } else if (filters.purpose === 'agriculture') {
        if (prop.purpose !== 'agriculture' && prop.category !== 'agricultural_land') return false;
      } else if (filters.purpose === 'lease') {
        if (prop.purpose !== 'lease') return false;
      } else {
        if (prop.purpose !== filters.purpose) return false;
      }

      // City match
      if (filters.city !== 'All Cities') {
        const isAllCg = filters.city.toLowerCase().includes('chhattisgarh') || filters.city.toLowerCase().includes('छत्तीसगढ़');
        const isAllMp = filters.city.toLowerCase().includes('madhya pradesh') || filters.city.toLowerCase().includes('मध्य प्रदेश');
        if (isAllCg) {
          const isPropInCg = prop.state === 'Chhattisgarh' || CHHATTISGARH_CITIES.some(c => c.toLowerCase() === prop.city.toLowerCase());
          if (!isPropInCg) return false;
        } else if (isAllMp) {
          const isPropInMp = prop.state === 'Madhya Pradesh' || MADHYA_PRADESH_CITIES.some(c => c.toLowerCase() === prop.city.toLowerCase());
          if (!isPropInMp) return false;
        } else if (prop.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }
      }

      // Search Query (title, locality, city, state, builder, rera, cg/mp keywords, khasra, village)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = prop.title.toLowerCase().includes(query) || prop.titleHi.toLowerCase().includes(query);
        const matchesLocality = prop.locality.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        const matchesState = prop.state ? prop.state.toLowerCase().includes(query) : false;
        const matchesAddress = prop.address.toLowerCase().includes(query);
        const matchesRera = prop.reraId ? prop.reraId.toLowerCase().includes(query) : false;
        const matchesKhasra = prop.khasraNumber ? prop.khasraNumber.toLowerCase().includes(query) : false;
        const matchesVillage = prop.village ? prop.village.toLowerCase().includes(query) : false;
        const matchesTehsil = prop.tehsil ? prop.tehsil.toLowerCase().includes(query) : false;
        const matchesAgriKeyword = (query.includes('agri') || query.includes('कृषि') || query.includes('खेती') || query.includes('फार्म') || query.includes('जमीन') || query.includes('borewell') || query.includes('सिंचित') || query.includes('बागीचा') || query.includes('हाईवे')) && (prop.purpose === 'agriculture' || prop.category === 'agricultural_land');
        const matchesCgKeyword = (query === 'cg' || query.includes('chhattisgarh') || query.includes('छत्तीसगढ़')) && 
          (prop.state === 'Chhattisgarh' || CHHATTISGARH_CITIES.some(c => c.toLowerCase() === prop.city.toLowerCase()));
        const matchesMpKeyword = (query === 'mp' || query.includes('madhya pradesh') || query.includes('मध्य प्रदेश') || query.includes('मप्र') || query.includes('एमपी')) && 
          (prop.state === 'Madhya Pradesh' || MADHYA_PRADESH_CITIES.some(c => c.toLowerCase() === prop.city.toLowerCase()));
        
        if (!matchesTitle && !matchesLocality && !matchesCity && !matchesState && !matchesAddress && !matchesRera && !matchesKhasra && !matchesVillage && !matchesTehsil && !matchesAgriKeyword && !matchesCgKeyword && !matchesMpKeyword) {
          return false;
        }
      }

      // Category match
      if (filters.category !== 'all' && prop.category !== filters.category) {
        return false;
      }

      // BHK match
      if (filters.bhk.length > 0 && prop.bhk) {
        if (!filters.bhk.includes(prop.bhk)) return false;
      }

      // Price range
      if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
        return false;
      }

      // Furnishing
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(prop.furnishing)) {
        return false;
      }

      // Possession
      if (filters.possession.length > 0 && !filters.possession.includes(prop.possession)) {
        return false;
      }

      // Listed By
      if (filters.listedBy.length > 0 && !filters.listedBy.includes(prop.listedBy)) {
        return false;
      }

      // Verified Only
      if (filters.verifiedOnly && !prop.isVerified) {
        return false;
      }

      // Hundred Builders Only
      if (filters.hundredBuildersOnly && !prop.isExclusiveHundredBuilders) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(a => prop.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low_high') return a.price - b.price;
      if (filters.sortBy === 'price_high_low') return b.price - a.price;
      if (filters.sortBy === 'area_high_low') return b.carpetAreaSqFt - a.carpetAreaSqFt;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default: relevance with Hundred Builders featured prioritized
      if (a.isExclusiveHundredBuilders && !b.isExclusiveHundredBuilders) return -1;
      if (!a.isExclusiveHundredBuilders && b.isExclusiveHundredBuilders) return 1;
      return 0;
    });
  }, [properties, filters]);

  const shortlistedProperties = useMemo(() => {
    return properties.filter(p => shortlistIds.includes(p.id));
  }, [properties, shortlistIds]);

  const comparedProperties = useMemo(() => {
    return properties.filter(p => compareIds.includes(p.id));
  }, [properties, compareIds]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        onSelectLanguage={handleSelectLanguage}
        selectedCity={filters.city}
        onSelectCity={handleSelectCity}
        onOpenPostProperty={() => handleTriggerPostProperty('owner')}
        onOpenCareerCare={() => setIsCareerCareOpen(true)}
        onOpenEmiCalc={() => setIsEmiCalcOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenInquiries={() => setIsInquiriesOpen(true)}
        onOpenSecurityTrust={() => setIsSecurityModalOpen(true)}
        onOpenAdPackages={() => setIsAdPackagesOpen(true)}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenMyListings={() => setIsMyListingsOpen(true)}
        myListingsCount={myListingsCount}
        shortlistCount={shortlistIds.length}
        compareCount={compareIds.length}
        inquiryCount={siteVisits.length}
        activeTab={filters.purpose}
        onSelectTab={handleSelectTab}
      />

      {/* Hero Search Engine (MagicBricks & 99Acres Style) */}
      <HeroSearch
        lang={lang}
        activePurpose={filters.purpose}
        onSelectPurpose={handleSelectTab}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
        selectedCity={filters.city}
        onSelectCity={(city) => setFilters(prev => ({ ...prev, city }))}
        selectedBhk={filters.bhk}
        onToggleBhk={(b) => {
          setFilters(prev => ({
            ...prev,
            bhk: prev.bhk.includes(b) ? prev.bhk.filter(item => item !== b) : [...prev.bhk, b]
          }));
        }}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
        onExecuteSearch={() => {
          // Smooth scroll to catalog
          document.getElementById('property-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        totalListingsCount={properties.length}
      />

      {/* 4 Dedicated Portals Banner: Property Owner, Verified Agent, Hundred Builders, Registered Broker */}
      <RolePortalsBanner
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onOpenPostProperty={() => handleTriggerPostProperty(authUser?.role || 'owner')}
        onOpenMyListings={() => setIsMyListingsOpen(true)}
        myListingsCount={myListingsCount}
        onLogout={handleLogout}
        lang={lang}
      />

      {/* Main Content Area: Catalog + Filter Sidebar */}
      <main id="property-catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Section Top Controls (Title, Filter Pills, View Mode Switcher, Sorting) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {filters.city !== 'All Cities' ? `${filters.city} - ` : ''}
                {filters.purpose === 'all'
                  ? (lang === 'hi' ? 'सभी लिस्टेड प्रॉपर्टीज (All Listed Properties)' : 'All Listed Properties')
                  : (lang === 'hi' ? `${t[filters.purpose] || filters.purpose} के लिए उपलब्ध प्रॉपर्टीज` : `Properties for ${t[filters.purpose] || filters.purpose}`)}
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                {filteredProperties.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi' 
                ? 'मालिक (0% ब्रोकरेज), वेरिफाइड एजेंट, हंड्रेड बिल्डर्स और रजिस्टर्ड ब्रोकर की लाइव संपत्तियां' 
                : 'Live listings from Owners (0% Brokerage), Verified Agents, Hundred Builders, and Registered Brokers'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>{t.filters}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.sortBy}:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="relevance">{t.sortRelevance}</option>
                <option value="price_low_high">{t.sortPriceLow}</option>
                <option value="price_high_low">{t.sortPriceHigh}</option>
                <option value="newest">{t.sortNewest}</option>
                <option value="area_high_low">{t.sortAreaHigh}</option>
              </select>
            </div>

            {/* Grid / List Switcher */}
            <div className="hidden sm:flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Quick Role Categories Tabs & Live Sync indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              id="role-filter-all"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: [] }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                filters.listedBy.length === 0
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सभी संपत्तियां' : 'All Properties'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${filters.listedBy.length === 0 ? 'bg-slate-700 text-amber-300' : 'bg-slate-100 text-slate-600'}`}>
                {roleCounts.all}
              </span>
            </button>

            <button
              id="role-filter-owner"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: prev.listedBy.includes('owner') && prev.listedBy.length === 1 ? [] : ['owner'] }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                filters.listedBy.includes('owner') && filters.listedBy.length === 1
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50/80 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'मालिक (Owner - 0% ब्रोकरेज)' : 'Direct Owner (0% Brokerage)'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-white text-emerald-800 border border-emerald-200">
                {roleCounts.owner}
              </span>
            </button>

            <button
              id="role-filter-agent"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: prev.listedBy.includes('verified_agent') && prev.listedBy.length === 1 ? [] : ['verified_agent'] }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                filters.listedBy.includes('verified_agent') && filters.listedBy.length === 1
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50/80 text-blue-800 border border-blue-200 hover:bg-blue-100/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>{lang === 'hi' ? 'वेरिफाइड एजेंट (Verified Agent)' : 'Verified Agent'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-white text-blue-800 border border-blue-200">
                {roleCounts.verified_agent}
              </span>
            </button>

            <button
              id="role-filter-builder"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: prev.listedBy.includes('hundred_builders') && prev.listedBy.length === 1 ? [] : ['hundred_builders'] }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                filters.listedBy.includes('hundred_builders') && filters.listedBy.length === 1
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50/80 text-amber-900 border border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'हंड्रेड बिल्डर्स (100 Builders)' : '100 Builders Official'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-white text-amber-900 border border-amber-200">
                {roleCounts.hundred_builders}
              </span>
            </button>

            <button
              id="role-filter-broker"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: prev.listedBy.includes('registered_broker') && prev.listedBy.length === 1 ? [] : ['registered_broker'] }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                filters.listedBy.includes('registered_broker') && filters.listedBy.length === 1
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-800 border border-purple-200 hover:bg-purple-100/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-700" />
              <span>{lang === 'hi' ? 'रजिस्टर्ड ब्रोकर (Registered Broker)' : 'Registered Broker'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-white text-purple-800 border border-purple-200">
                {roleCounts.registered_broker}
              </span>
            </button>
          </div>

          {/* Real-time sync badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{lang === 'hi' ? 'लाइव सिंक • तुरंत सभी यूजर्स को दृश्यमान' : 'Live Sync • Immediately Visible to All'}</span>
            </div>
            <button
              onClick={() => {
                fetchPropertiesFromServer();
                showToast(lang === 'hi' ? 'सभी नई लिस्टिंग्स रीफ्रेश कर ली गई हैं।' : 'Properties refreshed.');
              }}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer transition shadow-2xs"
              title="Refresh Listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Catalog Layout: Sidebar on Left, Property Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              onFilterChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
              onResetFilters={() => setFilters({
                purpose: filters.purpose,
                city: 'All Cities',
                searchQuery: '',
                category: 'all',
                bhk: [],
                minPrice: filters.purpose === 'rent' ? 10000 : 1500000,
                maxPrice: filters.purpose === 'rent' ? 250000 : 50000000,
                furnishing: [],
                possession: [],
                listedBy: [],
                amenities: [],
                verifiedOnly: false,
                hundredBuildersOnly: false,
                sortBy: 'relevance',
              })}
              lang={lang}
              totalFiltered={filteredProperties.length}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 p-4 flex flex-col justify-end">
              <div className="bg-white rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">{t.filters}</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
                  onResetFilters={() => setFilters({
                    purpose: filters.purpose,
                    city: 'All Cities',
                    searchQuery: '',
                    category: 'all',
                    bhk: [],
                    minPrice: filters.purpose === 'rent' ? 10000 : 1500000,
                    maxPrice: filters.purpose === 'rent' ? 250000 : 50000000,
                    furnishing: [],
                    possession: [],
                    listedBy: [],
                    amenities: [],
                    verifiedOnly: false,
                    hundredBuildersOnly: false,
                    sortBy: 'relevance',
                  })}
                  lang={lang}
                  totalFiltered={filteredProperties.length}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl text-xs"
                >
                  {t.applyFilters}
                </button>
              </div>
            </div>
          )}

          {/* Property Cards Grid / List */}
          <div className="lg:col-span-3 space-y-6">
            
            {properties.length === 0 ? (
              <div id="empty-portal-no-properties" className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/80">
                  <Home className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'hi' ? 'कोई प्रॉपर्टी लिस्टिंग उपलब्ध नहीं है' : 'No Property Listings Available'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    {lang === 'hi'
                      ? 'सभी डेमो प्रॉपर्टीज हटा दी गई हैं। आप अपनी प्रॉपर्टी (मकान, फ्लैट, प्लॉट, कृषि भूमि या दुकान) यहाँ सबसे पहले लिस्ट कर सकते हैं।'
                      : 'All demo property listings have been removed. Be the first to post your property (House, Flat, Plot, Farmland, or Commercial Space) on 100 BUILDERS REALITIES.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    id="post-first-property-btn"
                    type="button"
                    onClick={() => handleTriggerPostProperty('owner')}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs sm:text-sm font-black px-6 py-3 rounded-xl transition cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'अपनी प्रॉपर्टी लिस्ट करें' : 'Post Your Property'}</span>
                  </button>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">{t.noPropertiesFound}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {lang === 'hi' 
                    ? 'कृपया अपने सर्च कीवर्ड्स या फ़िल्टर जैसे कीमत और BHK बदलकर पुनः प्रयास करें।' 
                    : 'Try clearing your search query or broadening the price and bedroom filters.'}
                </p>
                <button
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    city: 'All Cities',
                    searchQuery: '',
                    category: 'all',
                    bhk: [],
                    minPrice: prev.purpose === 'rent' ? 10000 : 1500000,
                    maxPrice: prev.purpose === 'rent' ? 250000 : 50000000,
                    furnishing: [],
                    possession: [],
                    listedBy: [],
                    amenities: [],
                    verifiedOnly: false,
                    hundredBuildersOnly: false,
                  }))}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                >
                  {t.clearAll}
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    lang={lang}
                    isShortlisted={shortlistIds.includes(property.id)}
                    onToggleShortlist={handleToggleShortlist}
                    isCompared={compareIds.includes(property.id)}
                    onToggleCompare={handleToggleCompare}
                    onViewDetails={(p) => setSelectedProperty(p)}
                    onBookVisit={(p) => setInquiryProperty(p)}
                    viewMode={viewMode}
                    authUser={authUser}
                    onDeleteProperty={handleRequestDeleteProperty}
                    onEditProperty={handleEditProperty}
                  />
                ))}
              </div>
            )}

            {/* Post Property Banner CTA & Advertisement Packages Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Listing Banner */}
              <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-7 text-slate-950 flex flex-col justify-between gap-5 shadow-xl">
                <div className="space-y-1 text-left">
                  <span className="text-xs font-extrabold uppercase tracking-widest bg-slate-950 text-white px-2.5 py-1 rounded-md inline-block">
                    100% Free Listing
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 pt-1">
                    {lang === 'hi' ? 'संपत्ति बेचना या किराए पर देना चाहते हैं?' : 'Are you an Owner with Property?'}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    {lang === 'hi' 
                      ? 'हंड्रेड बिल्डर्स पर मुफ्त में अपनी व्यक्तिगत प्रॉपर्टी लिस्ट करें और सक्रिय खरीदारों से तुरंत जुड़ें।' 
                      : 'List your flat, villa, land, or shop with zero listing fees and connect with verified buyers.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsPostPropertyOpen(true)}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition cursor-pointer shrink-0 flex items-center justify-center space-x-2 w-full sm:w-auto self-start"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>{t.postPropertyBtn}</span>
                </button>
              </div>

              {/* Paid Advertisement Packages Banner */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between gap-5 shadow-xl border border-amber-500/40 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-1 text-left relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md inline-flex items-center space-x-1 shadow-sm">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'सशुल्क विज्ञापन' : 'Paid Ads'}</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                      ₹199 से शुरू
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                    {lang === 'hi' ? 'बिल्डर, ब्रोकर, इन्वेस्टर व संस्था हेतु विज्ञापन' : 'Ad Packages for Builders, Brokers & Investors'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {lang === 'hi' 
                      ? 'Starter, Basic, Professional, Builder, Premium व Business प्लान्स। प्रोजेक्ट गैलरी, टॉप लिस्टिंग व सीधी लीड्स।' 
                      : 'High-visibility advertisement slots, featured placements, top ranking & direct inquiries across India.'}
                  </p>
                </div>

                <button
                  id="main-explore-ad-packages-btn"
                  onClick={() => setIsAdPackagesOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition cursor-pointer shrink-0 flex items-center justify-center space-x-2 w-full sm:w-auto self-start relative z-10"
                >
                  <Megaphone className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'hi' ? 'विज्ञापन पैकेज चुनें (₹199 - ₹9,999) →' : 'View Ad Packages (From ₹199) →'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        lang={lang}
        isShortlisted={selectedProperty ? shortlistIds.includes(selectedProperty.id) : false}
        onToggleShortlist={handleToggleShortlist}
        isCompared={selectedProperty ? compareIds.includes(selectedProperty.id) : false}
        onToggleCompare={handleToggleCompare}
        authUser={authUser}
        onDeleteProperty={handleRequestDeleteProperty}
        onEditProperty={handleEditProperty}
        onBookVisit={(p) => {
          setSelectedProperty(null);
          setInquiryProperty(p);
        }}
      />

      {/* User My Listings Dashboard Modal */}
      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
        properties={properties}
        authUser={authUser}
        onSelectProperty={(p) => {
          setIsMyListingsOpen(false);
          setSelectedProperty(p);
        }}
        onEditProperty={handleEditProperty}
        onRequestDelete={handleRequestDeleteProperty}
        onOpenPostProperty={() => {
          setIsMyListingsOpen(false);
          setEditingProperty(null);
          handleTriggerPostProperty(authUser?.role || 'owner');
        }}
        lang={lang}
      />

      {/* Delete Property Confirmation Modal */}
      <DeletePropertyConfirmModal
        property={deletingProperty}
        onClose={() => setDeletingProperty(null)}
        onConfirmDelete={handleConfirmDeleteProperty}
        lang={lang}
      />

      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={handleClosePostProperty}
        onAddProperty={handleAddProperty}
        onUpdateProperty={handleUpdateProperty}
        onDeleteProperty={handleRequestDeleteProperty}
        propertyToEdit={editingProperty}
        lang={lang}
        authUser={authUser}
        onOpenAuth={(role, mode) => {
          handleOpenAuth(role || 'owner', mode || 'signup', 'post_property');
        }}
      />

      {/* Role-Based Login & Signup Modal (Owner, Agent, Hundred Builders, Registered Broker) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalReason('default');
        }}
        initialRole={authModalRole}
        initialMode={authModalMode}
        reason={authModalReason}
        onAuthSuccess={handleAuthSuccess}
        lang={lang}
      />

      <EmiCalculatorModal
        isOpen={isEmiCalcOpen}
        onClose={() => setIsEmiCalcOpen(false)}
        lang={lang}
      />

      <ValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        lang={lang}
        onOpenPostProperty={() => {
          setIsValuationOpen(false);
          handleTriggerPostProperty('owner');
        }}
      />

      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProperties={comparedProperties}
        onRemoveFromCompare={(id) => setCompareIds(prev => prev.filter(i => i !== id))}
        onClearCompare={() => setCompareIds([])}
        lang={lang}
        onViewProperty={(p) => setSelectedProperty(p)}
      />

      <InquiryModal
        property={inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        onConfirmBooking={handleConfirmBooking}
        lang={lang}
      />

      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlistedProperties={shortlistedProperties}
        onRemoveShortlist={handleToggleShortlist}
        onClearShortlist={() => setShortlistIds([])}
        lang={lang}
        onViewProperty={(p) => setSelectedProperty(p)}
      />

      <InquiriesListModal
        isOpen={isInquiriesOpen}
        onClose={() => setIsInquiriesOpen(false)}
        bookings={siteVisits}
        onRemoveBooking={handleRemoveBooking}
        lang={lang}
      />

      {/* Career Care - Broker Partner Free Registration Modal */}
      <CareerCareModal
        isOpen={isCareerCareOpen}
        onClose={() => setIsCareerCareOpen(false)}
        lang={lang}
        isCorporateLoggedIn={authUser?.role === 'hundred_builders'}
        onOpenCorporateLogin={() => {
          handleOpenAuth('hundred_builders', 'login', 'default');
        }}
      />

      {/* Comprehensive Real Estate Footer */}
      <Footer
        lang={lang}
        onSelectCity={handleSelectCity}
        onSelectTab={handleSelectTab}
        onOpenPostProperty={() => handleTriggerPostProperty('owner')}
        onOpenCareerCare={() => setIsCareerCareOpen(true)}
        onOpenEmiCalc={() => setIsEmiCalcOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenSecurityTrust={() => setIsSecurityModalOpen(true)}
        onOpenAdPackages={() => setIsAdPackagesOpen(true)}
      />

      {/* Security & Anti-Hack Trust Center Modal */}
      <SecurityTrustModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        lang={lang}
      />

      {/* Paid Advertisement Packages Modal */}
      <AdvertisementPackagesModal
        isOpen={isAdPackagesOpen}
        onClose={() => setIsAdPackagesOpen(false)}
        lang={lang}
      />

      {/* Floating Buttons: Security Shield (Bottom-Left) & Ad Packages (Bottom-Right) */}
      <div className="fixed bottom-4 left-4 z-30 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsSecurityModalOpen(true)}
          className="bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-full border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center space-x-2 transition cursor-pointer hover:border-emerald-400 group active:scale-95"
          title="एंटी-हैक साइबर सुरक्षा स्थिति देखें (100% Secure)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono text-emerald-300 tracking-wide">100% ANTI-HACK SHIELD</span>
        </button>
      </div>

      {/* Floating Advertisement Packages Quick Launcher */}
      <div className="fixed bottom-4 right-4 z-30 hidden sm:block">
        <button
          id="floating-ad-packages-btn"
          type="button"
          onClick={() => setIsAdPackagesOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-full border border-amber-300 shadow-2xl backdrop-blur-md flex items-center space-x-2 transition cursor-pointer hover:scale-105 active:scale-95"
          title="सशुल्क विज्ञापन पैकेज - व्यक्ति, बिल्डर, ब्रोकर व संस्था (₹199 से)"
        >
          <Megaphone className="w-4 h-4 text-slate-950 animate-bounce" />
          <span>{lang === 'hi' ? 'विज्ञापन पैकेज (₹199 से)' : 'Ad Packages (₹199+)'}</span>
        </button>
      </div>

    </div>
  );
}
