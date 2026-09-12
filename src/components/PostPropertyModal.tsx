import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Home, 
  MapPin, 
  IndianRupee, 
  Phone, 
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Landmark,
  Tractor,
  Ruler,
  Pencil,
  Trash2
} from 'lucide-react';
import { Property, PurposeType, PropertyCategory, FurnishingStatus, PossessionStatus, FacingDirection, AgriculturalLandDetails, ResidentialPlotDetails, ListedByType, AuthUser } from '../types';
import { AgriculturalLandAreaForm } from './AgriculturalLandAreaForm';
import { ResidentialPlotAreaForm } from './ResidentialPlotAreaForm';
import { Language, translations, amenitiesList } from '../data/translations';
import { CITIES_LIST, SAMPLE_PROPERTY_IMAGES, CHHATTISGARH_CITIES, MADHYA_PRADESH_CITIES, OTHER_METRO_CITIES } from '../data/mockProperties';
import { 
  sanitizeText, 
  sanitizeUrl, 
  validateUploadedFile, 
  checkRateLimit, 
  isHoneypotTriggered 
} from '../utils/security';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => void;
  lang: Language;
  authUser?: AuthUser | null;
  propertyToEdit?: Property | null;
  onUpdateProperty?: (updatedProp: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  lang,
  authUser,
  propertyToEdit,
  onUpdateProperty,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const isHi = lang === 'hi';
  const isEditing = Boolean(propertyToEdit);

  // Wizard Step State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [purpose, setPurpose] = useState<PurposeType>('buy');
  const [category, setCategory] = useState<PropertyCategory>('apartment');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState(authUser?.city || 'Raipur');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [societyName, setSocietyName] = useState(authUser?.companyName || '');

  // Revenue & Land Record Details (जिला, तहसील, राजस्व निरीक्षक मंडल, ग्राम, खसरा नंबर)
  const [district, setDistrict] = useState(authUser?.city || 'Raipur');
  const [tehsil, setTehsil] = useState('');
  const [revenueCircle, setRevenueCircle] = useState('');
  const [village, setVillage] = useState('');
  const [khasraNumber, setKhasraNumber] = useState('');
  
  const [bhk, setBhk] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [balconies, setBalconies] = useState<number>(1);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1150);
  const [floor, setFloor] = useState<number>(4);
  const [totalFloors, setTotalFloors] = useState<number>(12);
  const [facing, setFacing] = useState<FacingDirection>('East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('semi_furnished');
  const [possession, setPossession] = useState<PossessionStatus>('ready_to_move');

  // Agricultural Land Area Details State (कृषि भूमि क्षेत्रफल की संपूर्ण जानकारी)
  const [agriDetails, setAgriDetails] = useState<AgriculturalLandDetails>({
    totalAreaAcres: 2.5,
    totalAreaDismil: 250,
    totalAreaHectares: 1.0117,
    totalAreaSqFt: 108900,
    totalAreaBigha: 4,
    primaryUnit: 'acre',
    primaryUnitValue: 2.5,
    roadFrontageFt: 120,
    approachRoadWidthFt: 30,
    approachRoadType: 'tar_road',
    isCornerLand: false,
    irrigationStatus: 'fully_irrigated',
    cropCycle: 'double_crop',
    soilType: 'kanhar',
    isFenced: true,
    fencingType: 'tarbandi_fencing',
    hasBorewell: true,
    borewellCount: 1,
    hasElectricityConnection: true,
    waterSources: ['borewell', 'canal'],
    govtRakbaHectare: '1.0110',
    landTitleCategory: 'general_freehold',
  });

  // Residential Plot Area Details State (रेसिडेंशियल प्लॉट / जमीन क्षेत्रफल की संपूर्ण जानकारी)
  const [plotDetails, setPlotDetails] = useState<ResidentialPlotDetails>({
    totalAreaSqFt: 1500,
    totalAreaSqYds: 166.67,
    totalAreaDismil: 3.44,
    totalAreaSqMtr: 139.35,
    primaryUnit: 'sqft',
    primaryUnitValue: 1500,
    plotLengthFt: 50,
    plotWidthFt: 30,
    dimensionsText: '30 ft x 50 ft',
    facingRoadWidthFt: 30,
    roadType: 'cc_concrete',
    isCornerPlot: false,
    openSidesCount: 1,
    facingDirection: 'East',
    boundaryWall: 'constructed_brick_wall',
    isGatedColony: true,
    colonyName: '',
    plotNumber: '',
    floorsAllowedConstruction: 3,
    approvalType: 'tncp_approved',
    diversionStatus: 'diverted_residential',
    reraNumber: '',
    landTitleType: 'freehold_clear_title',
    hasElectricityPoles: true,
    hasWaterSupplyLine: true,
    hasDrainageSewage: true,
    hasStreetLights: true,
  });

  const [price, setPrice] = useState<number>(6500000);
  const [maintenance, setMaintenance] = useState<number>(2500);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'lift', 'parking', 'security', 'power_backup', 'water_supply'
  ]);
  const [selectedImages, setSelectedImages] = useState<string[]>([
    SAMPLE_PROPERTY_IMAGES[0],
    SAMPLE_PROPERTY_IMAGES[1],
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [contactName, setContactName] = useState(authUser?.name || '');
  const [contactPhone, setContactPhone] = useState(authUser?.phone || '');
  const [contactEmail, setContactEmail] = useState(authUser?.email || '');
  const [listedBy, setListedBy] = useState<ListedByType>(
    authUser?.role ? (authUser.role as ListedByType) : 'owner'
  );
  const [honeypot, setHoneypot] = useState('');

  const [formError, setFormError] = useState('');

  // Synchronize form fields whenever propertyToEdit changes or modal opens
  useEffect(() => {
    if (propertyToEdit) {
      setPurpose(propertyToEdit.purpose);
      setCategory(propertyToEdit.category);
      setTitle(propertyToEdit.title || propertyToEdit.titleHi || '');
      setCity(propertyToEdit.city || authUser?.city || 'Raipur');
      setLocality(propertyToEdit.locality || '');
      setAddress(propertyToEdit.address || '');
      setPincode(propertyToEdit.pincode || '');
      setSocietyName(propertyToEdit.societyName || '');

      setDistrict(propertyToEdit.revenueCircleDetails?.district || propertyToEdit.city || 'Raipur');
      setTehsil(propertyToEdit.revenueCircleDetails?.tehsil || '');
      setRevenueCircle(propertyToEdit.revenueCircleDetails?.revenueInspectorCircle || '');
      setVillage(propertyToEdit.revenueCircleDetails?.village || '');
      setKhasraNumber(propertyToEdit.revenueCircleDetails?.khasraNumber || '');

      setBhk(propertyToEdit.bhk || 2);
      setBathrooms(propertyToEdit.bathrooms || 2);
      setBalconies(propertyToEdit.balconies || 1);
      setCarpetAreaSqFt(propertyToEdit.carpetAreaSqFt || 1150);
      setFloor(propertyToEdit.floor || 0);
      setTotalFloors(propertyToEdit.totalFloors || 0);
      setFacing(propertyToEdit.facing || 'East');
      setFurnishing(propertyToEdit.furnishing || 'semi_furnished');
      setPossession(propertyToEdit.possession || 'ready_to_move');

      if (propertyToEdit.agriculturalLandDetails) {
        setAgriDetails(propertyToEdit.agriculturalLandDetails);
      }
      if (propertyToEdit.plotDetails) {
        setPlotDetails(propertyToEdit.plotDetails);
      }

      setPrice(propertyToEdit.price);
      setMaintenance(propertyToEdit.maintenance || 0);
      setIsNegotiable(propertyToEdit.isNegotiable ?? true);
      setDescription(propertyToEdit.description || propertyToEdit.descriptionHi || '');
      setSelectedAmenities(propertyToEdit.amenities || ['lift', 'parking', 'security']);
      setSelectedImages(
        propertyToEdit.images && propertyToEdit.images.length > 0 
          ? [...propertyToEdit.images] 
          : [SAMPLE_PROPERTY_IMAGES[0]]
      );

      setContactName(propertyToEdit.contactName || authUser?.name || '');
      setContactPhone(propertyToEdit.contactPhone || authUser?.phone || '');
      setContactEmail(propertyToEdit.contactEmail || authUser?.email || '');
      setListedBy(propertyToEdit.listedBy || (authUser?.role ? (authUser.role as ListedByType) : 'owner'));
      setStep(1);
      setFormError('');
    } else {
      // Default initial states for a brand new property
      setPurpose('buy');
      setCategory('apartment');
      setTitle('');
      setCity(authUser?.city || 'Raipur');
      setLocality('');
      setAddress('');
      setPincode('');
      setSocietyName(authUser?.companyName || '');

      setDistrict(authUser?.city || 'Raipur');
      setTehsil('');
      setRevenueCircle('');
      setVillage('');
      setKhasraNumber('');

      setBhk(2);
      setBathrooms(2);
      setBalconies(1);
      setCarpetAreaSqFt(1150);
      setFloor(4);
      setTotalFloors(12);
      setFacing('East');
      setFurnishing('semi_furnished');
      setPossession('ready_to_move');

      setPrice(6500000);
      setMaintenance(2500);
      setIsNegotiable(true);
      setDescription('');
      setSelectedAmenities(['lift', 'parking', 'security', 'power_backup', 'water_supply']);
      setSelectedImages([SAMPLE_PROPERTY_IMAGES[0], SAMPLE_PROPERTY_IMAGES[1]]);

      setContactName(authUser?.name || '');
      setContactPhone(authUser?.phone || '');
      setContactEmail(authUser?.email || '');
      setListedBy(authUser?.role ? (authUser.role as ListedByType) : 'owner');
      setStep(1);
      setFormError('');
    }
  }, [propertyToEdit, isOpen, authUser]);

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddSampleImage = (url: string) => {
    if (!selectedImages.includes(url)) {
      setSelectedImages((prev) => [...prev, url]);
    }
  };

  const handleAddCustomImageUrl = () => {
    const cleanUrl = sanitizeUrl(customImageUrl.trim());
    if (!cleanUrl) {
      setFormError(lang === 'hi' ? 'कृपया मान्य व सुरक्षित इमेज URL (http:// या https://) दर्ज करें।' : 'Please enter a valid, safe image URL (http/https only).');
      return;
    }
    if (!selectedImages.includes(cleanUrl)) {
      setSelectedImages((prev) => [...prev, cleanUrl]);
      setCustomImageUrl('');
      setFormError('');
    }
  };

  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateUploadedFile(file);
      if (!validation.valid) {
        setFormError(validation.error || 'अमान्य फ़ाइल (Invalid file)');
        return;
      }
      setFormError('');
      // Create local safe object URL for preview
      const localUrl = URL.createObjectURL(file);
      setSelectedImages((prev) => [...prev, localUrl]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Format display price
  const formatPriceDisplay = (val: number, isRent: boolean) => {
    if (isRent) {
      return `₹${val.toLocaleString()} / month`;
    }
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} Lakh`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const formatPriceDisplayHi = (val: number, isRent: boolean) => {
    if (isRent) {
      return `₹${val.toLocaleString()} / महीना`;
    }
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} करोड़`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} लाख`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security Guard 1: Anti-Bot Trap
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[Security Guard] Bot rejected');
      return;
    }

    // Security Guard 2: Anti-Spam Rate Limit (Max 4 properties per minute)
    const rateCheck = checkRateLimit('post_property', 4, 60000);
    if (!rateCheck.allowed) {
      setFormError(lang === 'hi'
        ? `सुरक्षा कारणों से बहुत अधिक प्रयास दर्ज किए गए। कृपया ${rateCheck.retryAfterSec} सेकंड बाद पुनः प्रयास करें।`
        : `Rate limit reached. Please wait ${rateCheck.retryAfterSec} seconds before posting again.`);
      return;
    }

    if (!contactName.trim() || !contactPhone.trim()) {
      setFormError(lang === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर भरें।' : 'Please enter your full name and phone number.');
      return;
    }

    const isAgri = category === 'agricultural_land' || purpose === 'agriculture';
    const isPlot = category === 'plot' || purpose === 'plot';
    const effectiveSqFt = isAgri 
      ? (agriDetails.totalAreaSqFt || Math.round(agriDetails.totalAreaAcres * 43560)) 
      : isPlot 
      ? (plotDetails.totalAreaSqFt || Number(carpetAreaSqFt))
      : Number(carpetAreaSqFt);
    const pricePerSqFt = effectiveSqFt > 0 ? Math.round(price / effectiveSqFt) : undefined;
    const isRent = purpose === 'rent';

    const safeTitle = sanitizeText(title.trim(), 120);
    const safeLocality = sanitizeText(locality.trim(), 80);
    const safeSociety = sanitizeText(societyName.trim(), 100);
    const safeVillage = sanitizeText(village.trim(), 80);
    const safeKhasra = sanitizeText(khasraNumber.trim(), 50);
    const safeTehsil = sanitizeText(tehsil.trim(), 80);
    const safeDistrict = sanitizeText(district.trim(), 80);

    const defaultGeneratedTitle = safeTitle || (
      isAgri 
        ? `${agriDetails.totalAreaAcres} Acre Agricultural Land in ${safeVillage ? `${safeVillage}, ` : ''}${safeLocality || city}`
        : isPlot
        ? `${plotDetails.plotWidthFt && plotDetails.plotLengthFt ? `${plotDetails.plotWidthFt}x${plotDetails.plotLengthFt} ft ` : ''}(${plotDetails.totalAreaSqFt} Sq.Ft / ${Math.round(plotDetails.totalAreaSqYds || (plotDetails.totalAreaSqFt / 9))} Sq.Yds) Residential Plot in ${safeLocality || city}`
        : `${bhk || 2} BHK ${category.replace('_', ' ')} in ${safeLocality || city}`
    );

    const defaultGeneratedTitleHi = isAgri
      ? `${agriDetails.totalAreaAcres} एकड़ कृषि भूमि (${agriDetails.totalAreaDismil || Math.round(agriDetails.totalAreaAcres * 100)} डिसमिल), ${safeVillage ? `ग्राम ${safeVillage}, ` : ''}${safeLocality || city}`
      : isPlot
      ? `${plotDetails.plotWidthFt && plotDetails.plotLengthFt ? `${plotDetails.plotWidthFt}×${plotDetails.plotLengthFt} फीट ` : ''}(${plotDetails.totalAreaSqFt} वर्ग फीट / ${Math.round(plotDetails.totalAreaSqYds || (plotDetails.totalAreaSqFt / 9))} वर्ग गज) आवासीय प्लॉट, ${safeLocality || city}`
      : `${bhk || 2} BHK ${category === 'apartment' ? 'फ्लैट' : 'प्रॉपर्टी'}, ${safeLocality || city}`;

    const defaultDescEn = isAgri
      ? `${agriDetails.totalAreaAcres} Acre fertile agricultural land (${agriDetails.totalAreaDismil || Math.round(agriDetails.totalAreaAcres * 100)} Dismil / ${agriDetails.govtRakbaHectare || (agriDetails.totalAreaAcres / 2.471).toFixed(3)} Ha) located in ${safeVillage ? `${safeVillage}, ` : ''}${safeLocality}, ${city}. ${agriDetails.roadFrontageFt ? `${agriDetails.roadFrontageFt} ft road frontage, ` : ''}${agriDetails.irrigationStatus === 'fully_irrigated' ? 'fully irrigated' : 'fertile land'}. ${agriDetails.hasBorewell ? 'Borewell installed, ' : ''}${agriDetails.hasElectricityConnection ? '3-phase agricultural power connection, ' : ''}clear title and ready for immediate registry.`
      : isPlot
      ? `Prime residential plot measuring ${plotDetails.totalAreaSqFt} sq.ft (${Math.round(plotDetails.totalAreaSqYds || (plotDetails.totalAreaSqFt / 9))} sq.yds / ${plotDetails.totalAreaDismil || (plotDetails.totalAreaSqFt / 435.6).toFixed(2)} Dismil) with ${plotDetails.plotWidthFt || 30} ft frontage and ${plotDetails.facingRoadWidthFt || 30} ft wide road. ${plotDetails.isCornerPlot ? 'Corner plot with dual road access. ' : ''}${plotDetails.approvalType === 'tncp_approved' ? 'T&CP approved, ' : plotDetails.approvalType === 'rera_approved' ? 'RERA approved, ' : ''}100% diverted residential land with clear freehold title and ready for immediate registry.`
      : `Beautiful ${bhk} BHK property in ${safeLocality}, ${city}. Ready for immediate occupancy with great ventilation and modern amenities.`;

    const defaultDescHi = isAgri
      ? `${agriDetails.totalAreaAcres} एकड़ उपजाऊ कृषि भूमि (${agriDetails.totalAreaDismil || Math.round(agriDetails.totalAreaAcres * 100)} डिसमिल / ${agriDetails.govtRakbaHectare || (agriDetails.totalAreaAcres / 2.471).toFixed(3)} हेक्टेयर) - ${safeVillage ? `ग्राम ${safeVillage}, ` : ''}${safeLocality}, ${city}। ${agriDetails.roadFrontageFt ? `${agriDetails.roadFrontageFt} फीट रोड फ्रंट, ` : ''}${agriDetails.irrigationStatus === 'fully_irrigated' ? 'पूर्ण सिंचित' : 'कृषि योग्य'}। ${agriDetails.hasBorewell ? 'बोरवेल युक्त, ' : ''}${agriDetails.hasElectricityConnection ? '3-फेज कृषि बिजली कनेक्शन, ' : ''}सामान्य फ्रीहोल्ड व तुरंत रजिस्ट्री योग्य।`
      : isPlot
      ? `${safeLocality}, ${city} में स्थित शानदार आवासीय प्लॉट। कुल क्षेत्रफल ${plotDetails.totalAreaSqFt} वर्ग फीट (${Math.round(plotDetails.totalAreaSqYds || (plotDetails.totalAreaSqFt / 9))} वर्ग गज / ${plotDetails.totalAreaDismil || (plotDetails.totalAreaSqFt / 435.6).toFixed(2)} डिसमिल)। ${plotDetails.plotWidthFt ? `${plotDetails.plotWidthFt} फीट चौड़ा फ्रंट` : ''} एवं ${plotDetails.facingRoadWidthFt ? `${plotDetails.facingRoadWidthFt} फीट चौड़ी सड़क` : ''}। ${plotDetails.isCornerPlot ? 'कॉर्नर प्लॉट (2 तरफ रास्ता)। ' : ''}100% आवासीय डायवर्टेड, T&CP स्वीकृत, सामान्य फ्रीहोल्ड व तुरंत रजिस्ट्री योग्य।`
      : `${safeLocality}, ${city} में स्थित शानदार ${bhk} BHK प्रॉपर्टी। सभी बुनियादी सुविधाओं के साथ तुरंत रहने योग्य।`;

    const newProp: Property = {
      id: `user-${Date.now()}`,
      title: defaultGeneratedTitle,
      titleHi: defaultGeneratedTitleHi,
      purpose,
      category,
      price: Number(price),
      priceDisplayEn: formatPriceDisplay(Number(price), isRent),
      priceDisplayHi: formatPriceDisplayHi(Number(price), isRent),
      pricePerSqFt,
      maintenance: Number(maintenance),
      isNegotiable,
      city: sanitizeText(city, 60),
      state: CHHATTISGARH_CITIES.includes(city)
        ? 'Chhattisgarh'
        : MADHYA_PRADESH_CITIES.includes(city)
        ? 'Madhya Pradesh'
        : undefined,
      district: safeDistrict || undefined,
      tehsil: safeTehsil || undefined,
      revenueCircle: sanitizeText(revenueCircle.trim(), 80) || undefined,
      village: safeVillage || undefined,
      khasraNumber: safeKhasra || undefined,
      locality: safeLocality || city,
      address: sanitizeText(address.trim(), 250) || [
        safeSociety,
        safeLocality,
        safeVillage ? (lang === 'hi' ? `ग्राम: ${safeVillage}` : `Village: ${safeVillage}`) : '',
        safeKhasra ? (lang === 'hi' ? `खसरा नं: ${safeKhasra}` : `Khasra No: ${safeKhasra}`) : '',
        safeTehsil ? (lang === 'hi' ? `तहसील: ${safeTehsil}` : `Tehsil: ${safeTehsil}`) : '',
        safeDistrict ? (lang === 'hi' ? `जिला: ${safeDistrict}` : `District: ${safeDistrict}`) : '',
        city
      ].filter(Boolean).join(', '),
      pincode: sanitizeText(pincode.trim(), 10) || '110001',
      bhk: (isAgri || isPlot) ? 0 : Number(bhk),
      bathrooms: (isAgri || isPlot) ? 0 : Number(bathrooms),
      balconies: (isAgri || isPlot) ? 0 : Number(balconies),
      carpetAreaSqFt: effectiveSqFt,
      plotAreaSqYds: isPlot ? (plotDetails.totalAreaSqYds || Math.round(plotDetails.totalAreaSqFt / 9)) : undefined,
      floor: (isAgri || isPlot) ? 0 : Number(floor),
      totalFloors: (isAgri || isPlot) ? 0 : Number(totalFloors),
      facing: isPlot ? (plotDetails.facingDirection || facing) : facing,
      furnishing: (isAgri || isPlot) ? 'unfurnished' : furnishing,
      possession,
      agriculturalLandDetails: isAgri ? agriDetails : undefined,
      plotDetails: isPlot ? plotDetails : undefined,
      images: selectedImages.length > 0 ? selectedImages : [SAMPLE_PROPERTY_IMAGES[0]],
      isFeatured: false,
      isVerified: true,
      isExclusiveHundredBuilders: listedBy === 'hundred_builders',
      listedBy,
      contactName: sanitizeText(contactName.trim(), 80),
      contactPhone: sanitizeText(contactPhone.trim(), 15),
      contactEmail: sanitizeText(contactEmail.trim(), 80) || 'user@example.com',
      contactWhatsApp: sanitizeText(contactPhone.trim(), 15),
      description: sanitizeText(description.trim(), 1000) || defaultDescEn,
      descriptionHi: sanitizeText(description.trim(), 1000) || defaultDescHi,
      amenities: selectedAmenities,
      nearbyLandmarks: {
        metroDistance: '1.5 km',
        hospitalDistance: '2.0 km',
        mallDistance: '1.0 km',
      },
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      creatorUserId: authUser?.id,
      creatorUserRole: authUser?.role,
    };

    if (propertyToEdit && onUpdateProperty) {
      const updatedProp: Property = {
        ...propertyToEdit,
        purpose,
        category,
        title: defaultGeneratedTitle,
        titleHi: defaultGeneratedTitleHi,
        price: Number(price),
        priceDisplayEn: formatPriceDisplay(Number(price), isRent),
        priceDisplayHi: formatPriceDisplayHi(Number(price), isRent),
        pricePerSqFt,
        maintenance: Number(maintenance),
        isNegotiable,
        city: sanitizeText(city, 60),
        state: CHHATTISGARH_CITIES.includes(city)
          ? 'Chhattisgarh'
          : MADHYA_PRADESH_CITIES.includes(city)
          ? 'Madhya Pradesh'
          : propertyToEdit.state,
        district: safeDistrict || propertyToEdit.district,
        tehsil: safeTehsil || propertyToEdit.tehsil,
        revenueCircle: sanitizeText(revenueCircle.trim(), 80) || propertyToEdit.revenueCircle,
        village: safeVillage || propertyToEdit.village,
        khasraNumber: safeKhasra || propertyToEdit.khasraNumber,
        revenueCircleDetails: {
          district: safeDistrict || city,
          tehsil: safeTehsil || '',
          revenueInspectorCircle: sanitizeText(revenueCircle.trim(), 80),
          village: safeVillage || '',
          khasraNumber: safeKhasra || '',
        },
        locality: safeLocality || propertyToEdit.locality || city,
        address: sanitizeText(address.trim(), 250) || propertyToEdit.address,
        pincode: sanitizeText(pincode.trim(), 10) || propertyToEdit.pincode,
        societyName: safeSociety || propertyToEdit.societyName,
        bhk: (isAgri || isPlot) ? 0 : Number(bhk),
        bathrooms: (isAgri || isPlot) ? 0 : Number(bathrooms),
        balconies: (isAgri || isPlot) ? 0 : Number(balconies),
        carpetAreaSqFt: effectiveSqFt,
        landAreaAcres: isAgri ? agriDetails.totalAreaAcres : undefined,
        plotAreaSqYds: isPlot ? (plotDetails.totalAreaSqYds || Math.round(plotDetails.totalAreaSqFt / 9)) : undefined,
        floor: (isAgri || isPlot) ? 0 : Number(floor),
        totalFloors: (isAgri || isPlot) ? 0 : Number(totalFloors),
        facing: isPlot ? (plotDetails.facingDirection || facing) : facing,
        furnishing: (isAgri || isPlot) ? 'unfurnished' : furnishing,
        possession,
        agriculturalLandDetails: isAgri ? agriDetails : undefined,
        plotDetails: isPlot ? plotDetails : undefined,
        images: selectedImages.length > 0 ? selectedImages : propertyToEdit.images,
        contactName: sanitizeText(contactName.trim(), 80),
        contactPhone: sanitizeText(contactPhone.trim(), 15),
        contactEmail: sanitizeText(contactEmail.trim(), 80) || propertyToEdit.contactEmail,
        contactWhatsApp: sanitizeText(contactPhone.trim(), 15),
        description: sanitizeText(description.trim(), 1000) || propertyToEdit.description,
        descriptionHi: sanitizeText(description.trim(), 1000) || propertyToEdit.descriptionHi,
        amenities: selectedAmenities,
        listedBy,
      };

      onUpdateProperty(updatedProp);
      onClose();
      return;
    }

    onAddProperty(newProp);
  };

  return (
    <div id="post-property-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/80 shadow-xs shrink-0 bg-slate-950 flex items-center justify-center">
              {isEditing ? (
                <Pencil className="w-5 h-5 text-amber-400" />
              ) : (
                <img 
                  src="/logo.png" 
                  alt="100 Builders Realities Seal" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-extrabold">
                  {isEditing
                    ? (isHi ? 'प्रॉपर्टी लिस्टिंग में बदलाव करें (एडिट)' : 'Edit Property Listing')
                    : t.postPropertyTitle}
                </h2>
                {isEditing && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {isHi ? 'एडिट मोड' : 'Edit Mode'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                {isEditing
                  ? (isHi ? 'फोटो हटाएं/जोड़ें, कीमत, साइज और अन्य सभी विवरण अपडेट करें' : 'Update photos, price, size, description and other details')
                  : t.postPropertySubtitle}
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

        {/* Wizard Step Indicators */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
          <button
            onClick={() => setStep(1)}
            className={`py-3 border-b-2 transition ${step === 1 ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-500'}`}
          >
            {t.step1Basic}
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 border-b-2 transition ${step === 2 ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-500'}`}
          >
            {t.step2Location}
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-3 border-b-2 transition ${step === 3 ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-500'}`}
          >
            {t.step3PhotosPrice}
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-3 border-b-2 transition ${step === 4 ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-500'}`}
          >
            {t.step4Contact}
          </button>
        </div>

        {/* Step Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          
          {/* Anti-Bot Honeypot Trap (Hidden from users) */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <input
              type="text"
              name="trap_property_bot_field"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>
              <span>{formError}</span>
            </div>
          )}
          
          {/* STEP 1: Basic Property Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {lang === 'hi' ? 'आप क्या करना चाहते हैं? (I want to)' : 'I want to:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                  {(['buy', 'rent', 'commercial', 'plot', 'agriculture', 'lease'] as PurposeType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPurpose(p);
                        if (p === 'agriculture') {
                          setCategory('agricultural_land');
                        }
                      }}
                      className={`py-3 px-2 rounded-xl font-bold text-xs capitalize transition border cursor-pointer ${
                        purpose === p
                          ? p === 'lease'
                            ? 'bg-indigo-700 text-white border-indigo-700 shadow-md'
                            : 'bg-amber-600 text-white border-amber-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {p === 'buy' ? (lang === 'hi' ? 'बेचना (Sell)' : 'Sell') : (t[p] || p)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.propertyType}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'apartment', label: t.apartment },
                    { id: 'independent_house', label: t.independentHouse },
                    { id: 'builder_floor', label: t.builderFloor },
                    { id: 'plot', label: t.plot },
                    { id: 'agricultural_land', label: t.agriculturalLand },
                    { id: 'commercial_office', label: t.commercialOffice },
                    { id: 'commercial_shop', label: t.commercialShop },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as PropertyCategory)}
                      className={`p-3 rounded-xl text-left font-bold text-xs transition border cursor-pointer ${
                        category === cat.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {category === 'agricultural_land' && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center space-x-2.5 text-xs text-emerald-950 font-bold animate-in fade-in">
                    <Tractor className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      {lang === 'hi' 
                        ? '🌾 कृषि भूमि चयनित: अगले स्टेप (लोकेशन व साइज) में आप एकड़, डिसमिल, हेक्टेयर (बी-1 रिकॉर्ड), रोड फ्रंट, सिंचाई व मिट्टी की संपूर्ण जानकारी भर पाएंगे।'
                        : '🌾 Agricultural Land selected: In Step 2, you can fill in complete area details including Acres, Dismil, Hectare (B-1), Road Frontage & Irrigation.'}
                    </span>
                  </div>
                )}

                {category === 'plot' && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-xl border-2 border-indigo-300 flex items-center space-x-2.5 text-xs text-indigo-950 font-bold animate-in fade-in shadow-2xs">
                    <Ruler className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span>
                      {lang === 'hi' 
                        ? '🏡 रेसिडेंशियल प्लॉट / जमीन चयनित: अगले स्टेप (लोकेशन व साइज) में आप प्लॉट की लंबाई × चौड़ाई (साइज), कुल वर्ग फीट, वर्ग गज (Gaj), डिसमिल, रोड चौड़ाई, कॉर्नर स्टेटस, दिशा व डायवर्सन की संपूर्ण जानकारी भर पाएंगे।'
                        : '🏡 Residential Plot selected: In Step 2, you can fill in complete area details including Length x Width, Sq.Ft, Gaj, Dismil, Road Width, Corner Status, Facing & Legal Diversion.'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'hi' ? 'प्रॉपर्टी शीर्षक (Property Title / Headline)' : 'Property Headline'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    category === 'agricultural_land'
                      ? (lang === 'hi' ? 'उदा: 2.5 एकड़ उपजाऊ सिंचित कृषि भूमि, नेशनल हाईवे के पास' : 'e.g. 2.5 Acre Fertile Irrigated Agricultural Land near Highway')
                      : category === 'plot'
                      ? (lang === 'hi' ? 'उदा: 30x50 फीट (1500 वर्ग फीट) T&CP अप्रूव्ड रेसिडेंशियल कॉर्नर प्लॉट' : 'e.g. 30x50 ft (1500 Sq.Ft) T&CP Approved Residential Corner Plot')
                      : (lang === 'hi' ? 'उदा: 3 BHK लक्जरी फ्लैट इन सेक्टर 150 नोएडा' : 'e.g. Spacious 3 BHK Apartment with Pool View')
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'अगला कदम: लोकेशन व साइज' : 'Next: Location & Specs'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Specifications */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.citySelect} *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      if (!district || district === city) {
                        setDistrict(newCity);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <optgroup label="📍 Chhattisgarh (छत्तीसगढ़ के शहर)">
                      {CHHATTISGARH_CITIES.map((c) => (
                        <option key={c} value={c}>{c} (CG)</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Madhya Pradesh (मध्य प्रदेश के सभी शहर व गांव)">
                      {MADHYA_PRADESH_CITIES.map((c) => (
                        <option key={c} value={c}>{c} (MP)</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏙️ Other Major Metros">
                      {OTHER_METRO_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {lang === 'hi' ? 'इलाका / लोकैलिटी (Locality)' : 'Locality / Area'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sector 150, Whitefield, Bandra..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.societyName}
                  </label>
                  <input
                    type="text"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    placeholder="e.g. Hundred Heights, Palm Greens..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.pincode}
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 201310"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* राजस्व व भूमि रिकॉर्ड विवरण (जिला, तहसील, राजस्व निरीक्षक मंडल, ग्राम, खसरा नंबर) */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-50/70 rounded-2xl border-2 border-amber-300/80 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-amber-200/80">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                        {lang === 'hi' ? 'राजस्व एवं भू-अभिलेख विवरण (Land & Revenue Details)' : 'Revenue & Land Record Details'}
                      </span>
                      <span className="text-[11px] text-slate-600 block">
                        {lang === 'hi' 
                          ? 'रजिस्ट्री एवं भूमि रिकॉर्ड विवरण (जिला, तहसील, राजस्व निरीक्षक मंडल, ग्राम, खसरा नंबर)' 
                          : 'Registry verification details: District, Tehsil, RI Circle, Village & Khasra Number'}
                      </span>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[10px] font-black tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
                    {lang === 'hi' ? 'भूमि व राजस्व रिकॉर्ड' : 'Revenue Record'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {/* 1. जिला (District) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'जिला (District)' : 'District'}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा: रायपुर, दुर्ग, भोपाल...' : 'e.g. Raipur, Durg, Bhopal...'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* 2. तहसील (Tehsil) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'तहसील (Tehsil)' : 'Tehsil'}
                    </label>
                    <input
                      type="text"
                      value={tehsil}
                      onChange={(e) => setTehsil(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा: रायपुर, पाटन, आरंग...' : 'e.g. Patan, Arang, Huzur...'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* 3. राजस्व निरीक्षक मंडल (RI Circle) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'राजस्व निरीक्षक मंडल (RI Circle)' : 'Revenue Inspector (RI) Circle'}
                    </label>
                    <input
                      type="text"
                      value={revenueCircle}
                      onChange={(e) => setRevenueCircle(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा: आर.आई. मंडल 1 / खरोरा...' : 'e.g. RI Circle 1, Kharora...'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* 4. ग्राम (Village) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'ग्राम / मौजा (Village)' : 'Village / Gram'}
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा: सेरीखेड़ी, बोरियाकला, अमलेश्वर...' : 'e.g. Serikhedi, Boriyakhurd...'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* 5. खसरा नंबर (Khasra Number) */}
                  <div className="sm:col-span-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'खसरा नंबर (Khasra Number)' : 'Khasra Number (Land Record / Survey No.)'}
                    </label>
                    <input
                      type="text"
                      value={khasraNumber}
                      onChange={(e) => setKhasraNumber(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा: खसरा नं. 142/2, 143/1 (राजस्व अभिलेख अनुसार)' : 'e.g. Khasra No. 142/2, 143/1'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Specs Grid or Agricultural Land Area Form or Residential Plot Area Form */}
              {(category === 'agricultural_land' || purpose === 'agriculture') ? (
                <AgriculturalLandAreaForm
                  lang={lang}
                  value={agriDetails}
                  onChange={setAgriDetails}
                  propertyPrice={price}
                  onCarpetAreaChange={(sqft) => setCarpetAreaSqFt(sqft)}
                />
              ) : (category === 'plot' || purpose === 'plot') ? (
                <ResidentialPlotAreaForm
                  lang={lang}
                  value={plotDetails}
                  onChange={setPlotDetails}
                  propertyPrice={price}
                  onCarpetAreaChange={(sqft) => setCarpetAreaSqFt(sqft)}
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <span className="text-xs font-extrabold text-slate-900 block uppercase">
                    {lang === 'hi' ? 'प्रॉपर्टी साइज व कमरों की संख्या' : 'Dimensions & Configuration'}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.bedrooms}</label>
                      <select
                        value={bhk}
                        onChange={(e) => setBhk(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} BHK</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.bathrooms}</label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} Baths</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.carpetArea} ({t.sqft})</label>
                      <input
                        type="number"
                        value={carpetAreaSqFt}
                        onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.furnishing}</label>
                      <select
                        value={furnishing}
                        onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="furnished">{t.furnished}</option>
                        <option value="semi_furnished">{t.semiFurnished}</option>
                        <option value="unfurnished">{t.unfurnished}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'अगला कदम: कीमत व फोटो' : 'Next: Pricing & Photos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Photos */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {purpose === 'rent' ? t.monthlyRent : t.expectedPrice} *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-base font-extrabold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-xs text-amber-700 font-bold mt-1 block">
                    {formatPriceDisplay(price, purpose === 'rent')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.maintenanceCharges}
                  </label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {category === 'agricultural_land' && agriDetails.totalAreaAcres > 0 && price > 0 && (
                <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <Tractor className="w-4 h-4 text-emerald-700" />
                    <span className="font-black text-emerald-900">
                      {lang === 'hi' ? 'कृषि भूमि अनुमानित दर:' : 'Calculated Agricultural Rate:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 font-extrabold text-emerald-900">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                      ₹{Math.round(price / agriDetails.totalAreaAcres).toLocaleString()} {lang === 'hi' ? '/ एकड़' : '/ Acre'}
                    </span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                      ₹{Math.round(price / (agriDetails.totalAreaAcres * 100)).toLocaleString()} {lang === 'hi' ? '/ डिसमिल' : '/ Dismil'}
                    </span>
                  </div>
                </div>
              )}

              {(category === 'plot' || purpose === 'plot') && plotDetails.totalAreaSqFt > 0 && price > 0 && (
                <div className="p-3.5 bg-indigo-50 border-2 border-indigo-300 rounded-xl text-xs font-bold text-indigo-950 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-indigo-700" />
                    <span className="font-black text-indigo-900">
                      {lang === 'hi' ? 'रेसिडेंशियल प्लॉट अनुमानित दर:' : 'Calculated Residential Plot Rate:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 font-extrabold text-indigo-900">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-300">
                      ₹{Math.round(price / plotDetails.totalAreaSqFt).toLocaleString()} {lang === 'hi' ? '/ वर्ग फीट (Sq.Ft)' : '/ Sq.Ft'}
                    </span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-300">
                      ₹{Math.round(price / (plotDetails.totalAreaSqYds || (plotDetails.totalAreaSqFt / 9) || 1)).toLocaleString()} {lang === 'hi' ? '/ वर्ग गज (Gaj)' : '/ Sq.Yd (Gaj)'}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.photosUpload} ({selectedImages.length} {isHi ? 'तस्वीरें' : 'photos'})
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isHi ? 'लाल बटन से फोटो हटाएं, नई फोटो नीचे से जोड़ें' : 'Remove photos with red button, add new ones below'}
                  </span>
                </div>
                
                {/* Image Gallery Selected */}
                {selectedImages.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 text-center text-xs text-amber-900 font-bold mb-3">
                    {isHi ? 'कोई फोटो नहीं है। कृपया नीचे से फोटो जोड़ें।' : 'No photos selected. Please upload or add photos below.'}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5 mb-3">
                    {selectedImages.map((img, i) => (
                      <div key={i} className="relative w-28 h-24 rounded-xl overflow-hidden border-2 border-slate-200 group shadow-xs">
                        <img src={img} alt="preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        {i === 0 ? (
                          <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            {isHi ? 'मुख्य फोटो' : 'Cover'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = [img, ...selectedImages.filter((_, idx) => idx !== i)];
                              setSelectedImages(newArr);
                            }}
                            className="absolute bottom-1 left-1 bg-slate-900/85 hover:bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs cursor-pointer"
                            title={isHi ? 'इसे मुख्य फोटो बनाएं' : 'Make Cover Photo'}
                          >
                            {isHi ? 'मुख्य बनाएं' : 'Set Cover'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg p-1 shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center"
                          title={isHi ? 'फोटो हटाएं (Remove Photo)' : 'Remove Photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Preset Sample Images */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    {lang === 'hi' ? 'सैंपल हाई-डेफिनिशन तस्वीरें चुनें:' : 'Or choose sample real estate photos:'}
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {SAMPLE_PROPERTY_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSampleImage(img)}
                        className="w-14 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 hover:border-amber-500 transition cursor-pointer"
                      >
                        <img src={img} alt="preset" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Local Device Secure Photo Upload & Web URL */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center justify-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition">
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'hi' ? 'गैलरी / फोन से फोटो अपलोड करें' : 'Upload from Device'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleDirectImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center space-x-1.5">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomImageUrl}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
                      >
                        {lang === 'hi' ? 'जोड़ें' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities multi checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.amenities}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {amenitiesList.map((am) => (
                    <label key={am.id} className="flex items-center space-x-2 text-xs font-medium text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-amber-50/50">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(am.id)}
                        onChange={() => handleToggleAmenity(am.id)}
                        className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="truncate">{lang === 'hi' ? am.nameHi : am.nameEn}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'अगला कदम: संपर्क विवरण' : 'Next: Contact Info'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Publish */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.listedBy}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'owner', label: t.owner },
                    { id: 'verified_agent', label: t.verifiedAgent },
                    { id: 'hundred_builders', label: t.builder },
                    { id: 'registered_broker', label: lang === 'hi' ? 'रजिस्टर्ड ब्रोकर' : 'Broker (RERA)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setListedBy(item.id as ListedByType)}
                      className={`py-2.5 px-1 rounded-xl font-bold text-xs text-center border cursor-pointer transition ${
                        listedBy === item.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.ownerName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.ownerPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 78059 80006"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.ownerEmail}
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. contact@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.description}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  id="submit-property-listing-btn"
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  {isEditing ? <Check className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  <span>
                    {isEditing
                      ? (isHi ? 'बदलाव सहेजें (Save Changes)' : 'Save Changes')
                      : t.submitListing}
                  </span>
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
