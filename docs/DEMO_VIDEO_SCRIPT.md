# PulseFin: Risk Engine - 2-3 Minute Demo Video Script & Production Guide
### S&P Global & CRISIL Campus Hackathon 2026
**Candidate Name:** Manish Pawar | **Institution:** BITS Pilani  
**Total Target Duration:** 2 minutes 45 seconds (165 seconds)  
**Style & Tone:** Direct, confident, professional product demo.

---

## Production Quick-Start: How To Create This Video

You can produce this video using:
1. **Loom / OBS Studio / Screen Recorder:** Record your screen while reading the voiceover script below.
2. **Video Tools (HeyGen / InVideo / ElevenLabs):**
   - Take the exact **6 Screenshots / Video Clips** detailed below.
   - Upload them in sequence.
   - Use the Voiceover Script below for the narrator voice.

---

## Shot-by-Shot Timeline & Asset Upload Guide

```
┌───────────────┬────────────────────────────┬────────────────────────────────────────────────────────┐
│ Timestamp     │ Visual Asset to Upload/Show│ Voiceover Script Focus                                 │
├───────────────┼────────────────────────────┼────────────────────────────────────────────────────────┤
│ 0:00 - 0:30   │ Shot 1: Architecture + HUD │ Problem Statement & Risk Engine Overview               │
│ 0:30 - 0:55   │ Shot 2: Terminal Run Cmds  │ Quickstart & Live Engine Startup                       │
│ 0:55 - 1:40   │ Shot 3: Next.js Dashboard  │ Live Baseline Portfolio & Real-Time Telemetry          │
│ 1:40 - 2:15   │ Shot 4: DEFCON-1 Red Alert │ Flash Crash Trigger, Targeted Entity Shock, CVaR       │
│ 2:15 - 2:35   │ Shot 5: Portfolio Rebalance│ Dynamic Rebalance & Delta-Neutral Auto-Hedge           │
│ 2:35 - 2:45   │ Shot 6: Benchmark & Outro  │ Performance Metrics & S&P/CRISIL Value                 │
└───────────────┴────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Detailed Shot-by-Shot Breakdown

### Scene 1: Introduction & The Problem (0:00 – 0:30)
- **Visual Asset to Upload/Show:**
  - **Asset 1:** Image `docs/architecture.png` (Full Screen) transitioning into the dashboard header showing *"PulseFin: Risk Engine"*.
- **On-Screen Text Overlay:** `PulseFin | Risk Engine | S&P Global & CRISIL Hackathon 2026`
- **Voiceover Script:**
  > *"Hello judges. I'm Manish Pawar from BITS Pilani, presenting PulseFin—a real-time Risk Engine built for the S&P Global and CRISIL Hackathon.  
  > In volatile markets, risk teams face thousands of breaking headlines. Most basic tools rely on static rules like 'negative sentiment means sell five percent,' ignoring asset correlations and real volatility. Worse, traditional batch systems only update at end-of-day, missing intra-day flash events.  
  > PulseFin solves this by connecting real-time financial NLP directly with modern portfolio risk models."*

---

### Scene 2: Quickstart & Setup (0:30 – 0:55)
- **Visual Asset to Upload/Show:**
  - **Asset 2:** Split screen or sequential recording of two terminals:
    - **Left Terminal:** Running `python -m uvicorn src.main:app --port 8000` showing `Application startup complete` and `Uvicorn running on http://0.0.0.0:8000`.
    - **Right Terminal:** Running `cd frontend && npm run dev` showing `Ready in 1200ms at http://localhost:3000`.
- **On-Screen Text Overlay:** `Quickstart Setup | Python FastAPI + Next.js 14 WebSockets`
- **Voiceover Script:**
  > *"Setting up the engine is straightforward. Following the exact commands in our README, our Python backend initializes the models, covariance calculations, and WebSocket streaming.  
  > Next, our frontend launches, connecting to the backend with sub-fifteen-millisecond streaming latency."*

---

### Scene 3: End-to-End Walkthrough — Live Baseline (0:55 – 1:40)
- **Visual Asset to Upload/Show:**
  - **Asset 3:** Clean recording/screenshot of the dashboard at `http://localhost:3000`:
    - Point cursor to the **Portfolio Allocation Pie Chart** (`AAPL`, `MSFT`, `NVDA`, `TSLA`, `JNJ`, `JPM`, `GLD`, `TLT`).
    - Highlight the **Live Market Telemetry** panel streaming real-time prices via `yfinance`.
    - Show the **Risk Metrics card**: Portfolio Beta $\beta = 1.34$, Baseline 95% CVaR at -4.1%.
