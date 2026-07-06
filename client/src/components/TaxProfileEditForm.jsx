import React, { useState, useEffect } from "react";
import {
  Check,
  Landmark,
  Percent,
  DollarSign,
  ShieldAlert,
  Wallet,
  PiggyBank,
  Receipt,
} from "lucide-react";

import api from "../services/api";

export default function TaxProfileForm() {
  const [showTaxForm, setShowTaxForm] = useState(true);
  const [activeTab, setActiveTab] = useState("income");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const placeholders = {
    income: {
      salary: "e.g. 1200000",
      business: "e.g. 500000",
      capitalGains: "e.g. 150000",
      rentalIncome: "e.g. 240000",
      interestIncome: "e.g. 18000",
      otherIncome: "e.g. 50000",
    },

    deductions: {
      section80C: "Maximum 150000",
      section80D: "e.g. 25000",
      section80E: "Education loan interest",
      section80G: "Donation amount",
      homeLoanInterest: "e.g. 200000",
      nps: "e.g. 50000",
      other: "Other deductions",
    },

    investments: {
      ppf: "PPF investment",
      elss: "ELSS investment",
      ulip: "ULIP investment",
      nps: "NPS investment",
      fd5Year: "5-Year Tax Saver FD",
    },

    expenses: {
      rent: "Annual rent paid",
      education: "Education expenses",
      medical: "Medical expenses",
      insurance: "Insurance premium",
    },

    taxes: {
      tds: "Total TDS deducted",
      advanceTax: "Advance tax paid",
      selfAssessmentTax: "Self-assessment tax",
    },
  };
  // Local state modeling your Mongoose Schema Structure
  const [formData, setFormData] = useState({
    financialYear: "2026-27",

    income: {
      salary: 0,
      business: 0,
      capitalGains: 0,
      rentalIncome: 0,
      interestIncome: 0,
      otherIncome: 0,
    },

    deductions: {
      section80C: 0,
      section80D: 0,
      section80E: 0,
      section80G: 0,
      homeLoanInterest: 0,
      nps: 0,
      other: 0,
    },

    taxes: {
      tds: 0,
      advanceTax: 0,
      selfAssessmentTax: 0,
    },

    investments: {
      ppf: 0,
      elss: 0,
      ulip: 0,
      nps: 0,
      fd5Year: 0,
    },

    expenses: {
      rent: 0,
      education: 0,
      medical: 0,
      insurance: 0,
    },
  });

  // Helper handler for deep nested updates
  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSavingProfile(true);

      await api.put("/tax-profile", formData);
      await loadProfile();
      setShowSaveToast(true);

      setTimeout(() => {
        setShowSaveToast(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/tax-profile");
      if (res.data.profile) {
        setFormData(res.data.profile);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const tabs = [
    { id: "income", label: "Income Source", icon: DollarSign },
    { id: "deductions", label: "Deductions", icon: Percent },
    { id: "investments", label: "Investments", icon: PiggyBank },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "taxes", label: "Taxes Paid", icon: Wallet },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 text-slate-100 p-6 rounded-2xl border border-slate-900 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Metadata Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-400" /> Tax Profile
              Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your financial records and declarations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Financial Year
            </label>
            <input
              type="text"
              value={formData.financialYear}
              readOnly
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-300 cursor-not-allowed opacity-80 focus:outline-none"
            />
          </div>
        </div>

        {/* Conditional Layout Box */}
        <div className="space-y-6">
          {showTaxForm && (
            <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm transition-all grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Vertical Tabs Bar */}
              <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-slate-800/60 pr-0 md:pr-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400"
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Tab Panes */}
              <div className="md:col-span-3 min-h-75">
                {/* INCOME TAB */}
                {activeTab === "income" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-bold text-white mb-2">
                      Gross Annual Income Sources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(formData.income).map((key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            type="number"
                            value={formData.income[key]}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "income",
                                key,
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={placeholders.income[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DEDUCTIONS TAB */}
                {activeTab === "deductions" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-bold text-white mb-2">
                      Tax Deductions Exemptions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(formData.deductions).map((key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 uppercase">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            type="number"
                            value={formData.deductions[key]}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "deductions",
                                key,
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={placeholders.deductions[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INVESTMENTS TAB */}
                {activeTab === "investments" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-bold text-white mb-2">
                      Tax Saving Investments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(formData.investments).map((key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 uppercase">
                            {key.replace(/([A-Z]|\d+)/g, " $1")}
                          </label>
                          <input
                            type="number"
                            value={formData.investments[key]}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "investments",
                                key,
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={placeholders.investments[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPENSES TAB */}
                {activeTab === "expenses" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-bold text-white mb-2">
                      Declared Expenses
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(formData.expenses).map((key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 capitalize">
                            {key}
                          </label>
                          <input
                            type="number"
                            value={formData.expenses[key]}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "expenses",
                                key,
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={placeholders.expenses[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAXES PAID TAB */}
                {activeTab === "taxes" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-bold text-white mb-2">
                      Taxes Already Deposited
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(formData.taxes).map((key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            type="number"
                            value={formData.taxes[key]}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "taxes",
                                key,
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={placeholders.taxes[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-900">
            {/* Left Side: Toggle Button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowTaxForm(!showTaxForm)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 active:scale-[0.98] transition-all font-semibold cursor-pointer text-sm"
              >
                {showTaxForm
                  ? "Hide Tax Information Form"
                  : "Manually Edit Tax Information"}
              </button>
            </div>

            {/* Right Side: Status Toast & Submit Action */}
            <div className="flex items-center justify-end gap-4 ml-auto w-full sm:w-auto">
              {showSaveToast && (
                <span className="text-emerald-400 font-medium text-sm flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                  <Check className="w-5 h-5 bg-emerald-500/10 p-1 border border-emerald-500/20 rounded-full stroke-[2.5]" />
                  <span>Profile saved successfully!</span>
                </span>
              )}

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 active:scale-[0.98] text-sm"
              >
                {isSavingProfile ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-slate-950"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
