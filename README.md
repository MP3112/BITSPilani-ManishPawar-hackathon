# PulseFin - S&P Global & Crisil Campus Hackathon

**Candidate Name:** Manish Pawar
**College Email ID:** [your_id@college.ac.in]
**College / Campus:** BITS Pilani
**Demo Video Link:** [YouTube / Unlisted] (To be added)
**Slide Deck Link (if hosted externally):** (To be added)

## 1. Project Overview / Problem Statement & Approach
PulseFin is a real-time, unified AI/NLP Risk Engine and interactive dashboard that converts unstructured financial text into structured risk signals. It seamlessly merges tactical stock index rebalancing (Module A) with strategic portfolio stress testing (Module B). When a critical event is detected, the system transitions from micro-rebalancing to executing massive macro-stress-tests on a wholesale banking portfolio, all visualized in a real-time Next.js UI using WebSockets.

## 2. Architecture & Tech Stack
- Overview of system design and data flow (architecture diagram pending in docs/architecture.png).
- **Backend:** Python, FastAPI (WebSockets for real-time streaming).
- **AI/NLP:** FinBERT (ProsusAI) for deterministic financial sentiment, combined with a generative LLM for Explainable AI (XAI) rationale and event classification.
- **Frontend:** Next.js, Tremor, Tailwind CSS, Web Speech API (for auditory UX alerts).

## 3. Dataset Used
- **News Data:** Public financial news sources and synthetic demo feeds.
- **Mock Index/Portfolio:** Synthetic data generated for the tactical index (10-20 stocks) and wholesale portfolio.
- Located in the `/data` folder.

## 4. Quickstart & Installation
Runtime: Python 3.11+ on Windows

Step-by-step commands to set up the environment and run your code locally:
```bash
git clone <your-repo-url>
cd BITSPilani-ManishPawar-hackathon
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## 5. Key Results & Domain Impact
- **What your prototype outputs/demonstrates:** Real-time generation of structured JSON risk signals (Sentiment, Event Type, Impact, XAI Rationale), live portfolio rebalancing, and instant stress test simulations.
- **Why it matters:** Unlike static dashboards, PulseFin acts as an automated, proactive risk monitor that actively alerts analysts to critical threats, combining both quantitative shock simulations and qualitative explainability.
