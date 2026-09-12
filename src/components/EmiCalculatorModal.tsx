import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Percent, 
  Calendar, 
  IndianRupee, 
  PieChart as PieChartIcon, 
  Building, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const [principal, setPrincipal] = useState<number>(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const principalRatio = Math.round((principal / totalPayment) * 100);
  const interestRatio = 100 - principalRatio;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="emi-calculator-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">{t.emiCalculator}</h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? 'अपने होम लोन की मासिक किस्त और ब्याज का हिसाब लगाएं' : 'Plan your monthly budget with exact EMI & interest estimation'}
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Sliders Area */}
          <div className="space-y-5">
            
            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>{t.loanAmount}</span>
                <span className="text-amber-600 text-base">{formatINR(principal)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                <span>₹5 Lakh</span>
                <span>₹1 Crore</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>{t.interestRate} (% p.a.)</span>
                <span className="text-amber-600 text-base">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="6.5"
                max="15.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                <span>6.5%</span>
                <span>8.5% (Avg Bank)</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>{t.tenureYears}</span>
                <span className="text-amber-600 text-base">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

          </div>

          {/* Results Visual Box */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="text-center pb-4 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                {t.emiMonthlyEstimate}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 block my-1">
                {formatINR(emi)}
              </span>
              <span className="text-xs text-slate-400">
                {lang === 'hi' ? `हर महीने ${totalMonths} महीनों तक` : `per month for ${totalMonths} months`}
              </span>
            </div>

            {/* Principal vs Interest Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block font-semibold">Principal Loan</span>
                <span className="text-sm font-bold text-white block mt-0.5">{formatINR(principal)}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{principalRatio}% of total</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block font-semibold">{t.totalInterest}</span>
                <span className="text-sm font-bold text-amber-400 block mt-0.5">{formatINR(totalInterest)}</span>
                <span className="text-[10px] text-amber-400 font-bold">{interestRatio}% of total</span>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${principalRatio}%` }} 
                  title="Principal"
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${interestRatio}%` }} 
                  title="Interest"
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Principal: {principalRatio}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>Interest: {interestRatio}%</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between text-xs text-slate-300 font-medium">
              <span>{t.totalPayable}:</span>
              <span className="font-extrabold text-white">{formatINR(totalPayment)}</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
            >
              {lang === 'hi' ? 'कैलकुलेशन पूर्ण' : 'Done'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
