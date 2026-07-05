import React, { useState, useRef } from "react";
import { Lock, UploadCloud, Activity, Check, FileCheck2, FileText, Trash2 } from "lucide-react";
import api from "../services/api.js";

export default function SecureVaultTab({
  setGrossIncome,
  setDeduction80C,
  setDeduction80D,
  setDeductionNps,
  setDeductionHra,
  customFiles,
  setCustomFiles,
  setActiveTab
}) {
  const [vaultUploadState, setVaultUploadState] = useState("idle");
  const [vaultUploadedFile, setVaultUploadedFile] = useState(null);
  const [vaultScanProgress, setVaultScanProgress] = useState(0);
  const [vaultScanStep, setVaultScanStep] = useState(0);
  const fileInputRef = useRef(null);

  const triggerVaultUploadSimulation = (profile) => {
    setVaultUploadState("scanning");
    setVaultScanProgress(0);
    setVaultScanStep(0);
    setVaultUploadedFile(profile.name);

    const stepInterval = setInterval(() => {
      setVaultScanStep((prev) => (prev >= 3 ? 3 : prev + 1));
    }, 850);

    const progressInterval = setInterval(() => {
      setVaultScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    setTimeout(() => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setVaultUploadState("complete");
      setGrossIncome(profile.gross);
      setDeduction80C(profile.c80);
      setDeduction80D(profile.d80);
      setDeductionNps(profile.nps);
      setDeductionHra(profile.hra);

      const newFile = {
        name: profile.name,
        type: profile.name.includes("Form_16") ? "Form 16" : profile.name.includes("Salary") ? "Salary Slip" : "Investment Proof",
        date: new Date().toLocaleDateString(),
        size: profile.size,
        status: "Parsed & Active"
      };
      setCustomFiles((prev) => [newFile, ...prev]);
    }, 3400);
  };

  const handleVaultFileSelect = async(e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData =
    new FormData();

    formData.append(
      "document",
      file
    );
    const response =
    await api.post(
    "/documents/parse",
    formData,
    {
      headers:{
        "Content-Type":
        "multipart/form-data"
      }
    }
    );

    console.log(response.data);
    const extracted =
response.data.text?.taxProfile;

if (!extracted) {
   console.error(
      "No tax profile returned"
   );
   return;
}
    
    if(extracted.grossIncome!=null){
   setGrossIncome(extracted.grossIncome);
}

if(extracted.deduction80C!=null){
   setDeduction80C(extracted.deduction80C);
}

if(extracted.deduction80D!=null){
   setDeduction80D(extracted.deduction80D);
}

if(extracted.npsContribution!=null){
   setDeductionNps(extracted.npsContribution);
}

if(extracted.hraExemption!=null){
   setDeductionHra(extracted.hraExemption);
}


    const mockProfile = {
      name: file.name,
      gross: Math.floor(Math.random() * 1200000) + 800000,
      c80: Math.floor(Math.random() * 50000) + 100000,
      d80: Math.floor(Math.random() * 20000) + 15000,
      nps: Math.floor(Math.random() * 30000) + 20000,
      hra: Math.floor(Math.random() * 50000) + 50000,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    triggerVaultUploadSimulation(mockProfile);
  };

  return (
    <div className="space-y-6 animate-bubble-fade-in text-xs">
      
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

      {/* Upload area with file trigger */}
      <div className="relative overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleVaultFileSelect}
          className="hidden" 
        />

        {vaultUploadState === "idle" && (
          <div 
            onClick={() => fileInputRef.current.click()}
            className="border border-dashed border-slate-800 hover:border-emerald-500/20 rounded-3xl p-10 text-center bg-slate-900/30 backdrop-blur-md transition-colors group cursor-pointer"
          >
            <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-3 group-hover:text-emerald-400 transition-colors duration-300" />
            <h3 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-white">Upload new documents to extract</h3>
            <h5 className="text-xs text-slate-500 max-w-sm mx-auto mb-4">Click to select files. Upload Form 16, rent receipts, health premium bills, or investment statements.</h5>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 border border-emerald-500/20 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">Select File</span>
          </div>
        )}

        {vaultUploadState === "scanning" && (
          <div className="border border-emerald-500/20 bg-slate-950/90 rounded-3xl p-8 relative overflow-hidden h-56 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-laser-scan pointer-events-none" />

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-xs font-bold text-slate-200">Scanning File: {vaultUploadedFile}...</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{Math.round(vaultScanProgress)}%</span>
            </div>

            <div className="grid grid-cols-1 gap-2 my-2 text-left">
              {[
                "Uploading to Encrypted Vault Portal",
                "Extracting Key Value Pairs & Deductions",
                "Masking PII Sensitive Fields",
                "Injecting Values to Tax Sliders"
              ].map((step, idx) => (
                <div key={idx} className="flex items-center text-[10px] font-semibold space-x-2">
                  {vaultScanStep > idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : vaultScanStep === idx ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-emerald-400/40 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /></span>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-800" />
                  )}
                  <span className={vaultScanStep >= idx ? "text-slate-300 font-bold" : "text-slate-600"}>{step}</span>
                </div>
              ))}
            </div>

            <div className="w-full bg-slate-900 rounded-full h-1">
              <div 
                className="bg-emerald-400 h-1 rounded-full transition-all duration-200" 
                style={{ width: `${vaultScanProgress}%`, boxShadow: "0 0 8px rgba(52,211,153,0.5)" }} 
              />
            </div>
          </div>
        )}

        {vaultUploadState === "complete" && (
          <div className="border border-emerald-500/30 bg-emerald-950/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-widest">Document Parsed and Saved</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                <strong>{vaultUploadedFile}</strong> has been encrypted, saved to vault, and scanned for tax optimization.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setVaultUploadState("idle");
                  setActiveTab("command-center");
                }}
                className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                View in Command Center
              </button>
              <button
                onClick={() => setVaultUploadState("idle")}
                className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Index Table */}
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
                    <button 
                      onClick={() => setCustomFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
  );
}
