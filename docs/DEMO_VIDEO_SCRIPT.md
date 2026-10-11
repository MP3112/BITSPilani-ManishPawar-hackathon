# PulseFin: 2-3 Minute Official Demo Video Script & Production Guide
### S&P Global & CRISIL Campus Hackathon 2026
**Candidate Name:** Manish Pawar | **Institution:** BITS Pilani  
**Total Target Duration:** 2 minutes 45 seconds (165 seconds)  
**Style & Tone:** Fast-paced, authoritative, institutional quant finance tone (like a Goldman Sachs / Bloomberg terminal product launch).

---

## Production Quick-Start: How To Create This Video

You can produce this video using:
1. **Loom / OBS Studio / Screen Recorder:** Record your screen while reading the voiceover script below.
2. **AI Video Generators (HeyGen / InVideo / ElevenLabs):**
   - Take the exact **6 Screenshots / Video Clips** detailed below.
   - Upload them in sequence to HeyGen or InVideo.
   - Copy-paste the Voiceover Script below into ElevenLabs (Voice: "Adam" or "Marcus" - Professional Deep Narrator) or HeyGen's AI avatar.

---

## Shot-by-Shot Timeline & Asset Upload Guide

```
┌───────────────┬────────────────────────────┬────────────────────────────────────────────────────────┐
│ Timestamp     │ Visual Asset to Upload/Show│ Voiceover Script Focus                                 │
├───────────────┼────────────────────────────┼────────────────────────────────────────────────────────┤
│ 0:00 - 0:30   │ Shot 1: Architecture + HUD │ Problem Statement & Institutional Vision               │
│ 0:30 - 0:55   │ Shot 2: Terminal Run Cmds  │ Quickstart & Live Architecture Starting                │
│ 0:55 - 1:40   │ Shot 3: Next.js Dashboard  │ Live Baseline Portfolio & WebSocket Streaming          │
│ 1:40 - 2:15   │ Shot 4: DEFCON-1 Red Alert │ Flash Crash Trigger, Targeted Entity Shock, CVaR       │
│ 2:15 - 2:35   │ Shot 5: Quant Rebalance    │ Black-Litterman Rebalance & Delta-Neutral Auto-Hedge   │
│ 2:35 - 2:45   │ Shot 6: Benchmark & Outro  │ +32.7% NLP F1, 66% CVaR Reduction, S&P/CRISIL Value   │
└───────────────┴────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Detailed Shot-by-Shot Breakdown

### Scene 1: Introduction & The Problem (0:00 – 0:30)
- **Visual Asset to Upload/Show:**
  - **Asset 1:** High-res image `docs/architecture.png` (Full Screen) transitioning into a quick zoom-in on the Next.js Glassmorphism Dashboard header showing *"PulseFin: Institutional Risk Engine"*.
- **On-Screen Text Overlay:** `PulseFin | S&P Global & CRISIL Hackathon 2026 | Manish Pawar (BITS Pilani)`
- **Voiceover Script:**
  > *"Hello judges. I'm Manish Pawar from BITS Pilani, presenting PulseFin—an institutional-grade AI and quantitative risk engine built for S&P Global and CRISIL.  
  > In volatile markets, asset managers are bombarded with thousands of breaking headlines. Most hackathon tools rely on naive heuristics like 'negative sentiment means sell five percent,' ignoring cross-asset correlations, or they rely on end-of-day batch jobs that miss intra-day flash crashes.  
  > PulseFin solves this by bridging financial Transformers directly with peer-reviewed mathematical optimization."*

---

### Scene 2: Quickstart & Setup (0:30 – 0:55)
- **Visual Asset to Upload/Show:**
  - **Asset 2:** Split screen or sequential screen recording of two terminals:
    - **Left Terminal:** Running `python -m uvicorn src.main:app --port 8000` showing `Application startup complete` and `Uvicorn running on http://0.0.0.0:8000`.
    - **Right Terminal:** Running `cd frontend && npm run dev` showing `Ready in 1200ms at http://localhost:3000`.
- **On-Screen Text Overlay:** `Zero-Friction Quickstart | Python 3.11 FastAPI + Next.js 14`
- **Voiceover Script:**
  > *"Starting the system is completely seamless. Following the exact commands in our README, our asynchronous Python FastAPI backend initializes with our FinBERT pipeline and covariance models.  
  > Next, our Next.js 14 terminal launches, instantly establishing a real-time WebSocket connection running at sub-fifteen-millisecond latency."*

---

### Scene 3: End-to-End Walkthrough — Live Baseline (0:55 – 1:40)
- **Visual Asset to Upload/Show:**
  - **Asset 3:** Clean recording/screenshot of the Next.js dashboard at `http://localhost:3000`:
    - Point cursor to the **Portfolio Allocation Pie Chart** (`AAPL`, `MSFT`, `NVDA`, `TSLA`, `JNJ`, `JPM`, `GLD`, `TLT`).
    - Highlight the **Live Market Telemetry** panel pulling live prices via `yfinance`.
    - Show the **Risk Metrics card**: Portfolio Beta $\beta = 1.34$, Baseline 95% CVaR at -4.1%.
