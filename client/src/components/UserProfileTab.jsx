import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Phone,
  Send,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Wallet,
  FileText
} from "lucide-react";
import api from "../services/api.js";
import TaxProfileEditForm from "./TaxProfileEditForm.jsx";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function UserProfileTab({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePhone,
  setProfilePhone,
  profilePan,
  setProfilePan,
  taxpayerCategory,
  setTaxpayerCategory,
  employmentType,
  setEmploymentType,
  address,
  setAddress,
  taxDiff,
  customFiles,
}) {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [panTouched, setPanTouched] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);

  const isPanValid = PAN_REGEX.test(profilePan);

  useEffect(() => {
    loadProfile();
  }, []);

  // MSG91 Widget Script Injection
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setPhoneVerified(false);
  }, [profilePhone]);

  const loadProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      const user = response.data.user;
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
      setProfilePhone(user.profile?.phoneNumber || "");
      setProfilePan(user.profile?.panNumber || "");
      setAddress(user.profile?.address || "");
      
      const taxpayerReverseMap = {
        individual: "Individual",
        huf: "HUF(Hindu Undivided Family)",
        company: "Company",
        firm: "Partnership Firm",
        local_authority: "Local Authorities",
        ajp: "AJP(Artificial Juridical Persons)",
      };
      
      const employmentReverseMap = {
        salaried: "Salaried / Employed",
        "self-employed": "Self-Employed Professional",
        business: "Business Owner / Merchant",
        retired: "Retired Pensioner",
        student: "Student",
      };
      
      setTaxpayerCategory(taxpayerReverseMap[user.profile?.taxpayerClassification] || "Individual");
      setEmploymentType(employmentReverseMap[user.profile?.employmentType] || "Salaried / Employed");
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handlePhoneVerification = () => {
    if (!profilePhone) return;
    if (!window.initSendOTP) {
      alert("MSG91 widget not loaded");
      return;
    }
    const phone = profilePhone.replace(/\D/g, "");
    window.initSendOTP({
      widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
      tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
      identifier: `+91${phone}`,
      success: async (data) => {
        try {
          const res = await api.post("/verify/verify-msg91-token", { accessToken: data.message });
          if (res.data.success) setPhoneVerified(true);
        } catch (err) {
          console.error(err);
        }
      },
      failure: (error) => console.log("FULL MSG91 ERROR:", error),
    });
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const taxpayerMap = {
        Individual: "individual",
        "HUF(Hindu Undivided Family)": "huf",
        Company: "company",
        "Partnership Firm": "firm",
        "Local Authorities": "local_authority",
        "AJP(Artificial Juridical Persons)": "ajp",
      };
      const employmentMap = {
        "Salaried / Employed": "salaried",
        "Self-Employed Professional": "self-employed",
        "Business Owner / Merchant": "business",
        "Retired Pensioner": "retired",
      };
      await api.put("/users/profile", {
        name: profileName,
        email: profileEmail,
        phoneNumber: profilePhone,
        panNumber: profilePan,
        taxpayerClassification: taxpayerMap[taxpayerCategory],
        employmentType: employmentMap[employmentType],
        address,
      });

      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    // Reduced max-width from 7xl to 6xl for tighter proportions
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-bubble-fade-in text-xs">
      
      {/* ═══════ TOP BANNER ═══════ */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden flex flex-col xl:flex-row items-center xl:justify-between gap-6">
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-extrabold shadow-md shrink-0">
            {profileName ? profileName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "MP"}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{profileName}</h3>
            <p className="text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-md border border-emerald-500/20">
              Verified Taypayer
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center xl:justify-end gap-3 md:gap-6 w-full xl:w-auto">
          <div className="flex flex-col gap-2 bg-slate-950/50 p-3 md:px-4 md:py-3 rounded-2xl border border-slate-800/50 min-w-35">
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400">PAN</span>
              {isPanValid ? (
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Valid</span>
              ) : (
                <span className="text-amber-400 text-[10px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Invalid</span>
              )}
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400">Phone</span>
              {phoneVerified ? (
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
              ) : (
                <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1"><Phone className="w-3 h-3" /> Pending</span>
              )}
            </div>
          </div>
{/* 
          <div className="flex flex-col gap-2 bg-slate-950/50 p-3 md:px-4 md:py-3 rounded-2xl border border-slate-800/50 min-w-35">
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Est. Savings</span>
              <span className="text-emerald-400 font-bold font-mono">₹{taxDiff.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Vault Files</span>
              <span className="text-slate-200 font-bold font-mono">{4 + customFiles.length}</span>
            </div>
          </div> */}

          <button
            type="button"
            onClick={handleLogoutClick}
            className="h-full px-5 py-3 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4 md:w-3.5 md:h-3.5" />
            <span className="text-[10px] md:text-xs">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ═══════ BASIC INFO FORM ═══════ */}
      <div className="w-full p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Basic Taxpayer Info</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure your core details to calibrate automated OCR deductions.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold text-xs whitespace-nowrap shadow-inner">
            Assessment Year: <span className="text-emerald-400">2026-27</span>
          </span>
        </div>

        <form onSubmit={handleProfileSave} className="text-sm md:text-xs flex flex-col gap-5">
          
          {/* Changed to 3-column grid for shorter input widths */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            
            <div className="space-y-1.5">
              <label className="text-slate-300 block font-bold ml-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-white rounded-xl px-4 py-3 md:py-2.5 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 block font-bold ml-1">Email Address</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-white rounded-xl px-4 py-3 md:py-2.5 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 flex items-center font-bold ml-1 gap-2">
                Phone Number
                {phoneVerified && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="98765 43210"
                  className={`flex-1 min-w-0 bg-slate-950 border text-white rounded-xl px-4 py-3 md:py-2.5 focus:outline-none transition-all shadow-sm ${
                    phoneVerified ? "border-emerald-500/40 focus:border-emerald-500/60" : "border-slate-850 focus:border-emerald-500"
                  }`}
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handlePhoneVerification}
                    disabled={!profilePhone.trim()}
                    className="shrink-0 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 flex items-center font-bold ml-1 gap-2">
                PAN Number
                {panTouched && profilePan.length > 0 && (isPanValid ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                    <Check className="w-3 h-3" /> Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
                    <X className="w-3 h-3" /> Invalid
                  </span>
                ))}
              </label>
              <input
                type="text"
                value={profilePan}
                onChange={(e) => {
                  setProfilePan(e.target.value.toUpperCase());
                  if (!panTouched) setPanTouched(true);
                }}
                required
                maxLength={10}
                placeholder="ABCDE1234F"
                className={`w-full bg-slate-950 border text-white rounded-xl px-4 py-3 md:py-2.5 focus:outline-none font-mono transition-all shadow-sm ${
                  panTouched && profilePan.length > 0
                    ? isPanValid ? "border-emerald-500/40 focus:border-emerald-500" : "border-red-500/40 focus:border-red-500"
                    : "border-slate-850 focus:border-emerald-500"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 block font-bold ml-1">Taxpayer Category</label>
              <select
                value={taxpayerCategory}
                onChange={(e) => setTaxpayerCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 md:py-2.5 focus:outline-none cursor-pointer shadow-sm"
              >
                <option>Individual</option>
                <option>HUF(Hindu Undivided Family)</option>
                <option>Company</option>
                <option>Partnership Firm</option>
                <option>Local Authorities</option>
                <option>AJP(Artificial Juridical Persons)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 block font-bold ml-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 md:py-2.5 focus:outline-none cursor-pointer shadow-sm"
              >
                <option>Salaried / Employed</option>
                <option>Self-Employed Professional</option>
                <option>Business Owner / Merchant</option>
                <option>Retired Pensioner</option>
              </select>
            </div>

          </div>

          {/* Full width address at the bottom */}
          <div className="space-y-1.5">
            <label className="text-slate-300 block font-bold ml-1">Filing Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-white rounded-xl px-4 py-3 focus:outline-none resize-none transition-all shadow-sm"
            />
          </div>

          <div className="pt-6 mt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-end gap-4">
            {showSaveToast && (
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-2 animate-in fade-in zoom-in-95">
                <Check className="w-5 h-5 bg-emerald-500/10 rounded-full p-0.5 border border-emerald-500/20 stroke-[2.5]" />
                Profile saved!
              </span>
            )}
            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 text-sm"
            >
              {isSavingProfile ? "Saving..." : "Save Basic Info"}
            </button>
          </div>
        </form>
      </div>

      {/* ═══════ GLOBAL TAX FORM TOGGLE ═══════ */}
      <button
        type="button"
        onClick={() => setShowTaxForm(!showTaxForm)}
        className="w-full px-6 py-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all font-bold flex justify-center items-center gap-2 text-sm shadow-md cursor-pointer"
      >
        {showTaxForm ? "Close Tax Information Form" : "Manually Edit Complete Tax Profile Data"}
      </button>

      {/* ═══════ EXPANDABLE TAX FORM ═══════ */}
      {showTaxForm && (
        <div className="w-full rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-300 overflow-hidden shadow-xl">
          <TaxProfileEditForm />
        </div>
      )}

    </div>
  );
}