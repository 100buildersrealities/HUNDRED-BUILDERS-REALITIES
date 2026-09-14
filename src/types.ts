export type PurposeType = 'buy' | 'rent' | 'commercial' | 'plot' | 'agriculture' | 'lease';

export type PropertyCategory = 
  | 'apartment' 
  | 'independent_house' 
  | 'villa' 
  | 'builder_floor' 
  | 'plot' 
  | 'commercial_office' 
  | 'commercial_shop' 
  | 'agricultural_land';

export type FurnishingStatus = 'furnished' | 'semi_furnished' | 'unfurnished';
export type PossessionStatus = 'ready_to_move' | 'under_construction';
export type ListedByType = 'owner' | 'hundred_builders' | 'verified_agent' | 'registered_broker';
export type FacingDirection = 'East' | 'North' | 'North-East' | 'West' | 'South' | 'South-East';

export type UserRole = 'owner' | 'verified_agent' | 'hundred_builders' | 'registered_broker';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  city?: string;
  reraNumber?: string;       // For registered_broker or builder
  agencyName?: string;       // For verified_agent or broker
  companyName?: string;      // For hundred_builders
  experienceYears?: string;  // For agent or broker
  isVerified?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type AgriAreaUnit = 'acre' | 'dismil' | 'bigha' | 'hectare' | 'sqft' | 'sqm';

export type PlotAreaUnit = 'sqft' | 'sqyd' | 'sqm' | 'dismil' | 'bigha' | 'gunta' | 'cent';

export interface ResidentialPlotDetails {
  // Area in multiple standard units
  totalAreaSqFt: number;              // वर्ग फीट (e.g. 1500)
  totalAreaSqYds?: number;            // वर्ग गज / गज (1 sq.yd = 9 sq.ft, e.g. 166.67)
  totalAreaSqMtr?: number;            // वर्ग मीटर (1 sq.m = 10.7639 sq.ft, e.g. 139.35)
  totalAreaDismil?: number;           // डिसमिल (1 dismil = 435.6 sq.ft, e.g. 3.44)
  primaryUnit?: PlotAreaUnit;         // Input mode ('sqft' | 'sqyd' | 'dismil' | 'sqm')
  primaryUnitValue?: number;
  
  // Dimensions (लंबाई व चौड़ाई / साइज)
  plotLengthFt?: number;              // लंबाई / गहराई (Depth in Ft - e.g. 50)
  plotWidthFt?: number;               // चौड़ाई / फ्रंट मुखौटा (Frontage in Ft - e.g. 30)
  dimensionsText?: string;            // e.g. "30 ft x 50 ft"
  
  // Road & Accessibility (सड़क एवं पहुंच)
  facingRoadWidthFt?: number;         // सामने सड़क की चौड़ाई (फीट में, e.g. 30 ft, 40 ft)
  roadType?: 'tar_road' | 'cc_concrete' | 'paver_blocks' | 'main_road' | 'murram'; // सड़क प्रकार
  isCornerPlot?: boolean;             // कॉर्नर प्लॉट (Corner Plot)
  openSidesCount?: number;            // खुले रास्तों की संख्या (1, 2, 3, 4 साइड ओपन)
  facingDirection?: FacingDirection;  // दिशा / वास्तु (East, North, North-East, West, South, South-East)
  
  // Boundary & Gated Campus (बाउंड्री एवं विकास स्तर)
  boundaryWall?: 'constructed_brick_wall' | 'tarbandi_fencing' | 'open_no_boundary';
  isGatedColony?: boolean;            // गेटेड कैंपस / सुरक्षित कॉलोनी
  colonyName?: string;                // कॉलोनी / लेआउट नाम
  plotNumber?: string;                // प्लॉट नंबर (e.g. Plot No. 24)
  floorsAllowedConstruction?: number; // अनुमत निर्माण मंजिलें (e.g. G+2, G+3, G+4)
  