- **Voiceover Script:**
  > *"Here is the PulseFin Risk Engine interface. On the left, we track our diversified multi-asset portfolio covering equities and defensive assets like gold and treasuries.  
  > The engine uses a Ledoit-Wolf shrunken covariance matrix to eliminate noise and stabilize correlation calculations.  
  > In normal market conditions, our baseline portfolio beta is 1.34, with a 95% Expected Shortfall of negative 4.1%."*

---

### Scene 4: Ingesting a Shock in DEFCON-1 (1:40 – 2:15)
- **Visual Asset to Upload/Show:**
  - **Asset 4:** Screen capture of clicking the red button **"Simulate Flash Crash"** (or submitting a headline):
    - Dashboard entering **DEFCON-1 Red Alert**.
    - The Risk Rationale card displaying the FinBERT sentiment score (`-0.89 Bearish`) and BART-MNLI event classification (`Macro / Geopolitical`).
    - Highlighting that **only the target entity** is shocked in the Pick Matrix ($P$).
- **Voiceover Script:**
  > *"Now let's see how the engine responds to an extreme market shock. When a flash shock occurs, the dashboard transitions into alert mode.  
  > Our NLP pipeline processes the headline: FinBERT evaluates the sentiment severity, and BART-MNLI categorizes the event type.  
  > Most importantly, the engine isolates the target entity and builds a targeted Pick Matrix—shocking only the directly impacted assets instead of making blind cuts across the entire portfolio."*

---

### Scene 5: Portfolio Rebalance & Auto-Hedge (2:15 – 2:35)
- **Visual Asset to Upload/Show:**
  - **Asset 5:** Screen recording of the **Rebalanced Weights Chart** and the **Auto-Hedge Recommendation Box**:
    - Highlight: Allocation rebalances out of volatile tech into Gold (`GLD`) and Treasuries (`TLT`).
    - Show the **Auto-Hedge Action Banner**: *"CRITICAL BREACH: CVaR > 15%. Deploying Auto-Hedge: Short $245,000 SPY equivalent to achieve Beta = 0.00 (Delta-Neutral)."*
- **Voiceover Script:**
  > *"In under 200 milliseconds, our Black-Litterman model calculates the new optimal allocations, shifting capital into defensive assets like gold and treasuries.  
  > If our 95% Conditional Value-at-Risk breaches risk limits, the engine automatically recommends a delta-neutral hedge, calculating the exact SPY short position to neutralize market exposure."*

---

### Scene 6: Results, Benchmarks & Conclusion (2:35 – 2:45)
- **Visual Asset to Upload/Show:**
  - **Asset 6:** Full-screen slide or graphic showing the **Benchmark Comparison Table**:
    - FinBERT (+32.7% F1 over naive sentiment).
    - CVaR Tail Loss (-6.2% vs -18.4% unhedged = 66.3% reduction).
    - Candidate Name, BITS Pilani, S&P Global & CRISIL Campus Hackathon.
- **Voiceover Script:**
  > *"In benchmark tests, PulseFin achieves a 66% reduction in tail-risk losses during flash crashes and a 32% accuracy improvement over standard sentiment tools.  
  > PulseFin provides fast, transparent, and mathematically grounded risk management for S&P Global and CRISIL surveillance workflows. Thank you."*

---

## Summary of Exact Screenshots / Photos to Capture

1. **`photo_1_architecture.png`**: The generated [docs/architecture.png](docs/architecture.png) showing the 4-stage pipeline.
2. **`photo_2_terminal_run.png`**: Split screen terminal showing FastAPI backend running on left, Next.js frontend on right.
3. **`photo_3_dashboard_normal.png`**: Chrome browser on `http://localhost:3000` showing baseline portfolio and green/blue telemetry.
4. **`photo_4_flash_crash_defcon1.png`**: Chrome browser during "Simulate Flash Crash" showing red alert badge, FinBERT score, and entity extraction.
5. **`photo_5_hedging_rebalance.png`**: The rebalanced allocation comparison + the Delta-Neutral SPY hedge recommendation banner.
6. **`photo_6_results_summary.png`**: Slide 5 from [docs/presentation.pdf](docs/presentation.pdf) showing the benchmark numbers.
