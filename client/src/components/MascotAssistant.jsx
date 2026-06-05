import React, { useState, useEffect } from "react";
import { X, Send, Bot, Calculator, ShieldAlert, Sparkles } from "lucide-react";

export default function MascotAssistant({ page = "dashboard" }) {
  const [visible, setVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: page === "dashboard"
        ? "Hey POOCHII! 🤖 I'm TaxBuddy, your AI coach. Tap me to check smart deductions, ask tax questions, or verify tax saving files!"
        : "Welcome to TaxAssist.AI! 🚀 Ready to see how much you can save? I can guide you through the savings estimator below."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Trigger entrance animations
  useEffect(() => {
    // Slide robot in after 1s
    const timerRobot = setTimeout(() => {
      setVisible(true);
    }, 1000);

    // Show speech bubble after 2s
    const timerBubble = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    // Auto-hide bubble after 8s
    const timerBubbleHide = setTimeout(() => {
      setShowBubble(false);
    }, 9500);

    return () => {
      clearTimeout(timerRobot);
      clearTimeout(timerBubble);
      clearTimeout(timerBubbleHide);
    };
  }, [page]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulated AI Mascot responses
    setTimeout(() => {
      let replyText = "I'm checking our tax database... 🧐";
      const q = inputText.toLowerCase();

      if (q.includes("80c") || q.includes("saving") || q.includes("deduction")) {
        replyText = "Section 80C allows deductions up to ₹1,500,000 yearly! You can invest in PPF, ELSS mutual funds, or LIC premiums to claim it. Check the 'Simulations' tab to adjust yours!";
      } else if (q.includes("hra") || q.includes("rent")) {
        replyText = "House Rent Allowance (HRA) can be exempted under Section 10(13A). Make sure to upload your Rent Receipts in the 'Vault' to claim it automatically!";
      } else if (q.includes("nps") || q.includes("retirement")) {
        replyText = "Section 80CCD(1B) offers an additional ₹50,000 deduction for NPS contributions, separate from the ₹1.5L limit of 80C. That's pure tax savings!";
      } else if (q.includes("new regime") || q.includes("regime") || q.includes("old")) {
        replyText = "The New Regime has lower tax rates but no deductions. The Old Regime is better if you claim HRA, 80C, and 80D. Check the 'Simulations Workbench' for a side-by-side comparison!";
      } else {
        replyText = "Got it! For tax questions, you can upload documents (like Salary Slips or Form 16) in our Vault and the AI will analyze them for compliance warnings automatically.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
      setIsTyping(false);
    }, 1200);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans flex flex-col items-end pointer-events-none">
      
      {/* 1. Speech Bubble (Intro greeting) */}
      {showBubble && !showChat && (
        <div className="mb-4 mr-2 bg-slate-900 border border-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-br-none shadow-2xl max-w-280px pointer-events-auto animate-bubble-fade-in relative">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute top-1 right-1 text-slate-500 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs leading-relaxed pr-3">
            {page === "dashboard" ? (
              <span>Hi John! 🤖 Ready to optimize your returns? Let's check if you can claim extra <strong>80CCD(1B) NPS</strong> benefits!</span>
            ) : (
              <span>Hi there! 🚀 Scroll down to play with our tax-saving sliders and see progressive slab calculations in real-time.</span>
            )}
          </p>
          {/* Bubble Tail */}
          <div className="absolute right-0 bottom--6px w-0 h-0 border-l-8px border-l-transparent border-r-8px border-r-transparent border-t-8px border-t-slate-900" />
        </div>
      )}

      {/* 2. Interactive Chat Dialog Box */}
      {showChat && (
        <div className="mb-4 bg-slate-950/95 border border-slate-800/90 text-slate-100 rounded-3xl shadow-2xl w-[320px] h-380px flex flex-col overflow-hidden pointer-events-auto backdrop-blur-xl animate-bubble-fade-in">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">TaxBuddy AI</p>
                <p className="text-[9px] text-emerald-400 font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Active Tax Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-bold rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Option Pills */}
          <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex gap-1.5 overflow-x-auto custom-scrollbar">
            {[
              { text: "What is 80C?", query: "what is 80c" },
              { text: "NPS benefit?", query: "nps benefit" },
              { text: "HRA rules?", query: "hra rules" }
            ].map((pill, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(pill.text);
                }}
                className="text-[9px] font-bold shrink-0 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {pill.text}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/60 border-t border-slate-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask me a tax question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-emerald-500 text-xs text-white rounded-xl px-3 py-2 focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl cursor-pointer transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. The Mascot Character Body (Floating SVG) */}
      <div 
        onClick={() => {
          setShowChat(!showChat);
          setShowBubble(false);
        }}
        className="pointer-events-auto cursor-pointer animate-mascot-slide-in relative group"
      >
        {/* Soft shadow hover glow */}
        <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="w-18 h-18 bg-linear-to-tr from-slate-900 via-slate-950 to-slate-900 border border-slate-800 group-hover:border-emerald-500/40 rounded-full flex items-center justify-center shadow-2xl relative animate-mascot-float">
          
          {/* Notification Alert Dot */}
          {showBubble && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
          )}

          {/* SVG TaxBuddy mascot */}
          <svg
            width="50"
            height="50"
            viewBox="0 0 64 64"
            className="overflow-visible"
          >
            {/* Ambient Shadow */}
            <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="rgba(0,0,0,0.4)" />

            {/* Robot Torso */}
            <rect x="20" y="32" width="24" height="18" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            
            {/* Screen Panel on Torso */}
            <rect x="24" y="36" width="16" height="8" rx="2" fill="#0f172a" />
            <line x1="28" y1="40" x2="36" y2="40" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />

            {/* Neck Connection */}
            <rect x="29" y="27" width="6" height="6" fill="#475569" />

            {/* Left Arm (Resting) */}
            <path d="M14 34 Q10 38 15 44" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            
            {/* Right Arm (Waving) */}
            <g className="animate-wave-arm" style={{ transformOrigin: "42px 34px" }}>
              {/* Upper & lower arm */}
              <path d="M42 34 Q50 38 48 24" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
              {/* Little robot hand */}
              <circle cx="48" cy="22" r="3" fill="#10b981" />
            </g>

            {/* Head */}
            <rect x="18" y="12" width="28" height="18" rx="8" fill="#334155" stroke="#475569" strokeWidth="2" />
            
            {/* Head Screen Face */}
            <rect x="21" y="15" width="22" height="12" rx="4" fill="#020617" />
            
            {/* Glowing Screen Eyes */}
            <ellipse cx="27" cy="21" rx="2" ry="3" fill="#34d399" className="group-hover:fill-emerald-300 transition-colors" />
            <ellipse cx="37" cy="21" rx="2" ry="3" fill="#34d399" className="group-hover:fill-emerald-300 transition-colors" />

            {/* Small Antenna */}
            <line x1="32" y1="12" x2="32" y2="7" stroke="#475569" strokeWidth="2" />
            <circle cx="32" cy="6" r="2" fill="#10b981" className="animate-pulse" />
          </svg>
        </div>
      </div>
    </div>
  );
}
