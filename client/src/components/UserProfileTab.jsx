import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Phone,
  Send,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  LogOut, // Added LogOut icon
} from "lucide-react";
import api from "../services/api.js";

// PAN regex: 5 uppercase letters, 4 digits, 1 uppercase letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function UserProfileTab({
  profileName, setProfileName,
  profileEmail, setProfileEmail,
  profilePhone, setProfilePhone,
  profilePan, setProfilePan,
  taxpayerCategory, setTaxpayerCategory,
  employmentType, setEmploymentType,
  address, setAddress,
  taxDiff, customFiles
}) {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // ── Phone Verification State ──
  const [phoneVerified, setPhoneVerified] = useState(false);

  // ── PAN Validation State ──
  const [panTouched, setPanTouched] = useState(false);
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

  // Reset verification when phone number changes
  useEffect(() => {
    setPhoneVerified(false);
  }, [profilePhone]);

  const loadProfile = async () => {
    try {
        const response = await api.get("/users/profile");
        const user = response.data.user;
        setProfileName(user.name || "");
        setProfileEmail(user.email || "");
        setProfilePhone(
            user.profile?.phoneNumber || ""
        );
        setProfilePan(
            user.profile?.panNumber || ""
        );
        setAddress(
            user.profile?.address || ""
        );
        const taxpayerReverseMap = {
            individual: "Individual",
            huf: "HUF(Hindu Undivided Family)",
            company: "Company",
            firm: "Partnership Firm",
            local_authority: "Local Authorities",
            ajp: "AJP(Artificial Juridical Persons)"
        };
        const employmentReverseMap = {
            salaried: "Salaried / Employed",
            "self-employed":
                "Self-Employed Professional",
            business:
                "Business Owner / Merchant",
            retired:
                "Retired Pensioner",
            student:
                "Student"
        };
        setTaxpayerCategory(
            taxpayerReverseMap[
                user.profile?.taxpayerClassification
            ] || "Individual"
        );
        setEmploymentType(
            employmentReverseMap[
                user.profile?.employmentType
            ] || "Salaried / Employed"
        );

    } catch (error) {

        console.error(
            "Failed to load profile:",
            error
        );
    }
  };

  // Format phone for API: strip spaces
  const cleanPhone = (phone) => phone.replace(/\s+/g, "");

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
          const res = await api.post(
            "/verify/verify-msg91-token",
            {
              accessToken: data.message,
            }
          );

          if (res.data.success) {
            setPhoneVerified(true);
          }
        } catch (err) {
          console.error(err);
        }
      },

      failure: (error) => {
        console.log("FULL MSG91 ERROR:", error);
      },
    });
  };

  // Default fallback logout function if prop is not passed
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ── Profile Save ──
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
        setIsSavingProfile(true);
        const taxpayerMap = {
          "Individual": "individual",
          "HUF(Hindu Undivided Family)": "huf",
          "Company": "company",
          "Partnership Firm": "firm",
          "Local Authorities": "local_authority",
          "AJP(Artificial Juridical Persons)": "ajp"
        };
        const employmentMap = {
          "Salaried / Employed": "salaried",
          "Self-Employed Professional": "self-employed",
          "Business Owner / Merchant": "business",
          "Retired Pensioner": "retired"
        };
        await api.put("/users/profile", {
            name: profileName,
            email: profileEmail,
            phoneNumber: profilePhone,
            panNumber: profilePan,
            taxpayerClassification: taxpayerMap[taxpayerCategory],
            employmentType: employmentMap[employmentType],
            address
        });

        setShowSaveToast(true);

        setTimeout(() => {
            setShowSaveToast(false);
        }, 3000);

    } catch (error) {
        console.error(error);
        alert(
            error.response?.data?.message ||
            "Failed to save profile"
        );
    } finally {
        setIsSavingProfile(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-bubble-fade-in text-xs">
      
      {/* ═══════ Profile Overview Card ═══════ */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden h-fit">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
        
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 my-4 text-3xl font-extrabold shadow-md">
          {profileName ? profileName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "MP"}
        </div>
        
        <h3 className="text-xl font-bold text-white">{profileName}</h3>
        <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">Pro AI Tax Filer</p>
        
        <div className="w-full space-y-3 pt-6 mt-6 border-t border-slate-800/80 text-left text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Assessment Year:</span>
            <span className="text-slate-200 font-bold">AY 2026-27</span>
          </div>

          {/* PAN Status — dynamic */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">PAN ID Status:</span>
            {isPanValid ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Valid
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 uppercase flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Invalid
              </span>
            )}
          </div>

          {/* Phone Status — dynamic */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Phone Status:</span>
            {phoneVerified ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-700/40 text-slate-400 text-[9px] font-bold border border-slate-700/40 uppercase flex items-center gap-1">
                <Phone className="w-3 h-3" /> Unverified
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Estimated Tax Savings:</span>
            <span className="text-emerald-400 font-bold font-mono">₹{taxDiff.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Vault Uploads:</span>
            <span className="text-slate-200 font-bold font-mono">{4 + customFiles.length} files</span>
          </div>
        </div>

        {/* ── Logout Button ── */}
        <button
          type="button"
          onClick={handleLogoutClick}
          className="w-full mt-6 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ═══════ Profile Edit Form ═══════ */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Basic Taxpayer Info</h3>
          <p className="text-xs text-slate-400">Fill in your information. These details configure your automated OCR deductions calculations.</p>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
              <input 
                type="text" 
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 block mb-1 font-bold">Email Address</label>
              <input 
                type="email" 
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* ═══════ Phone Number + Verification ═══════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 block mb-1 font-bold  gap-2">
                Phone Number
                {phoneVerified && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                    <Check className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="98765 43210"
                  className={`flex-1 bg-slate-950 border text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors ${
                    phoneVerified
                      ? "border-emerald-500/40 hover:border-emerald-500/60"
                      : "border-slate-850 focus:border-emerald-500"
                  }`}
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handlePhoneVerification}
                    disabled={!profilePhone.trim()}
                    className="shrink-0 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                )}
              </div>
            </div>

            {/* ═══════ PAN Number + Regex Validation ═══════ */}
            <div className="space-y-1.5">
              <label className="text-slate-300 block mb-1 font-bold mb gap-2">
                Permanent Account Number (PAN)
                {panTouched && profilePan.length > 0 && (
                  isPanValid ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                      <Check className="w-2.5 h-2.5" /> Valid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[9px] font-bold border border-red-500/20">
                      <X className="w-2.5 h-2.5" /> Invalid
                    </span>
                  )
                )}
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
                className={`w-full bg-slate-950 border text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none font-mono transition-colors ${
                  panTouched && profilePan.length > 0
                    ? isPanValid
                      ? "border-emerald-500/40 hover:border-emerald-500/60 focus:border-emerald-500"
                      : "border-red-500/40 hover:border-red-500/60 focus:border-red-500"
                    : "border-slate-850 focus:border-emerald-500"
                }`}
              />
              {panTouched && profilePan.length > 0 && !isPanValid && (
                <p className="text-red-400/80 text-[10px] mt-1 flex items-center gap-1 animate-bubble-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
                </p>
              )}
            </div>
          </div>

          {/* Taxpayer Category + Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 block mb-1 font-bold">Taxpayer Category</label>
              <select 
                value={taxpayerCategory}
                onChange={(e) => setTaxpayerCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none"
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
              <label className="text-slate-300 block mb-1 font-bold">Employment Type</label>
              <select 
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option>Salaried / Employed</option>
                <option>Self-Employed Professional</option>
                <option>Business Owner / Merchant</option>
                <option>Retired Pensioner</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-slate-300 block mb-1 font-bold">Filing Address</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none resize-none"
            />
          </div>

          {/* Submit / Toast */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-800/60">
            {showSaveToast ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 bg-emerald-500/10 p-0.5 border border-emerald-500/20 rounded-full" />
                <span>Profile Saved successfully!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSavingProfile}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? "Saving Profile..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}