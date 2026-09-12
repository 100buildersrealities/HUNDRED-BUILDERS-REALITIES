export interface AdPackage {
  id: string;
  name: string;
  nameHi: string;
  tier: 'starter' | 'basic' | 'professional' | 'builder' | 'premium' | 'business';
  colorTag: string;
  badgeBg: string;
  durationDays: number;
  durationText: string;
  durationTextEn: string;
  adsCount: number;
  adsText: string;
  adsTextHi: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  bestValue?: boolean;
  description: string;
  descriptionHi: string;
  features: string[];
  featuresHi: string[];
}

export interface FeaturedAddonPackage {
  id: string;
  days: number;
  title: string;
  titleHi: string;
  price: number;
  features: string[];
  featuresHi: string[];
  recommendedFor: string;
  recommendedForHi: string;
}

export interface RoleSpecialPackage {
  id: string;
  role: 'builder' | 'broker' | 'investor';
  title: string;
  titleHi: string;
  badgeText: string;
  badgeTextHi: string;
  badgeBg: string;
  price: number;
  billingPeriod: string;
  billingPeriodHi: string;
  targetAudience: string;
  targetAudienceHi: string;
  listingsLimitText: string;
  listingsLimitTextHi: string;
  highlights: string[];
  highlightsHi: string[];
  detailedFeatures: string[];
  detailedFeaturesHi: string[];
  iconName: 'Building2' | 'Handshake' | 'Gem';
}

