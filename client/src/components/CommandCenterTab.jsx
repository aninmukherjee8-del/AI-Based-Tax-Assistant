// import React, { useState, useEffect } from "react";
// import api from "../services/api.js";
// import {
//   FileText,
//   Sliders,
//   Check,
//   AlertTriangle,
//   RotateCcw,
//   Activity,
//   UploadCloud,
//   Zap,
//   BrainCircuit,
//   RefreshCw,
//   FileCheck2
// } from "lucide-react";

// // --- Utility: Count Up / Interpolate Animation ---
// const useCountUp = (end, duration = 800) => {
//   const [count, setCount] = useState(end);
  
//   useEffect(() => {
//     let startTime = null;
//     const startVal = count;
//     const difference = end - startVal;
//     if (difference === 0) return;

//     let animationFrame;
//     const animate = (currentTime) => {
//       if (!startTime) startTime = currentTime;
//       const progress = Math.min((currentTime - startTime) / duration, 1);
//       const easeProgress = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.floor(startVal + difference * easeProgress));
      
//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       } else {
//         setCount(end);
//       }
//     };
    
//     animationFrame = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(animationFrame);
//   }, [end, duration]);
  
//   return count;
// };

// // --- Component: Reacting Bar Chart ---
// const ReactingBarChart = ({ income }) => {
//   const baseHeights = [40, 70, 45, 90, 65, 85, 100];
//   const factor = Math.min(1.5, Math.max(0.5, income / 1250000));
  
