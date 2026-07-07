import React, { useState, useEffect } from "react";
import InteractiveNetworkBackground from "../components/InteractiveNetworkBackground.jsx";

// Import new tab components
import CommandCenterTab from "../components/CommandCenterTab.jsx";
import UserProfileTab from "../components/UserProfileTab.jsx";
import SecureVaultTab from "../components/SecureVaultTab.jsx";
import AiTaxChatTab from "../components/AiTaxChatTab.jsx";
import RecommendationsTab from "../components/RecommendationsTab.jsx";
import api from "../services/api.js";

import {
  LayoutDashboard,
  FileText,
  Bot,
  User,
  Cpu,
  Bell,
  Sparkles
} from "lucide-react";

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("command-center");

  // Shared Recommendation States
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recScanStep, setRecScanStep] = useState(0);
  const [recommendationData, setRecommendationData] = useState(null);
  const [recsError, setRecsError] = useState("");

  const handleGiveRecommendation = async () => {
    setLoadingRecs(true);
    setRecsError("");
    setRecScanStep(0);
    
    const stepsCount = 7;
    for (let i = 0; i < stepsCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setRecScanStep(i);
    }

    try {
      const response = await api.get("/recommendations");
      if (response.data && response.data.success && response.data.recommendation) {
        setRecommendationData(response.data.recommendation);
      } else {
        throw new Error("Could not fetch recommendations.");
      }
    } catch (err) {
      console.error(err);
      setRecsError("Failed to generate recommendations. Please try again.");
    } finally {
      setLoadingRecs(false);
    }
  };

  // Shared Tax input states (sliders)
  const [grossIncome, setGrossIncome] = useState(1250000);
  const [deduction80C, setDeduction80C] = useState(105000);
  const [deduction80D, setDeduction80D] = useState(15000);
  const [deductionNps, setDeductionNps] = useState(0);
  const [deductionHra, setDeductionHra] = useState(50000);

  // Shared File upload states (Command Center simulator)
  const [uploadState, setUploadState] = useState("idle"); // idle, scanning, complete
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [customFiles, setCustomFiles] = useState([]); // files uploaded dynamically
  const [progress, setProgress] = useState(68);

  // Shared User Profile basic info states
  const [profileName, setProfileName] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) return parsed.name;
      }
    } catch (e) {}
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) return parsed.email;
      }
    } catch (e) {}
  });
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePan, setProfilePan] = useState("");
  const [taxpayerCategory, setTaxpayerCategory] = useState("Individual / Resident");
  const [employmentType, setEmploymentType] = useState("Salaried / Employed");
  const [address, setAddress] = useState("");

  // Indian Tax Slab Formulas for Profile Summary computations
  const calculateOldRegimeTax = (gross, c80, d80, nps, hra) => {
    const stdDeduction = 50000;
    const cap80c = Math.min(150000, c80);
    const cap80d = Math.min(50000, d80);
    const capNps = Math.min(50000, nps);
    const capHra = Math.min(200000, hra);
    const totalDeductions = cap80c + cap80d + capNps + capHra + stdDeduction;
    const taxable = Math.max(0, gross - totalDeductions);

    let tax = 0;
    if (taxable <= 250000) tax = 0;
    else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
    else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20;
    else tax = 112500 + (taxable - 1000000) * 0.30;

    if (taxable <= 500000) tax = 0;
    return Math.round(tax + tax * 0.04);
  };

  const calculateNewRegimeTax = (gross) => {
    const stdDeduction = 75000;
    const taxable = Math.max(0, gross - stdDeduction);

    let tax = 0;
    if (taxable <= 300000) tax = 0;
    else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
    else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
    else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
    else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
    else tax = 140000 + (taxable - 1500000) * 0.30;

    if (taxable <= 700000) tax = 0;
    return Math.round(tax + tax * 0.04);
  };

  const taxOld = calculateOldRegimeTax(grossIncome, deduction80C, deduction80D, deductionNps, deductionHra);
  const taxNew = calculateNewRegimeTax(grossIncome);
  const taxDiff = Math.abs(taxOld - taxNew);

  // Audit Risk Score for Chat Tab reference
  const calculateAuditRisk = (gross, deductions) => {
    if (gross <= 0) return 0;
    const ratio = deductions / gross;
    let score = 12;
    if (ratio > 0.4) score += 48;
    else if (ratio > 0.25) score += 26;
    else score += ratio * 45;
    if (gross > 1800000) score += 24;
    else if (gross > 1000000) score += 10;
    return Math.round(Math.min(99, Math.max(5, score)));
  };
  const auditRiskScore = calculateAuditRisk(grossIncome, deduction80C + deduction80D + deductionNps + deductionHra);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden custom-scrollbar">
      <InteractiveNetworkBackground />
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-8000ms" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse duration-12000ms" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none animate-pulse duration-10000ms" />

      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* SIDEBAR */}
        <aside className="w-66 flex flex-col m-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shrink-0">
          <div className="h-24 flex items-center px-8 border-b border-slate-800/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-green-400 shadow-lg shadow-emerald-500/20">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <span className="ml-3 text-lg font-extrabold tracking-tight bg-linear-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Tax<span className="text-emerald-400 font-semibold">Wise</span>
            </span>
          </div>

          <nav className="flex-1 py-8 px-4 space-y-2">
            {[
              { id: "command-center", icon: LayoutDashboard, label: "Command Center" },
              { id: "profile", icon: User, label: "User Profile" },
              { id: "vault", icon: FileText, label: "Secure Vault" },
              { id: "recommendations", icon: Sparkles, label: "AI Recommendations" },
              // { id: "ai-chat", icon: Bot, label: "AI Tax Chat" },
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

          <div className="p-6 border-t border-slate-800/60 bg-slate-950/20">
            <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">{profileName}</p>
                <p className="text-[10px] text-emerald-400/80 font-medium">Verified Taxpayer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar gap-6">
          
          <header className="flex justify-between items-center bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40 backdrop-blur-md">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight m-0 animate-bubble-fade-in">
                {activeTab === "command-center" && "AI Command Center"}
                {activeTab === "profile" && "Taxpayer Profile"}
                {activeTab === "vault" && "Secure Documents Vault"}
                {activeTab === "recommendations" && "AI Recommendations"}
                {activeTab === "ai-chat" && "TaxBuddy AI Consult"}
              </h1>
            </div>

            {/* <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-900/50 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Core: Active</span>
              </div>
              <button className="p-3 rounded-full bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </button>
            </div> */}
          </header>

          {/* Render Active Tab Component */}
          {activeTab === "command-center" && (
            <CommandCenterTab 
              grossIncome={grossIncome} setGrossIncome={setGrossIncome}
              deduction80C={deduction80C} setDeduction80C={setDeduction80C}
              deduction80D={deduction80D} setDeduction80D={setDeduction80D}
              deductionNps={deductionNps} setDeductionNps={setDeductionNps}
              deductionHra={deductionHra} setDeductionHra={setDeductionHra}
              uploadState={uploadState} setUploadState={setUploadState}
              uploadedFile={uploadedFile} setUploadedFile={setUploadedFile}
              scanProgress={scanProgress} setScanProgress={setScanProgress}
              scanStep={scanStep} setScanStep={setScanStep}
              customFiles={customFiles} setCustomFiles={setCustomFiles}
              progress={progress} setProgress={setProgress}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "recommendations" && (
            <RecommendationsTab 
              loadingRecs={loadingRecs}
              recScanStep={recScanStep}
              recommendationData={recommendationData}
              recsError={recsError}
              handleGiveRecommendation={handleGiveRecommendation}
              setDeduction80C={setDeduction80C}
              setDeduction80D={setDeduction80D}
              setDeductionNps={setDeductionNps}
              setDeductionHra={setDeductionHra}
              grossIncome={grossIncome}
            />
          )}

          {activeTab === "profile" && (
            <UserProfileTab 
              profileName={profileName} setProfileName={setProfileName}
              profileEmail={profileEmail} setProfileEmail={setProfileEmail}
              profilePhone={profilePhone} setProfilePhone={setProfilePhone}
              profilePan={profilePan} setProfilePan={setProfilePan}
              taxpayerCategory={taxpayerCategory} setTaxpayerCategory={setTaxpayerCategory}
              employmentType={employmentType} setEmploymentType={setEmploymentType}
              address={address} setAddress={setAddress}
              taxDiff={taxDiff} customFiles={customFiles}
            />
          )}

          {activeTab === "vault" && (
            <SecureVaultTab 
              setGrossIncome={setGrossIncome}
              setDeduction80C={setDeduction80C}
              setDeduction80D={setDeduction80D}
              setDeductionNps={setDeductionNps}
              setDeductionHra={setDeductionHra}
              customFiles={customFiles} setCustomFiles={setCustomFiles}
              setActiveTab={setActiveTab}
            />
          )}
{/* 
          {activeTab === "ai-chat" && (
            <AiTaxChatTab 
              auditRiskScore={auditRiskScore}
            />
          )} */}
        </main>
      </div>
    </div>
  );
}