// 📢 1. Standard Advertisement Packages (सशुल्क विज्ञापन पैकेज)
export const ADVERTISEMENT_LISTING_PACKAGES: AdPackage[] = [
  {
    id: 'ad-starter',
    name: 'STARTER',
    nameHi: 'स्टार्टर (STARTER)',
    tier: 'starter',
    colorTag: 'emerald',
    badgeBg: 'bg-emerald-600 text-white',
    durationDays: 7,
    durationText: '7 दिन',
    durationTextEn: '7 Days',
    adsCount: 1,
    adsText: '1 Property Ad',
    adsTextHi: '1 प्रॉपर्टी विज्ञापन',
    price: 199,
    originalPrice: 299,
    description: 'Ideal for individual owners wanting quick inquiries for a single flat or plot.',
    descriptionHi: 'एकल प्रॉपर्टी या प्लॉट को जल्दी बेचने/किराए पर देने के लिए उपयुक्त।',
    features: [
      '7 Days Active Listing on Hundred Builders Realities',
      '1 Verified Property Advertisement',
      'Direct Phone & WhatsApp Buyer Inquiries',
      'High Resolution Photos & Location Map',
      'Instant Online Activation'
    ],
    featuresHi: [
      'हंड्रेड बिल्डर्स पर 7 दिन सक्रिय लिस्टिंग',
      '1 प्रॉपर्टी विज्ञापन पोस्ट करने की सुविधा',
      'सीधे खरीदारों से फोन कॉल व WhatsApp इन्क्वायरी',
      'फोटो गैलरी एवं लोकेशन मैप सपोर्ट',
      'त्वरित ऑनलाइन एक्टिवेशन'
    ]
  },
  {
    id: 'ad-basic',
    name: 'BASIC',
    nameHi: 'बेसिक (BASIC)',
    tier: 'basic',
    colorTag: 'blue',
    badgeBg: 'bg-blue-600 text-white',
    durationDays: 30,
    durationText: '30 दिन (1 माह)',
    durationTextEn: '30 Days (1 Month)',
    adsCount: 3,
    adsText: '3 Ads',
    adsTextHi: '3 प्रॉपर्टी विज्ञापन',
    price: 499,
    originalPrice: 699,
    description: 'Perfect for property owners and small dealers with up to 3 listings.',
    descriptionHi: 'प्रॉपर्टी मालिकों व छोटे डीलर्स के लिए 3 संपत्तियों के विज्ञापन हेतु।',
    features: [
      '30 Days Validity (Full Month)',
      '3 Property Listings (Flat / Plot / House)',
      'Direct Leads & Inquiry Notifications',
      'Property Edit & Photo Update Anytime',
      'Standard Portal Visibility'
    ],
    featuresHi: [
      'पूरे 30 दिन (1 माह) की वैधता',
      '3 प्रॉपर्टी विज्ञापन (फ्लैट / प्लॉट / मकान)',
      'डायरेक्ट खरीदार लीड्स व इन्क्वायरी सूचनाएं',
      'कभी भी फोटो व विवरण अपडेट करने की सुविधा',
      'पोर्टल पर सक्रिय विजिबिलिटी'
    ]
  },
  {
    id: 'ad-professional',
    name: 'PROFESSIONAL',
    nameHi: 'प्रोफेशनल (PROFESSIONAL)',
    tier: 'professional',
    colorTag: 'purple',
    badgeBg: 'bg-purple-600 text-white',
    durationDays: 30,
    durationText: '30 दिन',
    durationTextEn: '30 Days',
    adsCount: 10,
    adsText: '10 Ads',
    adsTextHi: '10 प्रॉपर्टी विज्ञापन',
    price: 999,
    originalPrice: 1499,
    popular: true,
    description: 'Most popular choice for active real estate consultants & property dealers.',
    descriptionHi: 'सक्रिय रियल एस्टेट एजेंटों व डीलरों के लिए सबसे लोकप्रिय विकल्प।',
    features: [
      '30 Days Validity',
      '10 Active Property Listings',
      'Priority Listing in Search Results',
      'Lead Dashboard & Direct WhatsApp Connect',
      'Verified Agent / Dealer Trust Tag'
    ],
    featuresHi: [
      '30 दिन की पूर्ण वैधता',
      '10 सक्रिय प्रॉपर्टी विज्ञापन',
      'सर्च परिणामों में प्राथमिकता विजिबिलिटी',
      'डायरेक्ट WhatsApp व कॉल इन्क्वायरी',
      'वेरिफाइड डीलर / एजेंट ट्रस्ट टैग'
    ]
  },
  {
    id: 'ad-builder',
    name: 'BUILDER',
    nameHi: 'बिल्डर (BUILDER)',
    tier: 'builder',
    colorTag: 'amber',
    badgeBg: 'bg-amber-600 text-white',
    durationDays: 30,
    durationText: '30 दिन',
    durationTextEn: '30 Days',
    adsCount: 25,
    adsText: '25 Ads + Featured',
    adsTextHi: '25 विज्ञापन + फीचर्ड बूस्ट',
    price: 1999,
    originalPrice: 2999,
    description: 'Designed for residential colonizers, colony developers, and builders.',
    descriptionHi: 'कॉलोनाइजर्स, प्रोजेक्ट डेवलपर्स और बिल्डरों के लिए विशेष पैकेज।',
    features: [
      '30 Days Validity',
      '25 Active Property / Unit Listings',
      '⭐ Included Featured Property Boost',
      'Builder / Developer Branding with Logo',
      'Dedicated Buyer Inquiry Management'
    ],
    featuresHi: [
      '30 दिन की वैधता',
      '25 प्रॉपर्टी / यूनिट्स विज्ञापन',
      '⭐ फीचर्ड प्रॉपर्टी बूस्ट (शीर्ष पर प्रदर्शन)',
      'कंपनी / बिल्डर लोगो व ब्रांडिंग',
      'डेडिकेटेड बायर लीड्स प्रबंधन'
    ]
  },
  {
    id: 'ad-premium',
    name: 'PREMIUM',
    nameHi: 'प्रीमियम (PREMIUM)',
    tier: 'premium',
    colorTag: 'rose',
    badgeBg: 'bg-rose-600 text-white',
    durationDays: 30,
    durationText: '30 दिन',
    durationTextEn: '30 Days',
    adsCount: 50,
    adsText: '50 Ads + Top Listing',
    adsTextHi: '50 विज्ञापन + टॉप लिस्टिंग',
    price: 3999,
    originalPrice: 5999,
    description: 'Maximum visibility package for large builders and multi-city property agencies.',
    descriptionHi: 'बड़े बिल्डरों एवं बहु-शहर रियल एस्टेट एजेंसियों के लिए अधिकतम विजिबिलिटी।',
    features: [
      '30 Days Validity',
      '50 Property Listings Across Cities',
      '⭐ Guaranteed Top Listing on City Pages',
      'Social & Notification Broadcast',
      'Priority Dedicated Relationship Manager'
    ],
    featuresHi: [
      '30 दिन की वैधता',
      '50 प्रॉपर्टी विज्ञापन (विभिन्न शहरों में)',
      '⭐ शहर के पेजों पर गारंटीड टॉप लिस्टिंग',
      'प्राथमिकता नोटिफिकेशन व सोशल सपोर्ट',
      'डेडिकेटेड रिलेशनशिप मैनेजर सहायता'
    ]
  },
  {
    id: 'ad-business',
    name: 'BUSINESS',
    nameHi: 'बिजनेस (BUSINESS)',
    tier: 'business',
    colorTag: 'slate',
    badgeBg: 'bg-slate-900 text-amber-300 border border-amber-400',
    durationDays: 90,
    durationText: '90 दिन (3 महीने)',
    durationTextEn: '90 Days (3 Months)',
    adsCount: 100,
    adsText: '100 Ads + Premium Promotion',
    adsTextHi: '100 विज्ञापन + प्रीमियम प्रमोशन',
    price: 7999,
    originalPrice: 11999,
    bestValue: true,
    description: 'Quarterly power package for real estate companies, corporate developers & institutions.',
    descriptionHi: 'कॉर्पोरेट डेवलपर्स, रियल एस्टेट कंपनियों व संस्थाओं के लिए 3 माह का पॉवर पैकेज।',
    features: [
      '90 Days (3 Months) Extended Validity',
      '100 Property & Project Listings',
      'Premium All-India Portal Promotion',
      'Homepage Banner & Highlighted Cards',
      'Custom Corporate Landing Showcase'
    ],
    featuresHi: [
      '90 दिन (3 महीने) की दीर्घकालिक वैधता',
      '100 प्रॉपर्टी व प्रोजेक्ट लिस्टिंग्स',
      'प्रीमियम ऑल-इंडिया पोर्टल प्रमोशन',
      'होमपेज बैनर एवं हाइलाइटेड कार्ड्स',
      'कस्टम कॉर्पोरेट लैंडिंग शोकेस'
    ]
  }
];