//   return (
//     <div className="flex items-end space-x-1.5 h-12">
//       {baseHeights.map((height, i) => {
//         const adjustedHeight = Math.min(100, Math.round(height * factor));
//         return (
//           <div key={i} className="w-3 bg-emerald-500/10 rounded-t-sm h-full flex items-end group/bar relative">
//             <div 
//               className="w-full bg-emerald-400/60 hover:bg-emerald-400 rounded-t-sm transition-all duration-500" 
//               style={{ height: `${adjustedHeight}%` }} 
//             />
//             <span className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 px-1 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-mono">
//               {adjustedHeight}%
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default function CommandCenterTab({
//   grossIncome, setGrossIncome,
//   deduction80C, setDeduction80C,
//   deduction80D, setDeduction80D,
//   deductionNps, setDeductionNps,
//   deductionHra, setDeductionHra,
 
// }) {
//   const [isAiRecalculating, setIsAiRecalculating] = useState(false);

//   // Animate AI Core Orb on slider modifications
//   useEffect(() => {
//     setIsAiRecalculating(true);
//     const timer = setTimeout(() => setIsAiRecalculating(false), 600);
//     return () => clearTimeout(timer);
//   }, [grossIncome, deduction80C, deduction80D, deductionNps, deductionHra]);

//   // Indian Tax Slab Formulas
//   const calculateOldRegimeTax = (gross, c80, d80, nps, hra) => {
//     const stdDeduction = 50000;
//     const cap80c = Math.min(150000, c80);
//     const cap80d = Math.min(50000, d80);
//     const capNps = Math.min(50000, nps);
//     const capHra = Math.min(200000, hra);

//     const totalDeductions = cap80c + cap80d + capNps + capHra + stdDeduction;
//     const taxable = Math.max(0, gross - totalDeductions);

//     let tax = 0;
//     if (taxable <= 250000) {
//       tax = 0;
//     } else if (taxable <= 500000) {
//       tax = (taxable - 250000) * 0.05;
//     } else if (taxable <= 1000000) {
//       tax = 12500 + (taxable - 500000) * 0.20;
//     } else {
//       tax = 112500 + (taxable - 1000000) * 0.30;
//     }

//     if (taxable <= 500000) tax = 0;

//     const cess = tax * 0.04;
//     return Math.round(tax + cess);
//   };

//   const calculateNewRegimeTax = (gross) => {
//     const stdDeduction = 75000;
//     const taxable = Math.max(0, gross - stdDeduction);

//     let tax = 0;
//     if (taxable <= 300000) {
//       tax = 0;
//     } else if (taxable <= 700000) {
//       tax = (taxable - 300000) * 0.05;
//     } else if (taxable <= 1000000) {
//       tax = 20000 + (taxable - 700000) * 0.10;
//     } else if (taxable <= 1200000) {
//       tax = 50000 + (taxable - 1000000) * 0.15;
//     } else if (taxable <= 1500000) {
//       tax = 80000 + (taxable - 1200000) * 0.20;
//     } else {
//       tax = 140000 + (taxable - 1500000) * 0.30;
//     }

//     if (taxable <= 700000) tax = 0;

//     const cess = tax * 0.04;
//     return Math.round(tax + cess);
//   };

//   const taxOld = calculateOldRegimeTax(grossIncome, deduction80C, deduction80D, deductionNps, deductionHra);
//   const taxNew = calculateNewRegimeTax(grossIncome);

//   const betterRegime = taxOld < taxNew ? "OLD" : "NEW";
//   const taxDiff = Math.abs(taxOld - taxNew);
//   const finalTax = betterRegime === "OLD" ? taxOld : taxNew;
//   const totalDeductions = deduction80C + deduction80D + deductionNps + deductionHra;

//   // AI Audit Risk Calculator
//   const calculateAuditRisk = (gross, deductions) => {
//     if (gross <= 0) return 0;
//     const ratio = deductions / gross;
//     let score = 12;
//     if (ratio > 0.4) {
//       score += 48;
//     } else if (ratio > 0.25) {
//       score += 26;
//     } else {
//       score += ratio * 45;
//     }
//     if (gross > 1800000) {
//       score += 24;
//     } else if (gross > 1000000) {
//       score += 10;
//     }
//     return Math.round(Math.min(99, Math.max(5, score)));
//   };

//   const auditRiskScore = calculateAuditRisk(grossIncome, totalDeductions);
//   const getRiskDetails = (score) => {
//     if (score < 35) return { label: "Safe / Low Risk", color: "text-emerald-400", pulse: "animate-pulse-safe", desc: "Your deductions align perfectly with typical thresholds. Auto-filing is safe." };
//     if (score < 68) return { label: "Moderate / Verify Receipts", color: "text-amber-400", pulse: "animate-pulse-warning", desc: "Slightly elevated deductions relative to income. Keep receipts handy." };
//     return { label: "High / Audit Flag Likely", color: "text-rose-400", pulse: "animate-pulse-danger", desc: "Deductions exceed 35% of income. AI recommends review before final filing." };
//   };
//   const riskInfo = getRiskDetails(auditRiskScore);

//   const DEFAULT_DASHBOARD = {
//     grossIncome: 1250000,
//     deduction80C: 105000,
//     deduction80D: 15000,
//     deductionNps: 0,
//     deductionHra: 50000,
//   };

//   const applyDashboardValues = (dashboard) => {
//     setGrossIncome(dashboard.grossIncome ?? DEFAULT_DASHBOARD.grossIncome);
//     setDeduction80C(dashboard.deduction80C ?? DEFAULT_DASHBOARD.deduction80C);
//     setDeduction80D(dashboard.deduction80D ?? DEFAULT_DASHBOARD.deduction80D);
//     setDeductionNps(dashboard.npsContribution ?? DEFAULT_DASHBOARD.deductionNps);
//     setDeductionHra(dashboard.hraExemption ?? DEFAULT_DASHBOARD.deductionHra);
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const response = await api.get("/documents");
//       const documents = response.data.documents ?? [];
//       if (documents.length === 0) {
//         applyDashboardValues(DEFAULT_DASHBOARD);
//         return;
//       }
//       applyDashboardValues(response.data.dashboard ?? DEFAULT_DASHBOARD);
//     } catch (err) {
//       console.error(err);
//       applyDashboardValues(DEFAULT_DASHBOARD);
//     }
//   };

//   // SVG Gauge Needle angle
//   const riskAngle = 180 - (auditRiskScore / 100) * 180;
//   const needleRad = (riskAngle * Math.PI) / 180;
//   const needleX = 50 + 32 * Math.cos(needleRad);
//   const needleY = 50 - 32 * Math.sin(needleRad);

//   const animatedIncome = useCountUp(grossIncome);
//   const animatedTax = useCountUp(finalTax);
//   const animatedDeductions = useCountUp(totalDeductions);
//   // const progress = 100;
//   const circleRadius = 28;
//   const circleCircumference = 2 * Math.PI * circleRadius;
//   const progress = grossIncome > 0 ? 100 : 0;
//   const strokeOffset = circleCircumference - (progress / 100) * circleCircumference;
//   return (
//     <div className="space-y-6">
      
//       {/* Stats Cards Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Gross Income Card */}
//         <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Income</p>
//               <h3 className="text-2xl font-extrabold text-white mt-1">₹{animatedIncome.toLocaleString()}</h3>
//             </div>
//             <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase flex items-center">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
//               Live Sync
//             </div>
//           </div>
//           <div className="mt-4 pt-2 border-t border-slate-900/60 flex items-center justify-between">
//             <span className="text-xs text-slate-500">Monthly breakdown:</span>
//             <ReactingBarChart income={grossIncome} />
//           </div>
//         </div>

//         {/* Est. Net Tax Card */}
//         <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
//           <div className="flex justify-between items-start mb-2">
//             <div>
//               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Est. Net Tax</p>
//               <h3 className="text-3xl font-extrabold text-white mt-1">₹{animatedTax.toLocaleString()}</h3>
//             </div>
//             <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.1)]">
//               {betterRegime} REGIME
//             </span>
//           </div>
//           <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
//             You save <strong className="text-emerald-400">₹{taxDiff.toLocaleString()}</strong> by opting for the {betterRegime} Regime.
//           </p>
//           <div className="mt-3 pt-2.5 border-t border-slate-900/60 flex justify-between text-[11px] text-slate-500">
//             <span>Taxable Deductions Claimed:</span>
//             <span className="text-slate-300 font-bold">₹{animatedDeductions.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Filing Trajectory Card */}
//         <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Filing Trajectory</p>
//               <h4 className="text-lg font-bold text-white mt-1">
//                 {progress >= 95 ? "Tax Return Ready!" : "Verification Incomplete"}
//               </h4>
//               <p className="text-[11px] text-slate-400 mt-1">
//                 {progress >= 95 ? "Form 16 loaded successfully" : "Next Milestone: OCR Document Scan"}
//               </p>
//             </div>

//             <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
//               <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
//                 <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-800/80" />
//                 <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeOffset} strokeLinecap="round" className="text-emerald-400 transition-all duration-1000" style={{ filter: "drop-shadow(0 0 4px rgba(52, 211, 153, 0.4))" }} />
//               </svg>
//               <span className="absolute text-xs font-bold text-white font-mono">{progress}%</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-2.5 border-t border-slate-900/60 flex justify-between items-center">
//             <span className="text-xs text-slate-500">Form 16 Status:</span>
//             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${grossIncome > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
//               { grossIncome > 0? "ACTIVE" : "PENDING UPLOAD"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main Grid Content split */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Columns (sliders, regime breakdown, document scanner) */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Tax Optimizer Sliders */}
//           <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
//             <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
//               <div className="flex items-center space-x-2">
//                 <Sliders className="w-5 h-5 text-emerald-400" />
//                 <h3 className="text-base font-bold text-white">Tax Optimizer Simulator</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button 
                
//                   onClick={() => {
//                     setDeduction80C(150000);
//                     setDeduction80D(50000);
//                     setDeductionNps(50000);
//                     setDeductionHra(200000);
//                   }}
//                   className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg hover:border-emerald-500/40 transition-all cursor-pointer"
//                 >
//                   Maximize Limit
//                 </button>
//                 <button 
//                   onClick={fetchDashboardData}
//                   className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer"
//                 >
//                   <RefreshCw className="w-3.5 h-3.5" />
//                   <span>Reset</span>
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {/* Gross income range input */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs font-semibold">
//                   <span className="text-slate-300">Gross Annual Income (₹)</span>
//                   <span className="text-emerald-400 font-bold font-mono">₹{grossIncome.toLocaleString()}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="300000"
//                   max="3000000"
//                   step="20000"
//                   value={grossIncome}
//                   onChange={(e) => setGrossIncome(Number(e.target.value))}
//                   className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
//                 />
//               </div>

//               {/* Deduction 80C range input */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs font-semibold">
//                   <span className="text-slate-300">Section 80C (PPF, ELSS, Insurance)</span>
//                   <span className="text-emerald-400 font-bold font-mono">
//                     ₹{deduction80C.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹1.5L</span>
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="150000"
//                   step="5000"
//                   value={deduction80C}
//                   onChange={(e) => setDeduction80C(Number(e.target.value))}
//                   className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
//                 />
//               </div>

//               {/* Deduction 80D range input */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs font-semibold">
//                   <span className="text-slate-300">Section 80D (Health Insurance Premium)</span>
//                   <span className="text-emerald-400 font-bold font-mono">
//                     ₹{deduction80D.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹50K</span>
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="50000"
//                   step="1000"
//                   value={deduction80D}
//                   onChange={(e) => setDeduction80D(Number(e.target.value))}
//                   className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
//                 />
//               </div>

//               {/* Deduction NPS range input */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs font-semibold">
//                   <span className="text-slate-300">Section 80CCD(1B) NPS Retirement Benefit</span>
//                   <span className="text-emerald-400 font-bold font-mono">
//                     ₹{deductionNps.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹50K</span>
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="50000"
//                   step="5000"
//                   value={deductionNps}
//                   onChange={(e) => setDeductionNps(Number(e.target.value))}
//                   className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
//                 />
//               </div>

//               {/* Deduction HRA range input */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs font-semibold">
//                   <span className="text-slate-300">House Rent Allowance (HRA) Exemption</span>
//                   <span className="text-emerald-400 font-bold font-mono">
//                     ₹{deductionHra.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹2.0L</span>
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="200000"
//                   step="5000"
//                   value={deductionHra}
//                   onChange={(e) => setDeductionHra(Number(e.target.value))}
//                   className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Regime Side-by-Side Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Old Regime Card */}
//             <div className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
//               betterRegime === "OLD" 
//                 ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]" 
//                 : "bg-slate-900/20 border border-slate-800/80"
//             }`}>
//               {betterRegime === "OLD" && (
//                 <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
//                   AI Recommended
//                 </div>
//               )}
//               <div>
//                 <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Old Regime</h4>
//                 <p className="text-[10px] text-slate-500 mt-0.5">Allows high deductions under Section 80C/80D/HRA</p>
                
//                 <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
//                   <div className="flex justify-between"><span className="text-slate-400">Standard Deduction:</span><span className="text-slate-200">₹50,000</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Section 80C:</span><span className="text-slate-200">₹{Math.min(150000, deduction80C).toLocaleString()}</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Health / NPS:</span><span className="text-slate-200">₹{(Math.min(50000, deduction80D) + Math.min(50000, deductionNps)).toLocaleString()}</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">HRA Exemption:</span><span className="text-slate-200">₹{Math.min(200000, deductionHra).toLocaleString()}</span></div>
//                   <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
//                     <span>Taxable Income:</span>
//                     <span>₹{Math.max(0, grossIncome - Math.min(150000, deduction80C) - Math.min(50000, deduction80D) - Math.min(50000, deductionNps) - Math.min(200000, deductionHra) - 50000).toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-end">
//                 <div>
//                   <p className="text-[10px] text-slate-500 uppercase font-bold">Estimated Tax</p>
//                   <p className="text-2xl font-black text-white font-mono">₹{taxOld.toLocaleString()}</p>
//                 </div>
//                 {betterRegime === "OLD" ? (
//                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><Check className="w-4 h-4" /></div>
//                 ) : (
//                   <span className="text-[10px] text-slate-500 font-semibold font-mono">Saves ₹0</span>
//                 )}
//               </div>
//             </div>

//             {/* New Regime Card */}
//             <div className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
//               betterRegime === "NEW" 
//                 ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]" 
//                 : "bg-slate-900/20 border border-slate-800/80"
//             }`}>
//               {betterRegime === "NEW" && (
//                 <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
//                   AI Recommended
//                 </div>
//               )}
//               <div>
//                 <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">New Regime</h4>
//                 <p className="text-[10px] text-slate-500 mt-0.5">Higher standard deduction, lower slab tax rates</p>
                
//                 <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
//                   <div className="flex justify-between"><span className="text-slate-400">Standard Deduction:</span><span className="text-slate-200">₹75,000</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Section 80C Deductions:</span><span className="text-slate-500">Not Allowed (₹0)</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Section 80D / NPS / HRA:</span><span className="text-slate-500">Not Allowed (₹0)</span></div>
//                   <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
//                     <span>Taxable Income:</span>
//                     <span>₹{Math.max(0, grossIncome - 75000).toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-end">
//                 <div>
//                   <p className="text-[10px] text-slate-500 uppercase font-bold">Estimated Tax</p>
//                   <p className="text-2xl font-black text-white font-mono">₹{taxNew.toLocaleString()}</p>
//                 </div>
//                 {betterRegime === "NEW" ? (
//                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><Check className="w-4 h-4" /></div>
//                 ) : (
//                   <span className="text-[10px] text-emerald-400 font-bold font-mono">Saves ₹{taxDiff.toLocaleString()}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Right Columns (AI Copilot suggestion drawer, risk levels) */}
//         <div className="space-y-6"> 
          
//           {/* AI Copilot Suggestions */}
//           <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
//             <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
//             <div className="flex justify-between items-center w-full mb-4">
//               <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
//                 <Zap className="w-4 h-4 text-emerald-400" />
//                 <span>CO-PILOT INTEL</span>
//               </div>
//               <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-safe" />
//             </div>

//             <div className="relative w-24 h-24 my-3 flex items-center justify-center">
//               <div className={`absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/20 via-green-500/5 to-transparent blur-md transition-all duration-500 ${isAiRecalculating ? "scale-125 opacity-100" : "scale-100 opacity-60"}`} />
//               <div className={`w-18 h-18 rounded-full border border-emerald-500/30 flex items-center justify-center bg-slate-950/90 relative animate-float shadow-[0_0_20px_rgba(52,211,153,0.15)] ${isAiRecalculating ? "shadow-emerald-500/40" : ""}`}>
//                 <BrainCircuit className={`w-8 h-8 text-emerald-400 transition-transform duration-500 ${isAiRecalculating ? "rotate-90 scale-110" : ""}`} />
//               </div>
//             </div>

//             <p className="text-[11px] text-slate-400 italic mb-4">
//               "I analyze your investments. Click any suggestion below to apply optimizing adjustments instantly."
//             </p>

//             <div className="w-full text-left space-y-3 pt-3 border-t border-slate-900/60">
//               {deduction80C < 150000 && (
//                 <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
//                   <div>
//                     <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Section 80C recommendation</span>
//                     <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Maximize limit to save ₹13,500 more.</p>
//                   </div>
//                   <button
//                     onClick={() => setDeduction80C(150000)}
//                     className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
//                   >
//                     Apply Recommendation
//                   </button>
//                 </div>
//               )}

//               {deduction80D < 35000 && (
//                 <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
//                   <div>
//                     <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Section 80D recommendation</span>
//                     <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Claim Health Insurance up to ₹35,000.</p>
//                   </div>
//                   <button
//                     onClick={() => setDeduction80D(35000)}
//                     className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
//                   >
//                     Apply Recommendation
//                   </button>
//                 </div>
//               )}

//               {deductionNps < 50000 && (
//                 <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
//                   <div>
//                     <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">80CCD(1B) NPS benefit</span>
//                     <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Claim extra ₹50,000 retirement benefit.</p>
//                   </div>
//                   <button
//                     onClick={() => setDeductionNps(50000)}
//                     className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
//                   >
//                     Apply Recommendation
//                   </button>
//                 </div>
//               )}

//               {deduction80C === 150000 && deduction80D >= 35000 && deductionNps === 50000 && (
//                 <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
//                   <Check className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
//                   <p className="text-[10px] text-emerald-400 font-bold">All standard deductions maximized!</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Audit Risk Card */}
//           <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col">
//             <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 mb-4">
//               <AlertTriangle className="w-4 h-4 text-emerald-400" />
//               <span>AI AUDIT RISK INDEX</span>
//             </div>

//             {/* SVG Gauge */}
//             <div className="relative w-full max-w-180px mx-auto py-2">
//               <svg viewBox="0 0 100 50" className="w-full h-auto">
//                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
//                 <path 
//                   d="M 10 50 A 40 40 0 0 1 90 50" 
//                   fill="none" 
//                   stroke="url(#gauge-gradient)" 
//                   strokeWidth="8" 
//                   strokeLinecap="round" 
//                   strokeDasharray="125" 
//                   strokeDashoffset={125 - (auditRiskScore / 100) * 125}
//                   className="transition-all duration-1000"
//                 />
//                 <defs>
//                   <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#10b981" />
//                     <stop offset="50%" stopColor="#fbbf24" />
//                     <stop offset="100%" stopColor="#f87171" />
//                   </linearGradient>
//                 </defs>
//                 <circle cx="50" cy="50" r="4" fill="#34d399" />
//                 <line 
//                   x1="50" 
//                   y1="50" 
//                   x2={needleX} 
//                   y2={needleY} 
//                   stroke="#ffffff" 
//                   strokeWidth="2.5" 
//                   strokeLinecap="round" 
//                   className="transition-all duration-700 ease-out" 
//                 />
//               </svg>
//               <div className="text-center mt-3">
//                 <span className="text-2xl font-black text-white">{auditRiskScore}</span>
//                 <span className="text-xs text-slate-500 font-bold">/100</span>
//               </div>
//             </div>

//             <div className={`mt-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900 text-center space-y-1 ${riskInfo.pulse}`}>
//               <p className={`text-xs font-extrabold uppercase ${riskInfo.color}`}>{riskInfo.label}</p>
//               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{riskInfo.desc}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import {
  FileText,
  Sliders,
  Check,
  AlertTriangle,
  RotateCcw,
  Activity,
  UploadCloud,
  Zap,
  BrainCircuit,
  RefreshCw,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

// --- Utility: Count Up / Interpolate Animation ---
const useCountUp = (end, duration = 800) => {
  const [count, setCount] = useState(end);
  
  useEffect(() => {
    let startTime = null;
    const startVal = count;
    const difference = end - startVal;
    if (difference === 0) return;

    let animationFrame;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + difference * easeProgress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// --- Component: Reacting Bar Chart ---
const ReactingBarChart = ({ income }) => {
  const baseHeights = [40, 70, 45, 90, 65, 85, 100];
  const factor = Math.min(1.5, Math.max(0.5, income / 1250000));
  
  return (
    <div className="flex items-end space-x-1.5 h-12">
      {baseHeights.map((height, i) => {
        const adjustedHeight = Math.min(100, Math.round(height * factor));
        return (
          <div key={i} className="w-3 bg-emerald-500/10 rounded-t-sm h-full flex items-end group/bar relative">
            <div 
              className="w-full bg-emerald-400/60 hover:bg-emerald-400 rounded-t-sm transition-all duration-500" 
              style={{ height: `${adjustedHeight}%` }} 
            />
            <span className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 px-1 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-mono">
              {adjustedHeight}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function CommandCenterTab({
  grossIncome, setGrossIncome,
  deduction80C, setDeduction80C,
  deduction80D, setDeduction80D,
  deductionNps, setDeductionNps,
  deductionHra, setDeductionHra,
  setActiveTab
}) {
  const [isAiRecalculating, setIsAiRecalculating] = useState(false);

  // Animate AI Core Orb on slider modifications
  useEffect(() => {
    setIsAiRecalculating(true);
    const timer = setTimeout(() => setIsAiRecalculating(false), 600);
    return () => clearTimeout(timer);
  }, [grossIncome, deduction80C, deduction80D, deductionNps, deductionHra]);

  // Indian Tax Slab Formulas
  const calculateOldRegimeTax = (gross, c80, d80, nps, hra) => {
    const stdDeduction = 50000;
    const cap80c = Math.min(150000, c80);
    const cap80d = Math.min(50000, d80);
    const capNps = Math.min(50000, nps);
    const capHra = Math.min(200000, hra);

    const totalDeductions = cap80c + cap80d + capNps + capHra + stdDeduction;
    const taxable = Math.max(0, gross - totalDeductions);

    let tax = 0;
    if (taxable <= 250000) {
      tax = 0;
    } else if (taxable <= 500000) {
      tax = (taxable - 250000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 12500 + (taxable - 500000) * 0.20;
    } else {
      tax = 112500 + (taxable - 1000000) * 0.30;
    }

    if (taxable <= 500000) tax = 0;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const calculateNewRegimeTax = (gross) => {
    const stdDeduction = 75000;
    const taxable = Math.max(0, gross - stdDeduction);

    let tax = 0;
    if (taxable <= 300000) {
      tax = 0;
    } else if (taxable <= 700000) {
      tax = (taxable - 300000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 20000 + (taxable - 700000) * 0.10;
    } else if (taxable <= 1200000) {
      tax = 50000 + (taxable - 1000000) * 0.15;
    } else if (taxable <= 1500000) {
      tax = 80000 + (taxable - 1200000) * 0.20;
    } else {
      tax = 140000 + (taxable - 1500000) * 0.30;
    }

    if (taxable <= 700000) tax = 0;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const taxOld = calculateOldRegimeTax(grossIncome, deduction80C, deduction80D, deductionNps, deductionHra);
  const taxNew = calculateNewRegimeTax(grossIncome);

  const betterRegime = taxOld < taxNew ? "OLD" : "NEW";
  const taxDiff = Math.abs(taxOld - taxNew);
  const finalTax = betterRegime === "OLD" ? taxOld : taxNew;
  const totalDeductions = deduction80C + deduction80D + deductionNps + deductionHra;

  // AI Audit Risk Calculator
  const calculateAuditRisk = (gross, deductions) => {
    if (gross <= 0) return 0;
    const ratio = deductions / gross;
    let score = 12;
    if (ratio > 0.4) {
      score += 48;
    } else if (ratio > 0.25) {
      score += 26;
    } else {
      score += ratio * 45;
    }
    if (gross > 1800000) {
      score += 24;
    } else if (gross > 1000000) {
      score += 10;
    }
    return Math.round(Math.min(99, Math.max(5, score)));
  };

  const auditRiskScore = calculateAuditRisk(grossIncome, totalDeductions);
  const getRiskDetails = (score) => {
    if (score < 35) return { label: "Safe / Low Risk", color: "text-emerald-400", pulse: "animate-pulse-safe", desc: "Your deductions align perfectly with typical thresholds. Auto-filing is safe." };
    if (score < 68) return { label: "Moderate / Verify Receipts", color: "text-amber-400", pulse: "animate-pulse-warning", desc: "Slightly elevated deductions relative to income. Keep receipts handy." };
    return { label: "High / Audit Flag Likely", color: "text-rose-400", pulse: "animate-pulse-danger", desc: "Deductions exceed 35% of income. AI recommends review before final filing." };
  };
  const riskInfo = getRiskDetails(auditRiskScore);

  const DEFAULT_DASHBOARD = {
    grossIncome: 1250000,
    deduction80C: 105000,
    deduction80D: 15000,
    deductionNps: 0,
    deductionHra: 50000,
  };

  const applyDashboardValues = (dashboard) => {
    setGrossIncome(dashboard.grossIncome ?? DEFAULT_DASHBOARD.grossIncome);
    setDeduction80C(dashboard.deduction80C ?? DEFAULT_DASHBOARD.deduction80C);
    setDeduction80D(dashboard.deduction80D ?? DEFAULT_DASHBOARD.deduction80D);
    setDeductionNps(dashboard.npsContribution ?? DEFAULT_DASHBOARD.deductionNps);
    setDeductionHra(dashboard.hraExemption ?? DEFAULT_DASHBOARD.deductionHra);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/documents");
      const documents = response.data.documents ?? [];
      if (documents.length === 0) {
        applyDashboardValues(DEFAULT_DASHBOARD);
        return;
      }
      applyDashboardValues(response.data.dashboard ?? DEFAULT_DASHBOARD);
    } catch (err) {
      console.error(err);
      applyDashboardValues(DEFAULT_DASHBOARD);
    }
  };

  // SVG Gauge Needle angle
  const riskAngle = 180 - (auditRiskScore / 100) * 180;
  const needleRad = (riskAngle * Math.PI) / 180;
  const needleX = 50 + 32 * Math.cos(needleRad);
  const needleY = 50 - 32 * Math.sin(needleRad);

  const animatedIncome = useCountUp(grossIncome);
  const animatedTax = useCountUp(finalTax);
  const animatedDeductions = useCountUp(totalDeductions);
  // const progress = 100;
  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progress = grossIncome > 0 ? 100 : 0;
  const strokeOffset = circleCircumference - (progress / 100) * circleCircumference;
  return (
    <div className="space-y-6">
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gross Income Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Income</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">₹{animatedIncome.toLocaleString()}</h3>
            </div>
            <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Live Sync
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-900/60 flex items-center justify-between">
            <span className="text-xs text-slate-500">Monthly breakdown:</span>
            <ReactingBarChart income={grossIncome} />
          </div>
        </div>

        {/* Est. Net Tax Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Est. Net Tax</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">₹{animatedTax.toLocaleString()}</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.1)]">
              {betterRegime} REGIME
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
            You save <strong className="text-emerald-400">₹{taxDiff.toLocaleString()}</strong> by opting for the {betterRegime} Regime.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-900/60 flex justify-between text-[11px] text-slate-500">
            <span>Taxable Deductions Claimed:</span>
            <span className="text-slate-300 font-bold">₹{animatedDeductions.toLocaleString()}</span>
          </div>
        </div>

        {/* Filing Trajectory Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Filing Trajectory</p>
              <h4 className="text-lg font-bold text-white mt-1">
                {progress >= 95 ? "Tax Return Ready!" : "Verification Incomplete"}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {progress >= 95 ? "Form 16 loaded successfully" : "Next Milestone: OCR Document Scan"}
              </p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-800/80" />
                <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeOffset} strokeLinecap="round" className="text-emerald-400 transition-all duration-1000" style={{ filter: "drop-shadow(0 0 4px rgba(52, 211, 153, 0.4))" }} />
              </svg>
              <span className="absolute text-xs font-bold text-white font-mono">{progress}%</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-900/60 flex justify-between items-center">
            <span className="text-xs text-slate-500">Form 16 Status:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${grossIncome > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
              { grossIncome > 0? "ACTIVE" : "PENDING UPLOAD"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (sliders, regime breakdown, document scanner) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tax Optimizer Sliders */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Tax Optimizer Simulator</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                
                  onClick={() => {
                    setDeduction80C(150000);
                    setDeduction80D(50000);
                    setDeductionNps(50000);
                    setDeductionHra(200000);
                  }}
                  className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg hover:border-emerald-500/40 transition-all cursor-pointer"
                >
                  Maximize Limit
                </button>
                <button 
                  onClick={fetchDashboardData}
                  className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Gross income range input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Gross Annual Income (₹)</span>
                  <span className="text-emerald-400 font-bold font-mono">₹{grossIncome.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="300000"
                  max="3000000"
                  step="20000"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Deduction 80C range input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Section 80C (PPF, ELSS, Insurance)</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{deduction80C.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹1.5L</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={deduction80C}
                  onChange={(e) => setDeduction80C(Number(e.target.value))}
                  className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Deduction 80D range input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Section 80D (Health Insurance Premium)</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{deduction80D.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹50K</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={deduction80D}
                  onChange={(e) => setDeduction80D(Number(e.target.value))}
                  className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Deduction NPS range input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Section 80CCD(1B) NPS Retirement Benefit</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{deductionNps.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹50K</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="5000"
                  value={deductionNps}
                  onChange={(e) => setDeductionNps(Number(e.target.value))}
                  className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Deduction HRA range input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">House Rent Allowance (HRA) Exemption</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{deductionHra.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">/ max ₹2.0L</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={deductionHra}
                  onChange={(e) => setDeductionHra(Number(e.target.value))}
                  className="w-full h-1.5 rounded bg-slate-800 cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Regime Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Regime Card */}
            <div className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
              betterRegime === "OLD" 
                ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]" 
                : "bg-slate-900/20 border border-slate-800/80"
            }`}>
              {betterRegime === "OLD" && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                   Recommended
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Old Regime</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Allows high deductions under Section 80C/80D/HRA</p>
                
                <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
                  <div className="flex justify-between"><span className="text-slate-400">Standard Deduction:</span><span className="text-slate-200">₹50,000</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Section 80C:</span><span className="text-slate-200">₹{Math.min(150000, deduction80C).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Health / NPS:</span><span className="text-slate-200">₹{(Math.min(50000, deduction80D) + Math.min(50000, deductionNps)).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">HRA Exemption:</span><span className="text-slate-200">₹{Math.min(200000, deductionHra).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
                    <span>Taxable Income:</span>
                    <span>₹{Math.max(0, grossIncome - Math.min(150000, deduction80C) - Math.min(50000, deduction80D) - Math.min(50000, deductionNps) - Math.min(200000, deductionHra) - 50000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Estimated Tax</p>
                  <p className="text-2xl font-black text-white font-mono">₹{taxOld.toLocaleString()}</p>
                </div>
                {betterRegime === "OLD" ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><Check className="w-4 h-4" /></div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-semibold font-mono">Saves ₹0</span>
                )}
              </div>
            </div>

            {/* New Regime Card */}
            <div className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
              betterRegime === "NEW" 
                ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]" 
                : "bg-slate-900/20 border border-slate-800/80"
            }`}>
              {betterRegime === "NEW" && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                  Recommended
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">New Regime</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Higher standard deduction, lower slab tax rates</p>
                
                <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
                  <div className="flex justify-between"><span className="text-slate-400">Standard Deduction:</span><span className="text-slate-200">₹75,000</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Section 80C Deductions:</span><span className="text-slate-500">Not Allowed (₹0)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Section 80D / NPS / HRA:</span><span className="text-slate-500">Not Allowed (₹0)</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
                    <span>Taxable Income:</span>
                    <span>₹{Math.max(0, grossIncome - 75000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Estimated Tax</p>
                  <p className="text-2xl font-black text-white font-mono">₹{taxNew.toLocaleString()}</p>
                </div>
                {betterRegime === "NEW" ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><Check className="w-4 h-4" /></div>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">Saves ₹{taxDiff.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right Columns (AI Copilot suggestion drawer, risk levels) */}
        <div className="space-y-6"> 
          
          {/* AI Recommendations Redirect Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center w-full mb-4">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>AI OPTIMIZER HUB</span>
              </div>
              <span className="text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="relative w-24 h-24 my-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/20 via-green-500/5 to-transparent blur-md scale-100 opacity-60" />
              <div className="w-18 h-18 rounded-full border border-emerald-500/30 flex items-center justify-center bg-slate-950/90 relative animate-float shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                <BrainCircuit className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-6 px-2">
Optimize taxes with AI insights.            </p>

            <button
              onClick={() => setActiveTab("recommendations")}
              className="w-full py-1 px-4 font-bold text-xs bg-linear-to-tr from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4.5 h-4.5 text-slate-950" />
              View AI Recommendations
            </button>
          </div>

          {/* AI Audit Risk Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 mb-4">
              <AlertTriangle className="w-4 h-4 text-emerald-400" />
              <span>AI AUDIT RISK INDEX</span>
            </div>

            {/* SVG Gauge */}
            <div className="relative w-full max-w-180px mx-auto py-2">
              <svg viewBox="0 0 100 50" className="w-full h-auto">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gauge-gradient)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeDasharray="125" 
                  strokeDashoffset={125 - (auditRiskScore / 100) * 125}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="4" fill="#34d399" />
                <line 
                  x1="50" 
                  y1="50" 
                  x2={needleX} 
                  y2={needleY} 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  className="transition-all duration-700 ease-out" 
                />
              </svg>
              <div className="text-center mt-3">
                <span className="text-2xl font-black text-white">{auditRiskScore}</span>
                <span className="text-xs text-slate-500 font-bold">/100</span>
              </div>
            </div>

            <div className={`mt-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900 text-center space-y-1 ${riskInfo.pulse}`}>
              <p className={`text-xs font-extrabold uppercase ${riskInfo.color}`}>{riskInfo.label}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{riskInfo.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
