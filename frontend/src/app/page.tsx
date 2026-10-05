"use client";

import { useEffect, useState, useRef } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Cpu, Volume2, VolumeX } from 'lucide-react';

export default function Dashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to FastAPI WebSocket
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/stream");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to PulseFin AI Engine");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "new_event") {
        setMessages((prev) => [data.data, ...prev].slice(0, 10)); // Keep last 10
        
        if (data.data.portfolio_state) {
            setPortfolio(data.data.portfolio_state);
            
            if (data.data.portfolio_state.mode === "critical_stress") {
                triggerCriticalAlert(data.data.risk_signal.event_type);
            } else {
                setIsCritical(false);
            }
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [voiceEnabled]);

  const triggerCriticalAlert = (eventType: string) => {
      setIsCritical(true);
      if (voiceEnabled && 'speechSynthesis' in window) {
          // Check if already speaking to avoid overlap spam
          if (!window.speechSynthesis.speaking) {
              const text = `Warning. Critical ${eventType} event detected. Initiating portfolio stress test.`;
              const msg = new SpeechSynthesisUtterance(text);
              msg.rate = 1.0;
              msg.pitch = 0.9;
              window.speechSynthesis.speak(msg);
          }
      }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-1000 ${isCritical ? 'bg-red-950/90' : 'bg-slate-950'} text-white`}>
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Cpu className="text-blue-500" /> PulseFin <span className="text-sm font-normal text-slate-400 hidden md:inline">AI/NLP Risk Engine</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm">BITSPilani-ManishPawar-hackathon</p>
        </div>
        <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${voiceEnabled ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
            {voiceEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
            <span className="hidden md:inline">{voiceEnabled ? "Voice Alerts On" : "Voice Alerts Off"}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Live NLP Feed */}
        <div className="xl:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity size={20} className="text-blue-400 animate-pulse"/> Live Risk Signals
            </h2>
            <div className="space-y-4 h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="p-8 bg-white/5 rounded-xl text-slate-400 text-center border border-white/10 border-dashed">
                        Waiting for live WebSocket stream...
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`p-5 rounded-xl border transition-all duration-500 ${msg.risk_signal.impact_score >= 8 ? 'bg-red-900/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${msg.risk_signal.sentiment_label === 'negative' ? 'bg-red-500/20 text-red-400' : msg.risk_signal.sentiment_label === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                    {msg.risk_signal.sentiment_label === 'negative' ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
                                    {msg.risk_signal.sentiment_score.toFixed(2)} {msg.risk_signal.sentiment_label.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400 text-right w-32 truncate">{msg.source}</span>
                            </div>
                            <p className="text-sm font-medium mb-4 leading-relaxed text-slate-200">{msg.risk_signal.text}</p>
                            
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-400">Event Class: <strong className="text-white">{msg.risk_signal.event_type}</strong></span>
                                    <span className="text-xs text-slate-400">Impact: <strong className={msg.risk_signal.impact_score >= 8 ? 'text-red-400 text-base font-bold' : 'text-white'}>{msg.risk_signal.impact_score}/10</strong></span>
                                </div>
                                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg mt-3">
                                    <p className="text-xs text-blue-200 leading-relaxed">
                                        <strong className="text-blue-400 font-semibold block mb-1">Agentic XAI Rationale: </strong>
                                        {msg.risk_signal.rationale}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Right Column: Portfolio Orchestrator */}
        <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Unified Portfolio Engine</h2>
            
            {/* The Flash Crash Shake Animation Wrapper */}
            <div className={`transition-all duration-300 ${isCritical ? 'animate-[shake_0.5s_ease-in-out_infinite] scale-[0.98]' : ''}`}>
                
                {/* Module A: Tactical Rebalancing */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-medium mb-8 text-slate-300 flex justify-between items-center">
                        <span>Module A: Tactical Rebalancing</span>
                        {portfolio?.mode === 'normal' && <span className="text-emerald-400 text-sm flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full"><Activity size={16}/> Active</span>}
                        {portfolio?.mode === 'critical_stress' && <span className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full"><AlertTriangle size={16}/> Halted</span>}
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {portfolio?.weights ? Object.entries(portfolio.weights).map(([ticker, weight]: any) => (
                            <div key={ticker} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group h-32">
                                <div className="absolute bottom-0 left-0 w-full bg-blue-500/20 transition-all duration-1000 ease-out" style={{ height: (weight * 500) + '%' }} />
                                <span className="text-slate-400 text-sm z-10 mb-1">{ticker}</span>
                                <span className="text-2xl font-bold z-10 text-white">{(weight * 100).toFixed(2)}%</span>
                            </div>
                        )) : (
                            <div className="col-span-full text-center text-slate-500 py-12">Waiting for portfolio state...</div>
                        )}
                    </div>
                </div>

                {/* Module B: Strategic Stress Testing */}
                <div className={`rounded-2xl p-6 border transition-all duration-700 ${portfolio?.mode === 'critical_stress' ? 'bg-red-950/80 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10'}`}>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-3">
                        Module B: Strategic Stress Test
                        {portfolio?.mode === 'critical_stress' && <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-bold animate-pulse">CRITICAL EVENT TRIGGERED</span>}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">Evaluates macroeconomic shocks against a synthetic $100M portfolio.</p>

                    {portfolio?.stress_test ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 bg-black/40 rounded-xl border border-white/5">
                                <div className="text-slate-400 text-sm mb-2">Baseline Value</div>
                                <div className="text-3xl font-mono text-slate-200">${portfolio.stress_test.baseline_value.toLocaleString()}</div>
                            </div>
                            <div className="p-5 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5" />
                                <div className="relative z-10">
                                    <div className="text-slate-400 text-sm mb-2">Stressed Value (T+1)</div>
                                    <div className="text-3xl font-mono text-red-400">${portfolio.stress_test.stressed_value.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="p-5 bg-red-950/50 rounded-xl border border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                                <div className="text-red-200 text-sm mb-2">Simulated Loss ({portfolio.stress_test.shock_applied})</div>
                                <div className="text-4xl font-mono text-red-500 font-bold flex items-center gap-2">
                                    <TrendingDown size={28}/>
                                    ${portfolio.stress_test.simulated_loss.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-12 border border-dashed border-white/10 rounded-xl">
                            No critical events detected yet. Monitoring...
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}
