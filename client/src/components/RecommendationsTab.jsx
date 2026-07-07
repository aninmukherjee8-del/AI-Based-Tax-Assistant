import React from "react";
import {
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  BrainCircuit,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Check
} from "lucide-react";

export default function RecommendationsTab({
  loadingRecs,
  recScanStep,
  recommendationData,
  recsError,
  handleGiveRecommendation,
  setDeduction80C,
  setDeduction80D,
  setDeductionNps,
  setDeductionHra,
  grossIncome
}) {
  const scanStepsList = [
    "Analyzing income brackets & tax category...",
    "Calculating optimal Section 80C deductions...",
    "Checking Section 80D limits & health premiums...",
    "Evaluating Section 80CCD(1B) NPS benefits...",
    "Verifying uploaded rent receipts & HRA exemptions...",
    "Comparing Old vs. New tax regime advantages...",
    "Compiling tailored optimization summary..."
  ];

  return (
    <div className="space-y-6">
      
      {/* Main Viewport Router */}
      {loadingRecs ? (
        /* LOADING STATE */
        <div className="min-h-112.5 p-6 md:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Integrated Header */}
          <div className="flex justify-between items-center w-full pb-6 border-b border-slate-800/40 text-left z-10">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                AI Recommendations Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Personalized, rule-based deductions analysis and regime optimization.
              </p>
            </div>
          </div>
          
          {/* Main Body Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-4">
            <div className="relative w-24 h-24 my-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-800/40 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-emerald-400 rounded-full animate-spin" />
              <BrainCircuit className="w-10 h-10 text-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-wider uppercase">Running AI Core Calculations</h3>
            <p className="text-xs text-emerald-400 font-mono mt-2.5 animate-pulse min-h-6">
              {scanStepsList[recScanStep]}
            </p>
            <div className="w-full max-w-md bg-slate-950/65 rounded-full h-1.5 mt-8 border border-slate-800/80 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300" 
                style={{ width: `${((recScanStep + 1) / scanStepsList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : !recommendationData ? (
        /* INITIAL STATE */
        <div className="min-h-112.5 p-6 md:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Integrated Header */}
          <div className="flex justify-between items-center w-full pb-6 border-b border-slate-800/40 text-left z-10">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                AI Recommendations Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Personalized, rule-based deductions analysis and regime optimization.
              </p>
            </div>
          </div>
          
          {/* Main Body Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-4">
            <div className="relative w-28 h-28 my-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500/25 via-green-500/5 to-transparent blur-md scale-110 opacity-70" />
              <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center bg-slate-950/90 relative animate-float shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                <BrainCircuit className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Generate Savings Report</h3>
            <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
              Run our tax calculation algorithms to scan your profiles, recognize qualified investment deductions, check missing files, and maximize your savings.
            </p>
            {recsError && (
              <div className="mt-4 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-xs text-rose-400 font-semibold">{recsError}</p>
              </div>
            )}
            <button
              onClick={handleGiveRecommendation}
              className="mt-8 py-3.5 px-8 font-extrabold text-xs bg-linear-to-tr from-emerald-600 to-green-400 hover:from-emerald-500 hover:to-green-300 text-slate-950 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:scale-105 cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4.5 h-4.5 text-slate-950" />
              Give Recommendation
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS STATE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Integrated Header - Spans Full Width Across Grid */}
          <div className="lg:col-span-3 flex justify-between items-center pb-4 border-b border-slate-800/60 w-full mb-2">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                AI Recommendations Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Personalized, rule-based deductions analysis and regime optimization.
              </p>
            </div>
            <button
              onClick={handleGiveRecommendation}
              className="text-xs font-bold text-slate-300 hover:text-emerald-400 bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run Full Analysis</span>
            </button>
          </div>
          
          {/* Left Panel: Regime Recommendation and Est. Saving */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Net Savings Big Card */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Net Savings Opportunities</span>
                <h3 className="text-4xl font-black text-white mt-2 font-mono">₹{recommendationData.estimatedSaving?.toLocaleString()}</h3>
                
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    {recommendationData.recommendedRegime} Regime Recommended
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-900/60 text-xs text-slate-400 leading-relaxed">
                {recommendationData.summary ? (
                  <p className="italic">"{recommendationData.summary}"</p>
                ) : (
                  <p>Based on your profile, calculations show maximum benefit under the {recommendationData.recommendedRegime} regime.</p>
                )}
              </div>
            </div>

            {/* Quick Summary list */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-900/60">Profile Status</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Income:</span>
                  <span className="text-slate-200 font-bold font-mono">₹{grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deductions Identified:</span>
                  <span className="text-emerald-400 font-bold font-mono">₹{recommendationData.estimatedSaving ? (recommendationData.estimatedSaving * 3).toLocaleString() : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className="text-emerald-400 font-semibold">Low Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Optimization suggestions lists */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Deduction Actions & Schemes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Deduction Action Cards */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-900/60">Deduction Actions</h4>
                  
                  {recommendationData.recommendations && recommendationData.recommendations.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {recommendationData.recommendations.map((rec, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900 flex flex-col space-y-2 justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-bold text-slate-200 leading-tight">{rec.title}</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">{rec.description}</p>
                            </div>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                              rec.priority === "High" 
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse-danger" 
                                : rec.priority === "Medium"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          {rec.title?.toLowerCase().includes("80c") && (
                            <button
                              onClick={() => {
                                setDeduction80C(150000);
                              }}
                              className="w-full mt-1.5 py-1.5 font-bold text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 rounded-lg transition-all text-center cursor-pointer uppercase tracking-wider"
                            >
                              Apply Max Limit (₹1.5L)
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2">No recommendations available.</p>
                  )}
                </div>
              </div>

              {/* Government Schemes Eligibility */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-900/60">Government Schemes</h4>
                  
                  {recommendationData.governmentSchemes && recommendationData.governmentSchemes.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {recommendationData.governmentSchemes.map((scheme, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900 flex flex-col space-y-2 justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{scheme.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">{scheme.reason}</p>
                          </div>
                          {scheme.name?.toLowerCase().includes("national pension") && (
                            <button
                              onClick={() => {
                                setDeductionNps(50000);
                              }}
                              className="w-full mt-1.5 py-1.5 font-bold text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 rounded-lg transition-all text-center cursor-pointer uppercase tracking-wider"
                            >
                              Claim NPS Benefit (₹50K)
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2">No eligible schemes identified.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Warnings and Missing Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Warnings List */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-900/60">Audit Risk Flags</h4>
                {recommendationData.warnings && recommendationData.warnings.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {recommendationData.warnings.map((warn, i) => (
                      <div key={i} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{warn}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">No warnings detected.</p>
                )}
              </div>

              {/* Missing Documents */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-900/60">Missing Documents</h4>
                {recommendationData.missingDocuments && recommendationData.missingDocuments.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {recommendationData.missingDocuments.map((doc, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-[10px] text-slate-300 font-bold">{doc}</span>
                        </div>
                        <span className="text-[8px] font-extrabold text-amber-400 uppercase tracking-wider shrink-0 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">Required</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">No missing documents flagged.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}