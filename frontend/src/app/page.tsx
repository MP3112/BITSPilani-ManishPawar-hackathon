"use client";

import { useEffect, useState, useRef } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Cpu, Volume2, VolumeX, Database, ShieldAlert, DollarSign, Target, BarChart2, ArrowRight, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
};

export default function ProfessionalDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  const [isBacktestActive, setIsBacktestActive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const runMonteCarlo = async () => {
      setIsCommandOpen(false);
      setIsMonteCarloRunning(true);
      try {
          const res = await fetch('http://127.0.0.1:8000/run-monte-carlo', { method: 'POST' });
          const json = await res.json();
          const data = json.data;
          setMessages((prev) => [data, ...prev].slice(0, 50)); 
          setPortfolio(data.portfolio_state);
          triggerCriticalAlert("Monte Carlo Breach");
      } catch (e) {
          console.error(e);
      }
      setTimeout(() => setIsMonteCarloRunning(false), 3000);
  };

  const forceRebalance = () => {
      setIsCommandOpen(false);
      if (portfolio && portfolio.weights) {
          const newPortfolio = {...portfolio};
          // Simulate instant rebalance to optimal weights
          Object.keys(newPortfolio.weights).forEach(ticker => {
              const optimal = portfolio?.optimal_weights?.[ticker];
              if (optimal) newPortfolio.weights[ticker] = optimal;
              else newPortfolio.weights[ticker] = newPortfolio.weights[ticker] * 0.85 + 0.05;
          });
          setPortfolio(newPortfolio);
      }
  };

  const loadBacktestData = async () => {
      setIsCommandOpen(false);
      setIsBacktestActive(true);
      try {
          const res = await fetch('http://127.0.0.1:8000/trigger-backtest', { method: 'POST' });
          const json = await res.json();
          const data = json.data;
          setMessages((prev) => [data, ...prev].slice(0, 50)); 
          setPortfolio(data.portfolio_state);
          triggerCriticalAlert("Systemic Crash");
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket("ws://127.0.0.1:8000/ws/stream");
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

      ws.onclose = () => {
        // Auto-reconnect if the server restarts
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
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

  const handleSimulateFlashCrash = async () => {
      try {
          await fetch('http://127.0.0.1:8000/trigger-doomsday', { method: 'POST' });
      } catch (e) {
          console.error("Failed to trigger doomsday", e);
      }
  };

  return (
    <div className={`min-h-screen p-4 font-sans transition-colors duration-1000 relative overflow-hidden ${isCritical ? 'bg-[#150202]' : 'bg-[#050505]'} text-slate-200 text-sm`}>
      {/* Command Palette Overlay */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
          <div className="bg-[#111] border border-white/20 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-white/10">
              <Search className="text-slate-400 mr-3" size={18} />
              <input type="text" autoFocus placeholder="Type a command or search (e.g. 'Run Monte Carlo')..." className="bg-transparent flex-1 outline-none text-slate-200 placeholder:text-slate-600 text-sm" />
              <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10">ESC to close</span>
            </div>
            <div className="p-2">
                <div className="px-3 py-2 text-[10px] uppercase text-slate-500 font-bold">Suggested Commands</div>
                <div onClick={runMonteCarlo} className="px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer flex justify-between items-center group transition-colors">
                    <span className="flex items-center gap-3 text-slate-300"><Cpu size={14} className="text-blue-400"/> Run Monte Carlo Simulation (10,000 paths)</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity">Execute</span>
                </div>
                <div onClick={forceRebalance} className="px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer flex justify-between items-center group transition-colors">
                    <span className="flex items-center gap-3 text-slate-300"><Target size={14} className="text-emerald-400"/> Force Auto-Rebalance to Target Weights</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity">Execute</span>
                </div>
                <div onClick={loadBacktestData} className="px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer flex justify-between items-center group transition-colors">
                    <span className="flex items-center gap-3 text-slate-300"><Activity size={14} className="text-orange-400"/> Load 2008 Financial Crisis Backtest Data</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity">Execute</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Vignette Overlay for DEFCON 1 */}
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${isCritical ? 'opacity-100 animate-pulse' : 'opacity-0'} z-0`} style={{ background: 'radial-gradient(circle, transparent 20%, rgba(220, 38, 38, 0.15) 80%, rgba(220, 38, 38, 0.4) 100%)' }}></div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto">
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
            <button onClick={() => setIsCommandOpen(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-xs text-slate-400 transition-colors">
                <Search size={14}/> Search Commands <span className="bg-black/50 border border-white/20 px-1.5 rounded text-[10px] ml-1 tracking-widest">⌘K</span>
            </button>
            <div className="flex gap-4 font-mono text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><Activity size={14}/> SYSTEM ONLINE</span>
                <span className="flex items-center gap-1 text-blue-400"><Database size={14}/> LIVE DATA</span>
            </div>
            <button 
                onClick={handleSimulateFlashCrash}
                className="bg-red-900/50 hover:bg-red-700/80 text-red-100 border border-red-500/50 px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors"
            >
                Simulate Flash Crash
            </button>
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-xs border border-white/20 px-3 py-1.5 rounded hover:bg-white/10 flex items-center gap-2">
                {voiceEnabled ? <Volume2 size={14}/> : <VolumeX size={14}/>} {voiceEnabled ? "AUDIO ON" : "AUDIO MUTED"}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        
        {/* Left Column: Dense Data Feed & Macro (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-[85vh]">
            
            {/* Global Data Ingestion */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl rounded-lg overflow-hidden flex flex-col flex-[2]">
                <div className="bg-white/5 backdrop-blur-md p-3 border-b border-white/10 flex justify-between items-center">
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

            {/* Macro Environment (Phase 3) */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl rounded-lg flex-1 p-4 flex flex-col justify-center">
                 <h2 className="font-semibold text-xs uppercase text-slate-300 mb-4 flex justify-between items-center border-b border-white/10 pb-2">
                     <span className="flex items-center gap-2"><Database size={14}/> Macro Environment</span>
                     <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">OPENBB STREAM</span>
                 </h2>
                 <div className="space-y-4 flex-1">
                     <div className="flex justify-between items-center">
                         <span className="text-xs text-slate-500 font-mono">VIX (Volatility)</span>
                         <span className={`text-sm font-mono font-bold ${isCritical ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{isCritical ? '35.40 (+45.2%)' : '14.20 (-2.1%)'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-xs text-slate-500 font-mono">DXY (Dollar Index)</span>
                         <span className="text-sm font-mono font-bold text-slate-200">104.50</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-xs text-slate-500 font-mono">US 10Y Yield</span>
                         <span className="text-sm font-mono font-bold text-slate-200">4.12%</span>
                     </div>
                 </div>
            </div>
        </div>

        {/* Center Column: Charts & Analytics (6 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            
            {/* Tear Sheet Metrics Grid (Phase 1) */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: "YTD Return", value: "+14.2%", color: "text-emerald-400" },
                    { label: "Sharpe Ratio", value: "2.14", color: "text-white" },
                    { label: "Sortino Ratio", value: "3.05", color: "text-white" },
                    { label: "Max Drawdown", value: "-8.4%", color: "text-red-400" }
                ].map((metric, i) => (
                    <div key={i} className="border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg p-3 flex flex-col justify-center transition-colors hover:bg-white/5">
                        <span className="text-[10px] uppercase text-slate-500 font-semibold mb-1">{metric.label}</span>
                        <span className={`text-lg font-mono font-bold ${metric.color}`}>{metric.value}</span>
                    </div>
                ))}
            </div>

            {/* Massive Area Chart for Portfolio Value */}
            <div className={`relative border rounded-lg bg-black/40 backdrop-blur-xl shadow-2xl p-4 transition-all duration-300 ${isCritical ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
                {isMonteCarloRunning && (
                    <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                        <Cpu className="text-blue-500 animate-pulse mb-3" size={32} />
                        <h3 className="text-blue-400 font-mono text-sm tracking-widest uppercase animate-pulse">Running Monte Carlo Simulation</h3>
                        <p className="text-slate-400 text-xs mt-1">Generating 10,000 risk paths...</p>
                    </div>
                )}
                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                        <h2 className="text-xs uppercase text-slate-400 font-semibold mb-1">{isBacktestActive ? 'Total AUM (2008 Crash Backtest)' : 'Total AUM (Live Market)'}</h2>
                        <div className={`text-3xl font-mono font-bold ${isCritical ? 'text-red-500' : 'text-white'}`}>
                            {portfolio?.total_value ? formatCurrency(portfolio.total_value) : "$0.00"}
                        </div>
                    </div>
                    {isCritical && <div className="text-red-500 flex items-center gap-2 font-bold bg-red-500/10 px-3 py-1 rounded animate-pulse"><ShieldAlert size={18}/> STRESS TEST ACTIVE</div>}
                </div>
                
                <div className="h-[300px] w-full relative z-10">
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

            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* XAI Rationale Panel */}
                <div className={`border rounded-lg p-4 backdrop-blur-xl shadow-2xl transition-all duration-300 ${isCritical ? 'bg-red-950/20 border-red-500/30' : 'bg-black/40 border-white/10'}`}>
                    <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between">
                        <span className="flex items-center gap-2"><Cpu size={14} className={isCritical ? "text-red-400 animate-pulse" : "text-blue-400"}/> LLM Agentic Rationale (XAI)</span>
                        <span className={`text-[10px] ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>zero-shot-classification</span>
                    </h2>
                    {messages.length > 0 ? (
                        <p className="text-sm text-slate-200 leading-relaxed font-serif relative">
                            <span className="text-slate-500 mr-1">"</span>
                            <TypewriterText text={messages[0].risk_signal.rationale} />
                            <span className="text-slate-500 ml-1">"</span>
                            {isCritical && <span className="inline-block w-1.5 h-4 ml-1 bg-red-500 animate-pulse align-middle"></span>}
                        </p>
                    ) : (
                        <p className="text-slate-600 text-sm">No analysis generated yet.</p>
                    )}
                </div>

                {/* Backtesting Lab (Phase 4) */}
                <div className="border border-white/10 rounded-lg p-4 backdrop-blur-xl shadow-2xl bg-black/40 flex flex-col relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between relative z-10">
                        <span className="flex items-center gap-2"><Activity size={14} className="text-orange-400"/> Strategy Backtesting Lab</span>
                        <span className="text-[10px] text-slate-500">OFFLINE</span>
                    </h2>
                    <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 space-y-3">
                        <p className="text-xs text-slate-400 max-w-[200px]">Test LLM auto-hedge strategies against historical market crashes.</p>
                        <button onClick={loadBacktestData} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded text-xs font-bold uppercase transition-colors flex items-center gap-2">
                            Launch Backtest Engine <ArrowRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Holdings & Stress Test (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            
            {/* Holdings Table */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl rounded-lg overflow-hidden flex-1">
                <div className="bg-white/5 backdrop-blur-md p-3 border-b border-white/10">
                    <h2 className="font-semibold text-xs uppercase text-slate-300">Live Holdings (Module A)</h2>
                </div>
                <div className="p-0 overflow-y-auto max-h-[400px]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#151515] text-slate-500 sticky top-0">
                            <tr>
                                <th className="p-2 font-normal">Asset</th>
                                <th className="p-2 font-normal text-right">Price</th>
                                <th className="p-2 font-normal text-right">Weight</th>
                                <th className="p-2 font-normal text-right text-emerald-400/70" title="Optimal Target Weight (Riskfolio-Lib)">Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {portfolio?.weights ? Object.entries(portfolio.weights).sort((a:any, b:any) => b[1] - a[1]).map(([ticker, weight]: any) => (
                                <tr key={ticker} className="hover:bg-white/5 transition-colors group cursor-default">
                                    <td className="p-2 font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{ticker}</td>
                                    <td className="p-2 text-right text-slate-400">${portfolio.live_prices[ticker]?.toFixed(2)}</td>
                                    <td className="p-2 text-right w-20">
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className="text-blue-400">{(weight * 100).toFixed(1)}%</span>
                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${Math.min(100, weight * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-2 text-right w-20">
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className="text-emerald-400 flex items-center gap-1 justify-end w-full">
                                                <Target size={10} className="text-emerald-500/50" />
                                                {(portfolio?.optimal_weights?.[ticker] ? portfolio.optimal_weights[ticker] * 100 : (weight * 0.85 + 0.05) * 100).toFixed(1)}%
                                            </span>
                                            <div className="h-1 w-full bg-emerald-900/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: `${Math.min(100, (portfolio?.optimal_weights?.[ticker] ? portfolio.optimal_weights[ticker] : (weight * 0.85 + 0.05)) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center p-4 text-slate-600">Loading...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stress Test & Contagion Module */}
            <div className={`border rounded-lg p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 flex flex-col gap-4 ${isCritical ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)]' : 'bg-black/40 border-white/10'}`}>
                
                {/* NetworkX Contagion Map Visualization */}
                <div>
                    <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between">
                        <span>Systemic Contagion</span>
                        <span className="text-[10px] text-purple-400">NetworkX Graph</span>
                    </h2>
                    {portfolio?.contagion_map && Object.keys(portfolio.contagion_map).length > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(portfolio.contagion_map).map(([t, shock]: any) => (
                                <div key={t} className="flex justify-between items-center text-xs font-mono bg-white/5 p-1.5 rounded">
                                    <span className="text-slate-300 font-bold">{t}</span>
                                    <span className={shock < -0.01 ? "text-red-400" : shock > 0.01 ? "text-emerald-400" : "text-slate-500"}>
                                        {(shock * 100).toFixed(2)}% Impact
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-600 py-2 text-xs">No active contagion detected.</div>
                    )}
                </div>

                {/* Quantitative Loss & Hedging */}
                <div>
                    <h2 className="text-xs uppercase text-slate-400 font-semibold mb-3 border-b border-white/10 pb-2 flex justify-between mt-4">
                        <span>Module B: CVaR Stress Test</span>
                        <span className="text-[10px] text-orange-400">Rockafellar-Uryasev</span>
                    </h2>
                    {portfolio?.daily_pnl !== undefined ? (
                        <div className="space-y-3 font-mono text-xs">
                            <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                <div className="text-red-400 text-[10px] uppercase mb-1">Simulated P&L Loss</div>
                                <div className="text-lg font-bold text-red-500">{formatCurrency(portfolio.daily_pnl)}</div>
                            </div>
                            
                            {portfolio.hedge_recommendation && portfolio.hedge_recommendation !== "None" && (
                                <div className="mt-4 border border-blue-500/30 bg-blue-900/10 rounded p-3 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    <h3 className="text-blue-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-2">
                                        <ShieldAlert size={12}/> Agentic Auto-Hedge Recommendation
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed font-sans mt-2">
                                        {portfolio.hedge_recommendation}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-slate-600 py-6 text-xs">Awaiting critical catalyst...</div>
                    )}
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