// ⭐ 2. Featured Advertisement Add-ons (जो विज्ञापन सामान्य लिस्टिंग से ऊपर दिखाना चाहते हैं)
export const FEATURED_ADDON_PACKAGES: FeaturedAddonPackage[] = [
  {
    id: 'feat-7d',
    days: 7,
    title: '7 Days Featured Boost',
    titleHi: '7 दिन फीचर्ड बूस्ट',
    price: 299,
    features: [
      'Pinned above standard listings for 7 days',
      '⭐ "Featured" Golden Badge',
      '3x higher buyer views & calls',
      'Instant activation on existing listing'
    ],
    featuresHi: [
      'सामान्य विज्ञापनों से ऊपर 7 दिनों तक पिन',
      '⭐ "Featured" गोल्डन ट्रस्ट बैज',
      '3 गुना अधिक खरीदार व्यूज व कॉल्स',
      'मौजूदा विज्ञापन पर तुरंत एक्टिवेशन'
    ],
    recommendedFor: 'Fast sale for urgent properties',
    recommendedForHi: 'जल्दी बेचने के लिए आवश्यक संपत्तियों हेतु'
  },
  {
    id: 'feat-15d',
    days: 15,
    title: '15 Days Featured Boost',
    titleHi: '15 दिन फीचर्ड बूस्ट',
    price: 499,
    features: [
      'Top position for 15 days',
      '⭐ "Featured" High-Visibility Tag',
      'Targeted locality & city buyers',
      'Weekly performance report'
    ],
    featuresHi: [
      '15 दिनों तक सर्च व सिटी पेज पर शीर्ष स्थान',
      '⭐ "Featured" हाई-विजिबिलिटी टैग',
      'लोकेलिटी व शहर के खरीदारों तक प्राथमिकता पहुंच',
      'साप्ताहिक प्रदर्शन रिपोर्ट'
    ],
    recommendedFor: 'Commercial shops, plots & premium villas',
    recommendedForHi: 'कमर्शियल दुकान, प्लॉट एवं प्रीमियम विला हेतु'
  },
  {
    id: 'feat-30d',
    days: 30,
    title: '30 Days Featured Boost',
    titleHi: '30 दिन फीचर्ड बूस्ट',
    price: 899,
    features: [
      'Full 30 days non-stop Top Spot',
      '⭐ Prime Featured Badge on Card & Details',
      '5x lead generation boost',
      'Direct social & WhatsApp push'
    ],
    featuresHi: [
      'पूरे 30 दिन लगातार शीर्ष स्थान पर प्रदर्शन',
      '⭐ कार्ड व डिटेल पेज दोनों पर प्राइम बैज',
      '5 गुना अधिक खरीदार संपर्क व लीड्स',
      'सोशल एवं डायरेक्ट WhatsApp पुश'
    ],
    recommendedFor: 'High-ticket projects & agricultural land',
    recommendedForHi: 'बड़ी कीमत वाले प्रोजेक्ट व कृषि भूमि हेतु'
  }
];

