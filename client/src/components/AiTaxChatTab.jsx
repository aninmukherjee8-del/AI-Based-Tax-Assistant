import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";

export default function AiTaxChatTab({ auditRiskScore }) {
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hey! 🤖 I'm TaxBuddy, your dedicated AI coach. How can I help you optimize your tax returns today? You can ask me about Section 80C, HRA rent rules, NPS additional savings, or old vs new tax regimes."
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatIsTyping]);

  const handleChatSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setChatIsTyping(true);

    setTimeout(() => {
      let replyText = "I'm checking our tax database... 🧐";
      const q = currentInput.toLowerCase();

      if (q.includes("80c") || q.includes("saving") || q.includes("deduction")) {
        replyText = "Section 80C allows tax deductions up to ₹1,50,000 yearly. Qualified options include Public Provident Fund (PPF), Equity Linked Savings Schemes (ELSS) mutual funds, and Life Insurance premiums. You can adjust your Section 80C slider on the Command Center tab to see tax impact instantly!";
      } else if (q.includes("hra") || q.includes("rent")) {
        replyText = "House Rent Allowance (HRA) can be exempted under Section 10(13A). Tax exemption is the least of: actual HRA received, rent paid minus 10% of basic salary, or 50% (metro) / 40% (non-metro) of basic salary. Upload rent receipts to the 'Secure Vault' tab to claim this automatically.";
      } else if (q.includes("nps") || q.includes("retirement")) {
        replyText = "Section 80CCD(1B) offers an additional deduction of up to ₹50,000 for National Pension System (NPS) contributions. This is over and above the Section 80C limit (₹1.5L), meaning you can claim ₹2L total deduction by investing in both!";
      } else if (q.includes("new regime") || q.includes("regime") || q.includes("old")) {
        replyText = "The Old Regime is deduction-friendly: you can subtract Section 80C, 80D, HRA, etc. from your income. The New Regime offers lower tax rates, standard deduction of ₹75,000, but blocks standard deductions. Use the regime comparison cards on the Command Center tab for a custom comparison.";
      } else if (q.includes("risk") || q.includes("audit")) {
        replyText = `Your current AI Audit Risk index is ${auditRiskScore}/100. Audit flags are typically triggered when total deductions exceed 30% of gross income, or if there are mismatch irregularities. Keep your receipts safely loaded in the Secure Vault to stay protected.`;
      } else {
        replyText = "I understand. I can help you compute deductions, analyze Form 16, or choose the right tax regime. Let me know if you would like to run a query on a specific income slab or investment rule!";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
      setChatIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl h-137.5 overflow-hidden animate-mascot-slide-in text-xs">
      
      {/* Header */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">TaxBuddy AI Assistant</h3>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Active Online Tax Coach
            </p>
          </div>
        </div>

        <button 
          onClick={() => setChatMessages([
            {
              sender: "bot",
              text: "Chat history cleared. How can I assist you with your tax calculations or investments today?"
            }
          ])}
          className="text-[10px] font-bold bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          Clear History
        </button>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[75%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-emerald-500 text-slate-950 font-bold rounded-tr-none shadow-md"
                  : "bg-slate-950/60 border border-slate-850 text-slate-200 rounded-tl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {chatIsTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-950/60 border border-slate-850 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Chip suggestions */}
      <div className="px-6 py-2 border-t border-slate-900 bg-slate-950/40 flex gap-2 overflow-x-auto custom-scrollbar">
        {[
          { label: "Maximize Section 80C?", q: "how can I maximize my 80C deductions?" },
          { label: "NPS Retirement benefit?", q: "what is the NPS retirement benefit?" },
          { label: "HRA rules?", q: "what are the rules for HRA exemption?" },
          { label: "Compare tax regimes?", q: "explain old vs new tax regimes" }
        ].map((chip, i) => (
          <button
            key={i}
            onClick={() => {
              setChatInput(chip.q);
            }}
            className="text-[10px] font-bold shrink-0 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/20 text-slate-300 hover:text-emerald-400 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Text Input Panel */}
      <form onSubmit={handleChatSendMessage} className="p-4 bg-slate-900/60 border-t border-slate-900/80 flex items-center gap-3">
        <input
          type="text"
          placeholder="Ask a question about deductions, tax slabs, or audit risk..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-emerald-500 text-xs text-white rounded-xl px-4 py-3 focus:outline-none placeholder-slate-500"
        />
        <button
          type="submit"
          className="p-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl cursor-pointer transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