- **Voiceover Script:**
  > *"Here is the PulseFin Bloomberg-grade interface. On the left, we track our diversified multi-asset portfolio spanning high-beta tech equities and defensive safe-havens like gold and treasuries.  
  > Our quant engine continually maintains a Ledoit-Wolf shrunken covariance matrix—eliminating the noise that plagues traditional Markowitz sample matrices.  
  > Notice our baseline portfolio beta is 1.34, with a 95% Expected Shortfall of negative 4.1%."*

---

### Scene 4: The Climax — Ingesting a Flash Shock in DEFCON-1 (1:40 – 2:15)
- **Visual Asset to Upload/Show:**
  - **Asset 4:** Screen capture of clicking the red button **"Simulate Flash Crash"** (or entering a headline: *"Breaking: Major semiconductor export ban announced; tech sector faces immediate margin collapse"*):
    - Show the UI dynamically shifting into **DEFCON-1 Red Alert** (vignette pulse).
    - Zoom in on the **Agentic XAI Risk Rationale box** typing out the FinBERT sentiment score (`-0.89 Bearish`) and BART-MNLI classification (`Macro / Geopolitical`).
    - Point out that **only the target entity (NVDA/Tech)** is shocked in the Pick Matrix ($P$).
- **Voiceover Script:**
  > *"Now watch what happens when an extreme market shock hits. I trigger a simulated flash shock.  
  > Instantly, the UI shifts into DEFCON-1 emergency mode. Our NLP pipeline immediately ingests the headline. Unlike naive VADER, our domain-tuned FinBERT model captures the true financial severity, scoring it negative 0.89, while BART-MNLI categorizes it as a systemic geopolitical event.  
  > Crucially, our engine isolates the target entity ticker and constructs a targeted Pick Matrix P—shocking only the affected assets rather than a blind blanket cut."*

---

### Scene 5: Quantitative Rebalance & Delta-Neutral Auto-Hedge (2:15 – 2:35)
- **Visual Asset to Upload/Show:**
  - **Asset 5:** Screen recording of the **Rebalanced Weights Chart** updating and the **Auto-Hedge Recommendation Box**:
    - Highlight: Allocation shifts dynamically from NVDA/TSLA into Gold (`GLD`) and Treasuries (`TLT`).
    - Show the **Auto-Hedge Action Banner**: *"CRITICAL BREACH: CVaR > 15%. Deploying Auto-Hedge: Short $245,000 SPY equivalent to achieve Beta = 0.00 (Delta-Neutral)."*
- **Voiceover Script:**
  > *"Within 200 milliseconds, our Bayesian Black-Litterman model calculates the new posterior optimal weights. It dynamically rotates capital out of high-vulnerability tech equities and shifts it into safe-haven gold and treasuries.  
  > Furthermore, because our Rockafellar-Uryasev CVaR breached institutional thresholds, PulseFin's autonomous hedging agent mathematically calculates the exact SPY short position required to bring portfolio beta to zero, achieving complete delta-neutral immunity."*

---

### Scene 6: Results, Benchmarks & Conclusion (2:35 – 2:45)
- **Visual Asset to Upload/Show:**
  - **Asset 6:** Full-screen slide or graphic showing the **Benchmark Comparison Table**:
    - FinBERT (+32.7% F1 over VADER).
    - CVaR Tail Loss (-6.2% vs -18.4% unhedged = 66.3% reduction).
    - Candidate Name, BITS Pilani, S&P Global & CRISIL Campus Hackathon.
- **Voiceover Script:**
  > *"In empirical benchmarks, PulseFin delivers a 66% reduction in tail-risk losses during flash crashes and achieves a 32% accuracy gain over standard models.  
  > PulseFin brings mathematical rigor, sub-second reactivity, and institutional compliance to credit rating and risk surveillance desks at S&P Global and CRISIL. Thank you."*

---

## Summary of Exact Screenshots / Photos to Capture

1. **`photo_1_architecture.png`**: The generated [docs/architecture.png](docs/architecture.png).
2. **`photo_2_terminal_run.png`**: VS Code / Windows Terminal with backend uvicorn running on left, and frontend npm run dev on right.
3. **`photo_3_dashboard_normal.png`**: Chrome browser on `http://localhost:3000` showing PulseFin dark mode with green/blue telemetry charts.
4. **`photo_4_flash_crash_defcon1.png`**: Chrome browser right after clicking "Simulate Flash Crash" showing red alert badge, FinBERT score, and entity extraction.
5. **`photo_5_hedging_rebalance.png`**: The rebalanced pie chart comparison + the Delta-Neutral SPY hedge card.
6. **`photo_6_results_summary.png`**: Slide 5 from [docs/presentation.pdf](docs/presentation.pdf) showing the benchmark numbers.
