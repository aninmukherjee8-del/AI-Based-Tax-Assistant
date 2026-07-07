import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import InteractiveNetworkBackground from "../components/InteractiveNetworkBackground.jsx";
// import MascotAssistant from "../components/MascotAssistant.jsx";
import {
  Shield,
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Calculator,
  BookOpen,
  Cpu,
  Lock,
  LayoutDashboard,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

// Custom hook for the sequential typewriter effect
const useTypewriter = (text, delay = 0, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeout;
    let interval;

    // Wait for the specified delay before starting to type
    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i < text.length) {
          // Using slice guarantees accurate rendering even in React Strict Mode
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return displayedText;
};

export default function LandingPage() {
  const navigate = useNavigate();
    useEffect(() => {
      const checkLogin = async () => {
          const token = localStorage.getItem("token");
          if (!token) return;
          try {
              await api.get("/users/profile", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              navigate("/dashboard", { replace: true });
          } catch (err) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
          }
      };

      checkLogin();
  }, []);

  const [income, setIncome] = useState(800000);
  const [deductions, setDeductions] = useState(150000);

  // Typewriter timing sequence
  // 1. First line starts at 300ms, types at 50ms per char
  const typedHeading1 = useTypewriter("Demystify Taxes.", 300, 50);
  
  // 2. Second line starts after first line finishes (~1300ms)
  const typedHeading2 = useTypewriter("Maximize Your Savings.", 1300, 50);
  
  // 3. Paragraph starts after both headings finish (~2600ms), types slightly faster (20ms)
  const typedParagraph = useTypewriter(
    "Navigate complex tax laws effortlessly. Let our AI assistant scan your financial documents, explain concepts in plain language, and tailor legal tax-saving strategies to fit your income patterns.",
    2600,
    20
  );

  // Interactive mini tax calculator just for visualization / WOW factor!
  const calculateEstimatedTax = () => {
    const taxable = Math.max(0, income - deductions);
    // Simple mock progressive tax slab
    if (taxable <= 300000) return 0;
    if (taxable <= 600000) return (taxable - 300000) * 0.05;
    if (taxable <= 900000) return 15000 + (taxable - 600000) * 0.1;
    if (taxable <= 1200000) return 45000 + (taxable - 900000) * 0.15;
    return 90000 + (taxable - 1200000) * 0.2;
  };

  const estimatedTax = calculateEstimatedTax();
  const potentialSavings = Math.round(deductions * 0.2 + 12500); // mock smart recommendation savings

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans scroll-smooth">
      <InteractiveNetworkBackground />
      {/* Decorative Blur Backdrops with continuous subtle animation */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-8000ms" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse duration-10000ms" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-6000ms" />

      {/* Navigation Header */}
      <nav className="z-50 border-b border-slate-900 bg-slate-950/75 backdrop-blur-md sticky top-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="p-2.5 bg-linear-to-tr from-emerald-600 to-green-400 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Cpu className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                Tax
                <span className="text-emerald-400 font-semibold group-hover:text-green-300 transition-colors duration-300">
                  Wise
                </span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Features
              </a>
              <a
                href="#calculator"
                className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Savings Estimator
              </a>
              <a
                href="#security"
                className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Privacy & Security
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/auth"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-950 bg-linear-to-r from-emerald-400 to-green-300 hover:from-emerald-300 hover:to-green-200 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-5 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide hover:bg-emerald-500/15 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-3000" />
              <span>Next-Gen Smart Tax Filing Assistant</span>
            </div>

            {/* TYPED HEADING INCORPORATED HERE */}
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight min-h-120px sm:min-h-144px">
              {typedHeading1}
              <br />
              <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-green-300 bg-clip-text text-transparent">
                {typedHeading2}
                {/* Optional: Add a blinking cursor block here if desired */}
                {typedHeading2.length > 0 && typedHeading2.length < 22 && (
                  <span className="inline-block w-1 md:w-2 h-10 md:h-12 ml-1 bg-emerald-400 animate-pulse translate-y-1 md:translate-y-2"></span>
                )}
              </span>
            </h1>

            {/* TYPED PARAGRAPH INCORPORATED HERE */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed min-h-120px lg:min-h-85px">
              {typedParagraph}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start pt-4 gap-4">
              <a
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-950 bg-linear-to-r from-emerald-400 to-green-300 hover:from-emerald-300 hover:to-green-200 rounded-xl shadow-xl shadow-emerald-500/15 hover:shadow-emerald-400/40 hover:-translate-y-1 transition-all duration-200 group"
              >
                Start Smart Filing
                <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <a
                href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl hover:-translate-y-1 transition-all duration-200"
              >
                Estimate Savings
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
              <div className="group cursor-default">
                <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  100%
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                  Privacy Focused
                </p>
              </div>
              <div className="group cursor-default">
                <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Sec. 80C+
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                  Deduction Rules
                </p>
              </div>
              <div className="group cursor-default">
                <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Real-time
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                  AI Chat Answers
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Block (Interactive preview / widget) */}
          <div className="lg:col-span-5 relative group">
            {/* Soft backglow behind the card on hover */}
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative border border-slate-900 rounded-3xl p-8 max-w-md mx-auto bg-slate-950/80 backdrop-blur-sm shadow-2xl transition-all duration-300 group-hover:border-slate-800/80 ">
              {/* Card top bar */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 animate-pulse">
                  Live Simulator
                </span>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">
                        Recommended Regime
                      </p>
                      <p className="text-sm font-semibold text-emerald-400">
                        NEW REGIME (FY 2026-27)
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        Potential Savings
                      </p>
                      <p className="text-lg font-bold text-emerald-400">
                        ₹{potentialSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Estimated Income</span>
                    <span className="text-white font-mono font-semibold">
                      ₹{income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Deductions</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      ₹{deductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-800/80 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-semibold">
                      Estimated Net Tax
                    </span>
                    <span className="text-xl font-bold text-white font-mono bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-800/60">
                      ₹{estimatedTax.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href="#calculator"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group/cta"
                  >
                    <span>Run Your Personalized Tax Analysis</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-start space-x-3 hover:bg-emerald-500/15 transition-colors">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      AI Recommendation
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      You are eligible for scheme NPS under Section 80CCD(1B).
                      Save up to{" "}
                      <span className="font-bold text-white">
                        ₹{potentialSavings.toLocaleString()}
                      </span>{" "}
                      more by maximizing this contribution.
                    </p>
                  </div>
                </div>

                <a
                  href="/auth"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 text-sm font-semibold hover:text-white text-slate-300 transition-all group/btn"
                >
                  <span>Connect Financial Accounts</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="relative z-10 py-24 bg-slate-950 border-t border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered For Stress-Free Taxation
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Every feature is built with clarity, security, and smart
              automation in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards Matrix */}
            {[
  {
    icon: FileText,
    title: "AI Document Intelligence",
    desc: "Upload Form 16, salary slips, insurance receipts, bank statements, and investment proofs. AI automatically extracts tax-related information and builds your financial profile.",
  },
    {
    icon: LayoutDashboard,
    title: "Intelligent Command Centre",
    desc: "Monitor your complete tax profile from a unified dashboard with real-time insights into income, deductions, investments, taxes paid, audit risk, and profile completion."
  },
  {
    icon: TrendingUp,
    title: "AI Tax Optimization",
    desc: "Receive intelligent tax-saving recommendations, deduction opportunities, regime comparisons, and personalized strategies to legally minimize your tax liability.",
  },
  {
    icon: Shield,
    title: "Secure Document Vault",
    desc: "All uploaded tax documents are securely stored and encrypted. Access your financial records anytime while maintaining complete privacy and confidentiality.",
  },
  {
    icon: Sparkles,
    title: "Personalized Tax Insights",
    desc: "Generate AI-powered tax reports highlighting eligible deductions, missing documents, estimated tax savings, and government schemes tailored to your profile.",
  },
  {
    icon: Cpu,
    title: "Real-Time Tax Profile",
    desc: "Your financial profile is automatically updated as new documents are uploaded, giving you a live overview of income, deductions, taxes paid, and investments.",
  },
].map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={idx}
                  className="border border-slate-900 rounded-2xl p-8 space-y-6 bg-slate-950/40 hover:bg-slate-900/30 hover:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 group-hover:scale-110">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed transition-colors group-hover:text-slate-300">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Savings Simulator Section */}
      <section
        id="calculator"
        className="relative z-10 py-24 bg-slate-900/20 border-t border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Savings Estimator
              </h2>
              <h3 className="text-4xl font-extrabold text-white">
                How much can you save with smart guidelines?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Use the interactive sliders to set your approximate yearly
                earnings and current investments. See how progressive tax
                estimation works in real-time.
              </p>

              <ul className="space-y-4 pt-4">
                {[
                  "Interactive recommendation preview for eligible sections",
                  "Real-time calculation updates for tax liability",
                  "Clear distinction between taxable and tax-free limits",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 text-sm text-slate-300 group cursor-default"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white transition-colors">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sliders Widget */}
            <div className="p-8 bg-slate-950 border border-slate-900/60 rounded-3xl space-y-8 relative overflow-hidden shadow-2xl">
              <div className="space-y-8">
                {/* Slider 1 */}
                <div className="space-y-3 ">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-300">
                      Gross Yearly Income (INR)
                    </label>
                    <span className="text-base font-bold text-emerald-400 font-mono bg-slate-900/80 px-2.5 py-0.5 border border-slate-800 rounded-md">
                      ₹{income.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300000"
                    max="3000000"
                    step="5000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                  <div className="relative mt-0.1 mb-4 text-sm text-slate-400">
                    <span className="absolute left-0">3L</span>

                    <span
                      className="absolute -translate-x-1/2"
                      style={{ left: "44.44%" }}
                    >
                      15L
                    </span>

                    <span className="absolute right-0">30L</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-300">
                      Total Eligible Deductions (80C, etc.)
                    </label>
                    <span className="text-base font-bold text-emerald-400 font-mono bg-slate-900/80 px-2.5 py-0.5 border border-slate-800 rounded-md">
                      ₹{deductions.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-mono px-0.5">
                    <span>₹0</span>
                    <span>₹2.5L</span>
                    <span>₹5L</span>
                  </div>
                </div>

                {/* Results block */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
                  <div className="p-4 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors">
                    <p className="text-xs text-slate-400 font-medium">
                      Estimated Net Tax
                    </p>
                    <p className="text-xl font-bold text-white mt-1 font-mono">
                      ₹{estimatedTax.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:border-emerald-500/20 transition-all group/box">
                    <p className="text-xs text-emerald-400 font-bold group-hover/box:text-emerald-300 transition-colors">
                      Estimated Savings
                    </p>
                    <p className="text-xl font-extrabold text-white mt-1 font-mono group-hover/box:scale-105 origin-left transition-transform">
                      ₹{potentialSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Data Privacy Highlight */}
      <section
        id="security"
        className="relative z-10 py-24 bg-slate-950 border-t border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-16 bg-linear-to-br from-slate-950 via-slate-900/60 to-slate-950 border border-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Your privacy is non-negotiable.
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  We process sensitive financial data with advanced privacy
                  controls. We mask identifiable indices in files, encrypt
                  stored records, and do not sell financial metadata to third
                  parties.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {[
                    "End-to-End Encryption",
                    "Privacy Masking Middleware",
                    "Secure File Storage",
                    "GDPR/Privacy Compliant",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 group/item"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-xs text-slate-300 font-semibold">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative key block */}
              <div className="flex justify-center">
                <div className="relative p-8 bg-slate-900/30 backdrop-blur-xs rounded-3xl border border-slate-800/60 max-w-sm w-full text-center space-y-4 shadow-xl hover:border-emerald-500/20 transition-all duration-300 group/shield">
                  <Shield className="w-16 h-16 text-emerald-400 mx-auto group-hover:scale-110 group-hover:text-green-300 transition-all duration-300" />
                  <h4 className="text-base font-bold text-white">
                    Privacy Guard Active
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Personal Identifiable Information (PII) is automatically
                    masked during client-server transmissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crucial Disclaimer Section */}
      <section
        id="disclaimer"
        className="relative z-10 py-16 bg-slate-950 border-t border-slate-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Important Notice & Disclaimer</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed text-left sm:text-center bg-slate-900/20 p-4 rounded-xl border border-slate-900/60">
            This platform is intended for educational, informational, and
            personal assistance purposes only. It does not act as a certified
            legal, tax, or financial authority, and does not provide official
            certified tax advice. Tax codes and regulations change periodically.
            Please consult a licensed professional tax advisor or refer to
            government portals before filing official claims.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Tax
              <span className="text-emerald-400 font-semibold">Assist.AI</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-xs text-slate-600 order-2 sm:order-1">
              &copy; Created with ❤️. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}