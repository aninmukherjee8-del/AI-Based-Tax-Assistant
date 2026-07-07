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
  ArrowRight,
} from "lucide-react";
import { calculateComplianceScore } from "../utils/complianceScore.js";

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
          <div
            key={i}
            className="w-3 bg-emerald-500/10 rounded-t-sm h-full flex items-end group/bar relative"
          >
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
  grossIncome,
  setGrossIncome,
  deduction80C,
  setDeduction80C,
  deduction80D,
  setDeduction80D,
  deductionNps,
  setDeductionNps,
  deductionHra,
  setDeductionHra,
  setActiveTab,
}) {
  const [isAiRecalculating, setIsAiRecalculating] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadTaxProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tax-profile");
      const p = res.data.profile;
      setProfile(p);
      setProfileExists(true);
      setGrossIncome(p.income.salary);
      setDeduction80C(p.deductions.section80C);
      setDeduction80D(p.deductions.section80D);
      setDeductionNps(p.deductions.nps);
      setDeductionHra(p.expenses.rent);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileExists(false);
        setProfile(null);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxProfile();
  }, []);

  // Animate AI Core Orb on slider modifications
  useEffect(() => {
    setIsAiRecalculating(true);
    const timer = setTimeout(() => setIsAiRecalculating(false), 600);
    return () => clearTimeout(timer);
  }, [grossIncome, deduction80C, deduction80D, deductionNps, deductionHra]);

  // Indian Tax Slab Formulas
  const calculateOldRegimeTax = (gross, c80, d80, nps, hra) => {
    const standardDeduction = 50000;

    const deduction80C = Math.min(c80, 150000);
    const deduction80D = Math.min(d80, 50000);
    const deductionNPS = Math.min(nps, 50000);

    // hra is assumed to already be the exempt amount
    const deductionHRA = Math.max(0, hra);

    const taxableIncome = Math.max(
      0,
      gross -
        standardDeduction -
        deduction80C -
        deduction80D -
        deductionNPS -
        deductionHRA,
    );

    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    // Section 87A rebate
    if (taxableIncome <= 500000) {
      tax = 0;
    }

    tax += tax * 0.04;

    return Math.round(tax);
  };

  const calculateNewRegimeTax = (gross) => {
    const standardDeduction = 75000;

    const taxableIncome = Math.max(0, gross - standardDeduction);

    let tax = 0;

    if (taxableIncome <= 400000) {
      tax = 0;
    } else if (taxableIncome <= 800000) {
      tax = (taxableIncome - 400000) * 0.05;
    } else if (taxableIncome <= 1200000) {
      tax = 20000 + (taxableIncome - 800000) * 0.1;
    } else if (taxableIncome <= 1600000) {
      tax = 60000 + (taxableIncome - 1200000) * 0.15;
    } else if (taxableIncome <= 2000000) {
      tax = 120000 + (taxableIncome - 1600000) * 0.2;
    } else if (taxableIncome <= 2400000) {
      tax = 200000 + (taxableIncome - 2000000) * 0.25;
    } else {
      tax = 300000 + (taxableIncome - 2400000) * 0.3;
    }

    // Section 87A rebate (FY 2025-26)
    if (taxableIncome <= 1200000) {
      tax = 0;
    }

    tax += tax * 0.04;

    return Math.round(tax);
  };
  const totalIncome =
    grossIncome +
    (profile?.income.business ?? 0) +
    (profile?.income.capitalGains ?? 0) +
    (profile?.income.rentalIncome ?? 0) +
    (profile?.income.interestIncome ?? 0) +
    (profile?.income.otherIncome ?? 0);

  const taxOld = calculateOldRegimeTax(
    totalIncome,
    deduction80C,
    deduction80D,
    deductionNps,
    deductionHra,
  );

  const taxNew = calculateNewRegimeTax(totalIncome);

  const betterRegime = taxOld < taxNew ? "OLD" : "NEW";
  const taxDiff = Math.abs(taxOld - taxNew);
  const finalTax = betterRegime === "OLD" ? taxOld : taxNew;
  const totalDeductions =
    deduction80C + deduction80D + deductionNps + deductionHra;

  const compliance = calculateComplianceScore(profile);

  const auditRiskScore = compliance.score;
  const complianceLevel = compliance.level;
  const gaugeColor =
    compliance.color === "emerald"
      ? "#10b981"
      : compliance.color === "green"
        ? "#22c55e"
        : compliance.color === "yellow"
          ? "#facc15"
          : compliance.color === "orange"
            ? "#fb923c"
            : "#ef4444";

  // SVG Gauge Needle angle
  const riskAngle = 180 - (auditRiskScore / 100) * 180;
  const needleRad = (riskAngle * Math.PI) / 180;
  const needleX = 50 + 32 * Math.cos(needleRad);
  const needleY = 50 - 32 * Math.sin(needleRad);

  const animatedIncome = useCountUp(grossIncome);
  const animatedTax = useCountUp(finalTax);
  const animatedDeductions = useCountUp(totalDeductions);
  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progress = profile?.profileStatus?.percentage ?? 0;
  const strokeOffset =
    circleCircumference - (progress / 100) * circleCircumference;

  if (loading) {
    return (
      <div className="flex h-125 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-slate-700 border-t-emerald-400 animate-spin"></div>

          <p className="mt-6 text-slate-400">Loading your tax profile...</p>
        </div>
      </div>
    );
  }

  if (!profileExists) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 text-center backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Glowing Icon Container */}
        <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/20 via-emerald-500/5 to-transparent blur-md scale-110" />
          <div className="w-16 h-16 rounded-2xl border border-emerald-500/30 flex items-center justify-center bg-slate-950/80 shadow-[0_0_15px_rgba(52,211,153,0.1)] transition-transform duration-500 hover:scale-105 group">
            <UploadCloud className="h-8 w-8 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Typography with subtle gradient mask */}
        <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent sm:text-4xl">
          No Tax Profile Found
        </h2>

        <div className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-slate-400 font-medium">
          We couldn't find any tax information for your account. Upload your tax
          documents for AI parsing or manually fill your profile.
        </div>

        {/* Refined Premium Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setActiveTab("vault")}
            className="w-full sm:w-auto px-6 py-3.5 font-bold text-xs bg-linear-to-tr from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Upload Documents
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className="w-full sm:w-auto px-6 py-3.5 font-bold text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80 rounded-xl transition-all duration-300 shadow-xs transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Fill Manually
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column Group (Takes up 2/3 width on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats Cards Row (Changed to 2 columns to fit evenly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gross Income Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Gross Income
                </p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  ₹{animatedIncome.toLocaleString()}
                </h3>
              </div>
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Live Sync
              </div>
            </div>

            {/* Meaningful Metrics Replacement */}
            <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-xs">
              <div className="flex flex-col space-y-0.5">
                <span className="text-slate-500">Avg. Monthly Gross</span>
                <span className="text-slate-300 font-bold font-mono">
                  ₹{Math.round(animatedIncome / 12).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5 text-right">
                <span className="text-slate-500">Effective Tax Rate</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {animatedIncome > 0
                    ? ((animatedTax / animatedIncome) * 100).toFixed(2)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Est. Net Tax Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Est. Net Tax
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  ₹{animatedTax.toLocaleString()}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                {betterRegime} REGIME
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
              You save{" "}
              <strong className="text-emerald-400">
                ₹{taxDiff.toLocaleString()}
              </strong>{" "}
              by opting for the {betterRegime} Regime.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-900/60 flex justify-between text-[11px] text-slate-500">
              <span>Taxable Deductions Claimed:</span>
              <span className="text-slate-300 font-bold">
                ₹{animatedDeductions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Optimizer Sliders */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Tax Optimizer Simulator
              </h3>
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
                onClick={loadTaxProfile}
                className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Deduction 80C range input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  Section 80C (PPF, ELSS, Insurance)
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{deduction80C.toLocaleString()}{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / max ₹1.5L
                  </span>
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
                <span className="text-slate-300">
                  Section 80D (Health Insurance Premium)
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{deduction80D.toLocaleString()}{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / max ₹50K
                  </span>
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
                <span className="text-slate-300">
                  Section 80CCD(1B) NPS Retirement Benefit
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{deductionNps.toLocaleString()}{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / max ₹50K
                  </span>
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
                <span className="text-slate-300">
                  House Rent Allowance (HRA) Exemption
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{deductionHra.toLocaleString()}{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / max ₹2.0L
                  </span>
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
          <div
            className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
              betterRegime === "OLD"
                ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]"
                : "bg-slate-900/20 border border-slate-800/80"
            }`}
          >
            {betterRegime === "OLD" && (
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                AI Recommended
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Old Regime
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Allows high deductions under Section 80C/80D/HRA
              </p>

              <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Deduction:</span>
                  <span className="text-slate-200">₹50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Section 80C:</span>
                  <span className="text-slate-200">
                    ₹{Math.min(150000, deduction80C).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Health / NPS:</span>
                  <span className="text-slate-200">
                    ₹
                    {(
                      Math.min(50000, deduction80D) +
                      Math.min(50000, deductionNps)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA Exemption:</span>
                  <span className="text-slate-200">
                    ₹{Math.min(200000, deductionHra).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
                  <span>Taxable Income:</span>
                  <span>
                    ₹
                    {Math.max(
                      0,
                      grossIncome -
                        Math.min(150000, deduction80C) -
                        Math.min(50000, deduction80D) -
                        Math.min(50000, deductionNps) -
                        Math.min(200000, deductionHra) -
                        50000,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Estimated Tax
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  ₹{taxOld.toLocaleString()}
                </p>
              </div>
              {betterRegime === "OLD" ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold font-mono">
                  Saves ₹0
                </span>
              )}
            </div>
          </div>

          {/* New Regime Card */}
          <div
            className={`p-6 rounded-3xl backdrop-blur-xl relative transition-all duration-300 flex flex-col justify-between ${
              betterRegime === "NEW"
                ? "border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(52,211,153,0.05)]"
                : "bg-slate-900/20 border border-slate-800/80"
            }`}
          >
            {betterRegime === "NEW" && (
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                AI Recommended
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                New Regime
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Higher standard deduction, lower slab tax rates
              </p>

              <div className="mt-6 space-y-2 text-xs border-b border-slate-900/60 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Deduction:</span>
                  <span className="text-slate-200">₹75,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Section 80C Deductions:
                  </span>
                  <span className="text-slate-500">Not Allowed (₹0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Section 80D / NPS / HRA:
                  </span>
                  <span className="text-slate-500">Not Allowed (₹0)</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-900/20 text-slate-300">
                  <span>Taxable Income:</span>
                  <span>
                    ₹{Math.max(0, grossIncome - 75000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Estimated Tax
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  ₹{taxNew.toLocaleString()}
                </p>
              </div>
              {betterRegime === "NEW" ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold font-mono">
                  Saves ₹{taxDiff.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Takes up 1/3 width, seamlessly fills the top right) */}
      <div className="space-y-6">
        {/* AI Recommendations Redirect Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-center w-full mb-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>AI OPTIMIZER HUB</span>
            </div>
            <span className="text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="relative w-24 h-24 my-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/20 via-green-500/5 to-transparent blur-md scale-100 opacity-60" />
            <div className="w-18 h-18 rounded-full border border-emerald-500/30 flex items-center justify-center bg-slate-950/90 relative animate-float shadow-[0_0_20px_rgba(52,211,153,0.15)]">
              <BrainCircuit className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-6 px-2">
            Optimize your tax exemptions, scan for missing papers, explore
            government plans, and compare tax regimes.
          </p>

          <button
            onClick={() => setActiveTab("recommendations")}
            className="w-full py-3 mt-5 px-4 font-bold text-xs bg-linear-to-tr from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4.5 h-4.5 text-slate-950" />
            View AI Recommendations
          </button>
        </div>

        {/* AI Audit Risk Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 mb-4">
            <AlertTriangle className="w-4 h-4 text-emerald-400" />
            <span>AI TAX COMPLIANCE AUDIT SCORE</span>
          </div>

          {/* SVG Gauge */}
          <div className="relative w-full max-w-45 mx-auto py-2">
            <svg viewBox="0 0 100 50" className="w-full h-auto">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#1f2937"
                strokeWidth="8"
                strokeLinecap="round"
              />
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
                <linearGradient
                  id="gauge-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="4" fill={gaugeColor} />
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
              <span className="text-2xl font-black text-white">
                {auditRiskScore}
              </span>
              <span className="text-xs text-slate-500 font-bold">/100</span>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Verified
            </h4>

            <div className="space-y-2">
              {compliance.verifiedDocuments.length === 0 ? (
                <div className="text-slate-500 text-sm">None</div>
              ) : (
                compliance.verifiedDocuments.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2 text-sm text-emerald-400"
                  >
                    ✓ {doc}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Missing
            </h4>

            <div className="space-y-2">
              {compliance.missingDocuments.length === 0 ? (
                <div className="text-emerald-400 text-sm">None 🎉</div>
              ) : (
                compliance.missingDocuments.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2 text-sm text-orange-400"
                  >
                    ⚠ {doc}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
              AI Recommendations
            </h4>

            <div className="space-y-2">
              {compliance.recommendations.map((rec) => (
                <div key={rec} className="text-sm text-slate-300">
                  • {rec}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`mt-5 rounded-2xl border p-4 text-center ${
              compliance.color === "emerald"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : compliance.color === "green"
                  ? "border-green-500/30 bg-green-500/5"
                  : compliance.color === "yellow"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : compliance.color === "orange"
                      ? "border-orange-500/30 bg-orange-500/5"
                      : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <p className="text-lg font-bold text-white">{compliance.level}</p>

            <p className="mt-2 text-xs text-slate-400">
              {compliance.recommendations.length === 0
                ? "Your tax profile looks complete and well supported."
                : `${compliance.recommendations.length} recommendation(s) available to improve your compliance profile.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
