import React, { useState, useEffect } from "react";
import InteractiveNetworkBackground from "../components/InteractiveNetworkBackground.jsx";
import MascotAssistant from "../components/MascotAssistant.jsx";
import {
  LayoutDashboard,
  FileText,
  PieChart,
  Settings,
  Bell,
  Search,
  UploadCloud,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  Zap,
  ChevronRight,
  MoreVertical,
  HelpCircle,
  TrendingUp,
  Cpu,
  User,
  Activity,
  AlertTriangle,
  RotateCcw,
  Check,
  Lock,
  ChevronDown,
  Info,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  Trash2,
  Sliders,
  DollarSign
} from "lucide-react";

// --- Utility: Count Up / Interpolate Animation ---
// Smoothly animates values whenever 'end' value changes
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
      // easeOutCubic
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

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("command-center");

  // Tax input states (sliders)
  const [grossIncome, setGrossIncome] = useState(1250000);
  const [deduction80C, setDeduction80C] = useState(105000);
  const [deduction80D, setDeduction80D] = useState(15000);
  const [deductionNps, setDeductionNps] = useState(0);
  const [deductionHra, setDeductionHra] = useState(50000);

  // File Upload states
  const [uploadState, setUploadState] = useState("idle"); // idle, scanning, complete
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [customFiles, setCustomFiles] = useState([]); // files uploaded dynamically

  // Filing process progress state
  const [progress, setProgress] = useState(68);
  const [isAiRecalculating, setIsAiRecalculating] = useState(false);

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

    // 87A Rebate: if taxable income is <= 500k, tax is 0
    if (taxable <= 500000) tax = 0;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const calculateNewRegimeTax = (gross) => {
    const stdDeduction = 75000; // standard deduction for new regime
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

    // 87A Rebate (New Regime): if taxable income is <= 700k, tax is 0
    if (taxable <= 700000) tax = 0;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  // Perform dynamic calculations
  const taxOld = calculateOldRegimeTax(grossIncome, deduction80C, deduction80D, deductionNps, deductionHra);
  const taxNew = calculateNewRegimeTax(grossIncome);

  const betterRegime = taxOld < taxNew ? "OLD" : "NEW";
  const taxDiff = Math.abs(taxOld - taxNew);
  const finalTax = betterRegime === "OLD" ? taxOld : taxNew;
  const potentialSavings = taxDiff + (150000 - Math.min(150000, deduction80C)) * 0.2; // mock savings

  // Animate AI Core Orb on slider modifications
  useEffect(() => {
    setIsAiRecalculating(true);
    const timer = setTimeout(() => setIsAiRecalculating(false), 600);
    return () => clearTimeout(timer);
  }, [grossIncome, deduction80C, deduction80D, deductionNps, deductionHra]);

  // AI Audit Risk Calculator
  const totalDeductions = deduction80C + deduction80D + deductionNps + deductionHra;
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

  // SVG Audit Risk Gauge calculations
  // Angle rotates from 180 degrees (left) to 0 degrees (right)
  const riskAngle = 180 - (auditRiskScore / 100) * 180;
  const needleRad = (riskAngle * Math.PI) / 180;
  const needleX = 50 + 32 * Math.cos(needleRad);
  const needleY = 50 - 32 * Math.sin(needleRad);

  // Simulated parser data profiles
  const sampleProfiles = [
    { name: "Form_16_TechCorp_John.pdf", gross: 1450000, c80: 150000, d80: 25000, nps: 20000, hra: 85000, size: "1.4 MB" },
    { name: "Form_16_AeroGlobal_Sarah.pdf", gross: 1950000, c80: 150000, d80: 45000, nps: 50000, hra: 120000, size: "2.1 MB" },
    { name: "SalarySlip_Q4_FinTech.pdf", gross: 920000, c80: 80000, d80: 10000, nps: 0, hra: 30000, size: "680 KB" }
  ];

  const triggerUploadSimulation = (profile) => {
    setUploadState("scanning");
    setScanProgress(0);
    setScanStep(0);
    setUploadedFile(profile.name);

    // Increment scan steps sequentially
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev >= 3 ? 3 : prev + 1));
    }, 1000);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setUploadState("complete");
      setGrossIncome(profile.gross);
      setDeduction80C(profile.c80);
      setDeduction80D(profile.d80);
      setDeductionNps(profile.nps);
      setDeductionHra(profile.hra);
      setProgress(95);

      // Add to custom files list in the Vault tab
      const newFile = {
        name: profile.name,
        type: profile.name.includes("Form_16") ? "Form 16" : "Salary Slip",
        date: new Date().toLocaleDateString(),
        size: profile.size,
        status: "Parsed & Active"
      };
      setCustomFiles((prev) => [newFile, ...prev]);
    }, 4000);
  };

  const resetUpload = () => {
    setUploadState("idle");
    setUploadedFile(null);
    setScanProgress(0);
    setScanStep(0);
    setProgress(68);
  };

  // Count-up hook values
  const animatedIncome = useCountUp(grossIncome);
  const animatedTax = useCountUp(finalTax);
  const animatedDeductions = useCountUp(totalDeductions);

  // Progress circle attributes
  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden custom-scrollbar">
      <InteractiveNetworkBackground />
      
      {/* Decorative Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-8000ms" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse duration-12000ms" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none animate-pulse duration-10000ms" />

      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* SIDEBAR */}
        <aside className="w-66 flex flex-col m-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shrink-0">
          
          {/* Sidebar Logo */}
          <div className="h-24 flex items-center px-8 border-b border-slate-800/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-green-400 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <span className="ml-3 text-lg font-extrabold tracking-tight bg-linear-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Tax<span className="text-emerald-400 font-semibold">Assist.AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-8 px-4 space-y-2">
            {[
              { id: "command-center", icon: LayoutDashboard, label: "Command Center" },
              { id: "playground", icon: Sliders, label: "Simulations" },
              { id: "vault", icon: FileText, label: "Vault" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-800/60 bg-slate-950/20">
            <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">mitti poochi</p>
                <p className="text-[10px] text-emerald-400/80 font-medium">Pro AI Filer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY CONTAINER */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar gap-6">
          
          {/* Header */}
          <header className="flex justify-between items-center bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40 backdrop-blur-md">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Workspace</p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight m-0">
                {activeTab === "command-center" && "AI Command Center"}
                {activeTab === "playground" && "Simulations Workbench"}
                {activeTab === "vault" && "Secure Document Vault"}
                {activeTab === "settings" && "Config Settings"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-900/50 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Core: Active</span>
              </div>
              <button className="p-3 rounded-full bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </button>
            </div>
          </header>

          {/* TAB 1: COMMAND CENTER */}
          {activeTab === "command-center" && (
            <div className="space-y-6">
              
              {/* Dynamic Stats Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Gross Income Card */}
                <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Income</p>
                      <h3 className="text-3xl font-extrabold text-white mt-1">₹{animatedIncome.toLocaleString()}</h3>
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

                {/* Est. Tax Liability Card */}
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${uploadedFile ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {uploadedFile ? "ACTIVE" : "PENDING UPLOAD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Sliders & Upload Simulator (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Quick Tax Optimizer Slider Card */}
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-base font-bold text-white">Live Tax Optimizer Simulator</h3>
                      </div>
                      <button 
                        onClick={() => {
                          setGrossIncome(1250000);
                          setDeduction80C(105000);
                          setDeduction80D(15000);
                          setDeductionNps(0);
                          setDeductionHra(50000);
                        }}
                        className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Slider 1: Gross Income */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Gross Annual Income (₹)</span>
                          <span className="text-emerald-400 font-bold font-mono">₹{grossIncome.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="300000"
                          max="2500000"
                          step="10000"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(Number(e.target.value))}
                          className="w-full h-1.5 rounded bg-slate-800 cursor-pointer focus:outline-none"
                        />
                      </div>

                      {/* Slider 2: Section 80C */}
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
                          className="w-full h-1.5 rounded bg-slate-800 cursor-pointer focus:outline-none"
                        />
                      </div>

                      {/* Slider 3: Section 80D */}
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
                          max="500000"
                          step="2500"
                          value={deduction80D}
                          onChange={(e) => setDeduction80D(Number(e.target.value))}
                          className="w-full h-1.5 rounded bg-slate-800 cursor-pointer focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form 16 Drag-and-Drop Simulator */}
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
                    
                    <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <span>Form 16 OCR Parser Simulator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Simulate how TaxAssist AI extracts details directly from official tax documents.</p>

                    {uploadState === "idle" && (
                      <div className="border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 text-center bg-slate-950/40 transition-colors duration-300">
                        <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-emerald-400" />
                        <p className="text-xs text-slate-300 font-semibold mb-1">Upload and Scan Tax Document</p>
                        <p className="text-[10px] text-slate-500 mb-4">PDF, PNG, JPG accepted (up to 10MB)</p>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                          {sampleProfiles.map((profile, i) => (
                            <button
                              key={i}
                              onClick={() => triggerUploadSimulation(profile)}
                              className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-emerald-500/20 text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md"
                            >
                              Scan: {profile.name.slice(0, 15)}...
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadState === "scanning" && (
                      <div className="border border-emerald-500/20 rounded-2xl p-6 bg-slate-950/80 relative overflow-hidden h-52 flex flex-col justify-between">
                        
                        {/* Glowing Laser Scan Line */}
                        <div className="absolute left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-laser-scan pointer-events-none" />

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
                            <span className="text-xs font-bold text-slate-200">Processing {uploadedFile}...</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">{Math.round(scanProgress)}%</span>
                        </div>

                        {/* OCR Scanner Stepper */}
                        <div className="grid grid-cols-1 gap-2 my-2 text-left">
                          {[
                            "Document Type Recognition & Alignment",
                            "Parsing Section 17 W-2 Salary Schedules",
                            "Extracting Section 80C/80D Deductions",
                            "Auto-filling Command Center Dashboard"
                          ].map((step, idx) => (
                            <div key={idx} className="flex items-center text-[10px] font-semibold space-x-2">
                              {scanStep > idx ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : scanStep === idx ? (
                                <span className="w-3.5 h-3.5 rounded-full border border-emerald-400/40 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /></span>
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-800" />
                              )}
                              <span className={scanStep >= idx ? "text-slate-300 font-bold" : "text-slate-600"}>{step}</span>
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-900 rounded-full h-1">
                          <div 
                            className="bg-emerald-400 h-1 rounded-full transition-all duration-200" 
                            style={{ width: `${scanProgress}%`, boxShadow: "0 0 8px rgba(52,211,153,0.5)" }} 
                          />
                        </div>
                      </div>
                    )}

                    {uploadState === "complete" && (
                      <div className="border border-emerald-500/30 bg-emerald-950/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                          <FileCheck2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Parsing Successful</h4>
                          <p className="text-[11px] text-slate-300 mt-1 max-w-sm">
                            AI extracted all metrics from <strong>{uploadedFile}</strong> and updated your gross income and deductions accordingly.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveTab("playground")}
                            className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Review Calculations
                          </button>
                          <button
                            onClick={resetUpload}
                            className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Scan Another File
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: AI Co-pilot & Risk Gauge (1 col) */}
                <div className="space-y-6">
                  
                  {/* AI Copilot Card */}
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center w-full mb-4">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>CO-PILOT INTEL</span>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-safe" />
                    </div>

                    {/* AI Orb Visualizer */}
                    <div className="relative w-24 h-24 my-3 flex items-center justify-center group/orb">
                      <div className={`absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/20 via-green-500/5 to-transparent blur-md transition-all duration-500 ${isAiRecalculating ? "scale-125 opacity-100" : "scale-100 opacity-60"}`} />
                      <div className={`w-18 h-18 rounded-full border border-emerald-500/30 flex items-center justify-center bg-slate-950/90 relative animate-float shadow-[0_0_20px_rgba(52,211,153,0.15)] ${isAiRecalculating ? "shadow-emerald-500/40" : ""}`}>
                        <BrainCircuit className={`w-8 h-8 text-emerald-400 transition-transform duration-500 ${isAiRecalculating ? "rotate-90 scale-110" : ""}`} />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic mb-4">
                      "I analyze your investments. Click any suggestion below to apply optimizing adjustments instantly."
                    </p>

                    <div className="w-full text-left space-y-3 pt-3 border-t border-slate-900/60">
                      
                      {deduction80C < 150000 && (
                        <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Section 80C recommendation</span>
                            <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Maximize limit to save ₹13,500 more.</p>
                          </div>
                          <button
                            onClick={() => setDeduction80C(150000)}
                            className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
                          >
                            Apply Recommendation
                          </button>
                        </div>
                      )}

                      {deduction80D < 35000 && (
                        <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Section 80D recommendation</span>
                            <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Claim Health Insurance up to ₹35,000.</p>
                          </div>
                          <button
                            onClick={() => setDeduction80D(35000)}
                            className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
                          >
                            Apply Recommendation
                          </button>
                        </div>
                      )}

                      {deductionNps < 50000 && (
                        <div className="p-3 rounded-2xl bg-emerald-950/10 border border-emerald-500/10 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">80CCD(1B) NPS benefit</span>
                            <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Claim extra ₹50,000 retirement benefit.</p>
                          </div>
                          <button
                            onClick={() => setDeductionNps(50000)}
                            className="w-full text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 py-1.5 rounded-lg transition-all cursor-pointer text-center"
                          >
                            Apply Recommendation
                          </button>
                        </div>
                      )}
                    </div>
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
          )}

          {/* TAB 2: INTERACTIVE PLAYGROUND (SIMULATIONS) */}
          {activeTab === "playground" && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-1">Simulations Workbench</h2>
                <p className="text-xs text-slate-400">Model tax regimes with live sliders. Click the cards to apply configurations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Input Panel */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex justify-between items-center">
                    <span>Adjust Deductions</span>
                    <button 
                      onClick={() => {
                        setDeduction80C(150000);
                        setDeduction80D(50000);
                        setDeductionNps(50000);
                        setDeductionHra(120000);
                      }}
                      className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      Maximize Deductions
                    </button>
                  </h3>

                  {/* Slider 1: Gross Income */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Gross Annual Income</span>
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

                  {/* Slider 2: Section 80C */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Section 80C (PPF/ELSS/LIC)</span>
                      <span className="text-emerald-400 font-bold font-mono">₹{deduction80C.toLocaleString()} / 1.5L</span>
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

                  {/* Slider 3: Section 80D */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Section 80D (Health Insurance)</span>
                      <span className="text-emerald-400 font-bold font-mono">₹{deduction80D.toLocaleString()} / 50K</span>
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

                  {/* Slider 4: NPS 80CCD(1B) */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">80CCD(1B) NPS Retirement</span>
                      <span className="text-emerald-400 font-bold font-mono">₹{deductionNps.toLocaleString()} / 50K</span>
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

                  {/* Slider 5: HRA Exemption */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">House Rent Allowance (HRA)</span>
                      <span className="text-emerald-400 font-bold font-mono">₹{deductionHra.toLocaleString()} / 2.0L</span>
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

                {/* Regime Comparison Cards */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Old Regime Card */}
                    <div className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
                      betterRegime === "OLD" 
                        ? "glass-panel-active border-emerald-500/30 bg-slate-900/50" 
                        : "glass-panel border-slate-800/80"
                    }`}>
                      {betterRegime === "OLD" && (
                        <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                          AI Recommended
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Old Regime</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Allows high deductions under Section 80C/80D</p>
                        
                        <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
                          <div className="flex justify-between"><span className="text-slate-400">Standard Deduction:</span><span className="text-slate-200">₹50,000</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Section 80C:</span><span className="text-slate-200">₹{Math.min(150000, deduction80C).toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Section 80D / NPS:</span><span className="text-slate-200">₹{(Math.min(50000, deduction80D) + Math.min(50000, deductionNps)).toLocaleString()}</span></div>
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
                        ? "glass-panel-active border-emerald-500/30 bg-slate-900/50" 
                        : "glass-panel border-slate-800/80"
                    }`}>
                      {betterRegime === "NEW" && (
                        <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                          AI Recommended
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

                  {/* Comparative Slab Info Banner */}
                  <div className="p-5 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex items-start space-x-3 text-xs leading-relaxed text-slate-400">
                    <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200">Comparison Breakdown</h4>
                      <p>
                        The **New Regime** is usually more beneficial for people who don't invest heavily in PPF, ELSS, NPS, or pay high rents. The tax rebates under Section 87A mean if your net taxable income is below ₹7L under the New Regime (or ₹5L under the Old Regime), your tax becomes completely **₹0**.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURE VAULT */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Secure Documents Vault</h2>
                  <p className="text-xs text-slate-400">Encrypted files parsed with privacy-masking technology.</p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-800/80 rounded-xl px-3.5 py-1.5 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>256-bit AES Encryption</span>
                </div>
              </div>

              {/* Upload Drop Zone (Static mockup) */}
              <div className="border border-dashed border-slate-850 hover:border-emerald-500/20 rounded-3xl p-8 text-center bg-slate-900/30 backdrop-blur-md transition-colors group cursor-pointer">
                <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3 group-hover:text-emerald-400 transition-colors" />
                <h3 className="text-sm font-bold text-slate-200 mb-1">Drag new documents here to extract</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Upload rent receipts, health bills, Form 16, or mutual fund reports. AI will read them securely and mask PII.</p>
              </div>

              {/* Vault Files Table */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Vault Files ({4 + customFiles.length})</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800/80 text-slate-400 font-bold">
                        <th className="pb-3 pr-4">File Name</th>
                        <th className="pb-3 pr-4">Document Type</th>
                        <th className="pb-3 pr-4">Date Added</th>
                        <th className="pb-3 pr-4">File Size</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/50">
                      {customFiles.map((file, idx) => (
                        <tr key={idx} className="text-slate-300 hover:bg-slate-900/10">
                          <td className="py-4.5 pr-4 font-bold flex items-center space-x-2 text-emerald-400">
                            <FileCheck2 className="w-4 h-4 shrink-0" />
                            <span className="truncate max-w-150px">{file.name}</span>
                          </td>
                          <td className="py-4.5 pr-4 font-medium">{file.type}</td>
                          <td className="py-4.5 pr-4 text-slate-400">{file.date}</td>
                          <td className="py-4.5 pr-4 text-slate-400">{file.size}</td>
                          <td className="py-4.5 pr-4">
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                              {file.status}
                            </span>
                          </td>
                          <td className="py-4.5 text-right">
                            <button className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      {[
                        { name: "Form_16_FY_25-26.pdf", type: "Form 16", date: "June 1, 2026", size: "1.2 MB", status: "Synced" },
                        { name: "Rent_Receipts_Jan_Mar.pdf", type: "HRA Proof", date: "June 2, 2026", size: "2.4 MB", status: "Synced" },
                        { name: "Health_Premium_Receipt.pdf", type: "Section 80D", date: "June 3, 2026", size: "650 KB", status: "Synced" },
                        { name: "ELSS_Statement_Aditya.pdf", type: "Section 80C", date: "June 5, 2026", size: "920 KB", status: "Synced" },
                      ].map((file, idx) => (
                        <tr key={idx} className="text-slate-300 hover:bg-slate-900/10">
                          <td className="py-4.5 pr-4 font-bold flex items-center space-x-2">
                            <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                            <span className="truncate max-w-150px">{file.name}</span>
                          </td>
                          <td className="py-4.5 pr-4 font-medium">{file.type}</td>
                          <td className="py-4.5 pr-4 text-slate-400">{file.date}</td>
                          <td className="py-4.5 pr-4 text-slate-400">{file.size}</td>
                          <td className="py-4.5 pr-4">
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                              {file.status}
                            </span>
                          </td>
                          <td className="py-4.5 text-right">
                            <button className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIG SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-1">Configuration Center</h2>
                <p className="text-xs text-slate-400">Configure filing profile, AI permissions, and portal integrations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Account & AI Models Config */}
                <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/60 pb-2">Profile & Model parameters</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">Active Tax Assessment Year</p>
                        <p className="text-[10px] text-slate-500">Indian Income Tax regime year</p>
                      </div>
                      <span className="bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-emerald-400 font-bold">FY 2026-27 (Latest)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">Filer Entity Type</p>
                        <p className="text-[10px] text-slate-500">Individual or corporate returns</p>
                      </div>
                      <span className="bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-slate-300 font-bold">Individual / Resident</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">AI Model Version</p>
                        <p className="text-[10px] text-slate-500">Model selected to analyze tax codes</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 border border-emerald-500/20 rounded-lg font-bold">TaxGPT-v4.2-Pro</span>
                    </div>
                  </div>
                </div>

                {/* Integration & Security Settings */}
                <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/60 pb-2">System Integrations</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">E-filing Portal Sync</p>
                        <p className="text-[10px] text-slate-500">Auto-transmit returns to government portals</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2px after:left-2px after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-slate-950" />
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">Real-time Audit Shield</p>
                        <p className="text-[10px] text-slate-500">Auto-calculate threat meters on slider changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2px after:left-2px after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-slate-950" />
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-200">Document Encryption</p>
                        <p className="text-[10px] text-slate-500">Encrypt stored files with end-to-end security</p>
                      </div>
                      <span className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <MascotAssistant page="dashboard" />
    </div>
  );
}