  // Approvals & Legal Diversion (कानूनी स्वीकृति व डायवर्सन)
  approvalType?: 'tncp_approved' | 'rera_approved' | 'municipal_corporation' | 'gram_panchayat_diversion' | 'unapproved_regularizable';
  diversionStatus?: 'diverted_residential' | 'diverted_commercial' | 'non_diverted_in_process' | 'agricultural_divertible';
  reraNumber?: string;
  landTitleType?: 'freehold_clear_title' | 'leasehold' | 'society_patta';
  
  // Utilities (बुनियादी नागरिक सुविधाएं)
  hasElectricityPoles?: boolean;      // बिजली खंभा व कनेक्शन उपलब्ध
  hasWaterSupplyLine?: boolean;       // पानी सप्लाई लाइन / बोरवेल
  hasDrainageSewage?: boolean;        // भूमिगत सीवरेज / पक्की नाली
  hasStreetLights?: boolean;          // स्ट्रीट लाइट्स
  
  // Pricing breakdown
  ratePerSqFt?: number;               // दर प्रति वर्ग फीट (₹)
  ratePerSqYd?: number;               // दर प्रति वर्ग गज (₹)
}

export interface AgriculturalLandDetails {
  // Area in various measurement units
  totalAreaAcres: number;          // एकड़ (Primary standard conversion)
  totalAreaDismil?: number;         // डिसमिल (1 Acre = 100 Dismil)
  totalAreaBigha?: number;          // बीघा (Regional standard: ~1.6 Bigha/Acre or custom)
  totalAreaHectares?: number;       // हेक्टेयर (1 Hectare = 2.471 Acres)
  totalAreaSqFt?: number;           // कुल वर्ग फीट (1 Acre = 43,560 sq.ft)
  totalAreaSqMtr?: number;          // कुल वर्ग मीटर
  primaryUnit?: AgriAreaUnit;       // Unit selected by user when filling
  primaryUnitValue?: number;        // Numeric value entered by user in primary unit
  
  // Dimensions & Road Connectivity (आयाम व चौहद्दी)
  roadFrontageFt?: number;          // रोड फ्रंट / मुखौटा (फीट में)
  lengthFt?: number;                // गहराई / लंबाई (फीट में)
  widthFt?: number;                 // चौड़ाई (फीट में)
  approachRoadWidthFt?: number;     // एप्रोच रोड चौड़ाई (फीट में, जैसे 30, 40, 60 ft)
  approachRoadType?: 'highway' | 'tar_road' | 'pmgsy_road' | 'murram_road' | 'chak_road'; // सड़क का प्रकार
  isCornerLand?: boolean;           // कॉर्नर जमीन (2 तरफ रास्ता)
  roadSidesCount?: number;          // 1, 2, 3 या 4 तरफ रास्ता
  
  // Soil, Irrigation & Utility Infrastructure (भूमि प्रकार, मिट्टी व सिंचाई)
  irrigationStatus?: 'fully_irrigated' | 'partially_irrigated' | 'unirrigated'; // सिंचित / असिंचित
  cropCycle?: 'double_crop' | 'triple_crop' | 'single_crop' | 'horticulture_orchard' | 'fallow_barren'; // फसल चक्र
  soilType?: string;                // कन्हार (काली), मटासी (पीली दोमट), डोरा, भाठा (मुरमी), रेतीली
  isFenced?: boolean;               // तारबंदी / बाउंड्री वॉल
  fencingType?: 'tarbandi_fencing' | 'boundary_wall' | 'open_land';
  hasBorewell?: boolean;            // बोरवेल सुविधा
  borewellCount?: number;           // बोरवेल की संख्या
  hasElectricityConnection?: boolean; // कृषि बिजली कनेक्शन (3-Phase)
  waterSources?: string[];          // 'borewell', 'canal', 'river', 'pond', 'open_well'
  hasFarmhouseOrShed?: boolean;     // किसान हट / फार्महाउस / शेड
  
  // Revenue & Pricing specifics (राजस्व रिकॉर्ड व प्रति इकाई दर)
  govtRakbaHectare?: string;        // सरकारी खसरे/बी-1 में दर्ज रकबा (हेक्टेयर में)
  ratePerAcre?: number;             // दर प्रति एकड़ (₹)
  ratePerDismil?: number;           // दर प्रति डिसमिल (₹)
  ratePerBigha?: number;            // दर प्रति बीघा (₹)
  landOwnershipType?: 'single_owner' | 'joint_family' | 'company_firm'; // स्वामित्व प्रकार
  landTitleCategory?: 'general_freehold' | 'obc_freehold' | 'sc_st_permission_required'; // टाइटल श्रेणी
}

