import React, { useState, useEffect } from "react";
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
  MoreVertical
} from "lucide-react";

// --- Utility: Count Up Animation ---
const useCountUp = (end, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    const startTimeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, startDelay);
    return () => {
      clearTimeout(startTimeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, startDelay]);
  return count;
};

// --- Component: Mini Graph ---
const MiniBarChart = () => (
  <div className="flex items-end space-x-1.5 h-12">
    {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
      <div key={i} className="w-3 bg-cyan-500/20 rounded-t-sm h-full flex items-end">
        <div className="w-full bg-cyan-400 rounded-t-sm transition-all duration-1000" style={{ height: `${height}%` }} />
      </div>
    ))}
  </div>
);

export default function EnhancedDashboard() {
  const [progress, setProgress] = useState(0);
  const income = useCountUp(1250000, 2000, 100);
  const taxPaid = useCountUp(45000, 2000, 300);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(68), 800);
    return () => clearTimeout(timer);
  }, []);

  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="flex h-screen bg-[#05050A] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col m-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl">
        <div className="h-24 flex items-center px-8 border-b border-white/[0.05]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <BrainCircuit className="w-5 h-5 text-black" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">TaxAssist</span>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Command Center" },
            { icon: FileText, label: "Vault" },
            { icon: PieChart, label: "Simulations" },
            { icon: Settings, label: "Settings" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all">
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto gap-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-white">Overview</h1>
          <button className="p-3 rounded-full bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05]">
            <Bell className="w-5 h-5" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05]">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 animate-pulse" />
                    Real-time sync
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-slate-400">Gross Income</p>
                    <h3 className="text-3xl font-bold text-white mt-1">₹{income.toLocaleString()}</h3>
                  </div>
                  <MiniBarChart />
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05]">
                <p className="text-sm text-slate-400">Est. Tax Liability</p>
                <h3 className="text-3xl font-bold text-white mt-1">₹{taxPaid.toLocaleString()}</h3>
              </div>
            </div>

            {/* Trajectory & Upload Section */}
            <div className="p-8 rounded-3xl bg-[#0A0A10]/80 border border-white/[0.05] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Filing Trajectory</h2>
                <p className="text-sm text-slate-400 mb-4">Next milestone: Document Verification</p>
                <button className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold rounded-xl transition-all flex items-center">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Form 16
                </button>
              </div>
              <div className="flex items-center space-x-4 bg-white/[0.02] p-2 pr-6 border border-white/[0.05]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                    <circle cx="32" cy="32" r={circleRadius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeOffset} strokeLinecap="round" className="text-cyan-400 transition-all duration-1500" />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (AI Co-pilot) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0A0A10] to-transparent border border-white/[0.05] flex flex-col">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Co-Pilot</h3>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex-1">
              <p className="text-sm text-slate-300 leading-relaxed">
                I analyzed your investments. If you shift <strong className="text-violet-300">₹15,000</strong> to ELSS, you can maximize your 80C limit.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}