// 🏢 3. Role-Based Dedicated Packages (बिल्डर, ब्रोकर व इन्वेस्टर विशेष पैकेज)
export const ROLE_SPECIAL_PACKAGES: RoleSpecialPackage[] = [
  {
    id: 'role-builder',
    role: 'builder',
    title: 'Builder / Developer Special Package',
    titleHi: '🏢 बिल्डर / डेवलपर स्पेशल पैकेज',
    badgeText: 'Complete Project Marketing',
    badgeTextHi: 'संपूर्ण प्रोजेक्ट मार्केटिंग',
    badgeBg: 'bg-amber-600 text-white',
    price: 4999,
    billingPeriod: '/ Month',
    billingPeriodHi: '₹4,999 / माह',
    targetAudience: 'Builders, Colonizers, Real Estate Township Developers',
    targetAudienceHi: 'बिल्डर्स, कॉलोनाइजर्स, रियल एस्टेट टाउनशिप डेवलपर्स',
    listingsLimitText: 'Up to 50 Project Ads Included',
    listingsLimitTextHi: 'प्रोजेक्ट के 50 तक विज्ञापन शामिल',
    iconName: 'Building2',
    highlights: [
      'Project के 50 तक विज्ञापन',
      'Project को Featured Listing',
      'Builder/Company का प्रोफाइल',
      'Logo + संपर्क विवरण',
      'Project Gallery',
      'Location/Map',
      'Lead/Enquiry सुविधा',
      'Promotional Banner'
    ],
    highlightsHi: [
      'Project के 50 तक विज्ञापन',
      'Project को Featured Listing',
      'Builder/Company का प्रोफाइल',
      'Logo + संपर्क विवरण',
      'Project Gallery',
      'Location/Map',
      'Lead/Enquiry सुविधा',
      'Promotional Banner'
    ],
    detailedFeatures: [
      'Showcase up to 50 units (Flats, Plots, Rowhouses, Shops) within the project',
      'Prime Featured Listing placement on city search and category pages',
      'Dedicated Builder & Developer Profile page with company history',
      'Official Logo, Phone numbers, Email & RERA Registration showcase',
      'Full Project Photo Gallery & Master Layout Plan rendering',
      'Interactive Google Map & precise geolocation direction',
      'Instant direct Buyer Lead & Enquiry forwarding via WhatsApp & SMS',
      'High-impact Promotional Banner on Hundred Builders portal'
    ],
    detailedFeaturesHi: [
      'प्रोजेक्ट के भीतर 50 यूनिट्स तक (फ्लैट, प्लॉट, रो-हाउस, दुकान) का विज्ञापन',
      'सर्च व कैटेगरी पेजों पर प्राइम फीचर्ड लिस्टिंग स्थान',
      'कंपनी इतिहास के साथ समर्पित बिल्डर व डेवलपर प्रोफाइल पेज',
      'आधिकारिक लोगो, फोन नंबर, ईमेल व RERA रजिस्ट्रेशन का स्पष्ट प्रदर्शन',
      'संपूर्ण प्रोजेक्ट फोटो गैलरी एवं मास्टर लेआउट प्लान शोकेस',
      'इंटरएक्टिव लोकेशन मैप व सटीक दिशा-निर्देश',
      'WhatsApp व कॉल द्वारा तुरंत खरीदार लीड व इन्क्वायरी की सीधी प्राप्ति',
      'हंड्रेड बिल्डर्स पोर्टल पर प्रभावशाली प्रमोशनल बैनर'
    ]
  },
  {
    id: 'role-broker',
    role: 'broker',
    title: 'Broker Special Package',
    titleHi: '🤝 ब्रोकर स्पेशल पैकेज',
    badgeText: 'Property Dealers & Agents',
    badgeTextHi: 'प्रॉपर्टी डीलर्स व एजेंट्स',
    badgeBg: 'bg-emerald-600 text-white',
    price: 999,
    billingPeriod: '/ Month',
    billingPeriodHi: '₹999 / माह',
    targetAudience: 'Real Estate Brokers, Property Dealers, Independent Agents',
    targetAudienceHi: 'रियल एस्टेट ब्रोकर्स, प्रॉपर्टी डीलर्स, स्वतंत्र एजेंट्स',
    listingsLimitText: '20 Property Listings Included',
    listingsLimitTextHi: '20 प्रॉपर्टी लिस्टिंग्स शामिल',
    iconName: 'Handshake',
    highlights: [
      '20 Property Listings',
      'Broker Profile',
      'Contact/WhatsApp Enquiry',
      'Featured Property का विकल्प',
      'Leads प्राप्त करने की सुविधा'
    ],
    highlightsHi: [
      '20 Property Listings',
      'Broker Profile',
      'Contact/WhatsApp Enquiry',
      'Featured Property का विकल्प',
      'Leads प्राप्त करने की सुविधा'
    ],
    detailedFeatures: [
      'Post and manage up to 20 active properties at any time',
      'Verified Broker Profile badge establishing client confidence',
      'Direct Click-to-Call & WhatsApp inquiry buttons on all your properties',
      'Option to boost any high-priority property as Featured',
      'Access to genuine buyer inquiries in your operating cities',
      'Free integration with Hundred Builders Career Care network'
    ],
    detailedFeaturesHi: [
      'किसी भी समय 20 सक्रिय संपत्तियों को पोस्ट व प्रबंधित करें',
      'ग्राहकों का विश्वास बढ़ाने वाला वेरिफाइड ब्रोकर प्रोफाइल बैज',
      'आपकी सभी संपत्तियों पर डायरेक्ट कॉल व WhatsApp इन्क्वायरी बटन',
      'किसी भी महत्वपूर्ण संपत्ति को फीचर्ड में प्रमोट करने का विकल्प',
      'आपके कार्यक्षेत्र/शहर में वास्तविक खरीदार लीड्स प्राप्त करने की सुविधा',
      'हंड्रेड बिल्डर्स करियर केयर नेटवर्क से मुफ्त जुड़ाव'
    ]
  },
  {
    id: 'role-investor',
    role: 'investor',
    title: 'Investor / Institution Package',
    titleHi: '💎 इन्वेस्टर / इंस्टीट्यूशन पैकेज',
    badgeText: 'Societies, Funds & Investors',
    badgeTextHi: 'सोसाइटी, फंड्स व निवेशक',
    badgeBg: 'bg-purple-700 text-amber-300 border border-amber-400',
    price: 9999,
    billingPeriod: '/ 3 Months',
    billingPeriodHi: '₹9,999 / 3 महीने',
    targetAudience: 'Real Estate Investors, Co-operative Societies, Financial Institutions',
    targetAudienceHi: 'रियल-एस्टेट इन्वेस्टर, सहकारी सोसायटियां, वित्तीय संस्थाएं, ट्रस्ट',
    listingsLimitText: '100 Listings for 90 Days',
    listingsLimitTextHi: '100 लिस्टिंग्स (90 दिनों के लिए)',
    iconName: 'Gem',
    highlights: [
      '100 Listings',
      'Premium Profile',
      'Featured Projects',
      'Investment Opportunities पोस्ट करने की सुविधा',
      'Banner Promotion',
      'Priority Listing'
    ],
    highlightsHi: [
      '100 Listings',
      'Premium Profile',
      'Featured Projects',
      'Investment Opportunities पोस्ट करने की सुविधा',
      'Banner Promotion',
      'Priority Listing'
    ],
    detailedFeatures: [
      '100 Property & Investment Asset listings across 3 months',
      'Elite Premium Institutional Profile with credentials & certifications',
      'Highlight multiple Projects & Commercial Land parcels simultaneously',
      'Dedicated section to post High-ROI Real Estate Investment Opportunities',
      'Promotional Hero Banner across the platform for 90 days',
      'Top priority placement across all search and city filters',
      'VIP Investor relations support from Hundred Builders executive team'
    ],
    detailedFeaturesHi: [
      '3 महीने (90 दिन) के लिए 100 प्रॉपर्टी व निवेश संपत्तियों की लिस्टिंग',
      'प्रमाणपत्रों व साख के साथ एलीट प्रीमियम संस्थागत प्रोफाइल',
      'एक साथ कई प्रोजेक्ट्स एवं बड़े कमर्शियल लैंड पार्सल को हाइलाइट करें',
      'हाई-रिटर्न (ROI) रियल एस्टेट निवेश अवसर (Investment Opportunities) पोस्ट करने की विशेष सुविधा',
      'प्लेटफॉर्म पर 90 दिनों तक प्रमुख प्रमोशनल बैनर प्रदर्शन',
      'सभी सर्च व शहर फिल्टर में सर्वोच्च प्राथमिकता लिस्टिंग',
      'हंड्रेड बिल्डर्स एग्जीक्यूटिव टीम द्वारा वीआईपी इन्वेस्टर रिलेशंस सपोर्ट'
    ]
  }
];

