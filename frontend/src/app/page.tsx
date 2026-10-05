"use client";

import { useEffect, useState, useRef } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Cpu, Volume2, VolumeX, Database, ShieldAlert, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProfessionalDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/stream");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "new_event") {
        setMessages((prev) => [data.data, ...prev].slice(0, 50)); 
        
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

    return () => ws.close();
  }, [voiceEnabled]);

  const triggerCriticalAlert = (eventType: string) => {
      setIsCritical(true);
      if (voiceEnabled && 'speechSynthesis' in window && !window.speechSynthesis.speaking) {
          const text = `Critical Alert. ${eventType} detected. Activating portfolio defense protocols.`;
          const msg = new SpeechSynthesisUtterance(text);
          msg.rate = 1.1;
          msg.pitch = 0.8;
          window.speechSynthesis.speak(msg);
      }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={`min-h-screen p-4 font-sans transition-colors duration-1000 ${isCritical ? 'bg-[#2a0808]' : 'bg-[#0a0a0a]'} text-slate-200 text-sm`}>
      {/* Top Navigation / Bloomberg Style Marquee */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
            <Cpu className="text-blue-500" size={24} />
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">PulseFin Terminal V2.0</h1>
                <p className="text-xs text-slate-500 font-mono">Enterprise AI Risk & Portfolio Engine</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex gap-4 font-mono text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><Activity size={14}/> SYSTEM ONLINE</span>
                <span className="flex items-center gap-1 text-blue-400"><Database size={14}/> LIVE DATA</span>
            </div>
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-xs border border-white/20 px-3 py-1.5 rounded hover:bg-white/10 flex items-center gap-2">
                {voiceEnabled ? <Volume2 size={14}/> : <VolumeX size={14}/>} {voiceEnabled ? "AUDIO ON" : "AUDIO MUTED"}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        
        {/* Left Column: Dense Data Feed (3 cols) */}
        <div className="col-span-12 lg:col-span-3 border border-white/10 bg-[#111111] rounded-lg overflow-hidden flex flex-col h-[85vh]">
            <div className="bg-[#1a1a1a] p-3 border-b border-white/10 flex justify-between items-center">
                <h2 className="font-semibold text-xs uppercase text-slate-300">Global Data Ingestion</h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">HUGGINGFACE NLP</span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {messages.length === 0 ? <p className="text-center text-slate-500 mt-10">Awaiting Signal...</p> : messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded border text-xs ${msg.risk_signal.impact_score >= 8 ? 'bg-red-950/40 border-red-500/50' : 'bg-[#1a1a1a] border-white/5'}`}>
                        <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-slate-500">
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            <span className={msg.risk_signal.impact_score >= 8 ? 'text-red-400 font-bold' : ''}>IMP: {msg.risk_signal.impact_score}/10</span>
                        </div>
                        <p className="mb-2 text-slate-300 leading-relaxed">{msg.risk_signal.text}</p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${msg.risk_signal.sentiment_label === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {msg.risk_signal.sentiment_score.toFixed(2)} {msg.risk_signal.sentiment_label.toUpperCase()}
                            </span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{msg.risk_signal.event_type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Center Column: Charts & Analytics (6 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            
            {/* Massive Area Chart for Portfolio Value */}
            <div className={`border rounded-lg bg-[#111111] p-4 transition-all duration-300 ${isCritical ? 'border-red-500/50 animate-[shake_0.5s_ease-in-out_infinite]' : 'border-white/10'}`}>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-xs uppercase text-slate-400 font-semibold mb-1">Total AUM (Live Market)</h2>
                        <div className={`text-3xl font-mono font-bold ${isCritical ? 'text-red-500' : 'text-white'}`}>
                            {portfolio?.total_value ? formatCurrency(portfolio.total_value) : "$0.00"}
                        </div>
                    </div>
                    {isCritical && <div className="text-red-500 flex items-center gap-2 font-bold bg-red-500/10 px-3 py-1 rounded animate-pulse"><ShieldAlert size={18}/> STRESS TEST ACTIVE</div>}
                </div>
                
                <div className="h-[300px] w-full">
                    {portfolio?.history && portfolio.history.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={portfolio.history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isCritical ? "#ef4444" : "#3b82f6"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={isCritical ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="time" stroke="#555" fontSize={10} tickMargin={10} />
                                <YAxis domain={['auto', 'auto']} stroke="#555" fontSize={10} tickFormatter={(value) => "$" + (value/1000000).toFixed(1) + "M"} width={60} />
                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="value" stroke={isCritical ? "#ef4444" : "#3b82f6"} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">Initializing chart data...</div>
                    )}
                </div>
            </div>

            {/* XAI Rationale Panel */}
            <div className="border border-white/10 bg-[#111111] rounded-lg p-4 flex-1">
                <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between">
                    <span>LLM Agentic Rationale (XAI)</span>
                    <span className="text-[10px] text-emerald-400">zero-shot-classification</span>
                </h2>
                {messages.length > 0 ? (
                    <p className="text-sm text-slate-300 leading-relaxed font-serif">
                        "{messages[0].risk_signal.rationale}"
                    </p>
                ) : (
                    <p className="text-slate-600 text-sm">No analysis generated yet.</p>
                )}
            </div>
        </div>

        {/* Right Column: Holdings & Stress Test (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            
            {/* Holdings Table */}
            <div className="border border-white/10 bg-[#111111] rounded-lg overflow-hidden flex-1">
                <div className="bg-[#1a1a1a] p-3 border-b border-white/10">
                    <h2 className="font-semibold text-xs uppercase text-slate-300">Live Holdings (Module A)</h2>
                </div>
                <div className="p-0 overflow-y-auto max-h-[400px]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#151515] text-slate-500 sticky top-0">
                            <tr>
                                <th className="p-2 font-normal">Asset</th>
                                <th className="p-2 font-normal text-right">Price</th>
                                <th className="p-2 font-normal text-right">Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {portfolio?.weights ? Object.entries(portfolio.weights).sort((a:any, b:any) => b[1] - a[1]).map(([ticker, weight]: any) => (
                                <tr key={ticker} className="hover:bg-white/5 transition-colors">
                                    <td className="p-2 font-bold text-slate-200">{ticker}</td>
                                    <td className="p-2 text-right text-slate-400">${portfolio.live_prices[ticker]?.toFixed(2)}</td>
                                    <td className="p-2 text-right text-blue-400">{(weight * 100).toFixed(2)}%</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="text-center p-4 text-slate-600">Loading...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stress Test Module */}
            <div className={`border rounded-lg p-4 ${isCritical ? 'bg-red-950/30 border-red-500/50' : 'bg-[#111111] border-white/10'}`}>
                <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between">
                    <span>Module B: CVaR Stress Test</span>
                    <span className="text-[10px] text-orange-400">Rockafellar-Uryasev</span>
                </h2>
                {portfolio?.stress_test ? (
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">T-0 Baseline:</span>
                            <span className="text-slate-300">{formatCurrency(portfolio.stress_test.baseline_value)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">T+1 Stressed:</span>
                            <span className="text-red-400">{formatCurrency(portfolio.stress_test.stressed_value)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2">
                            <span className="text-slate-500">VaR (95%):</span>
                            <span className="text-orange-400">{portfolio.stress_test.var_95}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">CVaR (95%):</span>
                            <span className="text-red-400 font-bold">{portfolio.stress_test.cvar_95}</span>
                        </div>
                        <div className="bg-red-500/10 p-2 rounded border border-red-500/20 mt-2">
                            <div className="text-red-400 text-[10px] uppercase mb-1">CVaR $ Loss (Expected Shortfall)</div>
                            <div className="text-lg font-bold text-red-500">-{formatCurrency(portfolio.stress_test.cvar_dollar_loss)}</div>
                        </div>
                        <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                            <div className="text-red-400 text-[10px] uppercase mb-1">Simulated P&L Loss</div>
                            <div className="text-lg font-bold text-red-500">-{formatCurrency(portfolio.stress_test.simulated_loss)}</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-600 py-6 text-xs">Awaiting critical catalyst...</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