export interface Amenity {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
}

export interface Property {
  id: string;
  title: string;
  titleHi: string;
  purpose: PurposeType; // 'buy' or 'rent' or 'commercial' or 'plot'
  category: PropertyCategory;
  price: number; // in Rupees (e.g. 6500000 = 65 Lakhs, 25000 = 25k/month)
  priceDisplayEn: string;
  priceDisplayHi: string;
  pricePerSqFt?: number;
  maintenance?: number;
  isNegotiable?: boolean;
  
  city: string;
  state?: string;
  locality: string;
  address: string;
  pincode: string;
  
  // Revenue & Land Record Details (जिला, तहसील, राजस्व निरीक्षक मंडल, ग्राम, खसरा नंबर)
  district?: string;
  tehsil?: string;
  revenueCircle?: string;
  village?: string;
  khasraNumber?: string;
  
  bhk?: number; // 1, 2, 3, 4, 5
  bathrooms?: number;
  balconies?: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt?: number;
  plotAreaSqYds?: number;
  
  floor?: number;
  totalFloors?: number;
  facing?: FacingDirection;
  furnishing: FurnishingStatus;
  possession: PossessionStatus;
  possessionDate?: string;
  ageOfProperty?: string;
  
  images: string[];
  floorPlanUrl?: string;
  videoUrl?: string;
  isFeatured?: boolean;
  isVerified: boolean;
  isExclusiveHundredBuilders: boolean;
  reraId?: string;
  
  listedBy: ListedByType;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  
  description: string;
  descriptionHi: string;
  amenities: string[]; // amenity IDs
  agriculturalLandDetails?: AgriculturalLandDetails;
  plotDetails?: ResidentialPlotDetails;
  nearbyLandmarks: {
    metroDistance?: string;
    airportDistance?: string;
    schoolDistance?: string;
    hospitalDistance?: string;
    mallDistance?: string;
  };
  
  createdAt: string;
  viewsCount: number;
  creatorUserId?: string;
  creatorUserRole?: UserRole;
}

export interface FilterState {
  purpose: PurposeType;
  city: string;
  searchQuery: string;
  category: string;
  bhk: number[];
  minPrice: number;
  maxPrice: number;
  furnishing: string[];
  possession: string[];
  listedBy: string[];
  amenities: string[];
  verifiedOnly: boolean;
  hundredBuildersOnly: boolean;
  sortBy: 'relevance' | 'price_low_high' | 'price_high_low' | 'newest' | 'area_high_low';
}

export interface SiteVisitBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  message: string;
  inquiryType: 'pricing' | 'site_visit' | 'callback' | 'loan_assistance';
  createdAt: string;
}

export interface BrokerRegistration {
  id: string; // e.g. HBR-CC-2026-XXXX
  fullName: string;
  fatherName: string;
  gender: 'male' | 'female' | 'other';
  dob?: string;
  
  phone: string;
  whatsappNumber?: string;
  email: string;
  
  currentAddress: string;
  permanentAddress: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  
  aadhaarNumber: string;
  panNumber: string;
  drivingLicenseNumber: string;
  reraNumber?: string;
  
  experienceYears: string;
  operatingAreas: string;
  specialization: string[];
  agencyName?: string;
  
  // Payout bank details
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;

  // KYC upload file names
  aadhaarDocName?: string;
  panDocName?: string;
  dlDocName?: string;
  profilePhotoName?: string;

  registeredAt: string;
  status: 'verified_active' | 'under_review';
  activationStatus?: 'pending' | 'activated' | 'suspended';
  activatedAt?: string;
  activatedBy?: string;
  corporateSealId?: string;
  corporateNotes?: string;
  lastSharedAt?: string;
  lastSharedChannel?: 'whatsapp' | 'email' | 'printed' | 'clipboard';
}