// 📜 महत्वपूर्ण कानूनी अस्वीकरण एवं नियम व शर्तें (Mandatory Legal Disclaimer & Terms)
export const ADVERTISEMENT_DISCLAIMER_TEXT = {
  hi: {
    title: 'महत्वपूर्ण विधिक अस्वीकरण (Disclaimer & Terms)',
    primaryStatement: 'विज्ञापनदाता (व्यक्ति, संस्था, सोसाइटी, बिल्डर, रियल-एस्टेट इन्वेस्टर और ब्रोकर) द्वारा दी गई संपत्ति/प्रोजेक्ट की जानकारी, स्वामित्व, कानूनी स्थिति, विधिक अनुमति (RERA, डायवर्सन, नक्शा पास, नामांतरण) एवं मूल्य की सत्यता की सम्पूर्ण जिम्मेदारी स्वयं विज्ञापनदाता की होगी।',
    points: [
      '100 BUILDERS REALITIES केवल एक विज्ञापन एवं सूचना प्रसारण मंच (Advertising & Promotional Media Platform) प्रदान करता है।',
      'पोर्टल पर प्रकाशित किसी भी विज्ञापन में दिए गए विवरण, कागजात या दावों की विधिक सत्यता की जांच करना खरीदार/निवेशक का दायित्व है।',
      'किसी भी संपत्ति के सौदे, वित्तीय लेन-देन, रजिस्ट्री या स्वामित्व विवाद के लिए 100 BUILDERS REALITIES या इसके संचालक उत्तरदायी नहीं होंगे।',
      'विज्ञापनदाता द्वारा कोई भी भ्रामक, असत्य, विवादित या अवैध संपत्ति का विज्ञापन पोस्ट किए जाने पर बिना पूर्व सूचना विज्ञापन हटाने का अधिकार सुरक्षित है।',
      'पैकेज एक्टिवेट होने के बाद तय अवधि तक विज्ञापन सक्रिय रहेगा। सरकारी नियमों व रेरा (RERA) अधिनियम के दिशा-निर्देशों का पालन करना अनिवार्य है।'
    ],
    declarationCheckbox: 'मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा विज्ञापित संपत्ति/प्रोजेक्ट की जानकारी पूर्णतः सत्य, वैध व सत्यापित है। इसकी विधिक सत्यता व मालिकाना हक की सम्पूर्ण जिम्मेदारी मेरी (विज्ञापनदाता) की होगी।'
  },
  en: {
    title: 'Mandatory Legal Disclaimer & Terms',
    primaryStatement: 'The sole responsibility for the authenticity, legal ownership, approvals (RERA, Diversion, Sanctioned Plans), and accuracy of property/project details posted rests entirely with the respective Advertiser (Individual, Institution, Society, Builder, Investor, or Broker).',
    points: [
      '100 BUILDERS REALITIES acts solely as an advertising and informational technology platform.',
      'Buyers and investors are strongly advised to independently verify title deeds, RERA approvals, and encumbrances before entering into any financial transaction.',
      '100 BUILDERS REALITIES and its management shall not be held liable for any misrepresentation, monetary transaction, or legal dispute arising between advertisers and buyers.',
      'The platform reserves the absolute right to take down any advertisement containing false, misleading, or disputed claims without refund.',
      'Compliance with Real Estate (Regulation and Development) Act (RERA) and state land laws is strictly mandatory for all advertisers.'
    ],
    declarationCheckbox: 'I solemnly certify and agree that all property/project information provided by me is truthful, authentic, and legally clear. All accountability and legal liability rests exclusively with me (the advertiser).'
  }
};

// Official Payment / Contact Details for Ads
export const AD_PAYMENT_CONFIG = {
  officialPhone: '+91 78059-80006',
  officialWhatsApp: '917805980006',
  officialEmail: '100buildersrealities@gmail.com',
  upiId: '100buildersrealities@upi',
  accountName: '100 BUILDERS REALITIES',
  bankName: 'State Bank of India / HDFC Bank',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=100buildersrealities@upi&pn=100%20BUILDERS%20REALITIES&cu=INR'
};
