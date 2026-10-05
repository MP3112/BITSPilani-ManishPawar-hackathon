from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
from src.ingestion import DataIngestor
from src.nlp_engine import RiskEngine

app = FastAPI(title="PulseFin Risk Engine API")
ingestor = DataIngestor()
risk_engine = RiskEngine()

@app.get("/")
async def root():
    return {"message": "PulseFin AI/NLP Risk Engine is running."}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Loop to simulate streaming data ingestion
        while True:
            # 1. Fetch live or demo data
            raw_data = await ingestor.fetch_live_data()
            
            if not raw_data:
                await websocket.send_json({"status": "idle", "message": "No new signals."})
            else:
                for item in raw_data:
                    # 2. Process through NLP Engine
                    processed_signal = risk_engine.process_text(item["text"], item["source"])
                    
                    # 3. Combine with original metadata
                    final_output = {
                        "id": item["id"],
                        "timestamp": item["timestamp"],
                        **processed_signal
                    }
                    
                    # 4. Stream to frontend
                    await websocket.send_json({"status": "new_signal", "data": final_output})
            
            # Wait a few seconds before polling again to simulate live feed
            await asyncio.sleep(5)
            
    except WebSocketDisconnect:
        print("Client disconnected normally.")
    except Exception as e:
        print(f"WebSocket error: {e}")
