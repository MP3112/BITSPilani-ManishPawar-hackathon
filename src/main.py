from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
from src.ingestion import DataIngestor
from src.nlp_engine import RiskEngine
from src.portfolio import PortfolioManager

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PulseFin Risk Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost", "http://127.0.0.1"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

ingestor = DataIngestor()
risk_engine = RiskEngine()
portfolio_manager = PortfolioManager()

@app.get("/")
async def root():
    return {"message": "PulseFin AI/NLP Risk Engine is running."}

@app.post("/trigger-doomsday")
async def trigger_doomsday():
    import datetime
    item = {
        "id": "DOOMSDAY-001",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "source": "Bloomberg Terminal (Simulated)",
        "text": "GLOBAL CONTAGION: Massive systemic bank failure detected. Credit markets freeze as major financial institution files for Chapter 11 bankruptcy. Unprecedented panic selling hits Apple, Microsoft, Nvidia, and Tesla as supply chains collapse."
    }
    processed_signal = risk_engine.process_text(item["text"], item["source"])
    processed_signal["sentiment_score"] = -0.96
    processed_signal["sentiment_label"] = "negative"
    processed_signal["impact_score"] = 10
    processed_signal["severity"] = 10
    portfolio_update = portfolio_manager.process_signal(processed_signal)
    portfolio_update["mode"] = "critical_stress"
    if portfolio_update.get("daily_pnl", 0) > -10_000_000:
        portfolio_update["daily_pnl"] = -18_450_000
    portfolio_update["hedge_recommendation"] = "CRITICAL DEFCON-1 BREACH: 95% CVaR threshold exceeded. Deploying Auto-Hedge: Short $245,000 SPY equivalent to achieve Beta = 0.00 (Delta-Neutral)."
    final_output = {"id": item["id"], "timestamp": item["timestamp"], "risk_signal": processed_signal, "portfolio_state": portfolio_update}
    return {"message": "Doomsday scenario executed.", "data": final_output}

@app.post("/trigger-backtest")
async def trigger_backtest():
    item = {
        "id": "BACKTEST-2008",
        "timestamp": "2008-09-15T08:00:00Z",
        "source": "Historical Replay (2008)",
        "text": "Lehman Brothers files for Chapter 11 bankruptcy protection. Subprime mortgage market collapses triggering systemic liquidity crisis across all financial sectors."
    }
    processed_signal = risk_engine.process_text(item["text"], item["source"])
    portfolio_update = portfolio_manager.process_signal(processed_signal)
    if portfolio_update["daily_pnl"] < -5000000:
        portfolio_update["mode"] = "critical_stress"
    final_output = {"id": item["id"], "timestamp": item["timestamp"], "risk_signal": processed_signal, "portfolio_state": portfolio_update}
    return {"message": "2008 backtest executed.", "data": final_output}

@app.post("/run-monte-carlo")
async def run_monte_carlo():
    portfolio_update = portfolio_manager.run_monte_carlo()
    portfolio_update["mode"] = "critical_stress"
    # To conform to expected UI structure, wrap it:
    final_output = {
        "id": "MONTE-CARLO", 
        "timestamp": "N/A",
        "risk_signal": {
            "text": "Monte Carlo Engine Simulation (10,000 Paths)", 
            "sentiment_score": -1.0, 
            "sentiment_label": "negative",
            "event_type": "QUANT_SIMULATION",
            "impact_score": 10,
            "rationale": "Offline Quant Simulation executed.",
            "severity": 10
        },
        "portfolio_state": portfolio_update
    }
    return {"message": "Monte carlo completed", "data": final_output}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # 1. Fetch live or demo data
            raw_data = await ingestor.fetch_live_data()
            
            if not raw_data:
                await websocket.send_json({"status": "idle", "message": "No new signals."})
            else:
                for item in raw_data:
                    # 2. Process through NLP Engine
                    processed_signal = risk_engine.process_text(item["text"], item["source"])
                    
                    # 3. Process through Downstream Financial Logic (Module A + B)
                    portfolio_update = portfolio_manager.process_signal(processed_signal)
                    
                    # 4. Combine everything into the ultimate 'God-Tier' payload
                    final_output = {
                        "id": item["id"],
                        "timestamp": item["timestamp"],
                        "risk_signal": processed_signal,
                        "portfolio_state": portfolio_update
                    }
                    
                    # 5. Stream to frontend instantly
                    await websocket.send_json({"status": "new_event", "data": final_output})
            
            # Wait only 1.5 seconds to simulate high-frequency trading terminal speed!
            await asyncio.sleep(1.5)
            
    except WebSocketDisconnect:
        print("Client disconnected normally.")
    except Exception as e:
        print(f"WebSocket error: {e}")
