import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Compass, 
  Shield, 
  FileText, 
  Calculator, 
  Check, 
  Sparkles, 
  Building2, 
  Zap, 
  Droplets, 
  Grid3X3,
  Layers,
  Award
} from 'lucide-react';
import { ResidentialPlotDetails, PlotAreaUnit, FacingDirection } from '../types';
import { Language } from '../data/translations';

interface ResidentialPlotAreaFormProps {
  lang: Language;
  value: ResidentialPlotDetails;
  onChange: (updated: ResidentialPlotDetails) => void;
  propertyPrice?: number;
  onCarpetAreaChange?: (sqFt: number, sqYds: number) => void;
}

export const ResidentialPlotAreaForm: React.FC<ResidentialPlotAreaFormProps> = ({
  lang,
  value,
  onChange,
  propertyPrice,
  onCarpetAreaChange,
}) => {
  const isIndic = lang !== 'en';

  // Entry Mode: 'dimensions' (लंबाई x चौड़ाई) or 'direct_area' (सीधे कुल क्षेत्रफल)
  const [entryMode, setEntryMode] = useState<'dimensions' | 'direct_area'>('dimensions');

  // Dimensions state
  const [widthFt, setWidthFt] = useState<number>(value.plotWidthFt || 30);
  const [lengthFt, setLengthFt] = useState<number>(value.plotLengthFt || 50);

  // Direct area state
  const [selectedUnit, setSelectedUnit] = useState<PlotAreaUnit>(value.primaryUnit || 'sqft');
  const [directAreaValue, setDirectAreaValue] = useState<number>(value.primaryUnitValue || 1500);

  // Road & Accessibility
  const [roadWidthFt, setRoadWidthFt] = useState<number>(value.facingRoadWidthFt || 30);
  const [roadType, setRoadType] = useState<ResidentialPlotDetails['roadType']>(value.roadType || 'cc_concrete');
  const [isCorner, setIsCorner] = useState<boolean>(value.isCornerPlot || false);
  const [openSides, setOpenSides] = useState<number>(value.openSidesCount || (value.isCornerPlot ? 2 : 1));
  const [facing, setFacing] = useState<FacingDirection>(value.facingDirection || 'East');

  // Colony & Boundary
  const [plotNumber, setPlotNumber] = useState<string>(value.plotNumber || '');
  const [colonyName, setColonyName] = useState<string>(value.colonyName || '');
  const [boundaryWall, setBoundaryWall] = useState<ResidentialPlotDetails['boundaryWall']>(value.boundaryWall || 'constructed_brick_wall');
  const [isGated, setIsGated] = useState<boolean>(value.isGatedColony !== undefined ? value.isGatedColony : true);
  const [allowedFloors, setAllowedFloors] = useState<number>(value.floorsAllowedConstruction || 3);

  // Approvals & Legal
  const [approvalType, setApprovalType] = useState<ResidentialPlotDetails['approvalType']>(value.approvalType || 'tncp_approved');
  const [diversionStatus, setDiversionStatus] = useState<ResidentialPlotDetails['diversionStatus']>(value.diversionStatus || 'diverted_residential');
  const [landTitleType, setLandTitleType] = useState<ResidentialPlotDetails['landTitleType']>(value.landTitleType || 'freehold_clear_title');
  const [reraNumber, setReraNumber] = useState<string>(value.reraNumber || '');

  // Utilities
  const [hasElectricity, setHasElectricity] = useState<boolean>(value.hasElectricityPoles !== undefined ? value.hasElectricityPoles : true);
  const [hasWater, setHasWater] = useState<boolean>(value.hasWaterSupplyLine !== undefined ? value.hasWaterSupplyLine : true);
  const [hasDrainage, setHasDrainage] = useState<boolean>(value.hasDrainageSewage !== undefined ? value.hasDrainageSewage : true);
  const [hasStreetLights, setHasStreetLights] = useState<boolean>(value.hasStreetLights !== undefined ? value.hasStreetLights : true);

  // Helper conversions
  // 1 Sq.Yard (Gaj) = 9 Sq.Ft
  // 1 Dismil = 435.6 Sq.Ft
  // 1 Sq.Meter = 10.7639 Sq.Ft
  const computeFromSqFt = (sqFt: number) => {
    const validSqFt = Math.max(0, sqFt);
    const sqYds = Math.round((validSqFt / 9) * 100) / 100;
    const dismil = Math.round((validSqFt / 435.6) * 100) / 100;
    const sqMtr = Math.round((validSqFt / 10.7639) * 100) / 100;
    return { sqFt: validSqFt, sqYds, dismil, sqMtr };
  };

  const getEffectiveSqFt = (): number => {
    if (entryMode === 'dimensions') {
      return (Number(widthFt) || 0) * (Number(lengthFt) || 0);
    } else {
      const val = Number(directAreaValue) || 0;
      switch (selectedUnit) {
        case 'sqft':
          return val;
        case 'sqyd':
          return val * 9;
        case 'dismil':
          return val * 435.6;
        case 'sqm':
          return val * 10.7639;
        case 'bigha':
          return val * 27225; // 0.625 acre = 27225 sqft
        case 'gunta':
          return val * 1089;
        case 'cent':
          return val * 435.6;
        default:
          return val;
      }
    }
  };

  const currentSqFt = getEffectiveSqFt();
  const converted = computeFromSqFt(currentSqFt);

  // Preset quick sizes
  const POPULAR_PRESETS = [
    { label: '20 x 50 ft', width: 20, length: 50, sqft: 1000, gaj: 111 },
    { label: '25 x 50 ft', width: 25, length: 50, sqft: 1250, gaj: 139 },
    { label: '30 x 50 ft', width: 30, length: 50, sqft: 1500, gaj: 167 },
    { label: '30 x 60 ft', width: 30, length: 60, sqft: 1800, gaj: 200 },
    { label: '40 x 50 ft', width: 40, length: 50, sqft: 2000, gaj: 222 },
    { label: '40 x 60 ft', width: 40, length: 60, sqft: 2400, gaj: 267 },
    { label: '50 x 60 ft', width: 50, length: 60, sqft: 3000, gaj: 333 },
  ];

  const handleApplyPreset = (w: number, l: number) => {
    setWidthFt(w);
    setLengthFt(l);
    setEntryMode('dimensions');
  };

  // Sync to parent
  useEffect(() => {
    const ratePerSqFt = propertyPrice && currentSqFt > 0 ? Math.round(propertyPrice / currentSqFt) : undefined;
    const ratePerSqYd = propertyPrice && converted.sqYds > 0 ? Math.round(propertyPrice / converted.sqYds) : undefined;

    const updated: ResidentialPlotDetails = {
      totalAreaSqFt: currentSqFt,
      totalAreaSqYds: converted.sqYds,
      totalAreaDismil: converted.dismil,
      totalAreaSqMtr: converted.sqMtr,
      primaryUnit: entryMode === 'dimensions' ? 'sqft' : selectedUnit,
      primaryUnitValue: entryMode === 'dimensions' ? currentSqFt : directAreaValue,
      plotLengthFt: lengthFt,
      plotWidthFt: widthFt,
      dimensionsText: `${widthFt} ft x ${lengthFt} ft`,
      facingRoadWidthFt: roadWidthFt,
      roadType,
      isCornerPlot: isCorner,
      openSidesCount: openSides,
      facingDirection: facing,
      boundaryWall,
      isGatedColony: isGated,
      colonyName: colonyName.trim(),
      plotNumber: plotNumber.trim(),
      floorsAllowedConstruction: allowedFloors,
      approvalType,
      diversionStatus,
      reraNumber: reraNumber.trim(),
      landTitleType,
      hasElectricityPoles: hasElectricity,
      hasWaterSupplyLine: hasWater,
      hasDrainageSewage: hasDrainage,
      hasStreetLights,
      ratePerSqFt,
      ratePerSqYd,
    };

    onChange(updated);

    if (onCarpetAreaChange) {
      onCarpetAreaChange(currentSqFt, converted.sqYds);
    }
  }, [
    currentSqFt,
    converted.sqYds,
    converted.dismil,
    converted.sqMtr,
    entryMode,
    selectedUnit,
    directAreaValue,
    lengthFt,
    widthFt,
    roadWidthFt,
    roadType,
    isCorner,
    openSides,
    facing,
    boundaryWall,
    isGated,
    colonyName,
    plotNumber,
    allowedFloors,
    approvalType,
    diversionStatus,
    reraNumber,
    landTitleType,
    hasElectricity,
    hasWater,
    hasDrainage,
    hasStreetLights,
    propertyPrice,
  ]);

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-blue-50/70 rounded-2xl border-2 border-indigo-300/80 shadow-2xs space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Ruler className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              {isIndic ? 'रेसिडेंशियल प्लॉट / जमीन क्षेत्रफल व आयाम का संपूर्ण विवरण' : 'Residential Plot Area, Dimensions & Specifications'}
            </h3>
            <p className="text-[11px] text-indigo-900 font-semibold">
              {isIndic ? 'लंबाई-चौड़ाई (साइज), वर्ग फीट, वर्ग गज (Gaj), डिसमिल, रोड चौड़ाई, दिशा व डायवर्सन' : 'Dimensions (Length x Width), Sq.Ft, Gaj, Dismil, Road Width, Vastu & Clearances'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-black tracking-wider text-indigo-900 bg-indigo-200/80 px-2.5 py-1 rounded-full border border-indigo-300 flex items-center space-x-1">
            <Calculator className="w-3 h-3 text-indigo-800" />
            <span>{isIndic ? 'लाइव एरिया ऑटो-कैलकुलेटर' : 'Live Area Converter'}</span>
          </span>
        </div>
      </div>

      {/* Entry Mode Toggle (Dimensions vs Direct Area) */}
      <div className="flex p-1 bg-white/90 rounded-xl border border-indigo-200 shadow-2xs max-w-md">
        <button
          type="button"
          onClick={() => setEntryMode('dimensions')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            entryMode === 'dimensions'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>{isIndic ? '1. आयाम द्वारा (लंबाई × चौड़ाई)' : '1. By Dimensions (Length x Width)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setEntryMode('direct_area')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            entryMode === 'direct_area'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isIndic ? '2. सीधे कुल क्षेत्रफल दर्ज करें' : '2. Direct Total Area'}</span>
        </button>
      </div>

      {/* Mode 1: Dimensions Input */}
      {entryMode === 'dimensions' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Frontage / Width */}
            <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
              <label className="block text-xs font-black text-indigo-950 mb-1">
                {isIndic ? 'प्लॉट का मुखौटा / चौड़ाई (Front Width)' : 'Plot Frontage / Width'} *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  step="0.5"
                  value={widthFt || ''}
                  onChange={(e) => setWidthFt(Number(e.target.value))}
                  placeholder="30"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <span className="text-xs font-extrabold text-slate-500 shrink-0">
                  {isIndic ? 'फीट (Ft)' : 'Feet'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                {isIndic ? 'सड़क से लगा सामने का भाग' : 'Road facing front width'}
              </span>
            </div>

            {/* Depth / Length */}
            <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
              <label className="block text-xs font-black text-indigo-950 mb-1">
                {isIndic ? 'प्लॉट की गहराई / लंबाई (Depth / Length)' : 'Plot Depth / Length'} *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  step="0.5"
                  value={lengthFt || ''}
                  onChange={(e) => setLengthFt(Number(e.target.value))}
                  placeholder="50"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <span className="text-xs font-extrabold text-slate-500 shrink-0">
                  {isIndic ? 'फीट (Ft)' : 'Feet'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                {isIndic ? 'अंदर की ओर लंबाई / गहराई' : 'Backwards depth in feet'}
              </span>
            </div>

            {/* Live Dimensions Ratio Display */}
            <div className="p-3 bg-indigo-100/70 rounded-xl border-2 border-indigo-300/80 shadow-2xs flex flex-col justify-between">
              <span className="text-[10px] font-black text-indigo-900 uppercase block mb-1">
                {isIndic ? 'प्लॉट साइज फॉर्मूला' : 'Dimension Ratio'}
              </span>
              <div className="text-base sm:text-lg font-black text-indigo-950">
                {widthFt} ft × {lengthFt} ft
              </div>
              <span className="text-[11px] font-bold text-indigo-800 mt-1">
                = {currentSqFt.toLocaleString()} sq.ft ({converted.sqYds} {isIndic ? 'गज' : 'Sq.Yds'})
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 mb-1.5 block">
              ⚡ {isIndic ? 'लोकप्रिय मानक साइज (1-क्लिक में चुनें):' : 'Popular Standard Sizes (1-Click Select):'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PRESETS.map((preset) => {
                const isSelected = widthFt === preset.width && lengthFt === preset.length;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.width, preset.length)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-800 text-white border-indigo-800 shadow-2xs'
                        : 'bg-white text-slate-700 border-indigo-200 hover:border-indigo-400'
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] font-semibold opacity-85 ml-1">
                      ({preset.sqft} sq.ft / {preset.gaj} {isIndic ? 'गज' : 'yd'})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Direct Area Entry */
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
              <label className="block text-xs font-black text-indigo-950 mb-1">
                {isIndic ? 'क्षेत्रफल मापन इकाई चुनें (Unit)' : 'Measurement Unit'} *
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'sqft', labelEn: 'Square Feet (sq.ft)', labelHi: 'वर्ग फीट (Sq.Ft)' },
                  { id: 'sqyd', labelEn: 'Square Yards / Gaj (गज)', labelHi: 'वर्ग गज / गज (Gaj)' },
                  { id: 'dismil', labelEn: 'Dismil (डिसमिल)', labelHi: 'डिसमिल (Dismil)' },
                  { id: 'sqm', labelEn: 'Square Meters (वर्ग मीटर)', labelHi: 'वर्ग मीटर (Sq.M)' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUnit(u.id as PlotAreaUnit)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                      selectedUnit === u.id
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isIndic ? u.labelHi : u.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
              <label className="block text-xs font-black text-indigo-950 mb-1">
                {isIndic ? 'कुल क्षेत्रफल संख्या (Area Value)' : 'Total Area Value'} *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={directAreaValue || ''}
                  onChange={(e) => setDirectAreaValue(Number(e.target.value))}
                  placeholder="1500"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <span className="text-xs font-extrabold text-indigo-900 uppercase shrink-0">
                  {selectedUnit}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                {isIndic ? 'स्वतः अन्य सभी इकाइयों (गज, वर्ग फीट, डिसमिल) में परिवर्तित होगा' : 'Automatically calculates all other Indian units'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Multi-Unit Conversion Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Card 1: Square Feet */}
        <div className="p-3 bg-white/95 rounded-xl border-2 border-indigo-300 shadow-2xs">
          <span className="text-[10px] font-black text-indigo-900 uppercase block mb-0.5">
            {isIndic ? 'कुल वर्ग फीट (Sq.Ft)' : 'Total Sq.Ft'}
          </span>
          <span className="text-base sm:text-lg font-black text-slate-950 block">
            {currentSqFt.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-bold block">
            sq.ft
          </span>
        </div>

        {/* Card 2: Square Yards / Gaj */}
        <div className="p-3 bg-indigo-50/90 rounded-xl border-2 border-indigo-300 shadow-2xs">
          <span className="text-[10px] font-black text-indigo-900 uppercase block mb-0.5">
            {isIndic ? 'वर्ग गज / गज (Gaj)' : 'Square Yards (Gaj)'}
          </span>
          <span className="text-base sm:text-lg font-black text-indigo-950 block">
            {converted.sqYds.toLocaleString()}
          </span>
          <span className="text-[10px] text-indigo-700 font-bold block">
            {isIndic ? 'वर्ग गज (1 गज = 9 sq.ft)' : 'Sq. Yards'}
          </span>
        </div>

        {/* Card 3: Dismil */}
        <div className="p-3 bg-purple-50/90 rounded-xl border-2 border-purple-300 shadow-2xs">
          <span className="text-[10px] font-black text-purple-900 uppercase block mb-0.5">
            {isIndic ? 'डिसमिल (Dismil)' : 'Dismil'}
          </span>
          <span className="text-base sm:text-lg font-black text-purple-950 block">
            {converted.dismil}
          </span>
          <span className="text-[10px] text-purple-700 font-bold block">
            {isIndic ? 'डिसमिल (1 dismil = 435.6 sq.ft)' : 'Dismil'}
          </span>
        </div>

        {/* Card 4: Square Meters */}
        <div className="p-3 bg-blue-50/90 rounded-xl border-2 border-blue-300 shadow-2xs">
          <span className="text-[10px] font-black text-blue-900 uppercase block mb-0.5">
            {isIndic ? 'वर्ग मीटर (Sq.Mtr)' : 'Square Meters'}
          </span>
          <span className="text-base sm:text-lg font-black text-blue-950 block">
            {converted.sqMtr}
          </span>
          <span className="text-[10px] text-blue-700 font-bold block">
            {isIndic ? 'वर्ग मीटर' : 'Sq.Mtrs'}
          </span>
        </div>
      </div>

      {/* Live Rate per Sq.Ft & Rate per Gaj Preview (if price entered) */}
      {propertyPrice && propertyPrice > 0 && currentSqFt > 0 && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-extrabold text-emerald-950">
              {isIndic ? 'सटीक दर विश्लेषण (Calculated Rates):' : 'Calculated Property Rates:'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-black text-emerald-900">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
              ₹{Math.round(propertyPrice / currentSqFt).toLocaleString()} / {isIndic ? 'वर्ग फीट' : 'sq.ft'}
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
              ₹{Math.round(propertyPrice / (converted.sqYds || 1)).toLocaleString()} / {isIndic ? 'वर्ग गज (Gaj)' : 'Sq.Yard'}
            </span>
          </div>
        </div>
      )}

      {/* Road Width, Road Type & Corner Plot Specifications */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-indigo-700" />
          <span>{isIndic ? 'सड़क कनेक्टिविटी, कॉर्नर स्टेटस व दिशा (Road, Corner & Facing)' : 'Road Connectivity, Corner & Facing'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Facing Road Width */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'सामने सड़क की चौड़ाई' : 'Facing Road Width'}
            </label>
            <select
              value={roadWidthFt}
              onChange={(e) => setRoadWidthFt(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              {[20, 25, 30, 40, 50, 60, 80, 100].map((w) => (
                <option key={w} value={w}>
                  {w} ft {isIndic ? 'चौड़ी सड़क' : 'Road'}
                </option>
              ))}
            </select>
          </div>

          {/* Road Construction Type */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'सड़क का प्रकार' : 'Road Construction'}
            </label>
            <select
              value={roadType}
              onChange={(e) => setRoadType(e.target.value as ResidentialPlotDetails['roadType'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="cc_concrete">{isIndic ? 'सीसी कंक्रीट रोड (CC Road)' : 'Cement Concrete (CC) Road'}</option>
              <option value="tar_road">{isIndic ? 'डामर / तारकोल रोड (Tar Road)' : 'Asphalt / Tar Road'}</option>
              <option value="paver_blocks">{isIndic ? 'पेवर ब्लॉक रोड' : 'Paver Blocks'}</option>
              <option value="main_road">{isIndic ? 'मुख्य मार्ग / हाईवे फेसिंग' : 'Main Road / Highway Facing'}</option>
              <option value="murram">{isIndic ? 'मुरमी / कच्ची सड़क' : 'Murram Road'}</option>
            </select>
          </div>

          {/* Plot Facing / Vastu */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-indigo-700" />
              <span>{isIndic ? 'प्लॉट की दिशा (Facing / वास्तु)' : 'Plot Facing (Vastu)'}</span>
            </label>
            <select
              value={facing}
              onChange={(e) => setFacing(e.target.value as FacingDirection)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="East">{isIndic ? 'पूर्व मुखी (East Facing)' : 'East Facing'}</option>
              <option value="North">{isIndic ? 'उत्तर मुखी (North Facing)' : 'North Facing'}</option>
              <option value="North-East">{isIndic ? 'ईशान कोण (North-East Facing)' : 'North-East Facing'}</option>
              <option value="West">{isIndic ? 'पश्चिम मुखी (West Facing)' : 'West Facing'}</option>
              <option value="South">{isIndic ? 'दक्षिण मुखी (South Facing)' : 'South Facing'}</option>
              <option value="South-East">{isIndic ? 'आग्नेय कोण (South-East Facing)' : 'South-East Facing'}</option>
            </select>
          </div>

          {/* Corner Plot & Open Sides */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                {isIndic ? 'कॉर्नर प्लॉट है?' : 'Is Corner Plot?'}
              </label>
              <input
                type="checkbox"
                checked={isCorner}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsCorner(checked);
                  if (checked && openSides < 2) setOpenSides(2);
                  if (!checked && openSides > 1) setOpenSides(1);
                }}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div className="mt-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                {isIndic ? 'खुले रास्तों की संख्या (Open Sides)' : 'Open Road Sides'}
              </label>
              <select
                value={openSides}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setOpenSides(val);
                  setIsCorner(val >= 2);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
              >
                <option value={1}>{isIndic ? '1 तरफ रास्ता (Single Side)' : '1 Side Open'}</option>
                <option value={2}>{isIndic ? '2 तरफ रास्ता (Corner Plot)' : '2 Sides Open (Corner)'}</option>
                <option value={3}>{isIndic ? '3 तरफ खुला (3 Sides Open)' : '3 Sides Open'}</option>
                <option value={4}>{isIndic ? '4 तरफ खुला (Island Plot)' : '4 Sides Open'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals, Legal Clearance & Land Diversion Status */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-indigo-700" />
          <span>{isIndic ? 'सरकारी स्वीकृति, डायवर्सन एवं टाइटल स्थिति (Approvals & Diversion)' : 'Approvals & Legal Clearance'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Approval Type */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'लेआउट स्वीकृति (Approval)' : 'Layout Approval'}
            </label>
            <select
              value={approvalType}
              onChange={(e) => setApprovalType(e.target.value as ResidentialPlotDetails['approvalType'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="tncp_approved">{isIndic ? 'T&CP अप्रूव्ड (टाउन एंड कंट्री प्लानिंग)' : 'T&CP Approved'}</option>
              <option value="rera_approved">{isIndic ? 'RERA अप्रूव्ड कॉलोनी' : 'RERA Approved'}</option>
              <option value="municipal_corporation">{isIndic ? 'नगर निगम / विकास प्राधिकरण स्वीकृत' : 'Municipal / Dev Authority'}</option>
              <option value="gram_panchayat_diversion">{isIndic ? 'ग्राम पंचायत लेआउट / डायवर्सन' : 'Gram Panchayat Layout'}</option>
              <option value="unapproved_regularizable">{isIndic ? 'नियमितीकरण योग्य / सामान्य' : 'Regularizable / General'}</option>
            </select>
          </div>

          {/* Diversion Status */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'भूमि डायवर्सन स्थिति' : 'Land Diversion Status'}
            </label>
            <select
              value={diversionStatus}
              onChange={(e) => setDiversionStatus(e.target.value as ResidentialPlotDetails['diversionStatus'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="diverted_residential">{isIndic ? '100% आवासीय व्यपवर्तित (Diverted)' : '100% Residential Diverted'}</option>
              <option value="diverted_commercial">{isIndic ? 'व्यावसायिक व्यपवर्तित (Commercial)' : 'Commercial Diverted'}</option>
              <option value="non_diverted_in_process">{isIndic ? 'डायवर्सन प्रक्रियाधीन' : 'Diversion In-Process'}</option>
              <option value="agricultural_divertible">{isIndic ? 'कृषि जमीन (डायवर्सन योग्य)' : 'Agricultural Divertible'}</option>
            </select>
          </div>

          {/* Land Title Type */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'स्वामित्व एवं रजिस्ट्री (Title)' : 'Land Title Type'}
            </label>
            <select
              value={landTitleType}
              onChange={(e) => setLandTitleType(e.target.value as ResidentialPlotDetails['landTitleType'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="freehold_clear_title">{isIndic ? 'फ्रीहोल्ड (क्लियर टाइटल, तुरंत रजिस्ट्री)' : 'Freehold (Clear Title)'}</option>
              <option value="leasehold">{isIndic ? 'लीजहोल्ड (प्राधिकरण लीज)' : 'Leasehold'}</option>
              <option value="society_patta">{isIndic ? 'सोसायटी पट्टा / अलॉटमेंट' : 'Society Patta'}</option>
            </select>
          </div>

          {/* RERA Number */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'RERA रजिस्ट्रेशन नंबर (वैकल्पिक)' : 'RERA Reg No. (Optional)'}
            </label>
            <input
              type="text"
              value={reraNumber}
              onChange={(e) => setReraNumber(e.target.value)}
              placeholder="e.g. CGRERA010224A..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Plot Number, Colony & Boundary Wall Details */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-700" />
          <span>{isIndic ? 'कॉलोनी, प्लॉट नंबर एवं बाउंड्री सुरक्षा (Colony & Boundary)' : 'Colony & Boundary Specs'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Plot Number */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'प्लॉट नंबर (Plot Number)' : 'Plot Number'}
            </label>
            <input
              type="text"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              placeholder="उदा. Plot No. 24 / B-12"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Colony / Layout Name */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'कॉलोनी / टाउनशिप नाम' : 'Colony / Township'}
            </label>
            <input
              type="text"
              value={colonyName}
              onChange={(e) => setColonyName(e.target.value)}
              placeholder="उदा. आनंदम ग्रीन, रॉयल एन्क्लेव"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Boundary Wall Status */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'बाउंड्री वॉल की स्थिति' : 'Boundary Wall Status'}
            </label>
            <select
              value={boundaryWall}
              onChange={(e) => setBoundaryWall(e.target.value as ResidentialPlotDetails['boundaryWall'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="constructed_brick_wall">{isIndic ? 'पक्की ईंट बाउंड्री वॉल निर्मित' : 'Constructed Brick Wall'}</option>
              <option value="tarbandi_fencing">{isIndic ? 'सुरक्षित तारबंदी बाउंड्री' : 'Fencing Boundary'}</option>
              <option value="open_no_boundary">{isIndic ? 'ओपन प्लॉट (बाउंड्री नहीं)' : 'Open Plot (No Boundary)'}</option>
            </select>
          </div>

          {/* Construction Allowed Floors */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isIndic ? 'अनुमत निर्माण मंजिलें' : 'Allowed Construction'}
            </label>
            <select
              value={allowedFloors}
              onChange={(e) => setAllowedFloors(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value={2}>G+1 {isIndic ? 'मंजिल (ग्राउंड + 1)' : 'Floors'}</option>
              <option value={3}>G+2 {isIndic ? 'मंजिल (ग्राउंड + 2)' : 'Floors'}</option>
              <option value={4}>G+3 {isIndic ? 'मंजिल (ग्राउंड + 3)' : 'Floors'}</option>
              <option value={5}>G+4 {isIndic ? 'मंजिल (ग्राउंड + 4)' : 'Floors'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Utilities & Amenities Checkboxes */}
      <div className="p-3.5 bg-white/90 rounded-xl border border-indigo-200 shadow-2xs">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2.5">
          {isIndic ? 'बुनियादी नागरिक सुविधाएं (Civic Utilities Available)' : 'Civic Utilities & Development'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-200">
            <input
              type="checkbox"
              checked={hasElectricity}
              onChange={(e) => setHasElectricity(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{isIndic ? 'बिजली लाइन व पोल' : 'Electricity Poles'}</span>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-200">
            <input
              type="checkbox"
              checked={hasWater}
              onChange={(e) => setHasWater(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>{isIndic ? 'पानी सप्लाई / बोरवेल' : 'Water Supply'}</span>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-200">
            <input
              type="checkbox"
              checked={hasDrainage}
              onChange={(e) => setHasDrainage(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isIndic ? 'पक्की नाली / सीवरेज' : 'Underground Drainage'}</span>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-200">
            <input
              type="checkbox"
              checked={hasStreetLights}
              onChange={(e) => setHasStreetLights(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{isIndic ? 'स्ट्रीट लाइट्स' : 'Street Lights'}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
