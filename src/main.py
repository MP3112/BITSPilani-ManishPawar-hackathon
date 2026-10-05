from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI(title="PulseFin Risk Engine API")

@app.get("/")
async def root():
    return {"message": "PulseFin AI/NLP Risk Engine is running."}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Placeholder for streaming live risk signals
            await websocket.send_json({"status": "connected", "message": "Listening for risk signals..."})
            await asyncio.sleep(5)
    except Exception as e:
        print(f"Client disconnected: {e}")
