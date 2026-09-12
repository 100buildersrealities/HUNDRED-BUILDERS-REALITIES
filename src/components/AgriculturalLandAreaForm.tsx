import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  Ruler, 
  Compass, 
  Droplets, 
  Zap, 
  Shield, 
  FileText, 
  Calculator, 
  Info,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { AgriculturalLandDetails, AgriAreaUnit } from '../types';
import { Language } from '../data/translations';

interface AgriculturalLandAreaFormProps {
  lang: Language;
  value: AgriculturalLandDetails;
  onChange: (updated: AgriculturalLandDetails) => void;
  propertyPrice?: number;
  onCarpetAreaChange?: (sqFt: number) => void;
}

export const AgriculturalLandAreaForm: React.FC<AgriculturalLandAreaFormProps> = ({
  lang,
  value,
  onChange,
  propertyPrice,
  onCarpetAreaChange,
}) => {
  const isHi = lang === 'hi';

  // Local helper states
  const [selectedUnit, setSelectedUnit] = useState<AgriAreaUnit>(value.primaryUnit || 'acre');
  const [unitValue, setUnitValue] = useState<number>(value.primaryUnitValue || 2.5);
  
  // Split entry helper (Acres + Dismil, widely used in Central & Eastern India)
  const [splitAcres, setSplitAcres] = useState<number>(Math.floor(value.totalAreaAcres || 2));
  const [splitDismil, setSplitDismil] = useState<number>(Math.round(((value.totalAreaAcres || 2.5) % 1) * 100));
  const [entryMode, setEntryMode] = useState<'single' | 'split'>('single');

  // Dimensions
  const [frontage, setFrontage] = useState<number | undefined>(value.roadFrontageFt || 120);
  const [lengthFt, setLengthFt] = useState<number | undefined>(value.lengthFt || 300);
  const [widthFt, setWidthFt] = useState<number | undefined>(value.widthFt || 120);
  const [roadWidth, setRoadWidth] = useState<number | undefined>(value.approachRoadWidthFt || 30);
  const [roadType, setRoadType] = useState<AgriculturalLandDetails['approachRoadType']>(value.approachRoadType || 'tar_road');
  const [isCorner, setIsCorner] = useState<boolean>(value.isCornerLand || false);

  // Farming, Soil, Utilities
  const [irrigation, setIrrigation] = useState<AgriculturalLandDetails['irrigationStatus']>(value.irrigationStatus || 'fully_irrigated');
  const [cropCycle, setCropCycle] = useState<AgriculturalLandDetails['cropCycle']>(value.cropCycle || 'double_crop');
  const [soilType, setSoilType] = useState<string>(value.soilType || 'kanhar');
  const [fencingType, setFencingType] = useState<AgriculturalLandDetails['fencingType']>(value.fencingType || 'tarbandi_fencing');
  const [hasBorewell, setHasBorewell] = useState<boolean>(value.hasBorewell !== undefined ? value.hasBorewell : true);
  const [borewellCount, setBorewellCount] = useState<number>(value.borewellCount || 1);
  const [hasElectricity, setHasElectricity] = useState<boolean>(value.hasElectricityConnection !== undefined ? value.hasElectricityConnection : true);
  const [hasFarmhouse, setHasFarmhouse] = useState<boolean>(value.hasFarmhouseOrShed || false);
  const [waterSources, setWaterSources] = useState<string[]>(value.waterSources || ['borewell', 'canal']);

  // Revenue & Title
  const [govtRakba, setGovtRakba] = useState<string>(value.govtRakbaHectare || '1.0110');
  const [titleCategory, setTitleCategory] = useState<AgriculturalLandDetails['landTitleCategory']>(value.landTitleCategory || 'general_freehold');

  // Conversion calculations
  const calculateAllUnits = (inputVal: number, unit: AgriAreaUnit) => {
    let acres = 0;

    switch (unit) {
      case 'acre':
        acres = inputVal;
        break;
      case 'dismil':
        acres = inputVal / 100;
        break;
      case 'bigha':
        // Standard regional: 1 Acre ≈ 1.6 Bigha (or 1 Bigha = 27,225 sqft = 0.625 Acre)
        acres = inputVal * 0.625;
        break;
      case 'hectare':
        acres = inputVal * 2.47105;
        break;
      case 'sqft':
        acres = inputVal / 43560;
        break;
      case 'sqm':
        acres = inputVal / 4046.86;
        break;
      default:
        acres = inputVal;
    }

    const dismil = Math.round(acres * 100 * 100) / 100;
    const hectares = Math.round((acres / 2.47105) * 10000) / 10000;
    const sqFt = Math.round(acres * 43560);
    const sqMtr = Math.round(acres * 4046.86);
    const bigha = Math.round((acres / 0.625) * 100) / 100;

    return {
      totalAreaAcres: Number(acres.toFixed(3)),
      totalAreaDismil: dismil,
      totalAreaHectares: hectares,
      totalAreaSqFt: sqFt,
      totalAreaSqMtr: sqMtr,
      totalAreaBigha: bigha,
    };
  };

  // Sync state upward whenever input changes
  useEffect(() => {
    let effectiveAcres = 0;
    let effectiveUnit = selectedUnit;
    let effectiveVal = unitValue;

    if (entryMode === 'split') {
      effectiveAcres = (Number(splitAcres) || 0) + ((Number(splitDismil) || 0) / 100);
      effectiveUnit = 'acre';
      effectiveVal = effectiveAcres;
    } else {
      const calc = calculateAllUnits(Number(unitValue) || 0, selectedUnit);
      effectiveAcres = calc.totalAreaAcres;
    }

    const converted = calculateAllUnits(effectiveAcres, 'acre');

    // Notify parent of total square feet for carpet area indexing
    if (onCarpetAreaChange && converted.totalAreaSqFt > 0) {
      onCarpetAreaChange(converted.totalAreaSqFt);
    }

    // Rate calculations
    let ratePerAcre: number | undefined;
    let ratePerDismil: number | undefined;
    let ratePerBigha: number | undefined;

    if (propertyPrice && effectiveAcres > 0) {
      ratePerAcre = Math.round(propertyPrice / effectiveAcres);
      ratePerDismil = Math.round(propertyPrice / (effectiveAcres * 100));
      ratePerBigha = Math.round(propertyPrice / (converted.totalAreaBigha || 1));
    }

    const updatedDetails: AgriculturalLandDetails = {
      totalAreaAcres: converted.totalAreaAcres,
      totalAreaDismil: converted.totalAreaDismil,
      totalAreaHectares: converted.totalAreaHectares,
      totalAreaSqFt: converted.totalAreaSqFt,
      totalAreaSqMtr: converted.totalAreaSqMtr,
      totalAreaBigha: converted.totalAreaBigha,
      primaryUnit: effectiveUnit,
      primaryUnitValue: effectiveVal,
      
      roadFrontageFt: frontage ? Number(frontage) : undefined,
      lengthFt: lengthFt ? Number(lengthFt) : undefined,
      widthFt: widthFt ? Number(widthFt) : undefined,
      approachRoadWidthFt: roadWidth ? Number(roadWidth) : undefined,
      approachRoadType: roadType,
      isCornerLand: isCorner,
      
      irrigationStatus: irrigation,
      cropCycle,
      soilType,
      isFenced: fencingType !== 'open_land',
      fencingType,
      hasBorewell,
      borewellCount: hasBorewell ? Number(borewellCount) : 0,
      hasElectricityConnection: hasElectricity,
      waterSources,
      hasFarmhouseOrShed: hasFarmhouse,
      
      govtRakbaHectare: govtRakba.trim() || undefined,
      ratePerAcre,
      ratePerDismil,
      ratePerBigha,
      landTitleCategory: titleCategory,
    };

    onChange(updatedDetails);
  }, [
    entryMode,
    selectedUnit,
    unitValue,
    splitAcres,
    splitDismil,
    frontage,
    lengthFt,
    widthFt,
    roadWidth,
    roadType,
    isCorner,
    irrigation,
    cropCycle,
    soilType,
    fencingType,
    hasBorewell,
    borewellCount,
    hasElectricity,
    waterSources,
    hasFarmhouse,
    govtRakba,
    titleCategory,
    propertyPrice,
  ]);

  const currentCalcs = entryMode === 'split' 
    ? calculateAllUnits((Number(splitAcres) || 0) + ((Number(splitDismil) || 0) / 100), 'acre')
    : calculateAllUnits(Number(unitValue) || 0, selectedUnit);

  const toggleWaterSource = (source: string) => {
    setWaterSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 text-white rounded-2xl shadow-md flex items-center justify-between border border-emerald-700">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Tractor className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-amber-300">
                {isHi ? 'कृषि भूमि संपूर्ण क्षेत्रफल एवं भू-अभिलेख विवरण' : 'Complete Agricultural Land Area & Records'}
              </h3>
              <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-extrabold uppercase border border-emerald-500">
                {isHi ? '100% सटीक मापन' : 'Live Area Converter'}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              {isHi 
                ? 'एकड़, डिसमिल, हेक्टेयर (बी-1 पर्चा), बीघा, रोड फ्रंट व सिंचाई की संपूर्ण जानकारी भरें।'
                : 'Fill comprehensive measurement units (Acres, Dismil, Hectare), road frontage, soil & irrigation details.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Area Input & Measurement Unit Tabs */}
      <div className="p-5 bg-emerald-50/50 rounded-2xl border-2 border-emerald-300/80 shadow-2xs space-y-4">
        
        {/* Entry Mode Switcher: Standard Unit vs Split (Acre + Dismil) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
          <div>
            <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider">
              {isHi ? '1. कुल जमीन का क्षेत्रफल भरें (Total Land Area)' : '1. Enter Total Land Area'} *
            </label>
            <span className="text-[11px] text-emerald-800">
              {isHi ? 'अपनी पसंदीदा राजस्व इकाई चुनें या एकड़ व डिसमिल अलग-अलग भरें' : 'Select preferred measurement unit or use split Acre + Dismil entry'}
            </span>
          </div>

          <div className="inline-flex p-1 bg-white rounded-xl border border-emerald-300 shadow-2xs">
            <button
              type="button"
              onClick={() => setEntryMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                entryMode === 'single'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {isHi ? 'एकल इकाई (Single Unit)' : 'Single Unit'}
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                entryMode === 'split'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {isHi ? 'एकड़ + डिसमिल जोड़ (Split Acre + Dismil)' : 'Split Acre + Dismil'}
            </button>
          </div>
        </div>

        {/* Form Inputs based on Mode */}
        {entryMode === 'single' ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Number input */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'क्षेत्रफल की संख्या (Value)' : 'Area Value'} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={unitValue}
                  onChange={(e) => setUnitValue(Number(e.target.value))}
                  placeholder={isHi ? 'उदा: 2.5' : 'e.g. 2.5'}
                  className="w-full bg-white border-2 border-emerald-400 rounded-xl px-4 py-2.5 text-lg font-black text-emerald-950 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                  {selectedUnit}
                </span>
              </div>
            </div>

            {/* Unit Selector */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'मापन इकाई चुनें (Measurement Unit)' : 'Select Unit'} *
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value as AgriAreaUnit)}
                className="w-full bg-white border-2 border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
              >
                <option value="acre">{isHi ? 'एकड़ (Acres)' : 'Acres (एकड़)'}</option>
                <option value="dismil">{isHi ? 'डिसमिल / डेसिमल (Dismil / Decimal - 1 एकड़ = 100 डिसमिल)' : 'Dismil / Decimal (डिसमिल)'}</option>
                <option value="hectare">{isHi ? 'हेक्टेयर (Hectares - सरकारी बी-1 राजस्व रिकॉर्ड)' : 'Hectares (हेक्टेयर)'}</option>
                <option value="bigha">{isHi ? 'बीघा (Bigha - क्षेत्रीय मानक)' : 'Bigha (बीघा)'}</option>
                <option value="sqft">{isHi ? 'वर्ग फीट (Square Feet)' : 'Square Feet (वर्ग फीट)'}</option>
                <option value="sqm">{isHi ? 'वर्ग मीटर (Square Meters)' : 'Square Meters (वर्ग मीटर)'}</option>
              </select>
            </div>
          </div>
        ) : (
          /* Split Acres + Dismil Inputs */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'कुल एकड़ (Acres)' : 'Total Acres'} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={splitAcres}
                  onChange={(e) => setSplitAcres(Number(e.target.value))}
                  placeholder="2"
                  className="w-full bg-white border-2 border-emerald-400 rounded-xl px-4 py-2.5 text-lg font-black text-emerald-950 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                  {isHi ? 'एकड़' : 'Acres'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'अतिरिक्त डिसमिल (Remaining Dismil / 100 में से)' : 'Extra Dismil (out of 100)'} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={splitDismil}
                  onChange={(e) => setSplitDismil(Number(e.target.value))}
                  placeholder="50"
                  className="w-full bg-white border-2 border-emerald-400 rounded-xl px-4 py-2.5 text-lg font-black text-emerald-950 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                  {isHi ? 'डिसमिल' : 'Dismil'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-1 block">
                {isHi ? 'नोट: 100 डिसमिल = 1 एकड़' : 'Note: 100 Dismil = 1 Acre'}
              </span>
            </div>
          </div>
        )}

        {/* Live Automatic Unit Conversion Cards */}
        <div className="mt-4 pt-3 border-t border-emerald-200">
          <div className="flex items-center space-x-1.5 mb-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
              {isHi ? 'तत्काल यूनिट कन्वर्जन तालिका (Live Multi-Unit Conversion):' : 'Live Multi-Unit Conversion:'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'कुल एकड़' : 'Acres'}
              </span>
              <span className="text-sm font-black text-emerald-900 block">
                {currentCalcs.totalAreaAcres} {isHi ? 'एकड़' : 'Acres'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'कुल डिसमिल' : 'Dismil'}
              </span>
              <span className="text-sm font-black text-emerald-900 block">
                {currentCalcs.totalAreaDismil?.toLocaleString()} {isHi ? 'डिसमिल' : 'Dismil'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'हेक्टेयर (बी-1)' : 'Hectares (B-1)'}
              </span>
              <span className="text-sm font-black text-emerald-900 block">
                {currentCalcs.totalAreaHectares} Ha
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'कुल बीघा (मानक)' : 'Bigha'}
              </span>
              <span className="text-sm font-black text-emerald-900 block">
                ~ {currentCalcs.totalAreaBigha} {isHi ? 'बीघा' : 'Bigha'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'कुल वर्ग फीट' : 'Total Sq.Ft'}
              </span>
              <span className="text-sm font-black text-emerald-900 block">
                {currentCalcs.totalAreaSqFt?.toLocaleString()} sq.ft
              </span>
            </div>
          </div>
        </div>

        {/* Optional: Government Patwari B-1 Rakba */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHi ? 'सरकारी खसरे/बी-1 पर्चा में दर्ज रकबा (हेक्टेयर में)' : 'Govt B-1 Official Area (in Hectares)'}
            </label>
            <input
              type="text"
              value={govtRakba}
              onChange={(e) => setGovtRakba(e.target.value)}
              placeholder={isHi ? 'उदा: 1.0110 हेक्टेयर' : 'e.g. 1.0110 Hectare'}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHi ? 'भूमि टाइटल व कानूनी श्रेणी (Land Title Category)' : 'Land Title Status'}
            </label>
            <select
              value={titleCategory}
              onChange={(e) => setTitleCategory(e.target.value as AgriculturalLandDetails['landTitleCategory'])}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
            >
              <option value="general_freehold">{isHi ? 'सामान्य / ओबीसी फ्रीहोल्ड (कोई रोक नहीं, तुरंत रजिस्ट्री)' : 'General / OBC Freehold (Clear Title)'}</option>
              <option value="sc_st_permission_required">{isHi ? 'कलेक्टर अनुमति आवश्यक (SC/ST Land)' : 'Collector Permission Required (SC/ST Land)'}</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. Road Frontage, Width & Physical Dimensions */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
          <Ruler className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            {isHi ? '2. रोड कनेक्टिविटी, मुखौटा व चौहद्दी (Frontage & Dimensions)' : '2. Road Connectivity & Dimensions'}
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'रोड फ्रंट / मुखौटा (फीट)' : 'Road Frontage (ft)'} *
            </label>
            <input
              type="number"
              value={frontage || ''}
              onChange={(e) => setFrontage(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 150"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'जमीन की गहराई / लंबाई (फीट)' : 'Length / Depth (ft)'}
            </label>
            <input
              type="number"
              value={lengthFt || ''}
              onChange={(e) => setLengthFt(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 300"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'जमीन की चौड़ाई (फीट)' : 'Width (ft)'}
            </label>
            <input
              type="number"
              value={widthFt || ''}
              onChange={(e) => setWidthFt(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 150"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'सामने सड़क की चौड़ाई (फीट)' : 'Approach Road Width (ft)'}
            </label>
            <input
              type="number"
              value={roadWidth || ''}
              onChange={(e) => setRoadWidth(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 40"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'रास्ते का प्रकार (Approach Road Surface)' : 'Approach Road Surface'}
            </label>
            <select
              value={roadType}
              onChange={(e) => setRoadType(e.target.value as AgriculturalLandDetails['approachRoadType'])}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="highway">{isHi ? 'राष्ट्रीय / राज्य राजमार्ग (NH / SH Highway Facing)' : 'National / State Highway'}</option>
              <option value="tar_road">{isHi ? 'मुख्य पक्की डामर सड़क (Main Bitumen / Tar Road)' : 'Paved Tar / Bitumen Road'}</option>
              <option value="pmgsy_road">{isHi ? 'प्रधानमंत्री ग्राम सड़क (PMGSY Concrete Road)' : 'PMGSY Concrete Village Road'}</option>
              <option value="murram_road">{isHi ? 'मुरमी / डब्ल्यूबीएम सड़क (WBM / Murram Road)' : 'WBM / Murram Road'}</option>
              <option value="chak_road">{isHi ? 'चकरोड / नहर नाली रास्ता (Chak Road / Canal Track)' : 'Chak Road / Agriculture Track'}</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-5">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isCorner}
                onChange={(e) => setIsCorner(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span>{isHi ? 'कॉर्नर जमीन (दो तरफा खुला रास्ता / 2 Sides Road)' : 'Corner Land (2-Side Road Access)'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Soil Type, Irrigation & Infrastructure Utilities */}
      <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-amber-200">
          <Droplets className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            {isHi ? '3. मिट्टी की किस्म, सिंचाई व कृषि सुविधाएं' : '3. Soil Type, Irrigation & Farm Utilities'}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Soil Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'मिट्टी की किस्म (Soil Type)' : 'Soil Type'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="kanhar">{isHi ? 'कन्हार (भारी उपजाऊ काली मिट्टी)' : 'Black Cotton Soil (Kanhar)'}</option>
              <option value="matasi">{isHi ? 'मटासी (पीली दोमट मिट्टी - धान व सब्जी)' : 'Yellow Loamy Soil (Matasi)'}</option>
              <option value="dora">{isHi ? 'डोरा / दोमट (मिश्रित उपजाऊ मिट्टी)' : 'Loam / Dora Soil'}</option>
              <option value="bhatha">{isHi ? 'भाठा / मुरमी (मुरमी मिट्टी - बागवानी/फार्म)' : 'Gravelly Murrum (Bhatha)'}</option>
              <option value="sandy">{isHi ? 'लाल रेतीली मिट्टी (Red Sandy Soil)' : 'Red Sandy Soil'}</option>
            </select>
          </div>

          {/* Irrigation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'सिंचाई की स्थिति (Irrigation Status)' : 'Irrigation Status'}
            </label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value as AgriculturalLandDetails['irrigationStatus'])}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="fully_irrigated">{isHi ? 'पूर्ण सिंचित (बोरवेल / नहर उपलब्ध)' : 'Fully Irrigated'}</option>
              <option value="partially_irrigated">{isHi ? 'आंशिक सिंचित (Partially Irrigated)' : 'Partially Irrigated'}</option>
              <option value="unirrigated">{isHi ? 'असिंचित / बारानी (Rainfed Only)' : 'Rainfed / Unirrigated'}</option>
            </select>
          </div>

          {/* Crop Cycle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isHi ? 'फसल चक्र (Cropping Pattern)' : 'Crop Cycle'}
            </label>
            <select
              value={cropCycle}
              onChange={(e) => setCropCycle(e.target.value as AgriculturalLandDetails['cropCycle'])}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="double_crop">{isHi ? 'दो फसली (धान + रबी चना/गेहूं)' : 'Double Crop (Kharif + Rabi)'}</option>
              <option value="triple_crop">{isHi ? 'तीन फसली (सब्जी व नकदी फसल)' : 'Triple Crop / Multi-Crop'}</option>
              <option value="single_crop">{isHi ? 'एक फसली (केवल खरीफ/मानसून)' : 'Single Crop (Monsoon Only)'}</option>
              <option value="horticulture_orchard">{isHi ? 'बागवानी / बागीचा (अमरूद/आम/सागौन)' : 'Horticulture / Fruit Orchard'}</option>
              <option value="fallow_barren">{isHi ? 'पड़त / ओपन लैंड' : 'Fallow / Open Land'}</option>
            </select>
          </div>
        </div>

        {/* Fencing & Infrastructure Checkboxes */}
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-2">
            {isHi ? 'उपलब्ध सुविधाएं व सुरक्षा (Features & Infrastructure)' : 'Facilities & Security'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setHasBorewell(!hasBorewell)}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                hasBorewell 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Droplets className="w-4 h-4 shrink-0" />
              <span className="truncate">{isHi ? 'बोरवेल युक्त' : 'Borewell Done'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHasElectricity(!hasElectricity)}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                hasElectricity 
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span className="truncate">{isHi ? '3-फेज कृषि बिजली' : '3-Phase Power'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFencingType(fencingType === 'open_land' ? 'tarbandi_fencing' : 'open_land');
              }}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                fencingType !== 'open_land'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="truncate">{isHi ? 'तारबंदी / बाउंड्री' : 'Fenced / Wall'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHasFarmhouse(!hasFarmhouse)}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                hasFarmhouse
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">{isHi ? 'शेड / फार्महाउस' : 'Shed / Cottage'}</span>
            </button>
          </div>
        </div>

        {/* Water Sources selection */}
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            {isHi ? 'पानी के स्रोत (Water Sources)' : 'Water Sources'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'borewell', label: isHi ? 'बोरवेल (Tubewell)' : 'Borewell' },
              { id: 'canal', label: isHi ? 'नहर (Canal Irrigation)' : 'Canal' },
              { id: 'river', label: isHi ? 'नदी तट / किनारा (River)' : 'River' },
              { id: 'pond', label: isHi ? 'तालाब / डबरी (Pond)' : 'Pond' },
              { id: 'open_well', label: isHi ? 'कुआं (Open Well)' : 'Open Well' },
            ].map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => toggleWaterSource(ws.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center space-x-1.5 ${
                  waterSources.includes(ws.id)
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {waterSources.includes(ws.id) && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{ws.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Rate Per Unit Summary Card (Auto-Calculated) */}
      {propertyPrice && propertyPrice > 0 && currentCalcs.totalAreaAcres > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
              {isHi ? 'दर व भाव विश्लेषण (Calculated Price per Unit):' : 'Rate per Unit Analysis:'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'भाव प्रति एकड़' : 'Rate per Acre'}
              </span>
              <span className="text-base font-black text-slate-900">
                ₹{Math.round(propertyPrice / currentCalcs.totalAreaAcres).toLocaleString()}
                <span className="text-xs font-bold text-slate-500"> {isHi ? '/ एकड़' : '/ Acre'}</span>
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'भाव प्रति डिसमिल' : 'Rate per Dismil'}
              </span>
              <span className="text-base font-black text-slate-900">
                ₹{Math.round(propertyPrice / (currentCalcs.totalAreaAcres * 100)).toLocaleString()}
                <span className="text-xs font-bold text-slate-500"> {isHi ? '/ डिसमिल' : '/ Dismil'}</span>
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isHi ? 'भाव प्रति वर्ग फीट' : 'Rate per Sq.Ft'}
              </span>
              <span className="text-base font-black text-slate-900">
                ₹{(propertyPrice / (currentCalcs.totalAreaAcres * 43560)).toFixed(2)}
                <span className="text-xs font-bold text-slate-500"> {isHi ? '/ वर्ग फीट' : '/ sq.ft'}</span>
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
